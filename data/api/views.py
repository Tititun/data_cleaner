import json
import os
import traceback
from pathlib import Path

from deep_translator import GoogleTranslator
from django.db.models import F, Q
import numpy as np
import pandas as pd
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sklearn.metrics import confusion_matrix as cmatrix
import torch
from torch.nn import functional
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from data.models import Item, Translation
from .paginators import ItemPagination
from .serializers import (ItemSerializer, ItemPostSerializer,
                          ItemPredictedSerializer)
from .utils import clean

MODEL_PATH = Path(__file__).parent.parent / 'models'
TOKENIZER_PATH = MODEL_PATH / 'tokenizer'

model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model = model.to('cuda' if torch.cuda.is_available() else 'cpu')
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH)
with open(os.path.join(Path(__file__).parent, 'idx_to_label.json')) as f:
    idx_to_label = {int(k): v for k,v in json.load(f).items()}


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

    category = request.GET.get('category')
    if category:
        filters &= Q(category__iregex=category)

    language = request.GET.get('lang')
    if language and language not in ['nen', 'null']:
        filters &= Q(language=language)

    name = request.GET.get('name')
    if name:
        if language:
            to = language if language != 'zh' else 'zh-CN'
            tr = Translation.objects.filter(source='en', target=to,
                                            original=name).first()
            if tr:
                print('found translation')
                filters &= Q(name__iregex=tr.translation)
            else:
                try:
                    translation = GoogleTranslator(source='en', target=to).translate(name)
                    filters &= Q(name__iregex=translation)
                    Translation.objects.create(source='en', target=to,
                                               original=name, translation=translation)
                except:
                    print(traceback.format_exc())
                    filters &= Q(name__iregex=name)
        else:
            filters &= Q(name__iregex=name)

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
            .exclude(Q(language='en') if language == 'nen' else Q())
    )
    result_page = paginator.paginate_queryset(items, request)
    data = ItemSerializer(result_page, many=True).data
    return paginator.get_paginated_response(data)


@api_view(['POST'])
def set_item_levels(request):
    item = Item.objects.get(id=request.data['id'])
    data = {k: v if v else None for k, v in request.data.items()}
    serializer = ItemPostSerializer(item, data=data)
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


@api_view(['GET'])
def model_results(request):
    paginator = ItemPagination()
    paginator.page_size = 100
    items = Item.objects.filter(is_test=True).exclude(level_3=F('predicted'))
    result_page = paginator.paginate_queryset(items, request)
    serializer = ItemPredictedSerializer(result_page, many=True)
    data = serializer.data
    return paginator.get_paginated_response(data)


@api_view(['GET'])
def confusion_matrix(request):
    data = (
        Item.objects.filter(is_test=True, level_3__isnull=False)
                    .values_list('level_3', 'predicted')
    )
    labels = [d[0] for d in data]
    predictions = [d[1] for d in data]
    names = sorted(list(set(labels)))
    cm = cmatrix(labels, predictions, labels=names, normalize='true').round(3)
    return Response({'cm': cm, 'labels': names})


@api_view(['GET'])
def confusion_matrix_errors(request):
    label = request.GET['label']
    print(label)
    items = Item.objects.filter(level_3=label).exclude(predicted=label)
    data = ItemPredictedSerializer(items, many=True).data
    return Response({'data': data})


@api_view(['GET'])
def get_random_predictions(request):
    items = Item.objects.filter(level_3__isnull=True).exclude(source='AE_carrefour').order_by('?').values(
        'id', 'name', 'source', 'language', 'category')[:20]
    texts = [clean(i['name']) for i in items]
    tokenized = tokenizer(texts, padding=True, truncation=True, max_length=50,
                          return_tensors="pt")
    for k, v in tokenized.items():
        tokenized[k] = v.to(model.device)
    with torch.no_grad():
        res = model(**tokenized).logits.to('cpu')
    probabilities_scores = functional.softmax(res.detach(), dim=-1).numpy()
    print(probabilities_scores.shape)
    probs = [p.argsort()[-3:][::-1] for p in probabilities_scores]
    top_predictions = [
        [{'category': idx_to_label[a],
          'prob': probabilities_scores[idx][a]}
         for a in [*item]] for idx, item in enumerate(probs)
    ]
    for idx, item in enumerate(items):
        item['predictions'] = top_predictions[idx]

    return Response({'data': items})
