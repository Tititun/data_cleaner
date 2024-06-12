from django.urls import path
from . import views

app_name = 'data'
urlpatterns = [
    path('categories_list', views.categories_list, name='categories_list'),
    path('classified', views.classified, name='classified'),
    path('confusion_matrix', views.confusion_matrix, name='confusion_matrix'),
    path('confusion_matrix_errors', views.confusion_matrix_errors,
         name='confusion_matrix_errors'),
    path('get_random_predictions', views.get_random_predictions,
         name='get_random_predictions'),
    path('items', views.items_list, name='items_list'),
    path('model_results', views.model_results, name='model_results'),
    path('save_page', views.save_page, name='save_page'),
    path('set_item_levels', views.set_item_levels, name='set_item_levels'),
    path('set_items_levels', views.set_items_levels, name='set_items_levels'),
    path('levels', views.levels, name='levels')
]