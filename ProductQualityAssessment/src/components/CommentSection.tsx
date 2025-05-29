import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
  
  useEffect(() => {
    dispatch(fetchProductComments(productId))
      .then((action) => {
        if (action.payload && typeof action.payload === 'object' && 'comments' in action.payload) {
          console.log('Fetched comments:', action.payload.comments);
        }
      });
  }, [dispatch, productId]);
  
  const comments = productComments[productId] || [];
  
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
          <Text style={styles.userName}>{item.userName}</Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={item.rating}
              size={12}
              showRating={false}
              isDisabled
            />
          </View>
        </View>
        
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        
        {isAdmin && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              const safeCommentId = commentId;
              console.log('CommentID при натисканні на видалення:', safeCommentId, typeof safeCommentId);
              handleDeleteComment(safeCommentId);
            }}
          >
            <Text style={styles.deleteButtonText}>{t('deleteComment')}</Text>
          </TouchableOpacity>
        )}
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
          
          <TextInput
            style={styles.commentInput}
            placeholder={t('commentPlaceholder')}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddComment}
            disabled={loading || newComment.trim() === '' || rating === 0}
          >
            <Text style={styles.submitButtonText}>{t('submitComment')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.commentsListContainer}>
        <Text style={styles.commentsListTitle}>{t('allComments')}</Text>
        
        {comments.length === 0 ? (
          <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsText}>{t('noComments')}</Text>
            <Text style={styles.beFirstText}>{t('beFirstToComment')}</Text>
          </View>
        ) : (
          <View style={styles.commentsList}>
            {comments.map(item => renderComment(item))}
          </View>
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
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginTop: 8,
    backgroundColor: '#fff',
    fontSize: 14,
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
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentsListContainer: {
    marginTop: 8,
  },
  commentsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#34572a',
  },
  commentsList: {
    maxHeight: 400,
  },
  commentContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34572a',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#34572a',
  },
  commentText: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
    color: '#333',
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '500',
  },
  noCommentsContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginTop: 16,
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