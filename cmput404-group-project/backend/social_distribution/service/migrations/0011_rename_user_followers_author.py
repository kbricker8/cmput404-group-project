# Generated by Django 4.1.7 on 2023-03-03 23:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0010_alter_followers_items'),
    ]

    operations = [
        migrations.RenameField(
            model_name='followers',
            old_name='user',
            new_name='author',
        ),
    ]
