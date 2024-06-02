import json
import traceback

from django.db import connection
from django.db.models import Count, Q
import pandas as pd
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from data.models import Item
from .paginators import ItemPagination
from .serializers import ItemSerializer, ItemPostSerializer


@api_view(['GET'])
def items_list(request):
    filters = Q()
    paginator = ItemPagination()

    source = request.GET.get('source')
    if source:
        if len(source) < 3:
            source = source.upper()
        else:
            source = source[:2].upper + source[2:].lower()
        filters &= Q(source__startswith=source)

    name = request.GET.get('name')
    if name:
        filters &= Q(name__iregex=name)

    category = request.GET.get('category')
    if category:
        filters &= Q(category__iregex=category)

    level_1 = request.GET.get('level_1')
    if level_1 and level_1 != 'null':
        filters &= Q(level_1=level_1)

    level_2 = request.GET.get('level_2')
    if level_2 and level_2 != 'null':
        filters &= Q(level_2=level_2)

    level_3 = request.GET.get('level_3')
    if level_3 and level_3 != 'null':
        filters &= Q(level_3=level_3)

    show_classified = request.GET.get('show_classified')
    show_classified = True if show_classified == 'true' else False

    items = (
        Item.objects
            .filter(filters)
            .exclude(
                (Q(level_1__isnull=False) |
                 Q(level_2__isnull=False) |
                 Q(level_3__isnull=False)) if not show_classified else Q())
    )
    result_page = paginator.paginate_queryset(items, request)
    data = ItemSerializer(result_page, many=True).data
    return paginator.get_paginated_response(data)


@api_view(['POST'])
def set_item_levels(request):
    item = Item.objects.get(id=request.data['id'])
    data = {k: v if v else None for k, v in request.data.items()}
    serializer = ItemPostSerializer(item, data=data)
    print(data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success"})
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def save_page(request):
    data = request.data

    for item_id, details in data.items():
        for level, value in details.items():
            if not value:
                details[level] = None
    print(data)
    try:
        items = Item.objects.filter(id__in=data.keys())
        for item in items:
            print(item)
            item.level_1 = data[str(item.id)]['level_1']
            item.level_2 = data[str(item.id)]['level_2']
            item.level_3 = data[str(item.id)]['level_3']
            item.save()
        # updated = Item.objects.bulk_update(items,
        #                                    ['level_1', 'level_2', 'level_3'])

        return Response({"status": "success"})
    except:
        print(traceback.format_exc())
        return Response({"status": "fail"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_items_levels(request):
    data = request.data
    ignore_classified = data['ignore_classified']
    try:
        updated = (Item.objects
             .filter(category=data['category'], source=data['source'])
             .exclude(
            (Q(level_1__isnull=False) |
             Q(level_2__isnull=False) |
             Q(level_3__isnull=False)) if ignore_classified else Q())
             .update(
                level_1=data['level_1'],
                level_2=data['level_2'],
                level_3=data['level_3']
        ))
        print('updated:', updated)
        return Response({"status": "success" if updated else "fail"})
    except:
        return Response({"status": "fail"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def levels(request):
    with open('data/api/json/levels.json') as f:
        levels = json.load(f)
    return Response(levels)


@api_view(['GET'])
def categories_list(request):
    # categories = {
    #     cat['category']: cat['group_count']
    #     for cat in (
    #         Item.objects
    #             .values('category')
    #             .annotate(group_count=Count('id'))
    #             .order_by('-group_count')
    #             .values('category', 'group_count')
    #     )
    # }
    with open('data/api/json/categories.json') as f:
        categories = json.load(f)
    return Response(categories)


@api_view(['GET'])
def classified(request):
    df = pd.DataFrame(
        Item.objects.filter(
            Q(level_1__isnull=False) | Q(level_2__isnull=False) | Q(
                level_3__isnull=False))
        .values('id', 'level_1', 'level_2', 'level_3')
    )
    df = df.fillna('NO GROUP')
    level_1_ = df.groupby(['level_1'])['level_2'].size().to_dict()
    level_2_ = df.groupby(['level_1', 'level_2'])['level_3'].size().to_dict()
    level_3_ = df.groupby(['level_1', 'level_2', 'level_3']).size().to_dict()

    groups = {}
    for gr_1, count_1 in level_1_.items():
        groups[gr_1] = {'count': count_1, 'groups': {}}
    for gr_2, count_2 in level_2_.items():
        level_1, level_2 = gr_2
        groups[level_1]['groups'][level_2] = {'count': count_2, 'groups': {}}
    for gr_3, count_3 in level_3_.items():
        level_1, level_2, level_3 = gr_3
        groups[level_1]['groups'][level_2]['groups'][level_3] = count_3
    return Response(groups)
