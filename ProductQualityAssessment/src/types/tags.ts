export type TagGroup = 
  | 'food_type'
  | 'dietary' 
  | 'allergen'
  | 'brand'
  | 'origin'
  | 'quality'
  | 'preparation'
  | 'other';

export interface Tag {
  id: string;
  text: string;
  group: TagGroup;
  count: number;
  isCustom: boolean;
  createdAt: Date;
}

export interface TagCloudProps {
  tags: Tag[];
  selectedTags?: string[];
  onTagPress?: (tag: Tag) => void;
  maxTags?: number;
  variant?: 'default' | 'compact';
}

export interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  popularTags?: Tag[];
  placeholder?: string;
  maxTags?: number;
}

export interface TagChipProps {
  tag: Tag | string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

export const TAG_GROUP_COLORS: Record<TagGroup, string> = {
  food_type: '#FF6B6B',
  dietary: '#4ECDC4',
  allergen: '#FFE66D',
  brand: '#A8E6CF',
  origin: '#C7CEEA',
  quality: '#FFA8A8',
  preparation: '#87CEEB',
  other: '#DDA0DD'
};

export const TAG_GROUP_ICONS: Record<TagGroup, string> = {
  food_type: '🍎',
  dietary: '🥗',
  allergen: '⚠️',
  brand: '🏷️',
  origin: '🌍',
  quality: '⭐',
  preparation: '',
  other: '📦'
}; 