import { createHttpError } from '../../utils/httpError.js';

const numberOrNull = (value: unknown) => {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 10) / 10 : null;
};

export async function lookupProductByBarcode(rawBarcode: unknown) {
  const barcode = String(rawBarcode || '').replace(/\s+/g, '');
  if (!/^\d{8,14}$/.test(barcode)) throw createHttpError(400, 'Enter a valid 8–14 digit product barcode.');
  const fields = ['code', 'product_name', 'brands', 'quantity', 'serving_size', 'ingredients_text', 'allergens_tags', 'nutriments', 'nutrition_grades', 'image_front_url'].join(',');
  const url = `https://world.openfoodfacts.org/api/v3.6/product/${encodeURIComponent(barcode)}.json?fields=${encodeURIComponent(fields)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'LifeOS/1.0 (https://github.com/Awadesh365/LifeOS; nutrition barcode lookup)' },
    signal: AbortSignal.timeout(12_000),
  }).catch(() => { throw createHttpError(502, 'The product database could not be reached. Try again shortly.'); });
  if (!response.ok) throw createHttpError(502, 'The product database could not complete this lookup.');
  const payload: any = await response.json().catch(() => null);
  if (payload?.status !== 1 || !payload.product) return { found: false, barcode, source: 'Open Food Facts' };
  const product = payload.product;
  const nutrient = product.nutriments || {};
  const tags = (value: unknown) => Array.isArray(value) ? value.map((item) => String(item).replace(/^[a-z]{2}:/i, '').replace(/-/g, ' ')).slice(0, 30) : [];
  return {
    found: true,
    barcode,
    name: String(product.product_name || 'Unnamed product').slice(0, 160),
    brands: String(product.brands || '').slice(0, 160),
    quantity: String(product.quantity || '').slice(0, 100),
    servingSize: String(product.serving_size || '').slice(0, 100),
    ingredients: String(product.ingredients_text || '').slice(0, 3000),
    allergens: tags(product.allergens_tags),
    nutritionGrade: /^[a-e]$/i.test(product.nutrition_grades || '') ? product.nutrition_grades.toUpperCase() : null,
    imageUrl: typeof product.image_front_url === 'string' && /^https:\/\//.test(product.image_front_url) ? product.image_front_url : null,
    nutrientsPer100g: {
      caloriesKcal: numberOrNull(nutrient['energy-kcal_100g']),
      proteinGrams: numberOrNull(nutrient.proteins_100g),
      carbohydrateGrams: numberOrNull(nutrient.carbohydrates_100g),
      sugarsGrams: numberOrNull(nutrient.sugars_100g),
      fatGrams: numberOrNull(nutrient.fat_100g),
      fiberGrams: numberOrNull(nutrient.fiber_100g),
      saltGrams: numberOrNull(nutrient.salt_100g),
      sodiumMg: numberOrNull(nutrient.sodium_100g) === null ? null : Math.round(Number(nutrient.sodium_100g) * 1000 * 10) / 10,
    },
    source: 'Open Food Facts',
    sourceUrl: `https://world.openfoodfacts.org/product/${encodeURIComponent(barcode)}`,
    license: 'Open Database License (ODbL); verify product data against its package label',
  };
}
