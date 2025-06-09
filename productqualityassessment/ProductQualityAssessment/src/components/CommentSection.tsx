import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewComment, fetchProductComments, removeComment } from '../redux/slices/commentsSlice';
import { Comment } from '../types/index';
import { t } from '../utils/translations';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../api/firebase';

interface CommentSectionProps {
  productId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.user);
  const { productComments, loading } = useAppSelector(state => state.comments);
  
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  
  const MAX_COMMENT_LENGTH = 250;
  
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductComments(productId)).then((action) => {
        if (fetchProductComments.fulfilled.match(action)) {
        }
      });
    }
  }, [productId, dispatch]);
  
  const comments = productComments[productId] || [];
  
  const handleCommentChange = (text: string) => {
    if (text.length <= MAX_COMMENT_LENGTH) {
      setNewComment(text);
    }
  };

  const handleAddComment = () => {
    if (!currentUser) {
      Alert.alert(t('error'), t('featureNotImplemented'));
      return;
    }
    
    console.log('User state:', {
      userId: currentUser.userId,
      canComment: currentUser.canComment,
      isBlocked: currentUser.isBlocked,
      role: currentUser.role
    });
    
    if (rating === 0) {
      Alert.alert(t('error'), t('ratingRequired'));
      return;
    }

    if (newComment.trim().length === 0) {
      Alert.alert(t('error'), 'Comment cannot be empty');
      return;
    }

    if (newComment.length > MAX_COMMENT_LENGTH) {
      Alert.alert(t('error'), `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }
    
    dispatch(addNewComment({
      productId,
      userId: currentUser.userId,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      text: newComment
    })).then(() => {
      setNewComment('');
      setRating(0);
      Alert.alert(t('success'), t('commentSuccess'));
    }).catch((error) => {
      console.error('Failed to add comment:', error);
      Alert.alert(t('error'), error.message || t('error'));
    });
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('Cannot delete comment: User is not admin');
      return;
    }
    
    console.log('Delete button clicked for comment ID:', commentId);
    console.log('Comment ID type:', typeof commentId);
    console.log('Comment ID is empty?', commentId === '');
    console.log('Comment ID is undefined?', commentId === undefined);
    
    if (!commentId) {
      console.error('Cannot delete comment: no comment ID provided');
      Alert.alert(t('error'), t('error'));
      return;
    }
    
    Alert.alert(
      t('confirmDelete'),
      t('deleteProductConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('deleteComment'),
          onPress: async () => {
            try {
              console.log('Confirm delete for comment with ID:', commentId);
              await dispatch(removeComment({ 
                commentId, 
                adminId: currentUser.userId 
              }));
              console.log('Comment successfully deleted:', commentId);
              Alert.alert(t('success'), t('commentDeleted'));
              dispatch(fetchProductComments(productId));
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert(t('error'), t('error'));
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const renderComment = (item: Comment) => {
    const isAdmin = currentUser?.role === 'admin';
    
    const commentId = item.commentId || item.userId + '_' + item.createdAt;
    
    if (!item.commentId) {
      console.warn('Comment missing commentId, using fallback:', commentId);
    }
    
    return (
      <View style={styles.commentContainer} key={commentId}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {item.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.userName}</Text>
              <View style={styles.ratingRow}>
                <AirbnbRating
                  count={5}
                  defaultRating={item.rating}
                  size={10}
                  showRating={false}
                  isDisabled
                />
                <Text style={styles.commentDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          
          {isAdmin && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const safeCommentId = commentId;
                console.log('CommentID при натисканні на видалення:', safeCommentId, typeof safeCommentId);
                handleDeleteComment(safeCommentId);
              }}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('comments')}</Text>
      
      {currentUser && currentUser.canComment && !currentUser.isBlocked && (
        <View style={styles.addCommentContainer}>
          <Text style={styles.addCommentTitle}>{t('leaveComment')}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>{t('yourRating')}</Text>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={20}
              showRating={false}
              onFinishRating={(value: number) => setRating(value)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder={t('commentPlaceholder')}
              value={newComment}
              onChangeText={handleCommentChange}
              multiline
              maxLength={MAX_COMMENT_LENGTH}
            />
            <View style={styles.characterCounter}>
              <Text style={[
                styles.characterCountText,
                newComment.length > MAX_COMMENT_LENGTH * 0.9 && styles.characterCountWarning
              ]}>
                {newComment.length}/{MAX_COMMENT_LENGTH}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || newComment.trim() === '' || rating === 0 || newComment.length > MAX_COMMENT_LENGTH) && styles.submitButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={loading || newComment.trim() === '' || rating === 0 || newComment.length > MAX_COMMENT_LENGTH}
          >
            <Text style={styles.submitButtonText}>{t('submitComment')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.commentsListContainer}>
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsListTitle}>{t('allComments')}</Text>
          {comments.length > 3 && (
            <Text style={styles.scrollHint}>↕️ Scroll to view all</Text>
          )}
        </View>
        
        {comments.length === 0 ? (
          <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsText}>{t('noComments')}</Text>
            <Text style={styles.beFirstText}>{t('beFirstToComment')}</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.commentsList}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            indicatorStyle="black"
            scrollIndicatorInsets={{ right: 2 }}
          >
            {comments.map(item => renderComment(item))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#34572a',
  },
  addCommentContainer: {
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#34572a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  addCommentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34572a',
  },
  ratingContainer: {
    marginVertical: 12,
    alignItems: 'flex-start',
  },
  ratingLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: 14,
  },
  characterCounter: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    color: '#666',
  },
  characterCountWarning: {
    color: '#ff6b35',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#5d8402',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentsListContainer: {
    marginTop: 8,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34572a',
  },
  scrollHint: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  commentsList: {
    maxHeight: 500,
    paddingHorizontal: 6,
    marginHorizontal: -6,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 8,
  },
  commentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#34572a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#34572a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#2c2c2c',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4a4a4a',
    marginTop: 4,
  },
  commentDate: {
    color: '#999',
    fontSize: 11,
    marginLeft: 8,
    fontWeight: '400',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  noCommentsContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#34572a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  beFirstText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default CommentSection; 