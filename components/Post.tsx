// Post.tsx
import React, { useEffect, useState } from 'react';
import { Image, Text, View, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import { PostResponse } from '@/interfaces/Post';
import { UserResponse } from '@/interfaces/User';
import { getUserById } from '@/services/profile/getUserById';
import { useUserContext } from '@/contexts/UserContext';

interface PostProps {
  post: PostResponse;
}

export default function Post({ post }: PostProps) {
  const { user } = useUserContext();
  const [postOwner, setPostOwner] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
          const userData = await getUserById(post.ownerId);
          setPostOwner(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [post.ownerId, user?.id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 1,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
 
          <Avatar.Image
            size={40}
            source={postOwner?.profileImageUrl ? { uri: postOwner.profileImageUrl } : require("@/assets/favicon.png")}
          />
        <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: 'bold' }}>{post.owner}</Text>
      </View>
      <Text style={{ fontSize: 14, marginBottom: 12 }}>{post.description}</Text>
      {post.imageUrl ? (
        <Image style={{ width: '100%', height: 200, borderRadius: 8 }} source={{ uri: post.imageUrl }} />
      ) : null}
    </View>
  );
}
