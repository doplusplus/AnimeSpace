# Generated by Django 2.2.1 on 2020-03-23 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ranking', '0003_auto_20190924_2039'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='anime',
            name='videoLink',
        ),
        migrations.AddField(
            model_name='anime',
            name='videoId',
            field=models.CharField(default='', max_length=20),
            preserve_default=False,
        ),
    ]