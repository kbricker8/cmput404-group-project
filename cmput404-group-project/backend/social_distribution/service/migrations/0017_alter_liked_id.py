# Generated by Django 4.1.7 on 2023-03-21 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0016_alter_likes_object_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='liked',
            name='id',
            field=models.URLField(max_length=255, primary_key=True, serialize=False),
        ),
    ]