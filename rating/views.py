from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.core import serializers

from .models import AnimeStats
from .models import GenreList
from .models import Genres

import json



# Create your views here.

#Pushes chracteristics to the database
def index(request):
    data =json.loads(request.body.decode("utf-8"))
    targetname=data['name']
    searchResult = list(AnimeStats.objects.filter(name = targetname))
    
    if len(searchResult) > 1 : 
        return JsonResponse("Problem:several results",  safe = False)

    characteristics = data['characteristics']            
    visualsValue            = int( characteristics[0]['value'] )
    audioValue              = int( characteristics[1]['value'] )
    sexyMValue              = int( characteristics[2]['value'] )
    sexyFValue              = int( characteristics[3]['value'] )
    violenceValue           = int( characteristics[4]['value'] )
    storyValue              = int( characteristics[5]['value'] )
    characterDesignValue    = int( characteristics[6]['value'] )
    fightChoreographyValue  = int( characteristics[7]['value'] )

    if len(searchResult) == 0 :
        #create anime and submit it to db       
        stats = AnimeStats(
        name                = data['name'],
        genre               = data['genre'] if data['genre'] in GenreList else "none" ,
        visuals             = visualsValue  if visualsValue > -1 else 5,
        audio               = audioValue    if audioValue   > -1 else 5,
        sexyM               = sexyMValue    if sexyMValue   > -1 else 5,
        sexyF               = sexyFValue    if sexyFValue   > -1 else 5,
        violence            = violenceValue if violenceValue > -1 else 5,
        story               = storyValue    if storyValue    > -1 else 5,
        characterDesign     = characterDesignValue      if characterDesignValue   > -1 else 5,
        fightChoreography   = fightChoreographyValue    if fightChoreographyValue > -1 else 5,
        tags = data['tags'],
        votes = 1)        
    
    if len(searchResult) == 1 :
        #update the values by averaging with the new data
        stats = searchResult[0]

        stats.visuals   = newAverage( stats.visuals , visualsValue , stats.votes )   if visualsValue > -1  else stats.visuals
        stats.audio     = newAverage( stats.audio , audioValue , stats.votes )       if audioValue > -1    else stats.audio
        stats.sexyM     = newAverage( stats.sexyM , sexyMValue , stats.votes )       if sexyMValue > -1    else stats.sexyM
        stats.sexyF     = newAverage( stats.sexyF , sexyFValue , stats.votes )       if sexyFValue > -1    else stats.sexyF
        stats.violence  = newAverage( stats.violence , violenceValue , stats.votes ) if violenceValue > -1 else stats.violence
        stats.story     = newAverage( stats.story , storyValue , stats.votes )       if storyValue > -1    else stats.story
        stats.characterDesign   = newAverage( stats.characterDesign , characterDesignValue , stats.votes )      if characterDesignValue > -1   else stats.characterDesign
        stats.fightChoreography = newAverage( stats.fightChoreography , fightChoreographyValue , stats.votes )  if fightChoreographyValue > -1 else stats.fightChoreography
        stats.votes += 1

    stats.save()
    if stats.genre != "none":
        pushGenre( stats , stats.genre )

    return HttpResponse(json.dumps('{message:"Everything is fine"}'), content_type='application/json')







def newAverage(currentvalue , valueToAdd, size ):
    return ( size*currentvalue + valueToAdd ) / ( size + 1)

def pushGenre( targetStats , animeGenre):
    searchResult = list(Genres.objects.filter(animeID = targetStats.pk, genre = animeGenre ))
    if len(searchResult) > 1 : raise Exception('too many genre results for ' + animeGenre  )
    if len(searchResult) == 0 :
        genrestat = Genres(animeID =targetStats, name =targetStats.name, genre = animeGenre, votes = 1 )
    if len(searchResult) == 1 :
        genrestat = searchResult[0]
        genrestat.votes += 1

    genrestat.save()


def genres(request):
    return HttpResponse(json.dumps(GenreList), content_type = 'application/json')

def getStats(request , animeName):
    searchResult = AnimeStats.objects.filter( name = animeName ).values()
    if len(searchResult) > 1 : raise Exception('too many stats results for ' + animeName)

    response = []
    if len(searchResult) == 1 :
        data = searchResult[0] 
        response.append( { 'name': "Visuals" , 'value': data['visuals']}    )
        response.append( { 'name': "Audio"   , 'value': data['audio']}      )
        response.append( { 'name': "Sexy M"  , 'value': data['sexyM']}      )
        response.append( { 'name': "Sexy F"  , 'value': data['sexyF']}      )
        response.append( { 'name': "Violence", 'value': data['violence']}   )
        response.append( { 'name': "Story"   , 'value': data['story']}      )
        response.append( { 'name': "CharacterDesign"  , 'value': data['characterDesign']}   )
        response.append( { 'name': "fightChoreography", 'value': data['fightChoreography']} )
    
    return HttpResponse(json.dumps(response), content_type = 'application/json')
    