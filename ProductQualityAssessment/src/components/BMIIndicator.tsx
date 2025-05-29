import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../utils/translations';

interface BMIIndicatorProps {
  bmi: number;
  weight?: number;
  height?: number;
}

const BMIIndicator: React.FC<BMIIndicatorProps> = ({ bmi, weight, height }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const getBMIStatus = (bmi: number): string => {
    if (bmi < 18.5) return t('underweight');
    if (bmi < 25) return t('healthy');
    if (bmi < 30) return t('overweight');
    return t('obese');
  };

  const getBMIColor = (bmi: number): string => {
    if (bmi < 18.5) return '#3498db';
    if (bmi < 25) return '#2ecc71';
    if (bmi < 30) return '#f39c12';
    return '#e74c3c';
  };

  const getBMIPosition = (bmi: number): number => {
   
    if (bmi < 18.5) {
      return Math.max(0, Math.min(25, (bmi / 18.5) * 25));
    } else if (bmi < 25) {
      return 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
      return 50 + ((bmi - 25) / (30 - 25)) * 25;
    } else {
      return Math.min(100, 75 + ((bmi - 30) / 10) * 25);
    }
  };

  const getArrowColorByPosition = (position: number): string => {
    if (position < 25) return '#3498db'; 
    if (position < 50) return '#2ecc71'; 
    if (position < 75) return '#f39c12'; 
    return '#e74c3c'; 
  };

  const getBMIInfo = (): string => {
    return `${t('bmiInfo')}\n\n${t('currentBMI')}: ${bmi.toFixed(1)}`;
  };

  if (!weight || !height || bmi === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('yourBMI')}</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Ionicons name="information-circle-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.noDataText}>
            {t('fillYourPersonalData')}
          </Text>
        </View>
        
        <Modal
          visible={showInfoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('whatIsBMI')}</Text>
              <Text style={styles.modalText}>{getBMIInfo()}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('understood')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('yourBMI')}</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowInfoModal(true)}
        >
          <Ionicons name="information-circle-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.status}>
            {t('yourWeightIs')} <Text style={[styles.statusValue, { color: getBMIColor(bmi) }]}>
              {getBMIStatus(bmi)}
            </Text>
          </Text>
        </View>
        
        <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
        
   
        <View style={styles.scaleContainer}>
          <View style={styles.scale}>
            <View style={[styles.scaleBar, { backgroundColor: '#3498db' }]} />
            <View style={[styles.scaleBar, { backgroundColor: '#2ecc71' }]} />
            <View style={[styles.scaleBar, { backgroundColor: '#f39c12' }]} />
            <View style={[styles.scaleBar, { backgroundColor: '#e74c3c' }]} />
          </View>
          
       
          <View style={[
            styles.arrowPointer, 
            { 
              left: `${getBMIPosition(bmi)}%`,
            }
          ]}>
            <View style={[styles.arrowTriangle, { borderTopColor: getArrowColorByPosition(getBMIPosition(bmi)) }]} />
          </View>
        </View>
        
        <View style={styles.labels}>
          <Text style={styles.label}>{t('underweight')}</Text>
          <Text style={styles.label}>{t('healthy')}</Text>
          <Text style={styles.label}>{t('overweight')}</Text>
          <Text style={styles.label}>{t('obese')}</Text>
        </View>
      </View>
      
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('whatIsBMI')}</Text>
            <Text style={styles.modalText}>{getBMIInfo()}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>{t('understood')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontWeight: 'bold',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scaleContainer: {
    position: 'relative',
  },
  scale: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  scaleBar: {
    flex: 1,
    height: '100%',
  },
  arrowPointer: {
    position: 'absolute',
    top: -12,
    width: 0,
    height: 0,
    transform: [{ translateX: -5 }],
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BMIIndicator; 