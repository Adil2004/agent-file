from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer, FileManagerSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import FileManager
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .aiagent import ask_openrouter
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class FileManagerCreateView(generics.CreateAPIView):
    serializer_class = FileManagerSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(username = self.request.user)

class FileManagerListView(generics.ListCreateAPIView):
    serializer_class = FileManagerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FileManager.objects.filter(username= user).order_by("-created_at")

class FileChatView(generics.RetrieveAPIView):
    serializer_class = FileManagerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FileManager.objects.filter(username = user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_with_ai(request, pk):

    message = request.data.get("message", "").strip()

    document = get_object_or_404(
        FileManager,
        id=pk,
        username = request.user,
    )

    answer = ask_openrouter(
        message=message,
        file_path=document.file.path,
    )

    return JsonResponse({"answer": answer})