from django.db import models
from django.conf import settings

# Create your models here.

class Settings(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    themeColor = models.CharField(max_length = 20)
    autoPlay = models.BooleanField(default = True)


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    animeName = models.CharField(max_length = 50)


