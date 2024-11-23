import { IPost } from '../types';
import axiosInstance from './axiosInstance';
import authAxiosInstance from './authAxiosInstance';
import { API_ENDPOINTS } from '../config/api';

export const exhibitActions = {
  getAllPosts: async (page: number = 1, limit: number = 10): Promise<{ posts: IPost[], total: number }> => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_EXHIBITS}?page=${page}&limit=${limit}`);
      const posts = response.data.data || [];
      const total = response.data.total || posts.length;
      return { posts, total };
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      throw error;
    }
  },

  getMyPosts: async (page: number = 1, limit: number = 10): Promise<{ posts: IPost[], total: number }> => {
    try {
      const response = await authAxiosInstance.get(`${API_ENDPOINTS.GET_MY_EXHIBITS}?page=${page}&limit=${limit}`);
      const posts = response.data.data || [];
      const total = response.data.total || posts.length;
      return { posts, total };
    } catch (error) {
      console.error('Error in getMyPosts:', error);
      throw error;
    }
  },

  getPostById: async (id: number): Promise<IPost> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_EXHIBIT(id));
      return response.data;
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  },

  createPost: async (formData: FormData): Promise<IPost> => {
    try {
      console.log('Token before create post:', localStorage.getItem('token')); 
      console.log('Headers:', authAxiosInstance.defaults.headers); 
      const response = await authAxiosInstance.post(API_ENDPOINTS.CREATE_EXHIBIT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Create post response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  },

  updatePost: async (id: number, data: Partial<IPost>): Promise<IPost> => {
    try {
      const response = await authAxiosInstance.put(`/api/exhibits/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  },

  deletePost: async (id: number): Promise<void> => {
    try {
      await authAxiosInstance.delete(API_ENDPOINTS.DELETE_EXHIBIT(id));
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  },

  addComment: async (postId: number, content: string) => {
    console.log('Adding comment:', { postId, content });
    const response = await authAxiosInstance.post(API_ENDPOINTS.CREATE_COMMENT(postId), { text: content });
    console.log('Comment response:', response.data);
    return response.data;
  },

  getComments: async (postId: number) => {
    console.log('Getting comments for post:', postId);
    const response = await axiosInstance.get(API_ENDPOINTS.GET_COMMENTS(postId));
    console.log('Comments response:', response.data);
    return response.data;
  },

  deleteComment: async (postId: number, commentId: number) => {
    await authAxiosInstance.delete(API_ENDPOINTS.DELETE_COMMENT(postId, commentId));
  },

  updateComment: async (postId: number, commentId: number, content: string) => {
    const response = await authAxiosInstance.put(`/api/exhibits/${postId}/comments/${commentId}`, {
      content
    });
    return response.data;
  }
};
