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

const PrivacyPolicyScreen: React.FC = () => {
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
        <Text style={styles.headerTitle}>{t('privacyPolicyTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>
            {t('lastUpdatedDate')}: 29 травня 2025 р.
          </Text>

          <Text style={styles.sectionTitle}>{t('introduction')}</Text>
          <Text style={styles.paragraph}>
            Ця Політика конфіденційності описує наші політики та процедури щодо 
            збору, використання та розкриття вашої інформації, коли ви користуєтеся 
            додатком "Оцінка якості продуктів", і розповідає вам про ваші права на 
            приватність та як закон захищає вас.
          </Text>

          <Text style={styles.paragraph}>
            Ми використовуємо ваші особисті дані для надання та покращення послуг. 
            Користуючись додатком, ви погоджуєтеся на збір та використання 
            інформації відповідно до цієї Політики конфіденційності.
          </Text>

          <Text style={styles.sectionTitle}>{t('dataCollection')}</Text>
          <Text style={styles.paragraph}>
            Ми можемо збирати наступні типи інформації:
            {'\n\n'}• Особисті дані: ім'я, електронна пошта, вік, стать, фізичні параметри
            {'\n'}• Дані про використання: інформація про те, як ви користуєтеся додатком
            {'\n'}• Дані пристрою: IP-адреса, тип браузера, операційна система
            {'\n'}• Інформація про продукти: сканована історія, улюблені продукти
            {'\n'}• Дані про здоров'я: вага, зріст, цілі здоров'я (за вашою згодою)
          </Text>

          <Text style={styles.sectionTitle}>{t('dataUsage')}</Text>
          <Text style={styles.paragraph}>
            Компанія може використовувати особисті дані для наступних цілей:
            {'\n\n'}• Надання та підтримка нашого додатку
            {'\n'}• Персоналізація вашого досвіду користування
            {'\n'}• Аналіз використання для покращення послуг
            {'\n'}• Зв'язок з вами щодо оновлень та новин
            {'\n'}• Забезпечення безпеки та попередження шахрайства
            {'\n'}• Дотримання правових зобов'язань
          </Text>

          <Text style={styles.sectionTitle}>{t('dataSecurity')}</Text>
          <Text style={styles.paragraph}>
            Безпека ваших особистих даних важлива для нас, але пам'ятайте, що 
            жоден метод передачі через інтернет або метод електронного зберігання 
            не є 100% безпечним. Хоча ми прагнемо використовувати комерційно 
            прийнятні засоби для захисту ваших особистих даних, ми не можемо 
            гарантувати їх абсолютну безпеку.
          </Text>

          <Text style={styles.paragraph}>
            Ми використовуємо наступні заходи безпеки:
            {'\n\n'}• Шифрування даних при передачі та зберіганні
            {'\n'}• Регулярні аудити безпеки
            {'\n'}• Обмежений доступ до особистих даних
            {'\n'}• Навчання персоналу з питань конфіденційності
          </Text>

          <Text style={styles.sectionTitle}>{t('userRights')}</Text>
          <Text style={styles.paragraph}>
            Відповідно до застосовного законодавства, ви маєте наступні права:
            {'\n\n'}• Право доступу до ваших особистих даних
            {'\n'}• Право на виправлення неточних даних
            {'\n'}• Право на видалення ваших даних
            {'\n'}• Право на обмеження обробки
            {'\n'}• Право на портативність даних
            {'\n'}• Право на заперечення проти обробки
          </Text>

          <Text style={styles.sectionTitle}>{t('cookiesAndTracking')}</Text>
          <Text style={styles.paragraph}>
            Наш додаток може використовувати технології відстеження для покращення 
            користувацького досвіду. Ми можемо використовувати:
            {'\n\n'}• Аналітичні інструменти для розуміння використання додатку
            {'\n'}• Файли cookie для збереження налаштувань
            {'\n'}• Ідентифікатори пристроїв для персоналізації
          </Text>

          <Text style={styles.sectionTitle}>{t('thirdPartyServices')}</Text>
          <Text style={styles.paragraph}>
            Наш додаток може містити посилання на сторонні сервіси, якими ми не 
            керуємо. Ми настійно радимо вам ознайомитися з Політикою 
            конфіденційності кожного сайту, який ви відвідуєте.
            {'\n\n'}Сторонні сервіси, які ми можемо використовувати:
            {'\n'}• Firebase (Google) - для зберігання даних
            {'\n'}• Аналітичні сервіси для поліпшення додатку
          </Text>

          <Text style={styles.sectionTitle}>{t('dataRetention')}</Text>
          <Text style={styles.paragraph}>
            Ми зберігаємо ваші особисті дані лише стільки, скільки необхідно для 
            цілей, викладених у цій Політиці конфіденційності. Ми також можемо 
            зберігати дані для дотримання правових зобов'язань, вирішення спорів 
            та забезпечення виконання наших угод.
          </Text>

          <Text style={styles.sectionTitle}>{t('internationalTransfers')}</Text>
          <Text style={styles.paragraph}>
            Ваша інформація, включаючи особисті дані, може оброблятися на 
            комп'ютерах, розташованих поза вашою країною, де закони про захист 
            даних можуть відрізнятися. Ми вживаємо заходів для забезпечення 
            належного захисту ваших даних під час таких передач.
          </Text>

          <Text style={styles.sectionTitle}>{t('changesPrivacyPolicy')}</Text>
          <Text style={styles.paragraph}>
            Ми можемо оновлювати нашу Політику конфіденційності час від часу. 
            Ми повідомимо вас про будь-які зміни, опублікувавши нову Політику 
            конфіденційності у додатку. Ми також повідомимо вас електронною 
            поштою та/або через помітне повідомлення у додатку до того, як зміни 
            набудуть чинності.
          </Text>

          <Text style={styles.sectionTitle}>{t('contactInformation')}</Text>
          <Text style={styles.paragraph}>
            Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, 
            зв'яжіться з нами:
            {'\n\n'}Email: privacy@productquality.app
            {'\n'}Телефон: +380 (44) 123-45-67
            {'\n'}Адреса: м. Київ, вул. Хрещатик, 1
            {'\n\n'}Ви також можете зв'язатися з нами через форму зворотного зв'язку 
            у додатку.
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

export default PrivacyPolicyScreen; 