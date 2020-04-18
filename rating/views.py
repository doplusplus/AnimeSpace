from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.core import serializers
from django.db.models import Max
from django.db.models import F

from .models import AnimeStats
from .models import GenreList
from .models import Genres


import json



# Create your views here.

#Pushes chracteristics to the database
def index(request):
    data =json.loads(request.body.decode("utf-8"))
    targetname=data['name']
    searchResult = list(AnimeStats.objects.filter(name__iexact = targetname))
    
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
    if data['genre'] in GenreList:
        pushGenre( stats , data['genre'] )

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
    response = queryStats(animeName)
    return HttpResponse(json.dumps(response), content_type = 'application/json')
    

def queryStats(animeName):
    searchResult = AnimeStats.objects.filter( name__iexact = animeName ).values()
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
    
    return response


def getVotedGenre(request , animeName):
    genre = queryVotedGenre(animeName)
    return HttpResponse(json.dumps(genre), content_type = 'application/json')

def queryVotedGenre(animeName):
    searchResult = Genres.objects.filter( name__iexact = animeName ).order_by('votes')
    genre = searchResult.last().genre if searchResult.exists() else ""
    return genre

def getAdvice(request):
    data = json.loads(request.body.decode("utf-8"))
    similarAnimes = data["similarAnimes"]
    filters = data["characteristics"]


    response = []
    advisedSimilarities = []
    filteredSelection = []
    # FETCHING SIMILAR ANIMES------------------------------------------------------------------------------------
    if similarAnimes is not None and len(similarAnimes) > 0:
        numberOfAnimes = len(similarAnimes)
        visuals = 0
        audio = 0
        sexyM = 0
        sexyF = 0
        violence = 0
        story = 0
        characterDesign = 0
        fightChoreography = 0
        genre = []

        #Averaging the different characterisics
        for anime in similarAnimes:
            searchResult = AnimeStats.objects.filter( name__iexact = anime ).values()
            animeValues  = searchResult[0]
            visuals     += animeValues["visuals"]
            audio       += animeValues["audio"]
            sexyM       += animeValues["sexyM"]
            sexyF       += animeValues["sexyF"]
            violence    += animeValues["violence"]
            story       += animeValues["story"]
            characterDesign     += animeValues["characterDesign"]
            fightChoreography   += animeValues["fightChoreography"]

            potentialGenre = queryVotedGenre(anime)
            if potentialGenre != "":
                genre.append(potentialGenre)

        visuals     /= numberOfAnimes
        audio       /= numberOfAnimes
        sexyM       /= numberOfAnimes
        sexyF       /= numberOfAnimes
        violence    /= numberOfAnimes
        story       /= numberOfAnimes
        characterDesign     /= numberOfAnimes
        fightChoreography   /= numberOfAnimes

        #Identify an anime signature
        average = (visuals + audio + sexyM + sexyF + violence + story + characterDesign + fightChoreography)/8
        FAverage=(F('visuals') + F('audio') + F('sexyM') + F('sexyF') + F('violence') + F('story') + F('characterDesign') + F('fightChoreography'))/8

        allanimes           = AnimeStats.objects.all()  
        withVisualsFilter   = allanimes.filter( visuals__gte = FAverage )       if visuals > average    else allanimes.filter( visuals__lte = FAverage )
        andAudioFilter      = withVisualsFilter.filter( audio__gte = FAverage ) if audio > average      else allanimes.filter( audio__lte = FAverage )
        andSexyMFilter      = andAudioFilter.filter( sexyM__gte = FAverage )    if sexyM > average      else allanimes.filter( sexyM__lte = FAverage )
        andSexyFFilter      = andSexyMFilter.filter( sexyF__gte = FAverage )    if sexyF > average      else allanimes.filter( sexyF__lte = FAverage )
        andViolenceFilter   = andSexyFFilter.filter( violence__gte =FAverage )  if violence > average   else allanimes.filter( violence__lte = FAverage )
        andStoryFilter      = andViolenceFilter.filter( story__gte = FAverage )    if story > average      else allanimes.filter( story__lte = FAverage )
        andCharacterDesignFilter    = andStoryFilter.filter( characterDesign__gte = FAverage )    if characterDesign > average    else allanimes.filter( characterDesign__lte = FAverage )
        andFightChoreographyFilter  = andCharacterDesignFilter.filter( fightChoreography__gte = FAverage )if fightChoreography > average  else allanimes.filter( fightChoreography__lte = FAverage )

        betterAnimes = andFightChoreographyFilter.exclude(name__in = similarAnimes )
    

        if len(genre) > 0 :
            genre.sort()
            genrename = [] 
            genrename.append({"name":genre[0] , "count":1})
        
            for i in range(1 , len(genre)) :
                if genre[i] == genre[i-1]:
                    genrename[len(genrename)-1]["count"] += 1
                else:
                    genrename.append({"name": genre[i] , "count":1})
                
            genrename.sort(key= lambda x: x["count"] )

            for orderedGenre in genrename :
                topanimes = list(betterAnimes.filter(genre__iexact = orderedGenre["name"]).values("name"))
                nameList = [element["name"] for element in topanimes]
                advisedSimilarities.extend(nameList)
    

    #CHECKING MINIMAL CONDITIONS 
    if filters is not None :
        minCharacteristics = filters["characteristics"]
        specidifiedGenre = filters["genre"]

        minFiltered =  AnimeStats.objects.filter( 
        visuals__gte     = minCharacteristics["visuals"] ,
        audio__gte       = minCharacteristics["audio"] ,
        sexyM__gte       = minCharacteristics["sexyM"] ,
        sexyF__gte       = minCharacteristics["sexyF"] ,
        violence__gte    = minCharacteristics["violence"] ,
        story__gte       = minCharacteristics["story"],
        characterDesign__gte     = minCharacteristics["characterDesign"] ,
        fightChoreography__gte   = minCharacteristics["fightChoreography"],
        genre = specidifiedGenre )


        filteredSelection = list(minFiltered.filter(name__in = advisedSimilarities).values("name")) if len(advisedSimilarities) > 0 else list(minFiltered.values("name")) 

    #OVERALL RESPONSE LOGIC
    if filters is not None :
        response = [element["name"] for element in filteredSelection]
    elif similarAnimes is not None :
        response.extend(advisedSimilarities)


    return HttpResponse(json.dumps(response), content_type = 'application/json')