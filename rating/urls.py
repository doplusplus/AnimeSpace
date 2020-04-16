from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),# creates/updates the animes characteristics in the database
    path('genres', views.genres, name='genres'), #returns all available genres
    path('stats/<str:animeName>', views.getStats, name='getStats'),# send stats of a particular anime to the client
    path('genre/<str:animeName>', views.getVotedGenre, name='getStats'),# send the most voted genre
]