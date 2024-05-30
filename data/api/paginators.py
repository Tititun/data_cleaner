from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ItemPagination(PageNumberPagination):
    page_size = 15

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data,
            'max_page': round(self.page.paginator.count / self.page_size) + 1,
            'page_number': self.page.number
        })