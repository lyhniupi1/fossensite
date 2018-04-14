from django.urls import re_path
from . import views

app_name = 'fitness'

urlpatterns = [
    re_path(r'^program-list/(?P<ptype_id>[0-9]+)/$', views.ProgramListView.as_view(), name='program_list'),
    re_path(r'^program/(?P<pk>[0-9]+)/$', views.ProgramDetailView.as_view(), name='program'),
    re_path(r'^program/(?P<pk>[0-9]+)/edit/$', views.ProgramEditView.as_view(), name='program_edit'),
    re_path(r'^exercise-list/$', views.ExerciseListView.as_view(), name='exercise_list'),
    re_path(r'^exercise-list/json/$', views.exercise_json_view, name='json_exercise_list'),
]
