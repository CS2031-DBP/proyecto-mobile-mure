import React, { useEffect, useState } from 'react';
import { View, Text, Image , TouchableOpacity, Linking } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { SongResponse } from '@/interfaces/Song';
import { getSongById } from '@/services/song/getSongById';

interface SongProps {
    songId: number;
}

export default function Song({ songId }: SongProps) {
    const [song, setSong] = useState<SongResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const songData = await getSongById(songId);
                setSong(songData);
            } catch (err) {
                setError(`Failed to load song data for ID ${songId}: ${(err as Error).message}`);
            }
        };

        fetchSong();
    }, [songId]);

    const openLink = () => {
        if (song?.link) {
            Linking.openURL(song.link);
        }
    };

    if (error) {
        return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
    }

    if (!song) {
        return <Text style={{ textAlign: 'center' }}>Loading...</Text>;
    }

    return (
        <Card style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {song.coverImage ? (
                    <Image source={{ uri: song.coverImage }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                ) : (
                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'gray' }} />
                )}
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{song.title}</Text>
                    <Text style={{ color: 'gray' }}>{song.artistsNames.join(', ')}</Text>
                    {song.albumTitle && song.albumTitle.trim() !== '' && (
                        <Text style={{ color: 'gray' }}>{song.albumTitle}</Text>
                    )}
                    <Text style={{ color: 'gray' }}>{song.genre}</Text>
                    <Text style={{ color: 'gray' }}>{song.duration}</Text>
                </View>
                <TouchableOpacity onPress={openLink} style={{ position: 'absolute', right: 0, bottom: 0 }}>
                    <IconButton
                        icon="headphones"
                        size={24}
                        onPress={openLink}
                    />
                </TouchableOpacity>
            </View>
        </Card>
    );
}
