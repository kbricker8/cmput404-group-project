# Generated by Django 4.1.7 on 2023-03-02 23:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0004_rename_user_author_user_id_alter_author_github_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='user_id',
            new_name='user',
        ),
    ]
