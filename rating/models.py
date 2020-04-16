from django.db import models

from enum import IntEnum



class AnimeGenre(IntEnum):
    Cyberpunk=0
    Game=1
    Ecchi=2 
    Yaoi=3
    Demons=4
    Harem=5
    Josei=6
    MartialArts=7
    Kids=8
    Historical=9
    Hentai=10
    Isekai=11
    Military=12
    Mecha=13
    Music=14
    Parody=15
    Police=16
    PostApocalyptic=17
    ReverseHarem=18
    School=19
    Seinen=20
    Shoujo=21
    Shoujoai=22
    Shounen=23
    Shounenai=24
    Space=25
    Sports=26
    SuperPower=27
    Tragedy=28
    Vampire=29
    Yuri=30
   


GenreList = [None] * len(AnimeGenre)

GenreList[ AnimeGenre.Cyberpunk ]        = "Cyberpunk"
GenreList[ AnimeGenre.Game ]             = "Game" 
GenreList[ AnimeGenre.Ecchi ]            = "Ecchi"
GenreList[ AnimeGenre.Yaoi ]             = "Yaoi"
GenreList[ AnimeGenre.Demons ]           = "Demons"
GenreList[ AnimeGenre.Harem ]            = "Harem"
GenreList[ AnimeGenre.Josei ]            = "Josei"
GenreList[ AnimeGenre.MartialArts ]      = "Martial"
GenreList[ AnimeGenre.Kids ]             = "Kids"
GenreList[ AnimeGenre.Historical ]       = "Historical"
GenreList[ AnimeGenre.Hentai ]           = "Hentai"
GenreList[ AnimeGenre.Isekai ]           = "Isekai"
GenreList[ AnimeGenre.Military ]         = "Military"
GenreList[ AnimeGenre.Mecha ]            = "Mecha"
GenreList[ AnimeGenre.Music ]            = "Music"
GenreList[ AnimeGenre.Parody ]           = "Parody"
GenreList[ AnimeGenre.Police ]           = "Police"
GenreList[ AnimeGenre.PostApocalyptic ]  = "Post-Apocalyptic"
GenreList[ AnimeGenre.ReverseHarem ]     = "Reverse Harem"
GenreList[ AnimeGenre.School ]           = "School"
GenreList[ AnimeGenre.Seinen ]           = "Seinen"
GenreList[ AnimeGenre.Shoujo ]           = "Shoujo"
GenreList[ AnimeGenre.Shoujoai ]         = "Shoujo-ai"
GenreList[ AnimeGenre.Shounen ]          = "Shounen"
GenreList[ AnimeGenre.Shounenai ]        = "Shounen-ai"
GenreList[ AnimeGenre.Space ]            = "Space"
GenreList[ AnimeGenre.Sports ]           = "Sports"
GenreList[ AnimeGenre.SuperPower ]       = "Super Power"
GenreList[ AnimeGenre.Tragedy ]          = "Tragedy"
GenreList[ AnimeGenre.Vampire ]          = "Vampire"
GenreList[ AnimeGenre.Yuri ]             = "Yuri"





# Create your models here.
class AnimeStats(models.Model):
    name  = models.CharField(max_length=50)
    genre = models.CharField(max_length=20, default="none")
    
    visuals  = models.FloatField(default=5)
    audio    = models.FloatField(default=5)
    sexyM    = models.FloatField(default=5)
    sexyF    = models.FloatField(default=5)
    violence = models.FloatField(default=5)
    story    = models.FloatField(default=5)
    characterDesign     = models.FloatField(default=5)
    fightChoreography   = models.FloatField(default=5)

    tags = models.TextField(default="")

    votes=models.IntegerField(default=1)
   

class Genres(models.Model):
    animeID = models.ForeignKey( 'AnimeStats', on_delete = models.CASCADE )
    name    = models.CharField( max_length = 50 )
    genre   = models.CharField( max_length = 20 )
    votes   = models.IntegerField()