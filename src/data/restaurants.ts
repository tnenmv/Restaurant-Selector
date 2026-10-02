/**
 * ⚠️ PROTOTYPE SAMPLE DATA — بيانات تجريبية
 *
 * Every restaurant below is FICTIONAL. Names, ratings, prices, hours and
 * descriptions were invented for this prototype and are NOT verified
 * real-world information. Neighbourhood names are real Madinah districts and
 * coordinates are only approximate points inside them.
 *
 * This file is the only place the UI's data comes from (via
 * `services/restaurantService`). Replace it with Google Places, a custom
 * backend, an open-data source, etc. without touching any component.
 */
import { AREAS } from './options';
import type { AreaId, Cuisine, PlaceCategory, PriceLevel, Restaurant } from '../types';

interface Seed {
  id: string;
  name: string;
  nameEn: string;
  category: PlaceCategory;
  cuisine: Cuisine;
  price: PriceLevel;
  rating: number;
  area: AreaId;
  street: [ar: string, en: string];
  /** Offset from the district centre in thousandths of a degree (~110 m). */
  offset: [lat: number, lng: number];
  desc: [ar: string, en: string];
  /** Flags: o=openNow f=family s=outdoor q=quiet g=groups */
  flags: string;
}

const SEEDS: Seed[] = [
  // ── المنطقة المركزية ──
  { id: 'r01', name: 'بيت المندي الذهبي', nameEn: 'Golden Mandi House', category: 'restaurant', cuisine: 'saudi', price: 2, rating: 4.6, area: 'central', street: ['شارع الملك فيصل', 'King Faisal St'], offset: [3, -4], desc: ['مندي لحم وحاشي على الطريقة التقليدية، أرز مبهّر وصالة عائلية واسعة.', 'Traditional lamb and camel mandi with spiced rice and a spacious family hall.'], flags: 'ofg' },
  { id: 'r02', name: 'قهوة الحرّة', nameEn: 'Al-Harra Coffee', category: 'cafe', cuisine: 'cafe', price: 2, rating: 4.4, area: 'central', street: ['شارع أبي ذر', 'Abu Dharr St'], offset: [-2, 5], desc: ['قهوة سعودية بالهيل مع تمر مدني فاخر وقهوة مختصة مقطّرة.', 'Cardamom Saudi coffee with premium Madinah dates and specialty pour-overs.'], flags: 'oq' },
  { id: 'r03', name: 'فطور السوق القديم', nameEn: 'Old Souq Breakfast', category: 'breakfast', cuisine: 'arabic', price: 1, rating: 4.3, area: 'central', street: ['شارع السلام', 'As-Salam St'], offset: [5, 2], desc: ['فول وتميس ومعصوب وشاي حليب — فطور سريع ولذيذ قبل الزحمة.', 'Foul, tamees, masoub and milk tea — a quick, hearty breakfast before the crowds.'], flags: 'og' },
  { id: 'r04', name: 'مطبخ دلهي الصغير', nameEn: 'Little Delhi Kitchen', category: 'restaurant', cuisine: 'indian', price: 1, rating: 4.1, area: 'central', street: ['شارع قربان', 'Qurban St'], offset: [-5, -2], desc: ['برياني دجاج وكاري زبدة وخبز نان من التنور، كميات سخية وأسعار مناسبة.', 'Chicken biryani, butter curry and tandoor naan — generous plates at fair prices.'], flags: 'ofg' },

  // ── قباء ──
  { id: 'r05', name: 'حديقة قباء', nameEn: 'Quba Garden Terrace', category: 'restaurant', cuisine: 'levantine', price: 2, rating: 4.5, area: 'quba', street: ['طريق قباء', 'Quba Rd'], offset: [2, 3], desc: ['مشاوي شامية ومقبلات باردة في جلسات خارجية بين النخيل.', 'Levantine grills and cold mezze served on an outdoor terrace among the palms.'], flags: 'ofsg' },
  { id: 'r06', name: 'تمرية قباء', nameEn: 'Quba Date Bakery', category: 'desserts', cuisine: 'desserts', price: 1, rating: 4.7, area: 'quba', street: ['شارع قباء الجديد', 'New Quba St'], offset: [-3, -1], desc: ['معمول وكليجا وكيكة تمر طازجة يوميًا من تمور المدينة.', 'Fresh maamoul, kleicha and date cake baked daily with Madinah dates.'], flags: 'ofq' },
  { id: 'r07', name: 'كشري الحارة', nameEn: 'Hara Koshary', category: 'restaurant', cuisine: 'egyptian', price: 1, rating: 4.0, area: 'quba', street: ['شارع العوالي', 'Al-Awali St'], offset: [4, -5], desc: ['كشري وحواوشي وفطير مشلتت بنكهة مصرية أصيلة.', 'Koshary, hawawshi and feteer meshaltet with an authentic Egyptian touch.'], flags: 'og' },

  // ── العريض ──
  { id: 'r08', name: 'برجر الصحراء', nameEn: 'Desert Smash Burger', category: 'restaurant', cuisine: 'burger', price: 2, rating: 4.5, area: 'uraid', street: ['طريق الملك عبدالعزيز', 'King Abdulaziz Rd'], offset: [1, 2], desc: ['سماش برجر مقرمش مع صوص البيت وبطاطس بالكمّون.', 'Crispy smash burgers with house sauce and cumin-dusted fries.'], flags: 'osg' },
  { id: 'r09', name: 'ساكورا المدينة', nameEn: 'Sakura Madinah', category: 'dinner', cuisine: 'japanese', price: 3, rating: 4.6, area: 'uraid', street: ['شارع الأمير نايف', 'Prince Naif St'], offset: [-3, 4], desc: ['سوشي ورامن وتيبانياكي في أجواء هادئة وإضاءة خافتة.', 'Sushi, ramen and teppanyaki in a calm, softly lit dining room.'], flags: 'oq' },
  { id: 'r10', name: 'فرن الحطب', nameEn: 'Wood Fire Pizza Co.', category: 'restaurant', cuisine: 'pizza', price: 2, rating: 4.3, area: 'uraid', street: ['شارع العريض العام', 'Al-Uraid Main St'], offset: [4, -3], desc: ['بيتزا نابولية على الحطب بعجينة مخمّرة ٤٨ ساعة.', 'Neapolitan pizza from a wood oven with 48-hour fermented dough.'], flags: 'fg' },

  // ── العزيزية ──
  { id: 'r11', name: 'مشويات إسطنبول', nameEn: 'Istanbul Grill', category: 'restaurant', cuisine: 'turkish', price: 2, rating: 4.4, area: 'aziziyah', street: ['شارع العزيزية', 'Al-Aziziyah St'], offset: [2, -2], desc: ['إسكندر كباب وبيدا تركية وكنافة ساخنة بعد الأكل.', 'Iskender kebab, Turkish pide and hot kunafa to finish.'], flags: 'ofg' },
  { id: 'r12', name: 'ركن الكبسة', nameEn: 'Kabsa Corner', category: 'restaurant', cuisine: 'saudi', price: 1, rating: 4.2, area: 'aziziyah', street: ['طريق الملك عبدالله', 'King Abdullah Rd'], offset: [-4, 3], desc: ['كبسة دجاج ولحم ومظبي بأسعار اقتصادية، مناسب للطلبات الكبيرة.', 'Chicken and lamb kabsa and madhbi at budget prices — great for big orders.'], flags: 'ofg' },
  { id: 'r13', name: 'نودلز ووك', nameEn: 'Wok & Noodle', category: 'restaurant', cuisine: 'asian', price: 2, rating: 3.9, area: 'aziziyah', street: ['شارع الأمير سلطان', 'Prince Sultan St'], offset: [3, 4], desc: ['نودلز مقلية ودجاج حلو وحامض وأطباق تايلندية حارة.', 'Stir-fried noodles, sweet & sour chicken and spicy Thai plates.'], flags: 'o' },

  // ── الدفاع ──
  { id: 'r14', name: 'سمك البحر الأحمر', nameEn: 'Red Sea Fish Market', category: 'restaurant', cuisine: 'seafood', price: 2, rating: 4.5, area: 'difaa', street: ['شارع الدفاع', 'Ad-Difaa St'], offset: [1, -3], desc: ['اختر سمكك الطازج واطلبه مشويًا أو مقليًا أو صيادية.', 'Pick your fresh fish and have it grilled, fried or as sayadieh.'], flags: 'ofg' },
  { id: 'r15', name: 'صاج ومناقيش', nameEn: 'Saj & Manakish', category: 'breakfast', cuisine: 'levantine', price: 1, rating: 4.2, area: 'difaa', street: ['شارع السيح', 'As-Saih St'], offset: [-3, 2], desc: ['مناقيش زعتر وجبنة وصاج لبنة من الفرن مباشرة.', "Za'atar and cheese manakish and labneh saj straight from the oven."], flags: 'ofs' },
  { id: 'r16', name: 'لافيندر كافيه', nameEn: 'Lavender Café', category: 'cafe', cuisine: 'cafe', price: 2, rating: 4.3, area: 'difaa', street: ['شارع الهجرة الشرقي', 'East Hijrah St'], offset: [4, 4], desc: ['كافيه هادئ للمذاكرة والعمل، كرواسون طازج وماتشا.', 'A quiet café for studying or work — fresh croissants and matcha.'], flags: 'oqs' },

  // ── سلطانة ──
  { id: 'r17', name: 'شاورما سلطانة', nameEn: 'Sultanah Shawarma', category: 'restaurant', cuisine: 'arabic', price: 1, rating: 4.4, area: 'sultanah', street: ['شارع سلطانة', 'Sultanah St'], offset: [2, 1], desc: ['شاورما دجاج ولحم على الفحم مع ثومية البيت — سريع وطازج.', 'Charcoal chicken and beef shawarma with house garlic sauce — fast and fresh.'], flags: 'og' },
  { id: 'r18', name: 'تراتوريا روما', nameEn: 'Trattoria Roma', category: 'dinner', cuisine: 'italian', price: 3, rating: 4.5, area: 'sultanah', street: ['شارع أبو بكر الصديق', 'Abu Bakr As-Siddiq St'], offset: [-2, -4], desc: ['باستا طازجة وريزوتو وتيراميسو في أجواء عشاء راقية.', 'Fresh pasta, risotto and tiramisu in an elegant dinner setting.'], flags: 'fq' },
  { id: 'r19', name: 'حلا الكنافة', nameEn: 'Kunafa Delight', category: 'desserts', cuisine: 'desserts', price: 1, rating: 4.6, area: 'sultanah', street: ['شارع العنبرية', 'Al-Anbariyah St'], offset: [4, -1], desc: ['كنافة نابلسية بالجبن ساخنة وبسبوسة وقطايف موسمية.', 'Hot Nabulsi cheese kunafa, basbousa and seasonal qatayef.'], flags: 'ofg' },

  // ── الخالدية ──
  { id: 'r20', name: 'مجلس الخليج', nameEn: 'Gulf Majlis', category: 'dinner', cuisine: 'gulf', price: 3, rating: 4.7, area: 'khalidiyah', street: ['طريق الأمير محمد بن عبدالعزيز', 'Prince Mohammed bin Abdulaziz Rd'], offset: [1, 3], desc: ['مجبوس وهريس ومحمّر في مجالس أرضية خاصة للعائلات.', 'Machboos, harees and muhammar served in private floor-seating majlis rooms.'], flags: 'ofqg' },
  { id: 'r21', name: 'تشيز آند كرست', nameEn: 'Cheese & Crust', category: 'restaurant', cuisine: 'pizza', price: 1, rating: 3.8, area: 'khalidiyah', street: ['شارع الخالدية', 'Al-Khalidiyah St'], offset: [-3, -2], desc: ['بيتزا بالقطعة وعروض عائلية كبيرة — خيار سريع للمجموعات.', 'Pizza by the slice and big family deals — a quick pick for groups.'], flags: 'ofg' },
  { id: 'r22', name: 'بن وسكر', nameEn: 'Bean & Sugar', category: 'cafe', cuisine: 'cafe', price: 1, rating: 4.1, area: 'khalidiyah', street: ['شارع الستين', 'Sixtieth St'], offset: [3, -4], desc: ['قهوة مختصة بسعر معقول وكوكيز بالتمر والطحينة.', 'Specialty coffee at fair prices plus date-and-tahini cookies.'], flags: 'os' },

  // ── شوران ──
  { id: 'r23', name: 'مضغوط شوران', nameEn: 'Shuran Madghout', category: 'restaurant', cuisine: 'saudi', price: 1, rating: 4.3, area: 'shuran', street: ['شارع شوران', 'Shuran St'], offset: [2, 2], desc: ['مضغوط ومثلوثة ومرقوق — نكهات بيتية حجازية.', 'Madghout, mathlootha and marqooq — homestyle Hijazi flavours.'], flags: 'ofg' },
  { id: 'r24', name: 'بستان الشواء', nameEn: 'Grill Orchard', category: 'dinner', cuisine: 'arabic', price: 2, rating: 4.4, area: 'shuran', street: ['طريق السلام', 'As-Salam Rd'], offset: [-3, 3], desc: ['مشاوي مشكّلة على الفحم في جلسات خارجية عائلية واسعة.', 'Mixed charcoal grills in wide outdoor family seating.'], flags: 'fsg' },
  { id: 'r25', name: 'كاري هاوس', nameEn: 'Curry House', category: 'restaurant', cuisine: 'indian', price: 2, rating: 4.0, area: 'shuran', street: ['شارع المطار القديم', 'Old Airport St'], offset: [4, -3], desc: ['تكا ماسالا وبالاك بانير ودال — خيارات نباتية كثيرة.', 'Tikka masala, palak paneer and dal — plenty of vegetarian options.'], flags: 'of' },

  // ── الجامعة ──
  { id: 'r26', name: 'كبدة وفول الجامعة', nameEn: 'Campus Liver & Foul', category: 'breakfast', cuisine: 'saudi', price: 1, rating: 4.2, area: 'jamiah', street: ['شارع الجامعة', 'University St'], offset: [2, -1], desc: ['كبدة طازجة وفول بالسمن وخبز تميس حار — مفضّل للطلاب.', 'Fresh liver, ghee foul and hot tamees bread — a student favourite.'], flags: 'og' },
  { id: 'r27', name: 'بوكي باي', nameEn: 'Poke Bay', category: 'restaurant', cuisine: 'asian', price: 2, rating: 4.2, area: 'jamiah', street: ['طريق الجامعات', 'Universities Rd'], offset: [-3, 3], desc: ['أطباق بوكي صحية وسلطات آسيوية — خفيف وملوّن.', 'Healthy poke bowls and Asian salads — light and colourful.'], flags: 'oq' },
  { id: 'r28', name: 'برجر ستيشن', nameEn: 'Burger Station', category: 'restaurant', cuisine: 'burger', price: 1, rating: 3.7, area: 'jamiah', street: ['شارع الأمير عبدالمجيد', 'Prince Abdulmajeed St'], offset: [3, 4], desc: ['برجر كلاسيكي ووجبات كومبو بسعر طالب.', 'Classic burgers and combo meals at student prices.'], flags: 'og' },

  // ── طريق الهجرة ──
  { id: 'r29', name: 'استراحة الهجرة', nameEn: 'Hijrah Road Diner', category: 'restaurant', cuisine: 'gulf', price: 2, rating: 4.1, area: 'hijrah', street: ['طريق الهجرة', 'Hijrah Rd'], offset: [1, 2], desc: ['مقلقل ومرقوق ومشويات في جلسات خارجية على الطريق.', 'Maqalqal, marqooq and grills with roadside outdoor seating.'], flags: 'ofsg' },
  { id: 'r30', name: 'ريف مصر', nameEn: 'Egyptian Countryside', category: 'dinner', cuisine: 'egyptian', price: 2, rating: 4.3, area: 'hijrah', street: ['شارع الهجرة الغربي', 'West Hijrah St'], offset: [-2, -3], desc: ['حمام محشي وملوخية وطواجن على الفحم.', 'Stuffed pigeon, molokhia and clay-pot tagines.'], flags: 'fg' },

  // ── العيون ──
  { id: 'r31', name: 'كوخ المأكولات البحرية', nameEn: 'Shrimp Shack', category: 'restaurant', cuisine: 'seafood', price: 3, rating: 4.4, area: 'uyun', street: ['شارع العيون', 'Al-Uyun St'], offset: [2, 3], desc: ['جمبري بالصوص الحار وسلطعون وأطباق بحرية مشكّلة للمشاركة.', 'Spicy shrimp, crab and mixed seafood platters to share.'], flags: 'osg' },
  { id: 'r32', name: 'وافل ونخلة', nameEn: 'Waffle & Palm', category: 'desserts', cuisine: 'desserts', price: 2, rating: 4.0, area: 'uyun', street: ['طريق الملك سلمان', 'King Salman Rd'], offset: [-3, -2], desc: ['وافل ببلجيكي وآيس كريم تمر ودبس — حلو المساء.', 'Belgian waffles with date ice cream and date molasses — an evening treat.'], flags: 'ofs' },

  // ── العاقول ──
  { id: 'r33', name: 'مطعم الأوزون', nameEn: 'Ozone Fusion', category: 'dinner', cuisine: 'other', price: 3, rating: 4.3, area: 'aqoul', street: ['طريق المطار', 'Airport Rd'], offset: [2, -2], desc: ['مطبخ عالمي مبتكر بلمسة محلية — ستيك وتاكو وأطباق مشاركة.', 'Inventive global kitchen with a local twist — steak, tacos and sharing plates.'], flags: 'oqs' },
  { id: 'r34', name: 'هضبة كافيه', nameEn: 'Hadba Café', category: 'cafe', cuisine: 'cafe', price: 3, rating: 4.6, area: 'aqoul', street: ['شارع العاقول', 'Al-Aqoul St'], offset: [-3, 3], desc: ['قهوة مختصة مع إطلالة مفتوحة وجلسات خارجية مسائية.', 'Specialty coffee with open views and evening outdoor seating.'], flags: 'osq' },

  // ── extras across districts ──
  { id: 'r35', name: 'أنقرة دونر', nameEn: 'Ankara Döner', category: 'restaurant', cuisine: 'turkish', price: 1, rating: 4.1, area: 'central', street: ['شارع المناخة', 'Al-Manakha St'], offset: [-6, 6], desc: ['دونر تركي بالخبز أو الصحن مع عيران بارد.', 'Turkish döner in bread or on a plate with chilled ayran.'], flags: 'o' },
  { id: 'r36', name: 'توكيو إكسبرس', nameEn: 'Tokyo Express', category: 'restaurant', cuisine: 'japanese', price: 2, rating: 3.6, area: 'khalidiyah', street: ['شارع الخالدية الشمالي', 'North Khalidiyah St'], offset: [5, 1], desc: ['دونبوري وكاتسو كاري وأطباق يابانية سريعة.', 'Donburi, katsu curry and quick Japanese bowls.'], flags: 'og' },
  { id: 'r37', name: 'مقهى السبيل', nameEn: 'As-Sabeel Tea House', category: 'cafe', cuisine: 'arabic', price: 1, rating: 4.5, area: 'quba', street: ['شارع السبيل', 'As-Sabeel St'], offset: [6, 4], desc: ['شاي عدني وكرك وقهوة عربية مع جلسة شعبية هادئة.', 'Adeni tea, karak and Arabic coffee in a calm, traditional sitting area.'], flags: 'oqsf' },
  { id: 'r38', name: 'بيروت نايتس', nameEn: 'Beirut Nights', category: 'dinner', cuisine: 'levantine', price: 3, rating: 4.4, area: 'aziziyah', street: ['طريق الملك عبدالله الغربي', 'West King Abdullah Rd'], offset: [-6, -5], desc: ['مازة لبنانية كاملة ومشاوي وفتّة — عشاء طويل مع الأهل.', 'A full Lebanese mezze spread, grills and fatteh — a long dinner with family.'], flags: 'fsg' },
];

const areaCenter = (id: AreaId): [number, number] =>
  AREAS.find((a) => a.value === id)?.center ?? [24.4672, 39.6111];

export const SAMPLE_RESTAURANTS: Restaurant[] = SEEDS.map((s) => {
  const [lat, lng] = areaCenter(s.area);
  return {
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    category: s.category,
    cuisine: s.cuisine,
    priceLevel: s.price,
    rating: s.rating,
    area: s.area,
    address: s.street[0],
    addressEn: s.street[1],
    latitude: +(lat + s.offset[0] / 1000).toFixed(5),
    longitude: +(lng + s.offset[1] / 1000).toFixed(5),
    // No photos in the sample set: the UI renders an illustrated cover instead.
    image: undefined,
    description: s.desc[0],
    descriptionEn: s.desc[1],
    openNow: s.flags.includes('o'),
    familyFriendly: s.flags.includes('f'),
    outdoorSeating: s.flags.includes('s'),
    quiet: s.flags.includes('q'),
    groupFriendly: s.flags.includes('g'),
    isSample: true,
  };
});
