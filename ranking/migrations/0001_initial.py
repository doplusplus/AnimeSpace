# Generated by Django 2.2.1 on 2019-08-28 06:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Anime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('genre', models.CharField(max_length=200)),
                ('popularity', models.IntegerField(default=0)),
                ('videoLink', models.URLField()),
            ],
        ),
    ]
