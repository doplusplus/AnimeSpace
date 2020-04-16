from django.contrib import admin
from .models import AnimeStats
# Register your models here.

class AnimeStatsAdmin(admin.ModelAdmin):
    pass
admin.site.register(AnimeStats, AnimeStatsAdmin)