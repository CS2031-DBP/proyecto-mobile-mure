import Api from '../api';

const api = new Api({});

export async function likePost(postId: number): Promise<void> {
  try {
    await api.patch<null, void>(null, {
      url: `/post/like/${postId}`,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}
