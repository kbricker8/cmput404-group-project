# Generated by Django 4.1.7 on 2023-03-27 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0005_alter_likes_object_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='likes',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='likes',
            name='object_id',
        ),
        migrations.AddField(
            model_name='likes',
            name='object',
            field=models.URLField(blank=True),
        ),
    ]