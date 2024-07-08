import Api from '../api';

const api = new Api({});

export async function deletePostById(postId: number) {
  try {
    const response = await api.delete({
      url: `/post/${postId}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
