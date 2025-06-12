import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { t } from '../utils/translations';
import { 
  analyzeProductImage, 
  AnalyzedProductData, 
  autoFillFormFromAnalysis,
  fallbackProductAnalysis
} from '../api/smartProductAnalysis';

interface SmartProductAnalyzerProps {
  visible: boolean;
  onClose: () => void;
  onAnalysisComplete: (formData: any) => void;
  currentFormData: any;
  imageUri?: string;
}

const SmartProductAnalyzer: React.FC<SmartProductAnalyzerProps> = ({
  visible,
  onClose,
  onAnalysisComplete,
  currentFormData,
  imageUri,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzedProductData | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const startAnalysis = async () => {
    if (!imageUri) {
      Alert.alert(t('error'), 'Спочатку зробіть фото продукту');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('🤖 Запуск Gemini 2.5 Flash Preview аналізу...');

    try {
    
      setAnalysisStep('🔍 Аналіз зображення з Gemini 2.5 Flash Preview...');
      
      const analysisResult = await analyzeProductImage(imageUri, {
        name: currentFormData.name,
        barcode: currentFormData.barcode,
      });

      // Перевіряємо чи це не-їжевий продукт
      if (analysisResult.isNonFood) {
        Alert.alert(
          'Некоректне фото',
          analysisResult.analysisDetails || 'Це не харчовий продукт. Сфотографуйте етикетку їжі.',
          [{ text: 'Зрозуміло', style: 'default' }]
        );
        return;
      }

      setAnalysisResult(analysisResult);

      if (analysisResult.confidence > 0.3) {
      
        setAnalysisStep('📝 Автоматичне заповнення форми...');
        const autoFilledData = autoFillFormFromAnalysis(analysisResult, currentFormData);
        
        showAnalysisResults(analysisResult, autoFilledData);
      } else {
        Alert.alert(
          'Низька точність аналізу',
          'Gemini не впевнений у результатах аналізу. Спробуйте зробити більш чітке фото етикетки.'
        );
      }

    } catch (error) {
      console.error('Analysis error:', error);
      
      // Спроба базового аналізу
      setAnalysisStep('🔄 Спроба базового аналізу...');
      try {
        const fallbackResult = fallbackProductAnalysis('');
        if (fallbackResult.confidence > 0) {
          setAnalysisResult(fallbackResult);
          const autoFilledData = autoFillFormFromAnalysis(fallbackResult, currentFormData);
          showAnalysisResults(fallbackResult, autoFilledData);
        } else {
          throw new Error('Fallback also failed');
        }
      } catch (fallbackError) {
        Alert.alert(
          'Помилка аналізу',
          'Не вдалося проаналізувати продукт. Спробуйте ще раз з більш чітким фото етикетки.'
        );
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const showAnalysisResults = (analysis: AnalyzedProductData, autoFilledData: any) => {
    const foundFields: string[] = [];
    
    if (analysis.name) foundFields.push('Назва');
    if (analysis.brand) foundFields.push('Бренд');
    if (analysis.ingredients) foundFields.push('Інгредієнти');
    if (analysis.nutrition) foundFields.push('Харчова цінність');
    if (analysis.allergens?.length) foundFields.push('Алергени');
    if (analysis.weight) foundFields.push('Вага');

    const confidenceText = analysis.confidence > 0.8 ? 'Висока' :
                          analysis.confidence > 0.6 ? 'Середня' :
                          analysis.confidence > 0.4 ? 'Низька' : 'Дуже низька';

    Alert.alert(
      '✅ Аналіз завершено!',
      `Точність: ${confidenceText} (${Math.round(analysis.confidence * 100)}%)\n\n` +
      `Знайдено: ${foundFields.join(', ')}\n\n` +
      'Застосувати результати до форми?',
      [
        {
          text: 'Показати деталі',
          onPress: () => setShowExtractedText(true),
          style: 'default',
        },
        {
          text: 'Скасувати',
          style: 'cancel',
        },
        {
          text: 'Застосувати',
          onPress: () => {
            onAnalysisComplete(autoFilledData);
            onClose();
          },
          style: 'default',
        },
      ]
    );
  };

  const renderAnalysisDetails = () => {
    if (!analysisResult) return null;

    return (
      <Modal visible={showExtractedText} animationType="slide" presentationStyle="formSheet">
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Деталі аналізу</Text>
            <TouchableOpacity onPress={() => setShowExtractedText(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsContent}>
       
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>📊 Точність аналізу</Text>
              <View style={styles.confidenceBar}>
                <View style={[
                  styles.confidenceFill, 
                  { width: `${analysisResult.confidence * 100}%` }
                ]} />
              </View>
              <Text style={styles.confidenceText}>
                {Math.round(analysisResult.confidence * 100)}% - {
                  analysisResult.confidence > 0.8 ? 'Відмінно' :
                  analysisResult.confidence > 0.6 ? 'Добре' :
                  analysisResult.confidence > 0.4 ? 'Задовільно' : 'Погано'
                }
              </Text>
            </View>

      
            {analysisResult.name && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🏷️ Назва продукту</Text>
                <Text style={styles.sectionContent}>{analysisResult.name}</Text>
              </View>
            )}

            {analysisResult.brand && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🏭 Бренд</Text>
                <Text style={styles.sectionContent}>{analysisResult.brand}</Text>
              </View>
            )}

            {analysisResult.nutrition && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🍎 Харчова цінність (на 100г)</Text>
                <View style={styles.nutritionGrid}>
                  {analysisResult.nutrition.calories && (
                    <Text style={styles.nutritionItem}>Калорії: {analysisResult.nutrition.calories} ккал</Text>
                  )}
                  {analysisResult.nutrition.proteins && (
                    <Text style={styles.nutritionItem}>Білки: {analysisResult.nutrition.proteins}г</Text>
                  )}
                  {analysisResult.nutrition.fats && (
                    <Text style={styles.nutritionItem}>Жири: {analysisResult.nutrition.fats}г</Text>
                  )}
                  {analysisResult.nutrition.carbohydrates && (
                    <Text style={styles.nutritionItem}>Вуглеводи: {analysisResult.nutrition.carbohydrates}г</Text>
                  )}
                </View>
              </View>
            )}

            {analysisResult.ingredients && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>📋 Інгредієнти</Text>
                <Text style={styles.sectionContent}>{analysisResult.ingredients}</Text>
              </View>
            )}

            {analysisResult.allergens && analysisResult.allergens.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>⚠️ Алергени</Text>
                <Text style={styles.sectionContent}>{analysisResult.allergens.join(', ')}</Text>
              </View>
            )}

          
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>📝 Розпізнаний текст</Text>
              <Text style={styles.extractedTextContent}>{extractedText || 'Текст не розпізнано'}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => {
              if (analysisResult) {
                const autoFilledData = autoFillFormFromAnalysis(analysisResult, currentFormData);
                onAnalysisComplete(autoFilledData);
              }
              setShowExtractedText(false);
              onClose();
            }}
          >
            <Text style={styles.applyButtonText}>Застосувати результати</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 Gemini 2.5 Flash Preview 05-20</Text>
          <Text style={styles.subtitle}>
            Штучний інтелект проаналізує вашу етикетку та автоматично заповнить форму
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
        
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={imageUri && imageUri.trim() !== '' ? { uri: imageUri } : require('../assets/logo.png')} style={styles.previewImage} />
              <Text style={styles.imageCaption}>Зображення для аналізу</Text>
            </View>
          )}

      
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>🔍 Що проаналізує Gemini 2.5 Flash Preview:</Text>
            
            <View style={styles.featureItem}>
              <Ionicons name="eye-outline" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Розпізнавання тексту безпосередньо з зображення</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="nutrition-outline" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Харчова цінність та калорії (один крок!)</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="list-outline" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Інгредієнти та алергени з контексту</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="business-outline" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Назва, бренд візуально з упаковки</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialIcons name="category" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Автоматичне визначення категорії</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="flash-outline" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Швидше - без окремого OCR кроку!</Text>
            </View>
          </View>

        
          {isAnalyzing && (
            <View style={styles.analysisContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.analysisText}>{analysisStep}</Text>
              <Animated.Text style={[styles.processingText, { opacity: pulseAnim }]}>
                Gemini 2.5 Flash Preview аналізує зображення...
              </Animated.Text>
            </View>
          )}

     
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Поради для кращого результату:</Text>
            <Text style={styles.tipText}>• Зробіть чітке фото всієї етикетки</Text>
            <Text style={styles.tipText}>• Включіть таблицю харчової цінності</Text>
            <Text style={styles.tipText}>• Переконайтеся в хорошому освітленні</Text>
            <Text style={styles.tipText}>• Фотографуйте тільки ХАРЧОВІ продукти</Text>
            <Text style={styles.tipText}>• Gemini не аналізує косметику, ліки, побутову хімію</Text>
          </View>
        </ScrollView>

      
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]} 
            onPress={onClose}
            disabled={isAnalyzing}
          >
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.analyzeButton]} 
            onPress={startAnalysis}
            disabled={isAnalyzing || !imageUri}
          >
            <Ionicons name="scan" size={20} color="#fff" />
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? 'Аналізую...' : 'Почати аналіз'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderAnalysisDetails()}
      </View>
    </Modal>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: screenWidth - 80,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  imageCaption: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  analysisContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  analysisText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  processingText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
 
  detailsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#28a745',
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
  },
  nutritionGrid: {
    gap: 5,
  },
  nutritionItem: {
    fontSize: 14,
    color: '#555',
  },
  extractedTextContent: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    lineHeight: 18,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SmartProductAnalyzer; 