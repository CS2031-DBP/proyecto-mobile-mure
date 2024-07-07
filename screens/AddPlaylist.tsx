import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, View, Alert } from 'react-native';
import { getSongsByTitle } from '@/services/song/getSongsByTitle';
import { createPlaylist } from '@/services/playlist/createPlaylist';
import { SongResponse } from '@/interfaces/Song';
import { PlaylistRequest } from '@/interfaces/Playlist';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

export default function AddPlaylist() {
    const [title, setTitle] = useState('');
    const [songs, setSongs] = useState<SongResponse[]>([]);
    const [selectedSongs, setSelectedSongs] = useState<SongResponse[]>([]);
    const [playlistName, setPlaylistName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const userContext = useUserContext();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const handleSearch = async () => {
        try {
            const songsData = await getSongsByTitle(title, 0, 10);
            setSongs(songsData);
            setError(null);
        } catch (error) {
            setError('That song doesn\'t exist');
        }
    };

    const handleAddSong = (song: SongResponse) => {
        if (!selectedSongs.find(s => s.id === song.id)) {
            setSelectedSongs([...selectedSongs, song]);
        }
    };

    const handleRemoveSong = (songId: string) => {
        setSelectedSongs(selectedSongs.filter(song => song.id !== songId));
    };

    const handleCreatePlaylist = async () => {
        if (!playlistName) {
            setError('Playlist name is required');
            return;
        }

        const songIds = selectedSongs.map(song => Number(song.id));
        const playlistData: PlaylistRequest = {
            name: playlistName,
            userId: userContext.user!.id,
            songsIds: songIds,
        };

        try {
            await createPlaylist(playlistData);
            Alert.alert('Playlist Created', 'Your playlist has been created successfully.');
            navigation.navigate('Library');
        } catch (error) {
            setError('Failed to create playlist');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, marginTop: 32 }}>
            <TextInput
                placeholder="Enter playlist name"
                value={playlistName}
                onChangeText={setPlaylistName}
                style={{ marginBottom: 16, padding: 8, borderColor: 'gray', borderWidth: 1, borderRadius: 4 }}
            />
            <TextInput
                placeholder="Enter song title"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 16, padding: 8, borderColor: 'gray', borderWidth: 1, borderRadius: 4 }}
            />
            <Button title="Search" onPress={handleSearch} />
            {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}

            <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={{ fontSize: 16 }}>{item.title}</Text>
                            <Text style={{ fontSize: 14, color: 'gray' }}>{item.artistsNames.join(', ')}</Text>
                        </View>
                        <Button title="Add" onPress={() => handleAddSong(item)} />
                    </View>
                )}
                ListHeaderComponent={<Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Search Results</Text>}
            />

            <FlatList
                data={selectedSongs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={{ fontSize: 16 }}>{item.title}</Text>
                            <Text style={{ fontSize: 14, color: 'gray' }}>{item.artistsNames.join(', ')}</Text>
                        </View>
                        <Button title="Remove" onPress={() => handleRemoveSong(item.id)} />
                    </View>
                )}
                ListHeaderComponent={<Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Selected Songs</Text>}
            />

            <Button title="Create Playlist" onPress={handleCreatePlaylist} />
        </SafeAreaView>
    );
}
