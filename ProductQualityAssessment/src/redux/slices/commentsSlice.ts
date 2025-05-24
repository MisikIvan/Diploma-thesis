import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../types/index';
import { addComment, getProductComments, deleteComment } from '../../api/firebase';

interface CommentsState {
  productComments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  productComments: {},
  loading: false,
  error: null
};

export const addNewComment = createAsyncThunk(
  'comments/addComment',
  async ({
    productId,
    userId,
    userName,
    userAvatar,
    rating,
    text
  }: {
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: 1 | 2 | 3 | 4 | 5;
    text: string;
  }, { rejectWithValue }) => {
    try {
      const comment = await addComment(productId, userId, userName, userAvatar, rating, text);
      return comment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchProductComments = createAsyncThunk(
  'comments/fetchProductComments',
  async (productId: string, { rejectWithValue }) => {
    try {
      const comments = await getProductComments(productId);
      
   
      const validatedComments = comments.map(comment => {
        if (!comment.commentId) {
     
          console.warn('Comment missing commentId, creating fallback:', comment);
          return {
            ...comment,
            commentId: comment.userId + '_' + comment.createdAt
          };
        }
        return comment;
      });
      
      return { productId, comments: validatedComments };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async ({ commentId, adminId }: { commentId: string; adminId: string }, { rejectWithValue }) => {
    try {
      if (!commentId) {
        console.error('Cannot delete comment: commentId is missing in action payload');
        return rejectWithValue('Missing comment ID');
      }
      
      if (!adminId) {
        console.error('Cannot delete comment: adminId is missing in action payload');
        return rejectWithValue('Missing admin ID');
      }
      
      console.log('Removing comment:', { commentId, adminId });
      await deleteComment(commentId, adminId);
      console.log('Comment successfully marked as deleted');
      return { commentId };
    } catch (error) {
      console.error('Error in removeComment thunk:', error);
      return rejectWithValue((error as Error).message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add comment
      .addCase(addNewComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        const { productId } = action.payload;
        if (!state.productComments[productId]) {
          state.productComments[productId] = [];
        }
        state.productComments[productId].push(action.payload);
      })
      .addCase(addNewComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
     
      .addCase(fetchProductComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductComments.fulfilled, (state, action: PayloadAction<{ productId: string; comments: Comment[] }>) => {
        state.loading = false;
        const { productId, comments } = action.payload;
        state.productComments[productId] = comments;
      })
      .addCase(fetchProductComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    
      .addCase(removeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeComment.fulfilled, (state, action: PayloadAction<{ commentId: string }>) => {
        state.loading = false;
        const { commentId } = action.payload;
        
        if (!commentId) {
          console.error('No comment ID returned from removeComment');
          return;
        }
        
     
        Object.keys(state.productComments).forEach(productId => {
          if (state.productComments[productId]) {
            state.productComments[productId] = state.productComments[productId].filter(
              comment => comment.commentId !== commentId
            );
          }
        });
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCommentsError } = commentsSlice.actions;
export default commentsSlice.reducer; 