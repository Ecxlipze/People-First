from django.contrib.auth.models import Group, User
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import BlogPost
from .permissions import BLOG_AUTHORS_GROUP


class BlogAuthorRoleTests(APITestCase):
    def setUp(self):
        group = Group.objects.get_or_create(name=BLOG_AUTHORS_GROUP)[0]
        self.ann = User.objects.create_user("ann", password="x", first_name="Ann", last_name="Lee")
        self.bob = User.objects.create_user("bob", password="x")
        for u in (self.ann, self.bob):
            u.groups.add(group)
        self.staff = User.objects.create_user("boss", password="x", is_staff=True)
        self.nobody = User.objects.create_user("nobody", password="x")
        self.live = BlogPost.objects.create(
            title="Live", slug="live", status="published", published_at=timezone.now() - timezone.timedelta(days=1),
        )
        self.ann_draft = BlogPost.objects.create(title="Ann draft", slug="ann-draft", author=self.ann)
        self.bob_draft = BlogPost.objects.create(title="Bob draft", slug="bob-draft", author=self.bob)
        self.staff_draft = BlogPost.objects.create(title="Staff draft", slug="staff-draft")

    def slugs(self, user):
        self.client.force_authenticate(user)
        return {p["slug"] for p in self.client.get("/api/blog-posts/").json()}

    def test_visibility(self):
        self.assertEqual(self.slugs(self.ann), {"live", "ann-draft"})
        self.assertEqual(self.slugs(self.staff), {"live", "ann-draft", "bob-draft", "staff-draft"})
        self.assertEqual(self.slugs(None), {"live"})
        self.assertEqual(self.client.get("/api/blog-posts/bob-draft/").status_code, 404)

    def test_session_role(self):
        self.client.force_authenticate(self.ann)
        self.assertEqual(self.client.get("/api/blog-session/").json()["role"], "author")
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.get("/api/blog-session/").json()["role"], "staff")
        self.client.force_authenticate(self.nobody)
        self.assertEqual(self.client.get("/api/blog-session/").status_code, 403)

    def test_create_is_forced_to_own_draft(self):
        self.client.force_authenticate(self.ann)
        res = self.client.post("/api/blog-posts/", {
            "title": "Mine", "slug": "mine", "status": "published", "author_name": "Someone Else", "order": 9,
            "published_at": timezone.now().isoformat(),
        })
        self.assertEqual(res.status_code, 201, res.content)
        post = BlogPost.objects.get(slug="mine")
        self.assertEqual((post.status, post.author_name, post.author, post.order, post.published_at),
                         ("draft", "Ann Lee", self.ann, 0, None))

    def test_edit_rules(self):
        self.client.force_authenticate(self.ann)
        ok = self.client.patch("/api/blog-posts/ann-draft/", {"title": "New", "status": "published", "author_name": "X"})
        self.assertEqual(ok.status_code, 200, ok.content)
        self.ann_draft.refresh_from_db()
        self.assertEqual((self.ann_draft.title, self.ann_draft.status, self.ann_draft.author_name), ("New", "draft", "Ann Lee"))
        self.assertEqual(self.client.patch("/api/blog-posts/live/", {"title": "x"}).status_code, 403)
        self.assertEqual(self.client.patch("/api/blog-posts/bob-draft/", {"title": "x"}).status_code, 404)
        self.assertEqual(self.client.delete("/api/blog-posts/ann-draft/").status_code, 403)

    def test_cannot_edit_after_staff_publishes(self):
        BlogPost.objects.filter(pk=self.ann_draft.pk).update(status="published", published_at=timezone.now())
        self.client.force_authenticate(self.ann)
        self.assertEqual(self.client.patch("/api/blog-posts/ann-draft/", {"title": "x"}).status_code, 403)

    def test_non_author_cannot_write_and_staff_can(self):
        self.client.force_authenticate(self.nobody)
        self.assertEqual(self.client.post("/api/blog-posts/", {"title": "t", "slug": "t"}).status_code, 403)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.patch("/api/blog-posts/bob-draft/", {"status": "published"}).status_code, 200)

    def test_author_cannot_use_other_cms_apis(self):
        self.client.force_authenticate(self.ann)
        self.assertEqual(self.client.get("/api/inquiries/").status_code, 403)
        self.assertEqual(self.client.post("/api/blog-categories/", {"name": "n", "slug": "n"}).status_code, 403)


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("ann", password="old-pass-123", first_name="Ann")
        self.user.groups.add(Group.objects.get_or_create(name=BLOG_AUTHORS_GROUP)[0])
        self.client.force_authenticate(self.user)

    def test_update_profile_ignores_username_and_flags(self):
        res = self.client.patch("/api/profile/", {
            "first_name": "Annie", "last_name": "Lee", "email": "a@x.com",
            "username": "hacker", "is_staff": True,
        })
        self.assertEqual(res.status_code, 200, res.content)
        self.user.refresh_from_db()
        self.assertEqual((self.user.username, self.user.is_staff, self.user.first_name, self.user.email),
                         ("ann", False, "Annie", "a@x.com"))
        self.assertEqual(res.json()["display_name"], "Annie Lee")

    def test_bad_email(self):
        self.assertEqual(self.client.patch("/api/profile/", {"email": "nope"}).status_code, 400)

    def test_password_change(self):
        url = "/api/profile/password/"
        self.assertEqual(self.client.post(url, {"current_password": "wrong", "new_password": "Str0ng-new-pass!"}).status_code, 400)
        self.assertEqual(self.client.post(url, {"current_password": "old-pass-123", "new_password": "123"}).status_code, 400)
        self.assertEqual(self.client.post(url, {"current_password": "old-pass-123", "new_password": "Str0ng-new-pass!"}).status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Str0ng-new-pass!"))

    def test_requires_cms_role(self):
        self.client.force_authenticate(User.objects.create_user("x", password="p"))
        self.assertEqual(self.client.get("/api/profile/").status_code, 403)
