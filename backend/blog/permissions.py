from rest_framework.permissions import BasePermission, SAFE_METHODS

# Members of this group (who are NOT staff) get the restricted CMS role: read
# the live posts, write drafts of their own. Created by blog migration 0006.
BLOG_AUTHORS_GROUP = "Blog Authors"


def is_blog_author(user):
    """An active, non-staff account in the Blog Authors group."""
    return bool(
        user and user.is_authenticated and user.is_active and not user.is_staff
        and user.groups.filter(name=BLOG_AUTHORS_GROUP).exists()
    )


def is_staff_user(user):
    return bool(user and user.is_authenticated and user.is_staff)


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return is_staff_user(request.user)


class IsStaffOrBlogAuthor(BasePermission):
    """For the CMS-only endpoints (session check, image upload)."""
    def has_permission(self, request, view):
        return is_staff_user(request.user) or is_blog_author(request.user)


class IsStaffOrBlogAuthorOrReadOnly(BasePermission):
    """Blog posts: anyone reads; staff write freely; authors may create and
    edit. Which posts an author may touch is decided by the viewset."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return is_staff_user(request.user) or is_blog_author(request.user)
