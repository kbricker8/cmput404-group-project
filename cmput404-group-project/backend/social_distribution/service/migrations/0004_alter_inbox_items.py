# Generated by Django 4.1.7 on 2023-03-27 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0003_alter_inbox_options_alter_inbox_author_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inbox',
            name='items',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
