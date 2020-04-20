from django.contrib import admin

from .models import Favorite
from .models import Settings

# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    pass
admin.site.register(Settings, AccountAdmin)

class FavoriteAdmin(admin.ModelAdmin):
    pass
admin.site.register(Favorite, FavoriteAdmin)