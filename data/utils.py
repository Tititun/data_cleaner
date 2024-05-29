from collections import defaultdict
import json
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'data_cleaner.settings'
from django.db.models import Q
import django

django.setup()

from data.models import Item


def infer_levels():
    items = Item.objects.filter(
        Q(category__regex='.*/.*') | Q(level_1__isnull=False) | Q(
            level_3__isnull=False))

    levels = defaultdict(lambda: defaultdict(set))
    for item in items:
        if item.level_2_inferred:
            if item.level_1_inferred:
                levels[item.level_2_inferred.lower()]['l1'].add(
                    item.level_1_inferred.lower())
            if item.level_3_inferred:
                levels[item.level_2_inferred.lower()]['l3'].add(
                    item.level_3_inferred.lower())
        if item.level_1_inferred:
            if item.level_2_inferred:
                levels[item.level_1_inferred.lower()]['l2'].add(
                    item.level_2_inferred.lower())
            if item.level_3_inferred:
                levels[item.level_1_inferred.lower()]['l3'].add(
                    item.level_3_inferred.lower())
        if item.level_3_inferred:
            if item.level_1_inferred:
                levels[item.level_3_inferred.lower()]['l1'].add(
                    item.level_1_inferred.lower())
            if item.level_2_inferred:
                levels[item.level_3_inferred.lower()]['l2'].add(
                    item.level_2_inferred.lower())
    return levels


if __name__ == '__main__':
    levels = infer_levels()
    for k, v in levels.items():
        for sk, sv in v.items():
            v[sk] = list(sv)
    print(levels)
    with open('levels.json', 'w') as f:
        json.dump(levels, f)
