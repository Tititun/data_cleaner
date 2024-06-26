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
    language = models.CharField(max_length=2, null=True)
    quantity = models.IntegerField(null=True)
    weight = models.DecimalField(max_digits=7, decimal_places=4, null=True)
    volume = models.DecimalField(max_digits=7, decimal_places=4, null=True)
    is_test = models.BooleanField(null=False)
    predicted = models.CharField(max_length=50, null=False)
    inferred_from_upc = models.BooleanField(null=True)

    def infer_levels(self):
        if not self.category:
            return [None] * 3
        levels = self.category.lower().split('/')
        if len(levels) == 1:
            return [None, levels[0], None]
        elif len(levels) == 2:
            return [levels[0], levels[1], None]
        else:
            return [levels[-3], levels[-2], levels[-1]]

    @property
    def level_1_inferred(self):
        return self.infer_levels()[0]

    @property
    def level_2_inferred(self):
        return self.infer_levels()[1]

    @property
    def level_3_inferred(self):
        return self.infer_levels()[2]

    class Meta:
        db_table = 'consumer_item'
        unique_together = ('source', 'source_key')
        app_label = 'data'
        managed=False


class Prediction(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE,
                             related_name='predictions', null=False)
    category = models.CharField(max_length=100, null=False)
    prob = models.FloatField(null=False)

    class Meta:
        db_table = 'item_prediction'
        constraints = [
            models.UniqueConstraint(fields=['item', 'category'],
                                    name='item_category_prediction_constraint')
        ]

        ordering = ['-prob']


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


class Translation(models.Model):
    source = models.CharField(max_length=10, null=False)
    target = models.CharField(max_length=10, null=False)
    original = models.CharField(max_length=1000, null=True)
    translation = models.CharField(max_length=1000, null=False)
    from_item = models.BooleanField(null=True)
    category = models.CharField(max_length=100, null=True)

    class Meta:
        managed=False
        db_table = 'translation'