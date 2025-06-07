import { Alert } from 'react-native';
import { t } from './translations';



interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

interface SimpleAlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
}


export const showSuccess = (message: string, onPress?: () => void) => {
  Alert.alert(
    '✅ Успіх',
    message,
    [
      { 
        text: 'Гаразд', 
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};


export const showError = (message: string, onPress?: () => void) => {
  Alert.alert(
    '❌ Помилка',
    message,
    [
      { 
        text: 'Зрозуміло', 
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};


export const showWarning = (message: string, onPress?: () => void) => {
  Alert.alert(
    '⚠️ Попередження',
    message,
    [
      { 
        text: 'Зрозуміло', 
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};


export const showInfo = (message: string, onPress?: () => void) => {
  Alert.alert(
    'ℹ️ Інформація',
    message,
    [
      { 
        text: 'Гаразд', 
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};


export const showConfirm = (options: ConfirmDialogOptions) => {
  const {
    title,
    message,
    confirmText = 'Підтвердити',
    cancelText = 'Скасувати',
    onConfirm,
    onCancel,
    destructive = false
  } = options;

  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm
      }
    ]
  );
};


export const showDeleteConfirm = (itemName: string, onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '🗑️ Видалення',
    message: `Ви впевнені, що хочете видалити "${itemName}"?\n\nЦю дію неможливо скасувати.`,
    confirmText: 'Видалити',
    cancelText: 'Скасувати',
    onConfirm,
    onCancel,
    destructive: true
  });
};


export const showLogoutConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '🚪 Вихід',
    message: 'Ви впевнені, що хочете вийти з облікового запису?',
    confirmText: 'Вийти',
    cancelText: 'Залишитися',
    onConfirm,
    onCancel
  });
};


export const showDeleteAccountConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '⚠️ Видалення облікового запису',
    message: 'Ви впевнені, що хочете НАЗАВЖДИ видалити свій обліковий запис?\n\nВсі ваші дані будуть втрачені безповоротно!\n\nЦя дія не може бути скасована.',
    confirmText: 'Видалити назавжди',
    cancelText: 'Скасувати',
    onConfirm,
    onCancel,
    destructive: true
  });
};


export const showSaveConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '💾 Збереження',
    message: 'Зберегти зміни?',
    confirmText: 'Зберегти',
    cancelText: 'Скасувати',
    onConfirm,
    onCancel
  });
};


export const showUnsavedChangesConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '⚠️ Незбережені зміни',
    message: 'У вас є незбережені зміни. Ви впевнені, що хочете вийти без збереження?',
    confirmText: 'Вийти без збереження',
    cancelText: 'Повернутися',
    onConfirm,
    onCancel,
    destructive: true
  });
};


export const showRefreshConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '🔄 Оновлення',
    message: 'Оновити дані? Незбережені зміни можуть бути втрачені.',
    confirmText: 'Оновити',
    cancelText: 'Скасувати',
    onConfirm,
    onCancel
  });
};


export const showClearCacheConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '🧹 Очищення кешу',
    message: 'Очистити кеш додатку? Це може покращити швидкодію, але деякі дані доведеться завантажити заново.',
    confirmText: 'Очистити',
    cancelText: 'Скасувати',
    onConfirm,
    onCancel
  });
};


export const showSubmitConfirm = (formName: string, onConfirm: () => void, onCancel?: () => void) => {
  showConfirm({
    title: '📤 Відправка',
    message: `Відправити ${formName}?`,
    confirmText: 'Відправити',
    cancelText: 'Перевірити ще раз',
    onConfirm,
    onCancel
  });
};


export const showNetworkError = (onRetry?: () => void) => {
  const buttons = onRetry 
    ? [
        { text: 'Скасувати', style: 'cancel' as const },
        { text: 'Спробувати знову', onPress: onRetry }
      ]
    : [{ text: 'Зрозуміло' }];

  Alert.alert(
    '🌐 Помилка мережі',
    'Не вдалося підключитися до сервера. Перевірте з\'єднання з інтернетом.',
    buttons
  );
};


export const showAuthError = (onRetry?: () => void) => {
  const buttons = onRetry 
    ? [
        { text: 'Скасувати', style: 'cancel' as const },
        { text: 'Увійти знову', onPress: onRetry }
      ]
    : [{ text: 'Зрозуміло' }];

  Alert.alert(
    '🔐 Помилка авторизації',
    'Сесія застаріла або недійсна. Увійдіть в обліковий запис знову.',
    buttons
  );
};


export const showLoadError = (itemName: string, onRetry?: () => void) => {
  const buttons = onRetry 
    ? [
        { text: 'Скасувати', style: 'cancel' as const },
        { text: 'Спробувати знову', onPress: onRetry }
      ]
    : [{ text: 'Зрозуміло' }];

  Alert.alert(
    '📥 Помилка завантаження',
    `Не вдалося завантажити ${itemName}.`,
    buttons
  );
};


export const showSaveSuccess = (itemName: string, onPress?: () => void) => {
  showSuccess(`${itemName} успішно збережено!`, onPress);
};


export const showDeleteSuccess = (itemName: string, onPress?: () => void) => {
  showSuccess(`${itemName} успішно видалено!`, onPress);
};


export const showSubmitSuccess = (itemName: string, onPress?: () => void) => {
  showSuccess(`${itemName} успішно відправлено!`, onPress);
}; 