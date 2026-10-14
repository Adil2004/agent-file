from .models import FileManager
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class FileManagerSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="username.username")
    class Meta:
        model = FileManager
        fields = ["id", "username", "topic", "file", "created_at"]

