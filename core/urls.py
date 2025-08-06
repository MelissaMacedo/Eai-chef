from django.urls import path
from core import views

urlpatterns = [
    path('', views.index, name='index'),
    path('generate-recipe/', views.generate_recipe, name='generate_recipe'),
]