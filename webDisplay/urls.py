from django.urls import path

from . import views

app_name = 'webDisplay'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('rankingTemplate',views.RankingView.as_view(),name='ranking'),
    path('rankingMobileTemplate',views.RankingView.as_view(),name='mobileRanking'),
]