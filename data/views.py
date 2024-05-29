from django.http import HttpRequest, JsonResponse
from django.shortcuts import render


def index(request: HttpRequest):
    return render(request, 'data/main.html')
