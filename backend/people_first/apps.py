from django.apps import AppConfig


class PeopleFirstConfig(AppConfig):
    name = "people_first"

    def ready(self):
        from . import revalidate

        revalidate.connect()
