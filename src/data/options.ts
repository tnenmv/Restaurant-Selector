import type { AreaId, Cuisine, MinRating, PlaceCategory, PriceLevel, SmartPreference } from '../types';

export interface Option<T> {
  value: T;
  ar: string;
  en: string;
  icon: string;
}

export const CUISINES: Option<Cuisine>[] = [
  { value: 'saudi', ar: 'سعودي', en: 'Saudi', icon: '🍚' },
  { value: 'arabic', ar: 'عربي', en: 'Arabic', icon: '🥙' },
  { value: 'gulf', ar: 'خليجي', en: 'Gulf', icon: '🍛' },
  { value: 'egyptian', ar: 'مصري', en: 'Egyptian', icon: '🫘' },
  { value: 'levantine', ar: 'شامي', en: 'Levantine', icon: '🧆' },
  { value: 'turkish', ar: 'تركي', en: 'Turkish', icon: '🥩' },
  { value: 'italian', ar: 'إيطالي', en: 'Italian', icon: '🍝' },
  { value: 'asian', ar: 'آسيوي', en: 'Asian', icon: '🥢' },
  { value: 'japanese', ar: 'ياباني', en: 'Japanese', icon: '🍣' },
  { value: 'indian', ar: 'هندي', en: 'Indian', icon: '🍲' },
  { value: 'burger', ar: 'برجر', en: 'Burger', icon: '🍔' },
  { value: 'pizza', ar: 'بيتزا', en: 'Pizza', icon: '🍕' },
  { value: 'seafood', ar: 'مأكولات بحرية', en: 'Seafood', icon: '🦐' },
  { value: 'cafe', ar: 'مقاهي', en: 'Cafés', icon: '☕' },
  { value: 'desserts', ar: 'حلويات', en: 'Desserts', icon: '🍰' },
  { value: 'other', ar: 'أخرى', en: 'Other', icon: '🍽️' },
];

export const PRICES: Option<PriceLevel>[] = [
  { value: 1, ar: 'اقتصادي', en: 'Budget', icon: '$' },
  { value: 2, ar: 'متوسط', en: 'Moderate', icon: '$$' },
  { value: 3, ar: 'مرتفع', en: 'Premium', icon: '$$$' },
];

/** Approximate per-person spend, SAR. Prototype estimate only. */
export const PRICE_RANGE_SAR: Record<PriceLevel, [number, number]> = {
  1: [20, 45],
  2: [45, 100],
  3: [100, 220],
};

export const AREAS: (Option<AreaId> & { center: [number, number] })[] = [
  { value: 'central', ar: 'المنطقة المركزية', en: 'Central Area', icon: '🕌', center: [24.4686, 39.6112] },
  { value: 'quba', ar: 'قباء', en: 'Quba', icon: '📍', center: [24.4395, 39.6175] },
  { value: 'uraid', ar: 'العريض', en: 'Al-Uraid', icon: '📍', center: [24.5085, 39.5995] },
  { value: 'aziziyah', ar: 'العزيزية', en: 'Al-Aziziyah', icon: '📍', center: [24.4300, 39.5760] },
  { value: 'difaa', ar: 'الدفاع', en: 'Ad-Difaa', icon: '📍', center: [24.4560, 39.6570] },
  { value: 'sultanah', ar: 'سلطانة', en: 'Sultanah', icon: '📍', center: [24.4740, 39.5880] },
  { value: 'khalidiyah', ar: 'الخالدية', en: 'Al-Khalidiyah', icon: '📍', center: [24.4930, 39.6380] },
  { value: 'shuran', ar: 'شوران', en: 'Shuran', icon: '📍', center: [24.4080, 39.6270] },
  { value: 'jamiah', ar: 'الجامعة', en: 'Al-Jamiah', icon: '📍', center: [24.4810, 39.5560] },
  { value: 'hijrah', ar: 'طريق الهجرة', en: 'Hijrah Road', icon: '📍', center: [24.4200, 39.5480] },
  { value: 'uyun', ar: 'العيون', en: 'Al-Uyun', icon: '📍', center: [24.5250, 39.5700] },
  { value: 'aqoul', ar: 'العاقول', en: 'Al-Aqoul', icon: '📍', center: [24.5150, 39.6650] },
];

export const CATEGORIES: Option<PlaceCategory>[] = [
  { value: 'restaurant', ar: 'مطعم', en: 'Restaurant', icon: '🍽️' },
  { value: 'cafe', ar: 'كافيه', en: 'Café', icon: '☕' },
  { value: 'breakfast', ar: 'فطور', en: 'Breakfast', icon: '🍳' },
  { value: 'dinner', ar: 'عشاء', en: 'Dinner', icon: '🌙' },
  { value: 'desserts', ar: 'حلويات', en: 'Desserts', icon: '🧁' },
];

export const RATINGS: Option<MinRating>[] = [
  { value: 0, ar: 'أي تقييم', en: 'Any', icon: '⭐' },
  { value: 3, ar: '3+', en: '3+', icon: '⭐' },
  { value: 4, ar: '4+', en: '4+', icon: '⭐' },
  { value: 4.5, ar: '4.5+', en: '4.5+', icon: '⭐' },
];

export const SMART_PREFERENCES: Option<SmartPreference>[] = [
  { value: 'nearMe', ar: 'قريب مني', en: 'Near me', icon: '📍' },
  { value: 'family', ar: 'مناسب للعائلة', en: 'Family friendly', icon: '👨‍👩‍👧' },
  { value: 'quiet', ar: 'هادئ', en: 'Quiet', icon: '🤫' },
  { value: 'outdoor', ar: 'جلسات خارجية', en: 'Outdoor seating', icon: '🌴' },
  { value: 'groups', ar: 'مناسب للمجموعات', en: 'Good for groups', icon: '👥' },
  { value: 'budget', ar: 'مناسب للميزانية', en: 'Budget friendly', icon: '💰' },
  { value: 'openNow', ar: 'مفتوح الآن', en: 'Open now', icon: '🟢' },
];

export const MADINAH_CENTER: [number, number] = [24.4672, 39.6111];

export function findOption<T>(options: Option<T>[], value: T): Option<T> | undefined {
  return options.find((o) => o.value === value);
}
