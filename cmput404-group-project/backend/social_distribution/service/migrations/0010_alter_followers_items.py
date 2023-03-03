# Generated by Django 4.1.7 on 2023-03-03 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0009_followers_user_alter_author_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='followers',
            name='items',
            field=models.ManyToManyField(blank=True, related_name='following', to='service.author'),
        ),
    ]
