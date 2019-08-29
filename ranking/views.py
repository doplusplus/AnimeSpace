from django.shortcuts import render
from django.http import HttpResponse
from .models import Anime
from django.core import serializers

def index(request):
    animelist = Anime.objects.all()
    output = ', '.join([q.name for q in animelist])
    return HttpResponse(output)

def animeDetails(request):
    data = serializers.serialize("json", Anime.objects.all())
    return HttpResponse(data)