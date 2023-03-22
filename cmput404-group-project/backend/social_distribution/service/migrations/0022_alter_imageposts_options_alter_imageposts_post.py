# Generated by Django 4.1.7 on 2023-03-22 22:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0021_post_url'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='imageposts',
            options={'verbose_name_plural': 'images'},
        ),
        migrations.AlterField(
            model_name='imageposts',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='image', to='service.post'),
        ),
    ]
