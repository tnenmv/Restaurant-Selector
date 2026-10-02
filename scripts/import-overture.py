#!/usr/bin/env python3
"""
Import real food & drink places in Madinah from the Overture Maps open dataset
(https://overturemaps.org) into src/data/madinahPlaces.json.

    pip install pyarrow
    python3 scripts/import-overture.py [--release 2026-09-23.1] [--min-confidence 0.5]

Overture places are open data (CDLA-Permissive-2.0 and other open licenses),
compiled from Meta, Microsoft, Foursquare, AllThePlaces and others. They do NOT
include ratings, prices, opening hours or amenities; the app treats those as
unknown. Cuisine/category are mapped from Overture's taxonomy plus name keywords.
"""
import argparse, json, math, os, re, sys, urllib.request

import pyarrow.compute as pc
import pyarrow.dataset as ds
import pyarrow.fs as pafs

BUCKET = 'overturemaps-us-west-2'
BBOX = dict(xmin=39.45, xmax=39.80, ymin=24.30, ymax=24.62)  # Madinah
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'madinahPlaces.json')

# District centres (keep in sync with AREAS in src/data/options.ts).
AREAS = {
    'central': (24.4686, 39.6112), 'quba': (24.4395, 39.6175), 'uraid': (24.5085, 39.5995),
    'aziziyah': (24.4300, 39.5760), 'difaa': (24.4560, 39.6570), 'sultanah': (24.4740, 39.5880),
    'khalidiyah': (24.4930, 39.6380), 'shuran': (24.4080, 39.6270), 'jamiah': (24.4810, 39.5560),
    'hijrah': (24.4200, 39.5480), 'uyun': (24.5250, 39.5700), 'aqoul': (24.5150, 39.6650),
}
AREA_MAX_KM = 3.5  # farther than this from every centre → 'other'

EXCLUDE = {'bar', 'beer_garden', 'sports_bar', 'internet_cafe', 'airport_lounge', 'lounge', 'hookah_bar'}

CAFE = {'coffee_shop', 'cafe', 'tea_room', 'coffee_roastery', 'smoothie_juice_bar', 'bubble_tea_shop'}
DESSERT = {'dessert_shop', 'ice_cream_shop', 'bakery', 'candy_store', 'donut_shop', 'cupcake_shop',
           'chocolatier', 'frozen_yogurt_shop', 'bagel_shop'}
TAXONOMY_CUISINE = {
    'pizza_restaurant': 'pizza', 'burger_restaurant': 'burger', 'seafood_restaurant': 'seafood',
    'fish_and_chips_restaurant': 'seafood', 'indian_restaurant': 'indian', 'pakistani_restaurant': 'indian',
    'bangladeshi_restaurant': 'indian', 'afghani_restaurant': 'indian', 'turkish_restaurant': 'turkish',
    'doner_kebab_restaurant': 'turkish', 'italian_restaurant': 'italian', 'japanese_restaurant': 'japanese',
    'sushi_restaurant': 'japanese', 'ramen_restaurant': 'japanese', 'asian_restaurant': 'asian',
    'chinese_restaurant': 'asian', 'indonesian_restaurant': 'asian', 'malaysian_restaurant': 'asian',
    'filipino_restaurant': 'asian', 'dim_sum_restaurant': 'asian', 'thai_restaurant': 'asian',
    'egyptian_restaurant': 'egyptian', 'lebanese_restaurant': 'levantine', 'syrian_restaurant': 'levantine',
    'mediterranean_restaurant': 'levantine', 'middle_eastern_restaurant': 'arabic', 'arabian_restaurant': 'saudi',
    'barbecue_restaurant': 'arabic',
}
# Name keywords (Arabic + English) for generic restaurants. First match wins.
KEYWORDS = [
    # well-known chains first
    ('cafe', r'دانكن|dunkin|starbucks|ستاربكس|tim hortons|تيم هورتنز|barn\'?s|بارنز|كوفي|coffee|roaster|روستري'),
    ('desserts', r'cinnabon|سينابون|krispy|كرسبي|baskin|باسكن|حلواني|حلوان|tomoor|تمور|البلح|dates'),
    ('burger', r'برجر|برقر|burger|kudu|كودو|mcdonald|macdonald|ماكدونالد|hardee|هارديز|herfy|هرفي|fuddruckers|فدركرز'),
    ('pizza', r'بيتزا|pizza|domino|دومينوز|papa john|بابا جونز|little caesars'),
    ('saudi', r'مندي|كبسة|مضغوط|حنيذ|مظبي|بخاري|مقلقل|حاشي|كبدة|تميس|معصوب|فول|شعبي|شعبية|mandi|kabsa|bukhari|madfoon|tamees'),
    ('seafood', r'سمك|اسماك|أسماك|بحري|جمبري|fish|seafood|shrimp|crab'),
    ('egyptian', r'مصري|كشري|رمسيس|فطير|koshary|egypt|fetir'),
    ('levantine', r'شامي|الشام|سوري|لبنان|دمشق|حلب|syria|leban|shami'),
    ('turkish', r'تركي|اسطنبول|إسطنبول|turk|istanbul|doner|دونر|pide|osmanl|marmara|oglu|oglo|gurme|divan|konya'),
    ('indian', r'هندي|برياني|india|biryani|tandoor|تندو|pakistan|باكستان|islamabad|lahore|karachi|jhelum|mehran|zaiqa|sonargaon|bangla'),
    ('japanese', r'سوشي|ياباني|sushi|japan|ramen'),
    ('asian', r'صيني|تايلند|آسيوي|اسيوي|china|chinese|thai|asia|korea|noodle|bali'),
    ('italian', r'ايطالي|إيطالي|باستا|pasta|italian|italia|davanti'),
    ('gulf', r'خليجي|الخليج|يمني|حضرم|gulf|khaleej|yemen|hadram'),
    ('arabic', r'شاورم|مشويات|مشاوي|شواية|شوايه|فلافل|كباب|حمص|سيخ|shawarm|shawaya|grill|falafel|kebab|kabab|hummus'),
    ('desserts', r'حلويات|حلا|كنافة|كيك|sweets|dessert|cake|kunafa'),
    ('cafe', r'قهوة|كافيه|كرك|cafe|café|karak'),
]
KEYWORDS = [(c, re.compile(p, re.I)) for c, p in KEYWORDS]
ARABIC = re.compile('[؀-ۿ]')


def km(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (*a, *b))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def classify(primary, name):
    kw = next((c for c, rx in KEYWORDS if rx.search(name)), None)
    if primary in CAFE:
        return 'cafe', 'cafe'
    if primary in DESSERT:
        return 'desserts', 'desserts'
    if primary == 'breakfast_and_brunch_restaurant':
        return 'breakfast', kw if kw not in (None, 'cafe', 'desserts') else 'arabic'
    # A clear name keyword beats Overture's taxonomy (e.g. "Shawarma Restaurants" tagged as burger).
    cuisine = kw or TAXONOMY_CUISINE.get(primary) or 'other'
    category = 'cafe' if cuisine == 'cafe' else 'desserts' if cuisine == 'desserts' else 'restaurant'
    return category, cuisine


def latest_release():
    url = f'https://{BUCKET}.s3.us-west-2.amazonaws.com/?list-type=2&prefix=release/&delimiter=/'
    xml = urllib.request.urlopen(url, timeout=30).read().decode()
    return sorted(re.findall(r'<Prefix>release/([^<]+)/</Prefix>', xml))[-1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--release')
    ap.add_argument('--min-confidence', type=float, default=0.5)
    args = ap.parse_args()
    release = args.release or latest_release()
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    fs = pafs.S3FileSystem(anonymous=True, region='us-west-2', **({'proxy_options': proxy} if proxy else {}))
    d = ds.dataset(f'{BUCKET}/release/{release}/theme=places/type=place/', filesystem=fs, format='parquet')
    f = ((pc.field('bbox', 'xmin') > BBOX['xmin']) & (pc.field('bbox', 'xmax') < BBOX['xmax'])
         & (pc.field('bbox', 'ymin') > BBOX['ymin']) & (pc.field('bbox', 'ymax') < BBOX['ymax']))
    rows = d.to_table(filter=f, columns=['id', 'names', 'taxonomy', 'confidence', 'websites', 'phones', 'bbox', 'sources']).to_pylist()
    print(f'release {release}: {len(rows)} places in bbox', file=sys.stderr)

    out, seen = [], []
    for r in sorted(rows, key=lambda r: -(r['confidence'] or 0)):
        tax = r['taxonomy'] or {}
        hier = tax.get('hierarchy') or []
        primary = tax.get('primary')
        name = ((r['names'] or {}).get('primary') or '').strip()
        if not hier or hier[0] != 'food_and_drink' or primary in EXCLUDE or not name:
            continue
        if (r['confidence'] or 0) < args.min_confidence:
            continue
        lat = round((r['bbox']['ymin'] + r['bbox']['ymax']) / 2, 5)
        lng = round((r['bbox']['xmin'] + r['bbox']['xmax']) / 2, 5)
        key = re.sub(r'\W+', '', name.lower())
        if any(k == key and km((lat, lng), p) < 0.15 for k, p in seen):
            continue  # duplicate of a higher-confidence record
        seen.append((key, (lat, lng)))
        dist, area = min((km((lat, lng), c), a) for a, c in AREAS.items())
        category, cuisine = classify(primary, name)
        rec = {
            'id': r['id'], 'name': name, 'category': category, 'cuisine': cuisine,
            'area': area if dist <= AREA_MAX_KM else 'other', 'lat': lat, 'lng': lng,
            'type': primary, 'conf': round(r['confidence'], 2),
            'src': sorted({s['dataset'] for s in r['sources'] or [] if s['dataset'] != 'Overture'}),
        }
        if r['websites']:
            rec['web'] = r['websites'][0]
        if r['phones']:
            rec['tel'] = r['phones'][0]
        out.append(rec)

    out.sort(key=lambda x: x['name'])
    meta = {'source': 'Overture Maps Foundation', 'release': release, 'license': 'CDLA-Permissive-2.0 (and other open licenses per record)', 'count': len(out)}
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump({'meta': meta, 'places': out}, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'wrote {len(out)} places → {os.path.relpath(OUT)}', file=sys.stderr)


if __name__ == '__main__':
    main()
