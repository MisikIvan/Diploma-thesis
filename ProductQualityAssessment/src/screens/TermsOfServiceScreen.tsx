import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { t } from '../utils/translations';

const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('termsOfServiceTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>
            {t('lastUpdatedDate')}: 29 травня 2025 р.
          </Text>

          <Text style={styles.sectionTitle}>{t('introduction')}</Text>
          <Text style={styles.paragraph}>
            Ласкаво просимо до додатку "Оцінка якості продуктів" ("Додаток"). 
            Цей додаток розроблено для надання користувачам інформації про якість 
            харчових продуктів, їх склад та харчову цінність. Використовуючи наш 
            додаток, ви погоджуєтеся з цими Умовами користування.
          </Text>

          <Text style={styles.sectionTitle}>{t('acceptanceOfTerms')}</Text>
          <Text style={styles.paragraph}>
            Завантажуючи, встановлюючи або використовуючи цей додаток, ви 
            підтверджуете, що прочитали, зрозуміли та погоджуєтеся дотримуватися 
            цих Умов користування. Якщо ви не погоджуєтеся з будь-якою частиною 
            цих умов, будь ласка, не користуйтеся додатком.
          </Text>

          <Text style={styles.sectionTitle}>{t('servicesProvided')}</Text>
          <Text style={styles.paragraph}>
            Наш додаток надає наступні послуги:
            {'\n\n'}• Перегляд детальної інформації про склад та харчову цінність
            {'\n'}• Збереження улюблених продуктів
            {'\n'}• Інструменти для відстеження ваги та здоров'я
          </Text>

          <Text style={styles.sectionTitle}>{t('userResponsibilities')}</Text>
          <Text style={styles.paragraph}>
            Використовуючи додаток, ви зобов'язуєтеся:
            {'\n\n'}• Надавати точну особисту інформацію
            {'\n'}• Не порушувати права інтелектуальної власності
            {'\n'}• Не використовувати додаток для незаконних цілей
            {'\n'}• Не передавати шкідливий контент або віруси
            {'\n'}• Дотримуватися всіх застосовних законів та норм
          </Text>

          <Text style={styles.sectionTitle}>{t('privacyAndDataProtection')}</Text>
          <Text style={styles.paragraph}>
            Ваша приватність важлива для нас. Інформація про те, як ми збираємо, 
            використовуємо та захищаємо ваші особисті дані, детально описана в 
            нашій Політиці конфіденційності. Використовуючи додаток, ви також 
            погоджуєтеся з умовами нашої Політики конфіденційності.
          </Text>

          <Text style={styles.sectionTitle}>{t('limitationOfLiability')}</Text>
          <Text style={styles.paragraph}>
            ДОДАТОК НАДАЄТЬСЯ "ЯК Є" БЕЗ БУДЬ-ЯКИХ ГАРАНТІЙ. МИ НЕ НЕСЕМО 
            ВІДПОВІДАЛЬНОСТІ ЗА:
            {'\n\n'}• Точність інформації про продукти
            {'\n'}• Збитки від використання неточної інформації
            {'\n'}• Технічні збої або недоступність сервісу
            {'\n'}• Втрату даних або порушення безпеки
            {'\n\n'}Максимальна відповідальність обмежується сумою 50 доларів США.
          </Text>

          <Text style={styles.sectionTitle}>{t('terminationOfServices')}</Text>
          <Text style={styles.paragraph}>
            Ми залишаємо за собою право припинити або призупинити ваш доступ до 
            додатку в будь-який час без попереднього повідомлення, якщо ви 
            порушуєте ці Умови користування або використовуєте додаток 
            неналежним чином.
          </Text>

          <Text style={styles.sectionTitle}>{t('modificationsToTerms')}</Text>
          <Text style={styles.paragraph}>
            Ми можемо час від часу оновлювати ці Умови користування. Про всі 
            зміни ми повідомимо шляхом публікації оновлених умов у додатку. 
            Продовжуючи користуватися додатком після внесення змін, ви 
            погоджуєтеся з новими умовами.
          </Text>

          <Text style={styles.sectionTitle}>{t('contactInformation')}</Text>
          <Text style={styles.paragraph}>
            Якщо у вас є питання щодо цих Умов користування, будь ласка, 
            зв'яжіться з нами:
            {'\n\n'}Email: support@productquality.app
            {'\n'}Телефон: +380 (44) 123-45-67
            {'\n'}Адреса: м. Київ, вул. Хрещатик, 1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34572a',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
});

export default TermsOfServiceScreen; 