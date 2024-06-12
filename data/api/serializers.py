from rest_framework import serializers
from data.models import Item, Prediction


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'source', 'name', 'category',
                  'level_1', 'level_2', 'level_3',
                  'level_1_inferred', 'level_2_inferred', 'level_3_inferred']


class ItemPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'level_1', 'level_2', 'level_3']


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['item_id', 'category', 'prob']


class ItemPredictedSerializer(serializers.ModelSerializer):
    predictions = PredictionSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'level_3',
                  'language', 'source', 'predictions']
