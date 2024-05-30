from rest_framework import serializers
from data.models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'source', 'name', 'category',
                  'level_1', 'level_2', 'level_3', 'translation',
                  'level_1_inferred', 'level_2_inferred', 'level_3_inferred']


class ItemPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'level_1', 'level_2', 'level_3']
