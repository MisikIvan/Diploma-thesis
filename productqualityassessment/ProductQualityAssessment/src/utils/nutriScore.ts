// import { Colors } from '../constants/theme';

// Колори для Nutri-Score
const Colors = {
  A: '#008840',
  B: '#5CB85C',
  C: '#FFC700',
  D: '#FF8C00',
  E: '#E63946'
};

// Категорії харчових продуктів
export type FoodCategory = 'general' | 'dairy' | 'fats' | 'beverage' | 'cheese' | 'redMeat';

// Інтерфейс для харчових даних
export interface NutritionalData {
  energy: number; // кДж/100г
  saturatedFat: number; // г/100г
  totalSugars: number; // г/100г
  sodium: number; // мг/100г (для сумісності)
  salt?: number; // г/100г (нове для алгоритму 2024)
  fiber: number; // г/100г
  protein: number; // г/100г
  fruitsVegetablesNuts: number; // %
}

// Результат розрахунку Nutri-Score
export interface NutriScoreResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  color: string;
  positivePoints: number;
  negativePoints: number;
  category?: string;
  details?: {
    energyPoints: number;
    saturatedFatPoints: number;
    sugarPoints: number;
    saltPoints?: number; // Для алгоритму 2024
    sodiumPoints?: number; // Для алгоритму 2017
    fiberPoints: number;
    proteinPoints: number;
    fruitsVegetablesNutsPoints: number;
  };
  algorithm?: string;
}

// ======== НОВІ ТАБЛИЦІ NUTRI-SCORE 2024 ========

// Таблиці балів для негативних показників (2024)
const ENERGY_THRESHOLDS = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
const SATURATED_FAT_THRESHOLDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Нові пороги для цукру (2024) - більш суворі
const SUGARS_THRESHOLDS_2024 = [3.4, 6.8, 10, 14, 17, 20, 24, 27, 31, 34, 37, 41, 44, 48, 51];
// Нові пороги для солі замість натрію (2024)
const SALT_THRESHOLDS_2024 = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4];

// Старі таблиці (для сумісності)
const SUGARS_THRESHOLDS = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
const SODIUM_THRESHOLDS = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900];

// Таблиці балів для позитивних показників (2024) - оновлені
const FIBER_THRESHOLDS_2024 = [3.0, 4.1, 5.2, 6.3, 7.4]; // починається з 3.0 замість 0.9
const PROTEIN_THRESHOLDS_2024 = [2.4, 4.8, 7.2, 9.6, 12, 14, 17]; // розширена шкала

// Старі таблиці (для сумісності)
const FIBER_THRESHOLDS = [0.9, 1.9, 2.8, 3.7, 4.7];
const PROTEIN_THRESHOLDS = [1.6, 3.2, 4.8, 6.4, 8.0];

const FRUITS_VEGETABLES_NUTS_THRESHOLDS = [40, 60, 80];

// Таблиці балів для напоїв (2024) - оновлені
const BEVERAGES_ENERGY_THRESHOLDS_2024 = [30, 90, 150, 210, 240, 270, 300, 330, 360, 390];
const BEVERAGES_SUGARS_THRESHOLDS_2024 = [0.5, 2, 3.5, 5, 6, 7, 8, 9, 10, 11];

// ======== ФУНКЦІЇ РОЗРАХУНКУ ========

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
function calculateEnergyPoints(energy: number, category: FoodCategory, useNew: boolean = true): number {
  if (category === 'beverage' && useNew) {
    return getPointsFromThresholds(energy, BEVERAGES_ENERGY_THRESHOLDS_2024);
  }
  if (category === 'beverage') {
    return getPointsFromThresholds(energy, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270]);
  }
  return getPointsFromThresholds(energy, ENERGY_THRESHOLDS);
}

// Розрахунок балів для цукру
function calculateSugarsPoints(sugars: number, category: FoodCategory, useNew: boolean = true): number {
  if (category === 'beverage') {
    if (useNew) {
      return getPointsFromThresholds(sugars, BEVERAGES_SUGARS_THRESHOLDS_2024);
    }
    return getPointsFromThresholds(sugars, [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5]);
  }
  
  if (useNew) {
    return getPointsFromThresholds(sugars, SUGARS_THRESHOLDS_2024);
  }
  return getPointsFromThresholds(sugars, SUGARS_THRESHOLDS);
}

// Розрахунок балів для солі (2024)
function calculateSaltPoints(salt: number): number {
  return getPointsFromThresholds(salt, SALT_THRESHOLDS_2024);
}

// Розрахунок балів для клітковини
function calculateFiberPoints(fiber: number, useNew: boolean = true): number {
  if (useNew) {
    return getPointsFromThresholds(fiber, FIBER_THRESHOLDS_2024);
  }
  return getPointsFromThresholds(fiber, FIBER_THRESHOLDS);
}

// Розрахунок балів для білка
function calculateProteinPoints(protein: number, useNew: boolean = true): number {
  if (useNew) {
    return getPointsFromThresholds(protein, PROTEIN_THRESHOLDS_2024);
  }
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
    return 'beverage';
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
    return 'fats';
  }

  return 'general';
}

// Основна функція розрахунку Nutri-Score (алгоритм 2024)
export function calculateNutriScore(
  nutritionalData: NutritionalData,
  category: FoodCategory,
  useNewAlgorithm: boolean = true
): NutriScoreResult {
  // Розрахунок негативних балів
  const energyPoints = calculateEnergyPoints(nutritionalData.energy, category, useNewAlgorithm);
  const saturatedFatPoints = getPointsFromThresholds(nutritionalData.saturatedFat, SATURATED_FAT_THRESHOLDS);
  const sugarPoints = calculateSugarsPoints(nutritionalData.totalSugars, category, useNewAlgorithm);
  
  // У новому алгоритмі використовуємо сіль замість натрію
  let sodiumPoints = 0;
  let saltPoints = 0;
  
  if (useNewAlgorithm) {
    saltPoints = calculateSaltPoints(nutritionalData.salt || 0);
  } else {
    sodiumPoints = getPointsFromThresholds(nutritionalData.sodium, SODIUM_THRESHOLDS);
  }

  const negativePoints = energyPoints + saturatedFatPoints + sugarPoints + sodiumPoints + saltPoints;

  // Розрахунок позитивних балів
  const fiberPoints = calculateFiberPoints(nutritionalData.fiber, useNewAlgorithm);
  const proteinPoints = calculateProteinPoints(nutritionalData.protein, useNewAlgorithm);
  const fruitsVegetablesNutsPoints = calculateFruitsVegetablesNutsPoints(nutritionalData.fruitsVegetablesNuts);

  // Розрахунок фінального балу з новими правилами 2024
  let finalScore: number;
  let effectiveProteinPoints = proteinPoints;

  if (category === 'cheese') {
    // Для сирів завжди враховуються всі позитивні бали
    finalScore = negativePoints - (fiberPoints + proteinPoints + fruitsVegetablesNutsPoints);
  } else if (category === 'fats') {
    // Для жирів, олій, горіхів: протеїн враховується тільки якщо негативні бали >= 7 (2024)
    if (useNewAlgorithm) {
      effectiveProteinPoints = negativePoints >= 7 ? proteinPoints : 0;
    } else {
      effectiveProteinPoints = negativePoints >= 11 ? proteinPoints : 0;
    }
    finalScore = negativePoints - (fiberPoints + effectiveProteinPoints + fruitsVegetablesNutsPoints);
  } else if (category === 'redMeat') {
    // Нова категорія 2024: червоне м'ясо (максимум 2 бали за протеїн)
    const limitedProteinPoints = Math.min(proteinPoints, 2);
    effectiveProteinPoints = negativePoints >= 11 ? 0 : limitedProteinPoints;
    finalScore = negativePoints - (fiberPoints + effectiveProteinPoints + fruitsVegetablesNutsPoints);
  } else {
    // Загальні правила 2024: протеїн НЕ враховується якщо негативні бали >= 11
    if (negativePoints >= 11) {
      effectiveProteinPoints = 0;
      finalScore = negativePoints - (fiberPoints + fruitsVegetablesNutsPoints);
    } else {
      finalScore = negativePoints - (fiberPoints + proteinPoints + fruitsVegetablesNutsPoints);
    }
  }

  // Визначення градації (пороги 2024)
  let grade: 'A' | 'B' | 'C' | 'D' | 'E';

  if (category === 'beverage') {
    // Пороги для напоїв 2024
    if (finalScore <= 2) grade = 'A';
    else if (finalScore <= 6) grade = 'B';
    else if (finalScore <= 9) grade = 'C';
    else if (finalScore <= 13) grade = 'D';
    else grade = 'E';
  } else if (category === 'fats') {
    // Пороги для жирів/горіхів 2024
    if (finalScore <= -6) grade = 'A';
    else if (finalScore <= 2) grade = 'B';
    else if (finalScore <= 10) grade = 'C';
    else if (finalScore <= 18) grade = 'D';
    else grade = 'E';
  } else {
    // Стандартні пороги 2024
    if (finalScore <= 0) grade = 'A';
    else if (finalScore <= 2) grade = 'B';
    else if (finalScore <= 10) grade = 'C';
    else if (finalScore <= 18) grade = 'D';
    else grade = 'E';
  }

  const positivePoints = fiberPoints + effectiveProteinPoints + fruitsVegetablesNutsPoints;

  return {
    score: finalScore,
    grade,
    positivePoints,
    negativePoints,
    category,
    color: Colors[grade],
    details: {
      energyPoints,
      saturatedFatPoints,
      sugarPoints,
      ...(useNewAlgorithm ? { saltPoints } : { sodiumPoints }),
      fiberPoints,
      proteinPoints,
      fruitsVegetablesNutsPoints,
    },
    algorithm: useNewAlgorithm ? '2024' : undefined,
  };
}

// Функція для отримання інформації про оцінку
export function getNutriScoreInfo(grade: 'A' | 'B' | 'C' | 'D' | 'E'): {
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
    salt: product.nutrition.salt || 0,
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

// Утилітарна функція для швидкого розрахунку (алгоритм 2024)
export function quickNutriScore(
  calories: number,
  saturatedFat: number,
  sugars: number,
  salt: number,
  fiber: number = 0,
  protein: number = 0,
  fruitsVegetablesNuts: number = 0,
  category: FoodCategory = 'general',
  useNewAlgorithm: boolean = true
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
    salt: validatedSalt,
    fiber: validatedFiber,
    protein: validatedProtein,
    fruitsVegetablesNuts: validatedFruitsVegetablesNuts,
  };

  return calculateNutriScore(nutritionalData, category, useNewAlgorithm);
} 