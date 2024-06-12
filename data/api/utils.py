import os
import random
import re
import time
import traceback

from deep_translator import GoogleTranslator
from deep_translator.exceptions import NotValidLength
from django.db.models import Value
import numpy as np
import pandas as pd

os.environ["DJANGO_SETTINGS_MODULE"] = "data_cleaner.settings"
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

import django
django.setup()

from data.models import Item, Translation

np.random.seed(1)


def clean(text):
    text = text.lower().strip()
    text = re.sub('☆', '', text)
    text = re.sub('&', '', text)
    text = re.sub('^b\'', '', text)
    text = re.sub(r'\'$', '', text)
    text = re.sub(r'\[.*]', '', text)
    text = re.sub(r'\d+[.,]?\d*', '[NUM]', text)
    return text


def fetch_initial_df():
    return pd.DataFrame(
        Item.objects.filter(level_3__isnull=False)
                    .values('id', 'language', 'name', 'level_3', 'brand')
    )


def clean_df(df):
    df = df[df['name'].str.find(r'\x') == -1]
    df['name_clean'] = df['name'].apply(clean)
    df = df.drop_duplicates(subset=['name_clean'])
    df = df.loc[df['name_clean'] != '']
    print('items after cleaning:', df.shape[0])
    return df


def downsample(df, size=1000):
    print('df count before downsapling:', df.shape[0])
    df['group_count'] = df.groupby('level_3')['id'].transform('count')
    sample = df[df['group_count'] > size].groupby('level_3').sample(size)
    print(f'downsampled {len(sample["level_3"].unique())} categories')
    df = pd.concat([df[~df['level_3'].isin(sample['level_3'].unique())], sample])
    print('df count after downsapling:', df.shape[0])
    return df


def translate_small_groups(df, size):
    small_groups = df[(df['group_count'] < size)]['level_3'].unique()
    all_translations = []
    to_create = []
    for group in small_groups:
        group_count = df[df['level_3'] == group].shape[0]
        print(group, group_count)

        # try to fetch existing translations if they exist:
        existing = None
        try:
            existing = pd.DataFrame(Translation.objects.filter(category=group)
                                    .annotate(id_=Value(''),
                                              name_clean=Value(''),
                                              brand=Value(''),
                                              group_count=Value(''))
                                    .values('id_', 'target', 'translation',
                                            'category', 'brand',
                                            'name_clean', 'group_count')
                                    .distinct()[:size - group_count]
                                    ).rename(columns={'translation': 'name',
                                                      'id_': 'id',
                                                      'category': 'level_3',
                                                      'target': 'language'
                                                      })
            existing = existing[df.columns]
            print(f'found {existing.shape[0]} existing records')
        except KeyError:
            pass
        if existing is not None:
            all_translations.append(existing)
            group_count += existing.shape[0]
            if group_count >= size:
                continue

        translations = []
        languages = ['ar', 'de', 'es', 'fr', 'ja', 'nl', 'pl', 'ru', 'zh-CN']
        random.shuffle(languages)
        source_language = 'en'
        max_length = 50
        for language in languages:
            print(language)
            try:
                names = df[(df['level_3'] == group) & (
                            df['language'] == source_language)].sample(max_length)[
                    'name'].values
                google_tr = GoogleTranslator(source=source_language,
                                             target=language).translate(
                    '\n\n'.join(names))
                for name, name_tr in zip(names, google_tr.split('\n\n')):
                    translations.append({'id': '',
                                         'source_language': source_language,
                                         'language': language,
                                         'original': name,
                                         'name': name_tr,
                                         'level_3': group,
                                         'name_clean': '',
                                         'group_count': ''})
                    to_create.append(Translation(
                        source=source_language,
                        target=language,
                        original=name,
                        translation=name_tr,
                        from_item=True,
                        category=group)
                    )
                print(len(translations))
                if group_count + len(translations) >= size:
                    all_translations.append(pd.DataFrame(translations))
                    break
            except ValueError:
                source_language = \
                df[(df['level_3'] == group)]['language'].value_counts().index[0]
                print('switched language to', source_language)
            except NotValidLength:
                max_length = 25
                print('switched length to', max_length)
            except:
                print(traceback.format_exc())
            finally:
                time.sleep(2)

    df_tr = pd.concat(all_translations)
    print(f'total new translations: {len(to_create)}')
    Translation.objects.bulk_create(to_create, batch_size=3000)
    df = pd.concat([df, df_tr])
    return df


def fetch_data():
    df = fetch_initial_df()
    print('items before cleaning:', df.shape[0])
    df = clean_df(df)
    df = downsample(df, size=1000)
    df = translate_small_groups(df, size=600)
    df = clean_df(df)
    df.loc[df['id'] == '', 'id'] = 1
    df = df.drop(columns='group_count')

    return df


if __name__ == '__main__':
    df = fetch_data()
    print(df.head())

from transformers.models.xlm_roberta.modeling_xlm_roberta import XLMRobertaPreTrainedModel, XLMRobertaForSequenceClassification
from transformers.models.xlm_roberta.modeling_xlm_roberta import XLMRobertaConfig
from transformers import Trainer