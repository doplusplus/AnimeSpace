from django.shortcuts import render
from django.views import generic
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate

from django.views.decorators.clickjacking import xframe_options_exempt

import re

class DeviceIdentifier:

    @staticmethod
    def mobile(request):
        """Return True if the request comes from a mobile device."""

        MOBILE_AGENT_RE = re.compile(r".*(iphone|mobile|androidtouch)",re.IGNORECASE)

        if MOBILE_AGENT_RE.match(request.META['HTTP_USER_AGENT']):
            return True
        else:
            return False



class IndexView(generic.TemplateView):

    @xframe_options_exempt
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):

        about   = 'About'
        ranking = 'Ranking'
        account = 'Account'
        rate    = 'Rate it!'
        advised = 'Advised'
        shop    = 'Shop'
        home    = 'Home'

        isMobile = DeviceIdentifier.mobile(request)
        
        return render( request,
                    'webDisplay/IndexMobile.html' if isMobile else 'webDisplay/Index.html' , 
                    {'about': about, 'ranking':ranking, 'account':account, 'rate':rate , 'advised':advised , 'shop':shop , 'home':home }) 

class RankingView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/MobileRankingContent.html'if request.path.find("rankingMobileTemplate")> -1 else 'webDisplay/RankingContent.html'
        return render(request , address)


class RateAnimesView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/RateContent.html'if request.path.find("rateAnimesTemplate")> -1 else 'webDisplay/RateContent.html'
        return render(request , address)

class AdvisedView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/AdvisedContent.html'if request.path.find("advisedTemplate")> -1 else 'webDisplay/AdvisedContent.html'
        return render(request , address)

class AccountView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/AccountContent.html'if request.path.find("accountTemplate")> -1 else 'webDisplay/AccountContent.html'
        return render(request , address)

class LoginView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/LogIn.html'if request.path.find("loginTemplate") > -1 else 'webDisplay/LogIn.html'
        return render(request , address)

class AboutView(generic.TemplateView):

    def get(self, request, *args, **kwargs):
        address= 'webDisplay/AboutContent.html'if request.path.find("aboutTemplate") > -1 else 'webDisplay/AboutContent.html'
        return render(request , address)
