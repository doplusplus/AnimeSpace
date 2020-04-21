from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse

from .models import Settings
from .models import Favorite
import json



def log_in(request):
    data = json.loads(request.body.decode("utf-8"))
    user = authenticate(username=data['login'], password=data['password'])
    response = {"validUser" : True, "userID": user.id} if  user is not None else  {"validUser" : False}
    return HttpResponse(json.dumps(response), content_type='application/json')
    

def settings(request , userID):
    settingsQuery = Settings.objects.filter(user_id = userID).values('themeColor','autoPlay')
    response = {"themeColor" : settingsQuery[0]['themeColor'], "autoPlay": settingsQuery[0]['autoPlay']} if len(settingsQuery) == 1 else ""
    return HttpResponse(json.dumps(response), content_type='application/json')


def favorite(request , userID):
    favoriteQuery = Favorite.objects.filter(user_id = userID).values('animeName')
    response = list(favoriteQuery)
    return HttpResponse(json.dumps(response), content_type='application/json')



def saveSettings(request):
    data = json.loads(request.body.decode("utf-8"))
    userID = data['userID']
    UserSettings = Settings.objects.get(user_id = userID)
    UserSettings.themeColor = data['themeColor']
    UserSettings.autoPlay = data['autoplay']
    UserSettings.save()

    response = "Account settings succesfully saved"
    return HttpResponse(json.dumps(response), content_type='application/json')