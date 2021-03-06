from django.db import models


class Anime(models.Model):
    name    = models.CharField(max_length  = 50)
    genre   = models.CharField(max_length  = 20, default = "to be defined")
    description = models.TextField(default = "no description for now")
    popularity  = models.IntegerField(default = 0)
    videoId     = models.CharField(max_length = 20)
    tags        = models.CharField(max_length = 120)
    darkVideoBackground = models.BooleanField()