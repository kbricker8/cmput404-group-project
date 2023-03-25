
from rest_framework import pagination
from rest_framework.response import Response
from collections import OrderedDict
from drf_yasg import openapi
from drf_yasg.inspectors import PaginatorInspector

class PostsPagination(pagination.PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50
    page_query_param = 'p'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page', self.page.number),
            ('size', self.get_page_size(self.request)),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('posts', data)
        ]))

class CommentsPagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50
    page_query_param = 'p'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page', self.page.number),
            ('size', self.get_page_size(self.request)),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('comments', data)
        ]))


# https://www.appsloveworld.com/django/100/167/drf-yasg-show-custom-pagination-for-listapiview-in-swagger-docs
class PostsPaginatorInspectorClass(PaginatorInspector):

    def get_paginated_response(self, paginator, response_schema):
        return openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties=OrderedDict((
                ('count', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('page', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('size', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('next', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                ('previous', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                ('posts', response_schema),
            )),
            required=['posts']
        )

class CommentsPaginatorInspectorClass(PaginatorInspector):

    def get_paginated_response(self, paginator, response_schema):
        return openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties=OrderedDict((
                ('count', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('page', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('size', openapi.Schema(type=openapi.TYPE_INTEGER)),
                ('next', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                ('previous', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                ('posts', response_schema),
            )),
            required=['posts']
        )