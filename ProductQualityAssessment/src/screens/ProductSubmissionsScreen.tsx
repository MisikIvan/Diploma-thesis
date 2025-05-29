import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductSubmission, Product } from '../types';
import { t } from '../utils/translations';
import { useAppSelector } from '../redux/hooks';
import { getSubmissions, getSubmissionsByStatus, updateSubmissionStatus, auth } from '../api/firebase';

interface ProductSubmissionsScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubmissionApproved: (submission: ProductSubmission, productData: Product) => void;
  onSubmissionRejected: (submissionId: string, reason: string) => void;
}

type TabType = 'pending' | 'processed';

const ProductSubmissionsScreen: React.FC<ProductSubmissionsScreenProps> = ({
  visible,
  onClose,
  onSubmissionApproved,
  onSubmissionRejected,
}) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingSubmissions, setPendingSubmissions] = useState<ProductSubmission[]>([]);
  const [processedSubmissions, setProcessedSubmissions] = useState<ProductSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ProductSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [editedProductData, setEditedProductData] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      loadSubmissions();
    }
  }, [visible]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      
     
      const [pending, approved, rejected] = await Promise.all([
        getSubmissionsByStatus('pending'),
        getSubmissionsByStatus('approved'),
        getSubmissionsByStatus('rejected')
      ]);
      
      setPendingSubmissions(pending);
      setProcessedSubmissions([...approved, ...rejected].sort((a, b) => 
        new Date(b.reviewedAt || b.submittedAt).getTime() - new Date(a.reviewedAt || a.submittedAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading submissions:', error);
      Alert.alert('Помилка', 'Не вдалося завантажити заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setEditedProductData(submission.productData);
    setShowDetailModal(true);
  };

  const handleApprove = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setEditedProductData(submission.productData);
    setShowDetailModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedSubmission) return;

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Помилка', 'Потрібна авторизація');
        return;
      }
      
      await updateSubmissionStatus(selectedSubmission.submissionId, 'approved', currentUser.uid);
      
      Alert.alert('Успіх', 'Заявку схвалено та продукт додано до бази даних');
      
      if (onSubmissionApproved) {
        const product: Product = {
          productId: `prod-${Date.now()}`,
          ...selectedSubmission.productData,
          createdBy: currentUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        onSubmissionApproved(selectedSubmission, product);
      }
      
      setShowDetailModal(false);
      setSelectedSubmission(null);
      await loadSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      Alert.alert('Помилка', 'Не вдалося схвалити заявку');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (submission: ProductSubmission) => {
    setSelectedSubmission(submission);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      Alert.alert('Помилка', 'Будь ласка, вкажіть причину відхилення');
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Помилка', 'Потрібна авторизація');
        return;
      }
      
      await updateSubmissionStatus(selectedSubmission.submissionId, 'rejected', currentUser.uid, rejectionReason);
      
      Alert.alert('Успіх', 'Заявку відхилено');
      
      if (onSubmissionRejected) {
        onSubmissionRejected(selectedSubmission.submissionId, rejectionReason);
      }
      
      setShowRejectModal(false);
      setSelectedSubmission(null);
      setRejectionReason('');
      await loadSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      Alert.alert('Помилка', 'Не вдалося відхилити заявку');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'На розгляді';
      case 'approved': return 'Затверджено';
      case 'rejected': return 'Відхилено';
      default: return status;
    }
  };

  const renderSubmissionItem = ({ item }: { item: ProductSubmission }) => (
    <TouchableOpacity
      style={styles.submissionItem}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.submissionHeader}>
        <Image 
          source={{ uri: item.productData.imageUrl }}
          style={styles.submissionImage}
          defaultSource={require('../assets/logo.png')}
        />
        <View style={styles.submissionInfo}>
          <Text style={styles.submissionTitle} numberOfLines={2}>
            {item.productData.name}
          </Text>
          <Text style={styles.submissionUser}>
            {t('submittedBy')}: {item.userDisplayName}
          </Text>
          <Text style={styles.submissionDate}>
            {t('submittedDate')}: {new Date(item.submittedAt).toLocaleDateString('uk-UA')}
          </Text>
          {item.reviewedAt && (
            <Text style={styles.submissionDate}>
              {t('reviewedDate')}: {new Date(item.reviewedAt).toLocaleDateString('uk-UA')}
            </Text>
          )}
        </View>
        <View style={styles.submissionStatus}>
          <View 
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('productSubmissions')}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
              onPress={() => setActiveTab('pending')}
            >
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={activeTab === 'pending' ? '#fff' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                {t('pending')} ({pendingSubmissions.length})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'processed' && styles.activeTab]}
              onPress={() => setActiveTab('processed')}
            >
              <Ionicons 
                name="checkmark-done-outline" 
                size={20} 
                color={activeTab === 'processed' ? '#fff' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'processed' && styles.activeTabText]}>
                {t('processed')} ({processedSubmissions.length})
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>{t('loading')}</Text>
            </View>
          ) : (activeTab === 'pending' ? pendingSubmissions : processedSubmissions).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name={activeTab === 'pending' ? "time-outline" : "checkmark-done-outline"} 
                size={64} 
                color="#ccc" 
              />
              <Text style={styles.emptyText}>
                {activeTab === 'pending' ? t('noSubmissions') : t('noSubmissions')}
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'pending' 
                  ? t('noSubmissions')
                  : t('noSubmissions')
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={activeTab === 'pending' ? pendingSubmissions : processedSubmissions}
              renderItem={renderSubmissionItem}
              keyExtractor={(item, index) => {
                const key = item.submissionId && item.submissionId.trim() !== '' 
                  ? item.submissionId 
                  : `submission-${index}-${item.submittedAt}`;
                
                return key;
              }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        visible={showDetailModal} 
        animationType="slide" 
        presentationStyle="pageSheet"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => setShowDetailModal(false)} 
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('reviewSubmission')}</Text>
            <View style={styles.placeholder} />
          </View>

          {selectedSubmission && (
            <ScrollView style={styles.detailContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('submissionInfo')}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Подав: </Text>
                  {selectedSubmission.userDisplayName}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Дата: </Text>
                  {new Date(selectedSubmission.submittedAt).toLocaleString('uk-UA')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Статус: </Text>
                  <Text style={{ color: getStatusColor(selectedSubmission.status) }}>
                    {getStatusText(selectedSubmission.status)}
                  </Text>
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('basicInformation')}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Назва: </Text>
                  {editedProductData?.name}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Бренд: </Text>
                  {editedProductData?.brand || t('notSpecified')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Опис: </Text>
                  {editedProductData?.description || t('notSpecified')}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('images')}</Text>
                {editedProductData?.imageUrl && (
                  <Image 
                    source={{ uri: editedProductData.imageUrl }} 
                    style={styles.detailImage} 
                  />
                )}
                {editedProductData?.additionalImages?.map((url: string, index: number) => (
                  <Image 
                    key={index}
                    source={{ uri: url }} 
                    style={[styles.detailImage, { marginTop: 8 }]} 
                  />
                ))}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('nutritionalValue')}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Калорії: </Text>
                  {editedProductData?.nutriments.calories} ккал
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Білки: </Text>
                  {editedProductData?.nutriments.proteins} г
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Жири: </Text>
                  {editedProductData?.nutriments.fats.total} г
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Вуглеводи: </Text>
                  {editedProductData?.nutriments.carbohydrates.total} г
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('additionalInfo')}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Інгредієнти: </Text>
                  {editedProductData?.ingredients}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Алергени: </Text>
                  {editedProductData?.allergens.join(', ') || t('none')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Теги: </Text>
                  {editedProductData?.tags.join(', ') || t('none')}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>{t('verificationInformation')}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Штрих-код: </Text>
                  {editedProductData?.barcode || t('notSpecified')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Виробник: </Text>
                  {editedProductData?.manufacturer || t('notSpecified')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Країна: </Text>
                  {editedProductData?.countryOfOrigin || t('notSpecified')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Джерело: </Text>
                  {editedProductData?.source || t('notSpecified')}
                </Text>
              </View>

              {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Причина відхилення</Text>
                  <Text style={styles.rejectionText}>
                    {selectedSubmission.rejectionReason}
                  </Text>
                </View>
              )}

              {selectedSubmission.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(selectedSubmission)}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                      {t('approveSubmission')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(selectedSubmission)}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                      {t('rejectSubmission')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rejectModal}>
            <Text style={styles.rejectModalTitle}>{t('rejectionReason')}</Text>
            <TextInput
              style={styles.rejectInput}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Вкажіть причину відхилення..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.rejectModalButtons}>
              <TouchableOpacity 
                style={[styles.rejectModalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.rejectModalButton, styles.confirmRejectButton]}
                onPress={confirmReject}
              >
                <Text style={styles.confirmRejectButtonText}>{t('rejectConfirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  submissionItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f2f5',
  },
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submissionImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  submissionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  submissionUser: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  submissionDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  submissionStatus: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
  },
  detailSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  detailLabel: {
    fontWeight: '700',
    color: '#2E8B57',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    margin: 20,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  approveButton: {
    backgroundColor: '#2E8B57',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectModal: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    width: '90%',
  },
  rejectModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  rejectInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  rejectModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmRejectButton: {
    backgroundColor: '#dc3545',
  },
  confirmRejectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#2E8B57',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  rejectionText: {
    fontSize: 14,
    color: '#dc3545',
    fontStyle: 'italic',
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
});

export default ProductSubmissionsScreen; 