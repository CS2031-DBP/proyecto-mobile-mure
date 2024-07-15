import React, { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useFocusEffect, RouteProp, useRoute } from "@react-navigation/native";
import { SongResponse } from "./interfaces/SongResponse";
import { getFavoriteSongs } from "./services/getFavoriteSongs";
import MediaCard from "@components/MediaCard";

interface FavoriteSongsRouteProps {
	userId: number;
}

export default function FavoriteSongs() {
	const route =
		useRoute<RouteProp<{ params: FavoriteSongsRouteProps }, "params">>();
	const { userId } = route.params;
	const [favoriteSongs, setFavoriteSongs] = useState<SongResponse[]>([]);

	const loadFavoriteSongs = async () => {
		if (userId) {
			const songs = await getFavoriteSongs(userId);
			setFavoriteSongs(songs);
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadFavoriteSongs();
		}, [userId])
	);

	return (
		<SafeAreaView style={{ flex: 1, marginTop: 16 }}>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{favoriteSongs.length === 0 ? (
					<Text
						style={{
							color: "gray",
							textAlign: "center",
							marginTop: 16,
						}}
					>
						This playlist is empty
					</Text>
				) : (
					favoriteSongs.map((song) => (
						<View key={song.id} style={{ marginBottom: 8 }}>
							<MediaCard mediaId={Number(song.id)} type="song" />
						</View>
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
