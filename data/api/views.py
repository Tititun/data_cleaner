import json

from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from data.models import Item
from .paginators import ItemPagination
from .serializers import ItemSerializer


@api_view(['GET'])
def items_list(request):
    paginator = ItemPagination()
    items = Item.objects.all()
    result_page = paginator.paginate_queryset(items, request)
    data = ItemSerializer(result_page, many=True).data
    return paginator.get_paginated_response(data)


@api_view(['GET'])
def levels(request):
    with open('data/levels.json') as f:
        levels = json.load(f)
    return Response(levels, headers={})
