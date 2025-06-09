import { TagGroup, Tag } from '../types/tags';
import { AnalyzedProductData } from './smartProductAnalysis';

// AI-Enhanced Tag Integration
export class AITagIntegration {
  
  // Tag group definitions for AI validation
  private static readonly TAG_GROUPS: Record<TagGroup, string[]> = {
    food_type: [
      'молочні', 'м\'ясні', 'овочі', 'фрукти', 'зернові', 'напої', 
      'солодощі', 'снеки', 'хлібобулочні', 'консерви', 'заморожені', 
      'специи', 'соуси'
    ],
    dietary: [
      'веган', 'вегетаріанський', 'кошерний', 'халяль', 'органічний', 
      'еко', 'біо', 'натуральний', 'без-цукру', 'дієтичний', 
      'здоровий', 'спортивний'
    ],
    allergen: [
      'без-глютену', 'без-лактози', 'без-яєць', 'без-горіхів', 
      'без-сої', 'без-риби', 'без-молюсків', 'без-насіння', 'без-арахісу'
    ],
    brand: [
      'преміум', 'бюджетний', 'локальний', 'міжнародний', 
      'новий-бренд', 'відомий-бренд', 'приватна-марка'
    ],
    origin: [
      'україна', 'європа', 'сша', 'азія', 'місцевий', 
      'імпорт', 'екзотичний', 'регіональний'
    ],
    quality: [
      'свіжий', 'якісний', 'натуральний', 'штучний', 
      'переробленний', 'домашній', 'промисловий', 'ремісничий'
    ],
    preparation: [
      'готовий-до-вживання', 'потребує-готування', 'швидкого-приготування', 
      'заварний', 'розчинний', 'концентрат'
    ],
    other: [
      'новинка', 'сезонний', 'лімітований', 'акційний', 
      'розпродаж', 'популярний', 'рекомендований', 'тестовий'
    ]
  };


  static validateAITags(aiTags: string[]): Tag[] {
    const validatedTags: Tag[] = [];
    
    for (const tagText of aiTags) {
      const normalizedTag = tagText.toLowerCase().trim();
      
    
      for (const [groupKey, groupTags] of Object.entries(this.TAG_GROUPS)) {
        if (groupTags.includes(normalizedTag)) {
          validatedTags.push({
            id: `ai_${normalizedTag}_${Date.now()}`,
            text: normalizedTag,
            group: groupKey as TagGroup,
            count: 1,
            isCustom: false,
            createdAt: new Date()
          });
          break;
        }
      }
    }
    
    return validatedTags;
  }


  static enhanceWithSmartTags(analysis: AnalyzedProductData): AnalyzedProductData {
    const enhancedTags = [...(analysis.tags || [])];
    
   
    if (analysis.isVegan) enhancedTags.push('веган');
    if (analysis.isVegetarian && !analysis.isVegan) enhancedTags.push('вегетаріанський');
    
 
    if (!analysis.hasGluten) enhancedTags.push('без-глютену');
    if (!analysis.hasLactose) enhancedTags.push('без-лактози');
    
   
    if (analysis.category) {
      switch (analysis.category) {
        case 'напої':
          enhancedTags.push('напої');
          break;
        case 'сир':
          enhancedTags.push('молочні');
          break;
        case 'жири-олії-горіхи':
          enhancedTags.push('жири-олії-горіхи');
          break;
      }
    }
    
   
    if (analysis.nutrition) {
      const { calories, sugar, salt } = analysis.nutrition;
      
   
      if (calories && calories < 100) {
        enhancedTags.push('дієтичний');
      }
      
     
      if (sugar !== undefined && sugar < 5) {
        enhancedTags.push('без-цукру');
      }
      
    
      if (calories && calories < 150 && salt && salt < 1) {
        enhancedTags.push('здоровий');
      }
    }
    
 
    if (analysis.countryOfOrigin) {
      const country = analysis.countryOfOrigin.toLowerCase();
      if (country.includes('україн') || country.includes('ukraine')) {
        enhancedTags.push('україна', 'місцевий');
      } else if (country.includes('сша') || country.includes('usa') || country.includes('america')) {
        enhancedTags.push('сша', 'імпорт');
      } else if (country.includes('європ') || country.includes('europe') || 
                 country.includes('germany') || country.includes('france') || 
                 country.includes('italy')) {
        enhancedTags.push('європа', 'імпорт');
      } else if (country.includes('китай') || country.includes('china') || 
                 country.includes('japan') || country.includes('korea')) {
        enhancedTags.push('азія', 'імпорт');
      }
    }
    
   
    if (analysis.name || analysis.brand) {
      const productText = `${analysis.name || ''} ${analysis.brand || ''}`.toLowerCase();
      
      if (productText.includes('premium') || productText.includes('преміум') ||
          productText.includes('luxury') || productText.includes('елітний')) {
        enhancedTags.push('преміум');
      } else if (productText.includes('budget') || productText.includes('бюджет') ||
                 productText.includes('економ') || productText.includes('cheap')) {
        enhancedTags.push('бюджетний');
      }
      
      if (productText.includes('organic') || productText.includes('органічн') ||
          productText.includes('bio') || productText.includes('біо') ||
          productText.includes('eco') || productText.includes('еко')) {
        enhancedTags.push('органічний', 'еко', 'натуральний');
      }
    }
    
    
    if (analysis.ingredients) {
      const ingredients = analysis.ingredients.toLowerCase();
      
      if (ingredients.includes('готов') || ingredients.includes('ready')) {
        enhancedTags.push('готовий-до-вживання');
      } else if (ingredients.includes('концентрат') || ingredients.includes('concentrate')) {
        enhancedTags.push('концентрат', 'потребує-готування');
      } else if (ingredients.includes('розчинн') || ingredients.includes('instant')) {
        enhancedTags.push('розчинний', 'швидкого-приготування');
      }
    }
    
   
    return {
      ...analysis,
      tags: [...new Set(enhancedTags)]
    };
  }


  static generateTagSuggestions(
    productName: string, 
    category: string, 
    ingredients: string
  ): string[] {
    const suggestions: string[] = [];
    const text = `${productName} ${category} ${ingredients}`.toLowerCase();
    
  
    if (text.includes('молок') || text.includes('milk')) suggestions.push('молочні');
    if (text.includes('м\'яс') || text.includes('meat')) suggestions.push('м\'ясні');
    if (text.includes('овоч') || text.includes('vegetable')) suggestions.push('овочі');
    if (text.includes('фрукт') || text.includes('fruit')) suggestions.push('фрукти');
    if (text.includes('хліб') || text.includes('bread')) suggestions.push('хлібобулочні');
    if (text.includes('солод') || text.includes('sweet') || text.includes('цукер')) suggestions.push('солодощі');
    
  
    if (text.includes('веган') || text.includes('vegan')) suggestions.push('веган');
    if (text.includes('вегетар') || text.includes('vegetarian')) suggestions.push('вегетаріанський');
    if (text.includes('органічн') || text.includes('organic')) suggestions.push('органічний');
    if (text.includes('біо') || text.includes('bio')) suggestions.push('біо');
    if (text.includes('еко') || text.includes('eco')) suggestions.push('еко');
    if (text.includes('натур') || text.includes('natural')) suggestions.push('натуральний');
    
   
    if (!text.includes('глютен') && !text.includes('gluten')) suggestions.push('без-глютену');
    if (!text.includes('лактоз') && !text.includes('lactose')) suggestions.push('без-лактози');
    
    return [...new Set(suggestions)];
  }

 
  static scoreTagRelevance(tag: string, analysis: AnalyzedProductData): number {
    let score = 0;
    const text = `${analysis.name || ''} ${analysis.ingredients || ''} ${analysis.brand || ''}`.toLowerCase();
    const tagLower = tag.toLowerCase();
    
   
    if (text.includes(tagLower)) score += 10;
    
  
    if (analysis.category === tagLower) score += 8;
    
  
    if (tagLower === 'веган' && analysis.isVegan) score += 9;
    if (tagLower === 'вегетаріанський' && analysis.isVegetarian) score += 9;
    if (tagLower === 'без-глютену' && !analysis.hasGluten) score += 7;
    if (tagLower === 'без-лактози' && !analysis.hasLactose) score += 7;
    
   
    if (analysis.nutrition) {
      if (tagLower === 'дієтичний' && analysis.nutrition.calories && analysis.nutrition.calories < 100) score += 6;
      if (tagLower === 'здоровий' && analysis.nutrition.salt && analysis.nutrition.salt < 1) score += 5;
    }
    
    return score;
  }

 
  static getAllAvailableTags(): string {
    return Object.entries(this.TAG_GROUPS)
      .map(([group, tags]) => `${group.toUpperCase()}: ${tags.join(', ')}`)
      .join('\n');
  }
}

export default AITagIntegration; 