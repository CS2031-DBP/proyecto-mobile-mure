import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { PlaylistResponse } from '@/interfaces/Playlist';
import { getPlaylistsByUserId } from '@/services/playlist/getPlaylistsByUserId';
import Playlist from '@/components/Playlist';
import { useUserContext } from '@/contexts/UserContext';
import { FAB, Portal, Provider } from 'react-native-paper';
import { NavigationProp, ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';

export default function Library() {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const userContext = useUserContext();
  const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<ScrollView>(null);

  const size = 6;

  const loadPlaylists = async (currentPage: number, reset: boolean = false) => {
    if (!userContext.user) {
      setErrors('User data not loaded');
      return;
    }

    setLoading(true);

    try {
      const playlistsData = await getPlaylistsByUserId(userContext.user.id, currentPage, size);
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
    if (isFocused) {
      setPage(0);
      setHasMore(true);
      setPlaylists([]);
      loadPlaylists(0, true);
    }
  }, [userContext.user, isFocused]);

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
    <Provider>
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
        <Portal>
          <FAB.Group
            open={isFabGroupOpen}
            visible
            icon={isFabGroupOpen ? 'close' : 'playlist-plus'}
            actions={[
              {
                icon: 'playlist-plus',
                label: 'Add Playlist',
                onPress: () => navigation.navigate('AddPlaylist'),
              },
            ]}
            onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
          />
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}
