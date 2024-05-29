from django.urls import include, path
from . import views

app_name = "data"
urlpatterns = [
    path('api/', include('data.api.urls', namespace='api')),
    path("", views.index, name="index"),
]
