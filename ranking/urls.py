from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('details', views.animeDetails, name='animeDetails'),
    path('details/<int:first>/<int:last>', views.animeDetails, name='animeDetails'),
    path('search/<str:start>', views.search, name='search'),
]