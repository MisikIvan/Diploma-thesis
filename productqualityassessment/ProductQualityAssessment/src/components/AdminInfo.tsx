import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Product } from '../types';
import { formatDate } from '../utils/helpers';
import { t } from '../utils/translations';

interface AdminInfoProps {
  product: Product;
  isVisible: boolean;
}

const AdminInfo: React.FC<AdminInfoProps> = ({ product, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('adminInfo')}</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Product ID:</Text>
        <Text style={styles.value}>{product.productId}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('added')}:</Text>
        <Text style={styles.value}>{formatDate(product.createdAt)}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('lastUpdated')}:</Text>
        <Text style={styles.value}>{formatDate(product.updatedAt)}</Text>
      </View>
      
      {product.createdBy ? (
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('createdBy')}:</Text>
          <Text style={styles.value}>{product.createdBy}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    color: '#856404',
    fontFamily: 'monospace',
  },
});

export default AdminInfo; 