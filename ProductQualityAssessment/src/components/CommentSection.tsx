import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewComment, fetchProductComments, removeComment } from '../redux/slices/commentsSlice';
import { Comment } from '../types/index';
import { t } from '../utils/translations';

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
    dispatch(fetchProductComments(productId));
  }, [dispatch, productId]);
  
  const comments = productComments[productId] || [];
  
  const handleAddComment = () => {
    if (!currentUser) {
      Alert.alert(t('error'), t('featureNotImplemented'));
      return;
    }
    
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
    });
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return;
    }
    
    Alert.alert(
      t('areYouSure'),
      t('thisActionCannot'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('deleteComment'),
          onPress: () => {
            dispatch(removeComment({ commentId, adminId: currentUser.userId }))
              .then(() => {
                Alert.alert(t('success'), t('commentDeleted'));
                dispatch(fetchProductComments(productId));
              });
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const renderComment = ({ item }: { item: Comment }) => {
    const isAdmin = currentUser?.role === 'admin';
    
    return (
      <View style={styles.commentContainer}>
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
            onPress={() => handleDeleteComment(item.commentId)}
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
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.commentId}
            style={styles.commentsList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addCommentContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addCommentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    marginVertical: 12,
    alignItems: 'flex-start',
  },
  ratingLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    height: 100,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsListContainer: {
    marginTop: 8,
  },
  commentsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentsList: {
    maxHeight: 400,
  },
  commentContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 12,
  },
  noCommentsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
  },
  beFirstText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default CommentSection; 