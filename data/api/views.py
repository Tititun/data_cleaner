from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from data.models import Item
from .serializers import ItemSerializer


@api_view(['GET'])
def items_list(request):
    items = Item.objects.all()[:100]
    return Response(ItemSerializer(items, many=True).data, headers={})



