# Generated by Django 2.2.1 on 2019-08-28 21:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ranking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='description',
            field=models.TextField(default='no description for now'),
        ),
        migrations.AlterField(
            model_name='anime',
            name='genre',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='anime',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
