import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { PlaylistResponse } from '@/interfaces/Playlist';
import { getPlaylistsByUserId } from '@/services/playlist/getPlaylistByUserId';
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

    const loadPlaylists = async () => {
        try {
            const playlistsData = await getPlaylistsByUserId(userId);
            setPlaylists(playlistsData);
        } catch (error) {
            setErrors('Failed to load playlists');
        }
    };

    useEffect(() => {
        loadPlaylists();
    }, [userId]);

    const handleDelete = () => {
        loadPlaylists();
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 16 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {errors ? (
                    <Text style={{ color: 'red' }}>{errors}</Text>
                ) : (
                    playlists.map((playlist) => (
                        <Playlist key={playlist.id} playlist={playlist} onDelete={handleDelete}/>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
