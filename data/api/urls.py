from django.urls import path
from . import views

app_name = 'data'
urlpatterns = [
    path('categories_list', views.categories_list, name='categories_list'),
    path('classified', views.classified, name='classified'),
    path('items', views.items_list, name='items_list'),
    path('set_item_levels', views.set_item_levels, name='set_item_levels'),
    path('set_items_levels', views.set_items_levels, name='set_items_levels'),
    path('levels', views.levels, name='levels')
]