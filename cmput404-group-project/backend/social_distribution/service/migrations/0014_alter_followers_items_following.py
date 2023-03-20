# Generated by Django 4.1.7 on 2023-03-13 03:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0013_alter_followers_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='followers',
            name='items',
            field=models.ManyToManyField(blank=True, related_name='followingitem', to='service.author'),
        ),
        migrations.CreateModel(
            name='Following',
            fields=[
                ('id', models.URLField(max_length=255, primary_key=True, serialize=False)),
                ('author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='following', to='service.author')),
                ('items', models.ManyToManyField(blank=True, related_name='followeritem', to='service.author')),
            ],
        ),
    ]
