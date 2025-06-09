import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NutriScoreResult, NutriScoreGrade, getNutriScoreInfo } from '../utils/nutriScore';
import { t, getCurrentLanguage } from '../utils/translations';

interface NutriScoreDisplayProps {
  result: NutriScoreResult;
  showDetails?: boolean;
}

const NutriScoreDisplay: React.FC<NutriScoreDisplayProps> = ({ 
  result, 
  showDetails = false 
}) => {
  const currentLang = getCurrentLanguage();
  const scoreInfo = getNutriScoreInfo(result.grade);

 
  const nutriScoreTranslations = {
    en: {
      nutritionalQuality: 'Nutritional Quality',
      calculationDetails: 'Calculation Details',
      negativePoints: 'Negative Points',
      positivePoints: 'Positive Points',
      points: 'points',
      energy: 'Energy',
      saturatedFat: 'Saturated Fat',
      sugars: 'Sugars',
      sodium: 'Sodium',
      fiber: 'Fiber',
      protein: 'Protein',
      fruitsVegetablesNuts: 'Fruits, Vegetables, Nuts',
      finalScore: 'Final Score',
      category: 'Category',
      categories: {
        general: 'General Foods',
        beverages: 'Beverages',
        fatsOilsNutsSeeds: 'Fats, Oils, Nuts & Seeds',
        cheese: 'Cheese',
      },
      grades: {
        A: 'Excellent',
        B: 'Good',
        C: 'Fair',
        D: 'Poor',
        E: 'Very Poor',
      },
      descriptions: {
        A: 'Excellent nutritional quality',
        B: 'Good nutritional quality',
        C: 'Fair nutritional quality',
        D: 'Poor nutritional quality',
        E: 'Very poor nutritional quality',
      },
      recommendations: {
        A: 'Choose this product often as part of a balanced diet',
        B: 'Good choice for regular consumption',
        C: 'Consume in moderation as part of a varied diet',
        D: 'Limit consumption and choose healthier alternatives when possible',
        E: 'Avoid frequent consumption and opt for healthier alternatives',
      },
    },
    uk: {
      nutritionalQuality: 'Якість харчування',
      calculationDetails: 'Деталі розрахунку',
      negativePoints: 'Негативні бали',
      positivePoints: 'Позитивні бали',
      points: 'балів',
      energy: 'Енергія',
      saturatedFat: 'Насичені жири',
      sugars: 'Цукор',
      sodium: 'Натрій',
      fiber: 'Клітковина',
      protein: 'Білок',
      fruitsVegetablesNuts: 'Фрукти, овочі, горіхи',
      finalScore: 'Кінцевий бал',
      category: 'Категорія',
      categories: {
        general: 'Загальні продукти',
        beverages: 'Напої',
        fatsOilsNutsSeeds: 'Жири, олії, горіхи та насіння',
        cheese: 'Сир',
      },
      grades: {
        A: 'Відмінно',
        B: 'Добре',
        C: 'Задовільно',
        D: 'Погано',
        E: 'Дуже погано',
      },
      descriptions: {
        A: 'Відмінна якість харчування',
        B: 'Хороша якість харчування',
        C: 'Задовільна якість харчування',
        D: 'Погана якість харчування',
        E: 'Дуже погана якість харчування',
      },
      recommendations: {
        A: 'Вибирайте цей продукт часто як частину збалансованої дієти',
        B: 'Хороший вибір для регулярного споживання',
        C: 'Споживайте помірно як частину різноманітної дієти',
        D: 'Обмежте споживання та вибирайте здоровіші альтернативи, коли це можливо',
        E: 'Уникайте частого споживання та віддавайте перевагу здоровішим альтернативам',
      },
    },
  };

  const ns = nutriScoreTranslations[currentLang];

  const renderGradeLetters = () => {
    const grades: NutriScoreGrade[] = ['A', 'B', 'C', 'D', 'E'];
    const gradeColors = {
      A: '#038141',
      B: '#85BB2F',
      C: '#FECB02',
      D: '#EE8100',
      E: '#E63312'
    };

    return (
      <View style={styles.gradeContainer}>
        {grades.map((grade) => (
          <View
            key={grade}
            style={[
              styles.gradeLetter,
              {
                backgroundColor: gradeColors[grade],
                opacity: grade === result.grade ? 1 : 0.3,
                transform: grade === result.grade ? [{ scale: 1.2 }] : [{ scale: 1 }],
              },
            ]}
          >
            <Text style={[
              styles.gradeText,
              { 
                fontWeight: grade === result.grade ? 'bold' : 'normal',
                fontSize: grade === result.grade ? 20 : 16
              }
            ]}>
              {grade}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderScoreDetails = () => {
    if (!showDetails) return null;

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>{ns.calculationDetails}</Text>
        
        <View style={styles.scoreBreakdown}>
          <View style={styles.scoreSection}>
            <Text style={styles.sectionTitle}>{ns.negativePoints} ({result.negativePoints})</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointItem}>
                {ns.energy}: {result.details.energyPoints} {ns.points}
              </Text>
              <Text style={styles.pointItem}>
                {ns.saturatedFat}: {result.details.saturatedFatPoints} {ns.points}
              </Text>
              <Text style={styles.pointItem}>
                {ns.sugars}: {result.details.sugarsPoints} {ns.points}
              </Text>
              <Text style={styles.pointItem}>
                {ns.sodium}: {result.details.sodiumPoints} {ns.points}
              </Text>
            </View>
          </View>

          <View style={styles.scoreSection}>
            <Text style={styles.sectionTitle}>{ns.positivePoints} ({result.positivePoints})</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointItem}>
                {ns.fiber}: {result.details.fiberPoints} {ns.points}
              </Text>
              <Text style={styles.pointItem}>
                {ns.protein}: {result.details.proteinPoints} {ns.points}
              </Text>
              <Text style={styles.pointItem}>
                {ns.fruitsVegetablesNuts}: {result.details.fruitsVegetablesNutsPoints} {ns.points}
              </Text>
            </View>
          </View>

          <View style={styles.finalScore}>
            <Text style={styles.finalScoreText}>
              {ns.finalScore}: {result.score}
            </Text>
            <Text style={styles.categoryText}>
              {ns.category}: {ns.categories[result.category]}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutri-Score</Text>
        <Text style={styles.subtitle}>{ns.nutritionalQuality}</Text>
      </View>

      {renderGradeLetters()}

      <View style={[styles.currentGrade, { backgroundColor: scoreInfo.color }]}>
        <Text style={styles.currentGradeText}>{result.grade}</Text>
      </View>

      <View style={styles.description}>
        <Text style={styles.descriptionText}>{ns.descriptions[result.grade]}</Text>
        <Text style={styles.recommendationText}>{ns.recommendations[result.grade]}</Text>
      </View>

      {renderScoreDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradeLetter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentGrade: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  currentGradeText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  description: {
    alignItems: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  scoreBreakdown: {
    gap: 12,
  },
  scoreSection: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pointsContainer: {
    gap: 4,
  },
  pointItem: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 8,
  },
  finalScore: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  finalScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
});

export default NutriScoreDisplay; 