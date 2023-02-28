# Generated by Django 4.1.7 on 2023-02-28 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0003_author_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='user',
            new_name='user_id',
        ),
        migrations.AlterField(
            model_name='author',
            name='github',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='host',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='profileImage',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='url',
            field=models.URLField(blank=True),
        ),
    ]
