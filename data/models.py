from django.db import models


class Item(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    source = models.CharField(max_length=45, null=False, db_index=True)
    source_key = models.CharField(max_length=45, null=False)
    name = models.CharField(max_length=200, null=False)
    scraped_on = models.DateTimeField(auto_now=True)
    currency = models.CharField(max_length=3)
    category = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=2, null=False)
    upc_country = models.CharField(max_length=2)
    url = models.TextField(null=True)
    attributes = models.TextField(null=True)
    brand = models.CharField(max_length=45, null=True)
    unit = models.CharField(max_length=45, null=True)
    price_per_unit = models.CharField(max_length=45, null=True)
    upc = models.CharField(max_length=13, null=True)
    image_url = models.TextField(null=True)
    category_is_predicted = models.BooleanField(default=False)
    last_price = models.FloatField(null=True)
    last_seen = models.DateTimeField(null=True)
    country_origin = models.CharField(max_length=80, null=True)
    food_type = models.CharField(max_length=20, null=True)
    item_type = models.CharField(max_length=20, null=True)
    tag = models.CharField(max_length=15, null=True)
    level_1 = models.CharField(max_length=200, null=True)
    level_2 = models.CharField(max_length=200, null=True)
    level_3 = models.CharField(max_length=200, null=True)
    translation = models.CharField(max_length=200, null=True)

    class Meta:
        db_table = 'consumer_item'
        unique_together = ('source', 'source_key')
        app_label = 'data'
        managed=False


class Supermarket(models.Model):
    source = models.CharField(max_length=45)
    country = models.CharField(max_length=2)
    name = models.CharField(max_length=45)
    is_active = models.BooleanField(default=True)
    last_finished = models.DateTimeField(null=True)
    last_insert = models.DateTimeField(null=True)
    error_message = models.TextField(null=True, blank=True)
    language = models.CharField(max_length=2, null=True)

    class Meta:
        db_table = 'consumer_supermarket'
        app_label = 'data'
        managed = False
