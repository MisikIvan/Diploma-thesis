import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

interface AutoNutriScoreProps {
  nutriments: {
    calories: number;
    proteins: number;
    fats: { total: number; saturated: number };
    carbohydrates: { total: number; sugar: number };
    salt: number;
    fiber?: number;
  };
  fruitsVegetablesNuts?: number;
  onScoreChange?: (grade: 'A' | 'B' | 'C' | 'D' | 'E', score: number) => void;
  showDetails?: boolean;
}

const AutoNutriScore: React.FC<AutoNutriScoreProps> = ({ 
  nutriments, 
  fruitsVegetablesNuts = 0,
  onScoreChange,
  showDetails = true
}) => {
  const [currentGrade, setCurrentGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('C');
  const [score, setScore] = useState(0);
  const [showCalculation, setShowCalculation] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const calculatedScore = calculateNutriScore();
    const grade = getGradeFromScore(calculatedScore);
    
    setScore(calculatedScore);
    setCurrentGrade(grade);
    
    if (onScoreChange) {
      onScoreChange(grade, calculatedScore);
    }

   
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [nutriments, fruitsVegetablesNuts]);

  const calculateNutriScore = (): number => {
    let negativePoints = 0;
    let positivePoints = 0;

    // Негативні бали
    // Енергія (ккал/100г)
    if (nutriments.calories <= 335) negativePoints += 0;
    else if (nutriments.calories <= 670) negativePoints += 1;
    else if (nutriments.calories <= 1005) negativePoints += 2;
    else if (nutriments.calories <= 1340) negativePoints += 3;
    else if (nutriments.calories <= 1675) negativePoints += 4;
    else if (nutriments.calories <= 2010) negativePoints += 5;
    else if (nutriments.calories <= 2345) negativePoints += 6;
    else if (nutriments.calories <= 2680) negativePoints += 7;
    else if (nutriments.calories <= 3015) negativePoints += 8;
    else if (nutriments.calories <= 3350) negativePoints += 9;
    else negativePoints += 10;

    // Насичені жири (г/100г)
    const saturatedFats = nutriments.fats.saturated;
    if (saturatedFats <= 1) negativePoints += 0;
    else if (saturatedFats <= 2) negativePoints += 1;
    else if (saturatedFats <= 3) negativePoints += 2;
    else if (saturatedFats <= 4) negativePoints += 3;
    else if (saturatedFats <= 5) negativePoints += 4;
    else if (saturatedFats <= 6) negativePoints += 5;
    else if (saturatedFats <= 7) negativePoints += 6;
    else if (saturatedFats <= 8) negativePoints += 7;
    else if (saturatedFats <= 9) negativePoints += 8;
    else if (saturatedFats <= 10) negativePoints += 9;
    else negativePoints += 10;

    // Цукор (г/100г)
    const sugar = nutriments.carbohydrates.sugar;
    if (sugar <= 4.5) negativePoints += 0;
    else if (sugar <= 9) negativePoints += 1;
    else if (sugar <= 13.5) negativePoints += 2;
    else if (sugar <= 18) negativePoints += 3;
    else if (sugar <= 22.5) negativePoints += 4;
    else if (sugar <= 27) negativePoints += 5;
    else if (sugar <= 31) negativePoints += 6;
    else if (sugar <= 36) negativePoints += 7;
    else if (sugar <= 40) negativePoints += 8;
    else if (sugar <= 45) negativePoints += 9;
    else negativePoints += 10;

    // Натрій (мг/100г) - конвертуємо з солі
    const sodium = nutriments.salt * 400; // 1г солі ≈ 400мг натрію
    if (sodium <= 90) negativePoints += 0;
    else if (sodium <= 180) negativePoints += 1;
    else if (sodium <= 270) negativePoints += 2;
    else if (sodium <= 360) negativePoints += 3;
    else if (sodium <= 450) negativePoints += 4;
    else if (sodium <= 540) negativePoints += 5;
    else if (sodium <= 630) negativePoints += 6;
    else if (sodium <= 720) negativePoints += 7;
    else if (sodium <= 810) negativePoints += 8;
    else if (sodium <= 900) negativePoints += 9;
    else negativePoints += 10;

    // Позитивні бали
    // Фрукти, овочі, горіхи (%)
    if (fruitsVegetablesNuts <= 40) positivePoints += 0;
    else if (fruitsVegetablesNuts <= 60) positivePoints += 1;
    else if (fruitsVegetablesNuts <= 80) positivePoints += 2;
    else positivePoints += 5;

    // Клітковина (г/100г)
    const fiber = nutriments.fiber || 0;
    if (fiber <= 0.9) positivePoints += 0;
    else if (fiber <= 1.9) positivePoints += 1;
    else if (fiber <= 2.8) positivePoints += 2;
    else if (fiber <= 3.7) positivePoints += 3;
    else if (fiber <= 4.7) positivePoints += 4;
    else positivePoints += 5;

    // Білки (г/100г)
    const proteins = nutriments.proteins;
    if (proteins <= 1.6) positivePoints += 0;
    else if (proteins <= 3.2) positivePoints += 1;
    else if (proteins <= 4.8) positivePoints += 2;
    else if (proteins <= 6.4) positivePoints += 3;
    else if (proteins <= 8.0) positivePoints += 4;
    else positivePoints += 5;

    return negativePoints - positivePoints;
  };

  const getGradeFromScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'E' => {
    if (score <= -1) return 'A';
    if (score <= 2) return 'B';
    if (score <= 10) return 'C';
    if (score <= 18) return 'D';
    return 'E';
  };

  const getGradeColor = (grade: 'A' | 'B' | 'C' | 'D' | 'E') => {
    const colors = {
      A: '#00A651',
      B: '#85C441', 
      C: '#FED100',
      D: '#FF7F00',
      E: '#E63F00'
    };
    return colors[grade];
  };

  const getGradeDescription = (grade: 'A' | 'B' | 'C' | 'D' | 'E') => {
    const descriptions = {
      A: 'Відмінний вибір для здорового харчування',
      B: 'Хороший вибір з невеликими обмеженнями', 
      C: 'Помірний вибір, вживати в розумних кількостях',
      D: 'Погана якість, обмежити споживання',
      E: 'Дуже поганий вибір, уникати'
    };
    return descriptions[grade];
  };

  const renderGradeScale = () => {
    const grades = ['A', 'B', 'C', 'D', 'E'] as const;
    
    return (
      <View style={styles.gradeScale}>
        {grades.map((grade, index) => (
          <View key={grade} style={styles.gradeContainer}>
            <View 
              style={[
                styles.gradeButton,
                { backgroundColor: getGradeColor(grade) },
                currentGrade === grade && styles.currentGrade
              ]}
            >
              <Text style={styles.gradeText}>{grade}</Text>
            </View>
            {index < grades.length - 1 && <View style={styles.gradeSeparator} />}
          </View>
        ))}
      </View>
    );
  };

  const renderCalculationDetails = () => {
    if (!showCalculation) return null;

    const negativePoints = Math.max(0, score + calculatePositivePoints());
    const positivePoints = calculatePositivePoints();

    return (
      <View style={styles.calculationDetails}>
        <Text style={styles.calculationTitle}>🔬 Деталі розрахунку</Text>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsSection}>
            <View style={styles.pointsHeader}>
              <Ionicons name="remove-circle" size={20} color={Colors.error} />
              <Text style={styles.pointsSectionTitle}>Негативні фактори</Text>
            </View>
            <Text style={styles.pointsValue}>+{negativePoints} балів</Text>
            <Text style={styles.pointsDetails}>
              Калорії, цукор, насичені жири, натрій
            </Text>
          </View>

          <View style={styles.pointsSection}>
            <View style={styles.pointsHeader}>
              <Ionicons name="add-circle" size={20} color={Colors.success} />
              <Text style={styles.pointsSectionTitle}>Позитивні фактори</Text>
            </View>
            <Text style={styles.pointsValue}>-{positivePoints} балів</Text>
            <Text style={styles.pointsDetails}>
              Білки, клітковина, фрукти/овочі
            </Text>
          </View>
        </View>

        <View style={styles.finalScore}>
          <Text style={styles.finalScoreLabel}>Підсумковий бал:</Text>
          <Text style={[styles.finalScoreValue, { color: getGradeColor(currentGrade) }]}>
            {score}
          </Text>
        </View>
      </View>
    );
  };

  const calculatePositivePoints = (): number => {
    let positivePoints = 0;

    // Фрукти, овочі, горіхи
    if (fruitsVegetablesNuts <= 40) positivePoints += 0;
    else if (fruitsVegetablesNuts <= 60) positivePoints += 1;
    else if (fruitsVegetablesNuts <= 80) positivePoints += 2;
    else positivePoints += 5;

    // Клітковина
    const fiber = nutriments.fiber || 0;
    if (fiber <= 0.9) positivePoints += 0;
    else if (fiber <= 1.9) positivePoints += 1;
    else if (fiber <= 2.8) positivePoints += 2;
    else if (fiber <= 3.7) positivePoints += 3;
    else if (fiber <= 4.7) positivePoints += 4;
    else positivePoints += 5;

    // Білки
    const proteins = nutriments.proteins;
    if (proteins <= 1.6) positivePoints += 0;
    else if (proteins <= 3.2) positivePoints += 1;
    else if (proteins <= 4.8) positivePoints += 2;
    else if (proteins <= 6.4) positivePoints += 3;
    else if (proteins <= 8.0) positivePoints += 4;
    else positivePoints += 5;

    return positivePoints;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animatedValue,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="eco" size={24} color={Colors.primary} />
          <Text style={styles.title}>Nutri-Score</Text>
        </View>
        
        {showDetails && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowCalculation(!showCalculation)}
          >
            <Ionicons 
              name={showCalculation ? "chevron-up" : "information-circle"} 
              size={20} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.mainContent}>
        <View style={styles.scoreDisplay}>
          <View 
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeColor(currentGrade) }
            ]}
          >
            <Text style={styles.gradeBadgeText}>{currentGrade}</Text>
          </View>
          
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreValue}>Бал: {score}</Text>
            <Text style={styles.scoreDescription}>
              {getGradeDescription(currentGrade)}
            </Text>
          </View>
        </View>

        {renderGradeScale()}
      </View>

      {renderCalculationDetails()}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00A651' }]} />
          <Text style={styles.legendText}>A - Відмінно</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#85C441' }]} />
          <Text style={styles.legendText}>B - Добре</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FED100' }]} />
          <Text style={styles.legendText}>C - Задовільно</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF7F00' }]} />
          <Text style={styles.legendText}>D - Погано</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E63F00' }]} />
          <Text style={styles.legendText}>E - Дуже погано</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.primary,
  },
  infoButton: {
    padding: Spacing.xs,
  },
  mainContent: {
    marginBottom: Spacing.lg,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  gradeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  gradeBadgeText: {
    ...Typography.h1,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  scoreDescription: {
    ...Typography.caption,
    lineHeight: 16,
  },
  gradeScale: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.large,
    padding: Spacing.sm,
  },
  gradeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.small,
  },
  currentGrade: {
    transform: [{ scale: 1.1 }],
    ...Shadows.small,
  },
  gradeText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  gradeSeparator: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border.default,
    marginHorizontal: 2,
  },
  calculationDetails: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  calculationTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  pointsSection: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  pointsSectionTitle: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
  pointsValue: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  pointsDetails: {
    ...Typography.caption,
    fontSize: 10,
    lineHeight: 12,
  },
  finalScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  finalScoreLabel: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  finalScoreValue: {
    ...Typography.h2,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...Typography.caption,
    fontSize: 10,
  },
});

export default AutoNutriScore; 