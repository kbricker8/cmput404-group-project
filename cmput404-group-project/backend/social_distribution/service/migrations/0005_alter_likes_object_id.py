# Generated by Django 4.1.7 on 2023-03-27 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0004_alter_inbox_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='likes',
            name='object_id',
            field=models.URLField(null=True),
        ),
    ]
