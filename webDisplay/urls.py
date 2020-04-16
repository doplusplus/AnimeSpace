from django.urls import path

from . import views

app_name = 'webDisplay'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('rankingTemplate',views.RankingView.as_view(),name='ranking'),
    path('rankingMobileTemplate',views.RankingView.as_view(),name='mobileRanking'),
    path('rateAnimesTemplate',views.RateAnimesView.as_view(),name='rateAnimes'),
    path('advisedTemplate',views.AdvisedView.as_view(),name='advisedAnimes'),
]