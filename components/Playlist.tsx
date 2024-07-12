import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { PlaylistResponse } from "@/interfaces/Playlist";
import { getSongById } from "@/services/song/getSongById";
import { deletePlaylist } from "@/services/playlist/deletePlaylist";
import { SongResponse } from "@/interfaces/Song";
import MediaCard from "@/components/MediaCard";
import { useUserContext } from "@/contexts/UserContext";
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
} from "@react-navigation/native";
import { IconButton } from "react-native-paper";

interface PlaylistProps {
    playlist: PlaylistResponse;
    onDelete: () => void;
    isCurrentUser: boolean;
    isAdmin: boolean;
}

export default function Playlist({ playlist, onDelete, isCurrentUser, isAdmin }: PlaylistProps) {
    const { user } = useUserContext();
    const [songs, setSongs] = useState<SongResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    useEffect(() => {
        const loadSongs = async () => {
            try {
                const songsData = await Promise.all(
                    playlist.songsIds.map(async (id) => {
                        try {
                            const song = await getSongById(id);
                            return song;
                        } catch (error) {
                            console.error(`Failed to load song with id ${id}`, error);
                            return null;
                        }
                    })
                );
                setSongs(songsData.filter((song) => song !== null) as SongResponse[]);
            } catch (error) {
                setError("Failed to load songs");
            } finally {
                setLoading(false);
            }
        };

        loadSongs();
    }, [playlist.songsIds]);

    const handleDelete = async () => {
        try {
            await deletePlaylist(playlist.id);
            Alert.alert("Success", "Playlist deleted successfully");
            onDelete();
        } catch (error) {
            Alert.alert("Error", "Failed to delete playlist");
            console.error(`Failed to delete playlist with id ${playlist.id}`, error);
        }
    };

    const handleEdit = () => {
        navigation.navigate("EditPlaylist", { playlist });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={{ color: "red" }}>{error}</Text>;
    }

    return (
        <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, gap: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>{playlist.name}</Text>
                    {user?.id !== playlist.userId && (
                        <Text style={{ fontSize: 16, color: "gray", marginBottom: 16 }}>
                            by {user?.nickname}
                        </Text>
                    )}
                </View>
                {(isCurrentUser || isAdmin) && (
                    <View style={{ flexDirection: "row" }}>
                        <IconButton icon="pencil" size={20} onPress={handleEdit} iconColor="#750B97" />
                        <IconButton icon="delete" size={20} onPress={handleDelete} iconColor="#750B97" />
                    </View>
                )}
            </View>
            {songs.length === 0 ? (
                <Text style={{ color: "gray", textAlign: "center", marginTop: 16 }}>This playlist is empty</Text>
            ) : (
                songs.map((song) => (
                    <MediaCard key={song.id} mediaId={Number(song.id)} type="song" />
                ))
            )}
        </View>
    );
}
