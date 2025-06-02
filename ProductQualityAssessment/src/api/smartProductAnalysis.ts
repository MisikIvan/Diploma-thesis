import axios from 'axios';
import { Product, NutriScoreGrade } from '../types';


const AI_CONFIG = {
  
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
};


export interface AnalyzedProductData {
  name?: string;
  brand?: string;
  description?: string;
  category?: string;
  ingredients?: string;
  allergens?: string[];
  additives?: string[];
  nutrition?: {
    calories?: number;
    proteins?: number;
    fats?: number;
    saturatedFat?: number;
    carbohydrates?: number;
    sugar?: number;
    salt?: number;
    fiber?: number;
  };
  tags?: string[];
  isVegan?: boolean;
  isVegetarian?: boolean;
  hasLactose?: boolean;
  hasGluten?: boolean;
  weight?: number;
  barcode?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  confidence: number;
  analysisDetails?: string;
}


const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    if (imageUri.startsWith('data:image')) {
      return imageUri.split(',')[1];
    }
    
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};


const analyzeWithGemini = async (base64Image: string, context?: any): Promise<AnalyzedProductData> => {
  const contextInfo = context?.name ? `Контекст: назва продукту "${context.name}"` : '';
  
  const prompt = `Проаналізуй це зображення етикетки продукту і витягни ДЕТАЛЬНУ інформацію у форматі JSON.

${contextInfo}

🎯 ГОЛОВНЕ: Зосередься на ХАРЧОВІЙ ЦІННОСТІ для автоматичного розрахунку Nutri-Score!

Поверни ТОЧНИЙ JSON з цими полями:
{
  "name": "назва продукту українською",
  "brand": "бренд/виробник",
  "category": "категорія (молочні/м'ясні/овочі/фрукти/зернові/напої/солодощі/снеки/хлібобулочні/консерви/заморожені/специи/соуси)",
  "ingredients": "повний список інгредієнтів українською",
  "allergens": ["алерген1", "алерген2"],
  "nutrition": {
    "calories": число_ккал_на_100г,
    "proteins": число_г_білків,
    "fats": число_г_жирів,
    "saturatedFat": число_г_насичених_жирів,
    "carbohydrates": число_г_вуглеводів,
    "sugar": число_г_цукру,
    "salt": число_г_солі,
    "fiber": число_г_клітковини
  },
  "weight": вага_упаковки_в_грамах,
  "barcode": "штрих_код_якщо_видно",
  "manufacturer": "виробник",
  "countryOfOrigin": "країна_походження",
  "tags": ["тег1", "тег2", "тег3"],
  "isVegan": true/false,
  "isVegetarian": true/false,
  "hasLactose": true/false,
  "hasGluten": true/false,
  "confidence": 0.0-1.0
}

🔍 ОБОВ'ЯЗКОВО шукай:
- Таблицю харчової цінності (калорії, білки, жири, вуглеводи на 100г)
- Склад/інгредієнти
- Алергени (глютен, лактоза, горіхи, яйця тощо)
- Вагу нетто
- Виробника

📊 Теги використовуй з 8 категорій:
FOOD_TYPE: молочні, м'ясні, овочі, фрукти, зернові, напої, солодощі, снеки, хлібобулочні, консерви, заморожені, специи, соуси
DIETARY: веган, вегетаріанський, органічний, еко, біо, натуральний, без-цукру, дієтичний, здоровий
ALLERGEN: без-глютену, без-лактози, без-яєць, без-горіхів, без-сої
BRAND: преміум, бюджетний, локальний, міжнародний
ORIGIN: україна, європа, місцевий, імпорт
QUALITY: свіжий, якісний, натуральний, переробленний
PREPARATION: готовий-до-вживання, потребує-готування, швидкого-приготування
OTHER: новинка, популярний, рекомендований

⚠️ ВАЖЛИВО: Якщо не впевнений у цифрах - краще залиш 0 ніж вигадуй!
Confidence = точність розпізнавання (0.8+ для чітких даних, 0.5-0.7 для частково читаємих, <0.5 для нечітких)`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${AI_CONFIG.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.1,
          topP: 0.8,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('🤖 Gemini 2.5 Flash Preview raw response:', aiResponse);

  
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    const analysisResult = JSON.parse(jsonMatch[0]);
    
  
    const result: AnalyzedProductData = {
      confidence: analysisResult.confidence || 0.5,
      analysisDetails: 'Розпізнано Gemini 2.5 Flash Preview 05-20',
      ...analysisResult
    };

    console.log('✅ Gemini 2.5 Flash Preview analysis complete:', result);
    return result;

  } catch (error: any) {
    console.error('❌ Gemini 2.5 Flash Preview analysis failed:', error);
    
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid request to Gemini API. Please check image format.');
    }
    
    throw new Error(`Gemini 2.5 Flash Preview analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


const patternMatchingFallback = (text: string): Partial<AnalyzedProductData> => {
  console.log('⚠️ Using pattern matching fallback - Gemini unavailable');
  
  const result: Partial<AnalyzedProductData> = {
    confidence: 0.3,
    analysisDetails: 'Базовий аналіз без AI'
  };

 
  const caloriesMatch = text.match(/(\d+)\s*(ккал|кал)/i);
  if (caloriesMatch) {
    result.nutrition = { calories: parseInt(caloriesMatch[1]) };
  }

  const proteinMatch = text.match(/білки?\s*:?\s*(\d+(?:\.\d+)?)/i);
  if (proteinMatch) {
    result.nutrition = { ...result.nutrition, proteins: parseFloat(proteinMatch[1]) };
  }

  return result;
};


export const analyzeProductImage = async (
  imageUri: string,
  context?: { name?: string; barcode?: string }
): Promise<AnalyzedProductData> => {
  console.log('🚀 Starting product analysis with Gemini 2.5 Flash Preview 05-20...');

  try {
   
    const base64Image = await imageToBase64(imageUri);
    
   
    if (AI_CONFIG.GEMINI_API_KEY) {
      try {
        return await analyzeWithGemini(base64Image, context);
      } catch (error) {
        console.error('Gemini 2.5 Flash Preview failed, using pattern matching...', error);
      }
    }

 
    console.log('⚠️ Using pattern matching fallback - Gemini 2.5 Flash Preview unavailable');
    return {
      confidence: 0.2,
      analysisDetails: 'Аналіз недоступний - немає Gemini ключа',
      ...patternMatchingFallback('')
    } as AnalyzedProductData;

  } catch (error) {
    console.error('❌ Complete analysis failed:', error);
    throw new Error('Failed to analyze product image');
  }
};


export const autoFillFormFromAnalysis = (
  analysisResult: AnalyzedProductData,
  currentFormData: any
): any => {
  const autoFilledData = { ...currentFormData };

  console.log('🔄 Auto-filling form with analysis result:', analysisResult);

  
  if (analysisResult.name && analysisResult.confidence > 0.4) {
    autoFilledData.name = analysisResult.name;
    console.log('✅ Filled name:', analysisResult.name);
  }
  
  if (analysisResult.brand && analysisResult.confidence > 0.4) {
    autoFilledData.brand = analysisResult.brand;
    console.log('✅ Filled brand:', analysisResult.brand);
  }

  if (analysisResult.description) {
    autoFilledData.description = analysisResult.description;
  }

  if (analysisResult.ingredients && analysisResult.confidence > 0.3) {
    autoFilledData.ingredients = analysisResult.ingredients;
    console.log('✅ Filled ingredients');
  }


  if (analysisResult.nutrition && analysisResult.confidence > 0.3) {
    const nutrition = analysisResult.nutrition;
    
   
    const validateNutrition = (value: number | undefined, max: number): number => {
      if (!value || isNaN(value) || value < 0 || value > max) return 0;
      return value;
    };

    autoFilledData.nutriments = {
      calories: validateNutrition(nutrition.calories, 900), 
      proteins: validateNutrition(nutrition.proteins, 100),
      fats: {
        total: validateNutrition(nutrition.fats, 100),
        saturated: validateNutrition(nutrition.saturatedFat, 100),
      },
      carbohydrates: {
        total: validateNutrition(nutrition.carbohydrates, 100),
        sugar: validateNutrition(nutrition.sugar, 100),
      },
      salt: validateNutrition(nutrition.salt, 50), 
      fiber: validateNutrition(nutrition.fiber, 100),
    };

    console.log('✅ Filled nutrition data:', autoFilledData.nutriments);
  }


  if (analysisResult.allergens && analysisResult.allergens.length > 0) {
    const validAllergens = analysisResult.allergens.filter(a => a && a.trim().length > 0);
    if (validAllergens.length > 0) {
      autoFilledData.allergens = [...new Set([...autoFilledData.allergens, ...validAllergens])];
      console.log('✅ Filled allergens:', validAllergens);
    }
  }

  if (analysisResult.additives && analysisResult.additives.length > 0) {
    const validAdditives = analysisResult.additives.filter(a => a && a.trim().length > 0);
    if (validAdditives.length > 0) {
      autoFilledData.additives = [...new Set([...autoFilledData.additives, ...validAdditives])];
      console.log('✅ Filled additives:', validAdditives);
    }
  }

 
  if (analysisResult.confidence > 0.5) {
    if (analysisResult.isVegan !== undefined) {
      autoFilledData.isVegan = analysisResult.isVegan;
    }
    if (analysisResult.isVegetarian !== undefined) {
      autoFilledData.isVegetarian = analysisResult.isVegetarian;
    }
    if (analysisResult.hasLactose !== undefined) {
      autoFilledData.hasLactose = analysisResult.hasLactose;
    }
    if (analysisResult.hasGluten !== undefined) {
      autoFilledData.hasGluten = analysisResult.hasGluten;
    }
    console.log('✅ Filled dietary flags');
  }


  if (analysisResult.weight && analysisResult.confidence > 0.4) {
  
    const weight = parseFloat(analysisResult.weight.toString());
    if (!isNaN(weight) && weight > 0 && weight <= 10000) {
      autoFilledData.weight = weight;
      console.log('✅ Filled weight:', weight + 'g');
    }
  }

  if (analysisResult.barcode && analysisResult.barcode.trim().length > 0) {
    autoFilledData.barcode = analysisResult.barcode.trim();
    console.log('✅ Filled barcode:', analysisResult.barcode);
  }

  if (analysisResult.manufacturer && analysisResult.manufacturer.trim().length > 0) {
    autoFilledData.manufacturer = analysisResult.manufacturer.trim();
  }

  if (analysisResult.countryOfOrigin && analysisResult.countryOfOrigin.trim().length > 0) {
    autoFilledData.countryOfOrigin = analysisResult.countryOfOrigin.trim();
  }

 
  if (analysisResult.tags && analysisResult.tags.length > 0 && analysisResult.confidence > 0.3) {
  
    const validTags = analysisResult.tags
      .filter(tag => tag && typeof tag === 'string' && tag.trim().length > 1 && tag.trim().length < 50)
      .map(tag => tag.trim().toLowerCase());
    
    if (validTags.length > 0) {
     
      const existingTags = (autoFilledData.tags || []).map((tag: string) => tag.toLowerCase());
      const newTags = validTags.filter(tag => !existingTags.includes(tag));
      
      if (newTags.length > 0) {
        autoFilledData.tags = [...(autoFilledData.tags || []), ...newTags];
        console.log('✅ Added AI tags:', newTags.join(', '));
      }
    }
  }

 
  if (analysisResult.category && analysisResult.category !== 'загальна' && analysisResult.confidence > 0.4) {
    const categoryTags = (autoFilledData.tags || []).map((tag: string) => tag.toLowerCase());
    const categoryTag = analysisResult.category.toLowerCase();
    
    if (!categoryTags.includes(categoryTag)) {
      autoFilledData.tags = [...(autoFilledData.tags || []), categoryTag];
      console.log('✅ Added category tag:', categoryTag);
    }
  }

  console.log('🎯 Auto-fill complete! Confidence:', analysisResult.confidence);
  return autoFilledData;
};

export const analyzeProductText = async (
  extractedText: string,
  productName?: string
): Promise<AnalyzedProductData> => {
  console.log('🤖 Analyzing text with Gemini 2.5 Flash Preview 05-20...');
  
  
  if (AI_CONFIG.GEMINI_API_KEY) {
    try {
      const prompt = `Проаналізуй цей текст з етикетки продукту і витягни інформацію у форматі JSON на українській мові:

"${extractedText}"

${productName ? `Назва продукту: "${productName}"` : ''}

Поверни ТІЛЬКИ валідний JSON з полями: name, brand, category, ingredients, allergens, nutrition, tags, confidence. Використовуй систему тегів з 8 категорій.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${AI_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.1,
          }
        }
      );

      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Gemini 2.5 Flash Preview text analysis error:', error);
    }
  }
  
  
  return fallbackProductAnalysis(extractedText);
};

export const detectProductCategory = (productData: AnalyzedProductData): string => {
  const name = (productData.name || '').toLowerCase();
  const ingredients = (productData.ingredients || '').toLowerCase();
  const category = (productData.category || '').toLowerCase();

  // Напої
  if (
    category.includes('напо') ||
    category.includes('drink') ||
    category.includes('beverage') ||
    name.includes('сік') ||
    name.includes('вода') ||
    name.includes('кава') ||
    name.includes('чай') ||
    name.includes('juice') ||
    name.includes('water') ||
    name.includes('coffee') ||
    name.includes('tea') ||
    ingredients.includes('вода') ||
    ingredients.includes('water')
  ) {
    return 'напої';
  }

 
  if (
    category.includes('сир') ||
    category.includes('cheese') ||
    name.includes('сир') ||
    name.includes('cheese')
  ) {
    return 'сир';
  }

  
  if (
    category.includes('жир') ||
    category.includes('олі') ||
    category.includes('горіх') ||
    category.includes('oil') ||
    category.includes('fat') ||
    category.includes('nut') ||
    name.includes('олія') ||
    name.includes('горіх') ||
    name.includes('oil') ||
    name.includes('nut') ||
    ingredients.includes('олія') ||
    ingredients.includes('oil')
  ) {
    return 'жири-олії-горіхи';
  }

  return 'загальна';
};

export const fallbackProductAnalysis = (extractedText: string): AnalyzedProductData => {
  const text = extractedText.toLowerCase();
  
 
  const patterns = {
    calories: /(?:калор|calor|energy)[^\d]*(\d+)/i,
    proteins: /(?:білк|protein)[^\d]*(\d+(?:[.,]\d+)?)/i,
    fats: /(?:жир|fat)[^\d]*(\d+(?:[.,]\d+)?)/i,
    carbs: /(?:вуглевод|carb)[^\d]*(\d+(?:[.,]\d+)?)/i,
    weight: /(\d+)\s*(?:г|g|ml|мл)/i,
  };

  const nutrition: any = {};
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      nutrition[key] = parseFloat(match[1].replace(',', '.'));
    }
  });

 
  const allergens: string[] = [];
  if (text.includes('молок') || text.includes('milk')) allergens.push('молоко');
  if (text.includes('яйц') || text.includes('egg')) allergens.push('яйця');
  if (text.includes('глютен') || text.includes('gluten')) allergens.push('глютен');
  if (text.includes('горіх') || text.includes('nut')) allergens.push('горіхи');
  if (text.includes('соя') || text.includes('soy')) allergens.push('соя');

  return {
    nutrition: Object.keys(nutrition).length > 0 ? nutrition : undefined,
    allergens: allergens.length > 0 ? allergens : undefined,
    confidence: 0.3, 
    analysisDetails: 'Базовий аналіз без AI'
  };
}; 