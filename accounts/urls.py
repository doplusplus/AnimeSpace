from django.urls import path

from . import views

urlpatterns = [
    path('', views.log_in, name='log_in'),
    path('settings/<int:userID>', views.settings,       name='settings'),
    path('favorite/<int:userID>', views.favorite,       name='favorite'),
    path('saveSettings'         , views.saveSettings,   name='saveSettings'),
]


