from django.urls import path
from . import views

app_name = 'data'
urlpatterns = [
    path('items', views.items_list, name='items_list'),
    path('levels', views.levels, name='levels')
]