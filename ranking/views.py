import json
from django.http import HttpResponse
from django.core import serializers

from django.shortcuts import render
from .models import Anime
from django.http import JsonResponse


def index(request):
    animelist = Anime.objects.all()
    output = ', '.join([q.name for q in animelist])
    return HttpResponse(output)

def animeDetails(request):
    animelist = Anime.objects.all()
    rawData = serializers.serialize('python', animelist)
    data = [d['fields'] for d in rawData]
    return HttpResponse(json.dumps(data), content_type='application/json')