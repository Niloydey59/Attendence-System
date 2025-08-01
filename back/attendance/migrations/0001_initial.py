# Generated by Django 5.2.3 on 2025-06-26 12:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('students', '0003_alter_studentfaceimage_student_delete_student'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttendanceSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='AttendanceRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PRESENT', 'Present'), ('ABSENT', 'Absent')], default='ABSENT', max_length=10)),
                ('marked_at', models.DateTimeField(auto_now_add=True)),
                ('confidence_score', models.FloatField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendance_records', to='students.studentprofile')),
            ],
        ),
    ]
