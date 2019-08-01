from django.shortcuts import render
from django.views import generic


class IndexView(generic.TemplateView):
 #   template_name = 'animeLobby/Index.html'

    def get(self, request, *args, **kwargs):
        about   = 'About'
        ranking = 'Ranking'
        account = 'Account'
        rate    = 'Rate'
        advised = 'Advised'
        shop    = 'Shop'
        
        return render(
            request,
            'animeLobby/Index.html', 
            {'about': about, 'ranking':ranking, 'account':account, 'rate':rate , 'advised':advised , 'shop':shop})