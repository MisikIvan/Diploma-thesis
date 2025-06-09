export interface NutritionalData {
  energy: number; // кДж на 100г/мл
  saturatedFat: number; // г на 100г/мл
  totalSugars: number; // г на 100г/мл
  sodium: number; // мг на 100г/мл
  fiber: number; // г на 100г/мл
  protein: number; // г на 100г/мл
  fruitsVegetablesNuts: number; // % вміст фруктів, овочів, горіхів
}

export type FoodCategory = 'general' | 'beverages' | 'fatsOilsNutsSeeds' | 'cheese';

export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface NutriScoreResult {
  grade: NutriScoreGrade;
  score: number;
  negativePoints: number;
  positivePoints: number;
  category: FoodCategory;
  details: {
    energyPoints: number;
    saturatedFatPoints: number;
    sugarsPoints: number;
    sodiumPoints: number;
    fiberPoints: number;
    proteinPoints: number;
    fruitsVegetablesNutsPoints: number;
  };
}

// Таблиці балів для негативних показників
const ENERGY_THRESHOLDS = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
const SATURATED_FAT_THRESHOLDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SUGARS_THRESHOLDS = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
const SODIUM_THRESHOLDS = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900];

// Таблиці балів для позитивних показників
const FIBER_THRESHOLDS = [0.9, 1.9, 2.8, 3.7, 4.7];
const PROTEIN_THRESHOLDS = [1.6, 3.2, 4.8, 6.4, 8.0];
const FRUITS_VEGETABLES_NUTS_THRESHOLDS = [40, 60, 80];

// Таблиці балів для напоїв
const BEVERAGES_ENERGY_THRESHOLDS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
const BEVERAGES_SUGARS_THRESHOLDS = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5];

// Функція для отримання балів за шкалою
function getPointsFromThresholds(value: number, thresholds: number[]): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return i;
    }
  }
  return thresholds.length;
}

// Розрахунок балів для енергії
function calculateEnergyPoints(energy: number, category: FoodCategory): number {
  if (category === 'beverages') {
    return getPointsFromThresholds(energy, BEVERAGES_ENERGY_THRESHOLDS);
  }
  return getPointsFromThresholds(energy, ENERGY_THRESHOLDS);
}

// Розрахунок балів для цукру
function calculateSugarsPoints(sugars: number, category: FoodCategory): number {
  if (category === 'beverages') {
    return getPointsFromThresholds(sugars, BEVERAGES_SUGARS_THRESHOLDS);
  }
  return getPointsFromThresholds(sugars, SUGARS_THRESHOLDS);
}

// Розрахунок балів для клітковини
function calculateFiberPoints(fiber: number): number {
  return getPointsFromThresholds(fiber, FIBER_THRESHOLDS);
}

// Розрахунок балів для білка
function calculateProteinPoints(protein: number): number {
  return getPointsFromThresholds(protein, PROTEIN_THRESHOLDS);
}

// Розрахунок балів для фруктів/овочів/горіхів
function calculateFruitsVegetablesNutsPoints(percentage: number): number {
  if (percentage >= 80) return 5;
  if (percentage >= 60) return 2;
  if (percentage >= 40) return 1;
  return 0;
}

// Визначення категорії продукту
export function determineFoodCategory(
  productName: string,
  ingredients: string,
  categories: string[]
): FoodCategory {
  const name = productName.toLowerCase();
  const ingredientsList = ingredients.toLowerCase();
  const categoriesList = categories.map(c => c.toLowerCase());

  // Перевірка на напої
  if (
    categoriesList.some(cat => 
      cat.includes('напої') || cat.includes('drink') || cat.includes('beverage') || 
      cat.includes('сік') || cat.includes('juice') || cat.includes('tea') || 
      cat.includes('coffee') || cat.includes('вода') || cat.includes('water')
    ) ||
    name.includes('сік') || name.includes('вода') || name.includes('кава') ||
    name.includes('чай') || name.includes('juice') || name.includes('water')
  ) {
    return 'beverages';
  }

  // Перевірка на сир
  if (
    categoriesList.some(cat => cat.includes('сир') || cat.includes('cheese')) ||
    name.includes('сир') || name.includes('cheese')
  ) {
    return 'cheese';
  }

  // Перевірка на жири, олії, горіхи та насіння
  if (
    categoriesList.some(cat => 
      cat.includes('олія') || cat.includes('oil') || cat.includes('жир') || 
      cat.includes('fat') || cat.includes('горіх') || cat.includes('nut') ||
      cat.includes('насіння') || cat.includes('seed')
    ) ||
    ingredientsList.includes('олія') || ingredientsList.includes('oil') ||
    name.includes('олія') || name.includes('горіх') || name.includes('насіння')
  ) {
    return 'fatsOilsNutsSeeds';
  }

  return 'general';
}

// Основна функція розрахунку Nutri-Score
export function calculateNutriScore(
  nutritionalData: NutritionalData,
  category: FoodCategory
): NutriScoreResult {
  // Розрахунок негативних балів
  const energyPoints = calculateEnergyPoints(nutritionalData.energy, category);
  const saturatedFatPoints = getPointsFromThresholds(nutritionalData.saturatedFat, SATURATED_FAT_THRESHOLDS);
  const sugarsPoints = calculateSugarsPoints(nutritionalData.totalSugars, category);
  const sodiumPoints = getPointsFromThresholds(nutritionalData.sodium, SODIUM_THRESHOLDS);

  const negativePoints = energyPoints + saturatedFatPoints + sugarsPoints + sodiumPoints;

  // Розрахунок позитивних балів
  const fiberPoints = calculateFiberPoints(nutritionalData.fiber);
  const proteinPoints = calculateProteinPoints(nutritionalData.protein);
  const fruitsVegetablesNutsPoints = calculateFruitsVegetablesNutsPoints(nutritionalData.fruitsVegetablesNuts);

  const positivePoints = fiberPoints + proteinPoints + fruitsVegetablesNutsPoints;

  // Розрахунок фінального балу
  let finalScore: number;

  if (category === 'cheese') {
    // Для сирів є особливі правила
    finalScore = negativePoints - positivePoints;
  } else if (category === 'fatsOilsNutsSeeds') {
    // Для жирів, олій, горіхів та насіння білкові бали рахуються тільки якщо негативні бали >= 11
    const adjustedProteinPoints = negativePoints >= 11 ? proteinPoints : 0;
    const adjustedPositivePoints = fiberPoints + adjustedProteinPoints + fruitsVegetablesNutsPoints;
    finalScore = negativePoints - adjustedPositivePoints;
  } else {
    // Загальні правила: білкові бали рахуються тільки якщо негативні бали >= 11 або фрукти/овочі >= 80%
    const shouldCountProtein = negativePoints >= 11 || nutritionalData.fruitsVegetablesNuts >= 80;
    const adjustedProteinPoints = shouldCountProtein ? proteinPoints : 0;
    const adjustedPositivePoints = fiberPoints + adjustedProteinPoints + fruitsVegetablesNutsPoints;
    finalScore = negativePoints - adjustedPositivePoints;
  }

  // Визначення градації
  let grade: NutriScoreGrade;

  if (category === 'beverages') {
    // Особливі пороги для напоїв
    if (finalScore <= 1) grade = 'A';
    else if (finalScore <= 5) grade = 'B';
    else if (finalScore <= 9) grade = 'C';
    else if (finalScore <= 13) grade = 'D';
    else grade = 'E';
  } else {
    // Стандартні пороги
    if (finalScore <= -1) grade = 'A';
    else if (finalScore <= 2) grade = 'B';
    else if (finalScore <= 10) grade = 'C';
    else if (finalScore <= 18) grade = 'D';
    else grade = 'E';
  }

  return {
    grade,
    score: finalScore,
    negativePoints,
    positivePoints,
    category,
    details: {
      energyPoints,
      saturatedFatPoints,
      sugarsPoints,
      sodiumPoints,
      fiberPoints,
      proteinPoints,
      fruitsVegetablesNutsPoints,
    },
  };
}

// Функція для отримання інформації про оцінку
export function getNutriScoreInfo(grade: NutriScoreGrade): {
  color: string;
  description: string;
  recommendation: string;
} {
  const gradeInfo = {
    A: {
      color: '#038141',
      description: 'Excellent nutritional quality',
      recommendation: 'Choose this product often as part of a balanced diet',
    },
    B: {
      color: '#85BB2F',
      description: 'Good nutritional quality',
      recommendation: 'Good choice for regular consumption',
    },
    C: {
      color: '#FECB02',
      description: 'Fair nutritional quality',
      recommendation: 'Consume in moderation as part of a varied diet',
    },
    D: {
      color: '#EE8100',
      description: 'Poor nutritional quality',
      recommendation: 'Limit consumption and choose healthier alternatives when possible',
    },
    E: {
      color: '#E63312',
      description: 'Very poor nutritional quality',
      recommendation: 'Avoid frequent consumption and opt for healthier alternatives',
    },
  };

  return gradeInfo[grade];
}

// Функція для автоматичного розрахунку Nutri-Score з продукту
export function calculateNutriScoreFromProduct(product: {
  name?: string;
  ingredients?: string;
  categories?: string[];
  nutrition?: {
    energy?: number; // ккал/100г
    protein?: number;
    fat?: number;
    saturatedFat?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    salt?: number; // г -
  };
  fruitsVegetablesNuts?: number;
}): NutriScoreResult | null {
  if (!product.nutrition) return null;

  // Конвертація даних
  const energy = product.nutrition.energy ? product.nutrition.energy * 4.184 : 0; 
  const sodium = product.nutrition.salt ? product.nutrition.salt * 400 : 0; 

  const nutritionalData: NutritionalData = {
    energy,
    saturatedFat: product.nutrition.saturatedFat || 0,
    totalSugars: product.nutrition.sugars || 0,
    sodium,
    fiber: product.nutrition.fiber || 0,
    protein: product.nutrition.protein || 0,
    fruitsVegetablesNuts: product.fruitsVegetablesNuts || 0,
  };

  const category = determineFoodCategory(
    product.name || '',
    product.ingredients || '',
    product.categories || []
  );

  return calculateNutriScore(nutritionalData, category);
}

// Утилітарна функція для швидкого розрахунку
export function quickNutriScore(
  calories: number,
  saturatedFat: number,
  sugars: number,
  salt: number,
  fiber: number = 0,
  protein: number = 0,
  fruitsVegetablesNuts: number = 0,
  category: FoodCategory = 'general'
): NutriScoreResult {
  // Валідація вхідних даних
  const validateNutrientValue = (value: number, name: string, max: number = 1000): number => {
    if (isNaN(value) || value < 0) return 0;
    if (value > max) {
      console.warn(`⚠️ Високе значення ${name}: ${value}. Обмежено до ${max}.`);
      return max;
    }
    return Math.round(value * 100) / 100; // Округлення до 2 знаків після коми
  };

  const validatedCalories = validateNutrientValue(calories, 'калорій', 900);
  const validatedSaturatedFat = validateNutrientValue(saturatedFat, 'насичених жирів', 100);
  const validatedSugars = validateNutrientValue(sugars, 'цукру', 100);
  const validatedSalt = validateNutrientValue(salt, 'солі', 50);
  const validatedFiber = validateNutrientValue(fiber, 'клітковини', 50);
  const validatedProtein = validateNutrientValue(protein, 'білків', 100);
  const validatedFruitsVegetablesNuts = Math.max(0, Math.min(100, fruitsVegetablesNuts || 0));

  const nutritionalData: NutritionalData = {
    energy: validatedCalories * 4.184, // Конвертація ккал в кДж
    saturatedFat: validatedSaturatedFat,
    totalSugars: validatedSugars,
    sodium: validatedSalt * 400, // Конвертація г солі в мг натрію
    fiber: validatedFiber,
    protein: validatedProtein,
    fruitsVegetablesNuts: validatedFruitsVegetablesNuts,
  };

  return calculateNutriScore(nutritionalData, category);
} 