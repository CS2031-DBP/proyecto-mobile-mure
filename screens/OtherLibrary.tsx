import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, ActivityIndicator } from 'react-native';
import { PlaylistResponse } from '@/interfaces/Playlist';
import { getPlaylistsByUserId } from '@/services/playlist/getPlaylistsByUserId';
import Playlist from '@/components/Playlist';
import { RouteProp, useRoute } from '@react-navigation/native';

interface OtherLibraryRouteParams {
  userId: number;
}

export default function OtherLibrary() {
  const route = useRoute<RouteProp<{ params: OtherLibraryRouteParams }, 'params'>>();
  const { userId } = route.params;
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const size = 6;

  const loadPlaylists = async (currentPage: number, reset: boolean = false) => {
    setLoading(true);

    try {
      const playlistsData = await getPlaylistsByUserId(userId, currentPage, size);
      if (playlistsData.length < size) {
        setHasMore(false);
      }
      setPlaylists((prevPlaylists) => reset ? playlistsData : [...new Set([...prevPlaylists, ...playlistsData])]);
    } catch (error) {
      setErrors('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setPlaylists([]);
    loadPlaylists(0, true);
  }, [userId]);

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPlaylists(nextPage);
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMore();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 16 }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {errors ? (
          <Text style={{ color: 'red' }}>{errors}</Text>
        ) : (
          playlists.map((playlist) => (
            <Playlist key={playlist.id} playlist={playlist} onDelete={() => loadPlaylists(0, true)} />
          ))
        )}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
    </SafeAreaView>
  );
}
