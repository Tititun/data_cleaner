import json

from django.db import connection
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from data.models import Item
from .paginators import ItemPagination
from .serializers import ItemSerializer


@api_view(['GET'])
def items_list(request):
    filters = Q()
    paginator = ItemPagination()
    source = request.GET.get('source')
    if source:
        filters &= Q(source__iregex=source)
    name = request.GET.get('name')
    if name:
        filters &= Q(name__iregex=name)
    category = request.GET.get('category')
    if category:
        filters &= Q(category__iregex=category)
    items = Item.objects.filter(filters)
    result_page = paginator.paginate_queryset(items, request)
    data = ItemSerializer(result_page, many=True).data
    return paginator.get_paginated_response(data)


@api_view(['GET'])
def levels(request):
    with open('data/levels.json') as f:
        levels = json.load(f)
    return Response(levels, headers={})
