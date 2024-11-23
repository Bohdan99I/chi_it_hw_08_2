import axiosInstance from './axiosInstance';
import { IComment } from '../types';

export const commentActions = {
  getComments: async (postId: number, page: number = 1, limit: number = 10): Promise<{ comments: IComment[], total: number }> => {
    const response = await axiosInstance.get(`/api/exhibits/${postId}/comments?page=${page}&limit=${limit}`);
    console.log('Get Comments Response:', response.data);
    const comments = response.data.data || [];
    const total = response.data.total || comments.length;
    return { comments, total };
  },

  createComment: async (postId: number, content: string): Promise<IComment> => {
    const response = await axiosInstance.post(`/api/exhibits/${postId}/comments`, { content });
    console.log('Create Comment Response:', response.data);
    return response.data;
  },

  updateComment: async (postId: number, commentId: number, content: string): Promise<IComment> => {
    const response = await axiosInstance.put(`/api/exhibits/${postId}/comments/${commentId}`, { content });
    console.log('Update Comment Response:', response.data);
    return response.data;
  },

  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/exhibits/${postId}/comments/${commentId}`);
    console.log('Comment deleted successfully');
  }
};
