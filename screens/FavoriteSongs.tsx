import React, { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useFocusEffect, RouteProp, useRoute } from "@react-navigation/native";
import { SongResponse } from "@/interfaces/Song";
import { getFavoriteSongs } from "@/services/song/getFavoriteSongs";
import MediaCard from "@/components/MediaCard";
import { useUserContext } from "@/contexts/UserContext";

interface FavoriteSongsRouteProps {
    songs: SongResponse[];
}

export default function FavoriteSongs() {
    const route = useRoute<RouteProp<{ params: FavoriteSongsRouteProps }, "params">>();
    const { user } = useUserContext();
    const [favoriteSongs, setFavoriteSongs] = useState<SongResponse[]>([]);

    const loadFavoriteSongs = async () => {
        if (user) {
            const songs = await getFavoriteSongs(user.id);
            setFavoriteSongs(songs);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavoriteSongs();
        }, [user])
    );

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 16 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {favoriteSongs.length === 0 ? (
                    <Text style={{ color: "gray", textAlign: "center", marginTop: 16 }}>This playlist is empty</Text>
                ) : (
                    favoriteSongs.map((song) => (
                        <View key={song.id} style={{ marginBottom: 8 }}>
                            <MediaCard 
                                mediaId={Number(song.id)} 
                                type="song"
                            />
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}