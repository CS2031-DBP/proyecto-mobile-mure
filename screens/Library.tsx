import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { PlaylistResponse } from '@/interfaces/Playlist';
import { getPlaylistsByUserId } from '@/services/playlist/getPlaylistByUserId';
import Playlist from '@/components/Playlist';
import { useUserContext } from '@/contexts/UserContext';
import { FAB, Portal, Provider } from 'react-native-paper';
import { NavigationProp, ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';

export default function Library() {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const userContext = useUserContext();
  const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const isFocused = useIsFocused();

  const loadPlaylists = async () => {
    if (!userContext.user) {
      setErrors('User data not loaded');
      return;
    }

    try {
      const playlistsData = await getPlaylistsByUserId(userContext.user.id);
      setPlaylists(playlistsData);
    } catch (error) {
      setErrors('Failed to load playlists');
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadPlaylists();
    }
  }, [userContext.user, isFocused]);

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 , marginTop: 16 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {errors ? (
            <Text style={{ color: 'red' }}>{errors}</Text>
          ) : (
            playlists.map((playlist) => (
              <Playlist key={playlist.id} playlist={playlist} onDelete={loadPlaylists} />
            ))
          )}
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
