from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.contrib.auth.models import User

from .models import Settings
from .models import Favorite 
from .models import RecommendedByUser
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


def saveSuggestion(request):
    data    = json.loads(request.body.decode("utf-8"))
    userID  = data['userID']
    user    = User.objects.get(id = userID)
    recommendedAnime = RecommendedByUser( 
        user        = user,
        animeName   = data['animeName'],
        genre       = data['genre'],
        videoLink   = data['videoLink'],
        tags        = data['tags']
    )
    recommendedAnime.save()

    response = "Recommended Anime succesfully saved"
    return HttpResponse(json.dumps(response), content_type='application/json')


def deleteallfavorites(request , userID):
    favoriteQuery = Favorite.objects.filter(user_id = userID).delete()
    return HttpResponse(json.dumps("Deletion complete"), content_type='application/json')


def addFavourite(request):
    data    = json.loads(request.body.decode("utf-8"))
    name    = data["name"]
    userID  = data["userID"]
    message = "not created"
    if len(Favorite.objects.filter(animeName = name , user_id = userID )) == 0:
        user        = User.objects.get(id = userID)
        favorite    = Favorite( animeName = name , user_id = userID)
        favorite.save()
        message= name +" successfully added to the favourites"
    else:
        message="It seems that this is already a favourite"

    favouritesList    = list(Favorite.objects.filter(user_id = userID ).values('animeName'))
    response        = {'message': message, 'favourites':[ element["animeName"] for element in favouritesList]}
    
    return HttpResponse(json.dumps(response), content_type='application/json')

def deletefavorites(request , userID , name):
    favoriteQuery = Favorite.objects.filter(user_id = userID , animeName = name).delete()
    favouritesList    = list(Favorite.objects.filter(user_id = userID ).values('animeName'))
    response        = {'message': 'successful deletion', 'favourites':[ element["animeName"] for element in favouritesList]}
    return HttpResponse(json.dumps(response), content_type='application/json')




