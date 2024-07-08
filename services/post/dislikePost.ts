import Api from '../api';

const api = new Api({});

export async function dislikePost(postId: number): Promise<void> {
  try {
    await api.patch<null, void>(null, {
      url: `/post/dislike/${postId}`,
    });
  } catch (error) {
    console.error('Error disliking post:', error);
    throw error;
  }
}
