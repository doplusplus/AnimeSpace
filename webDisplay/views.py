from django.shortcuts import render
from django.views import generic


class IndexView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        about   = 'About'
        ranking = 'Ranking'
        account = 'Account'
        rate    = 'Rate it!'
        advised = 'Advised'
        shop    = 'Shop'
        home    = 'Home'

        return render(
            request,
            'webDisplay/Index.html', 
            {'about': about, 'ranking':ranking, 'account':account, 'rate':rate , 'advised':advised , 'shop':shop , 'home':home })


class RankingView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/MobileRankingContent.html'if request.path.find("rankingMobileTemplate")> -1 else 'webDisplay/RankingContent.html'
        return render(request , address)


class RateAnimesView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/RateContent.html'if request.path.find("rateAnimesTemplate")> -1 else 'webDisplay/RateContent.html'
        return render(request , address)

