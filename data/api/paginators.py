import math
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ItemPagination(PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data,
            'max_page': math.ceil(self.page.paginator.count / self.page_size),
            'page_number': self.page.number
        })