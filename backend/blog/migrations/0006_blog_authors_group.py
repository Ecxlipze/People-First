from django.db import migrations

GROUP = "Blog Authors"


def create_group(apps, schema_editor):
    apps.get_model("auth", "Group").objects.get_or_create(name=GROUP)


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0005_blogpost_author"),
        ("auth", "0012_alter_user_first_name_max_length"),
    ]
    operations = [migrations.RunPython(create_group, migrations.RunPython.noop)]
