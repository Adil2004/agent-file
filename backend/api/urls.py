from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('dashboard/', views.FileManagerListView.as_view(), name="dashboard"),
    path('upload-file/', views.FileManagerCreateView.as_view(), name="upload-file"),
    path('files/<int:pk>/', views.FileChatView.as_view(), name="file-detail"),
    path('files/<int:pk>/chat', views.chat_with_ai, name="chat-file"),
]