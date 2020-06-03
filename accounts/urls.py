from django.urls import path

from . import views

urlpatterns = [
    path(''         , views.log_in  , name = 'log_in'),
    path('register' , views.register, name = 'register'),
    path('settings/<int:userID>'                    , views.settings,           name = 'settings'),
    path('saveSettings'                             , views.saveSettings,       name = 'saveSettings'),
    path('saveSuggestion'                           , views.saveSuggestion,     name = 'saveSuggestion'),
    path('favorite/<int:userID>'                    , views.favorite,           name = 'favorite'),
    path('addFavourite'                             , views.addFavourite,       name = 'addFavourite'),   
    path('deleteallfavorites/<int:userID>'          , views.deleteallfavorites, name = 'deleteallfavorites'),
    path('deleteFavourite/<int:userID>/<str:name>'  , views.deletefavorites,    name = 'deleteFavourite'),
]


