import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { PlaylistResponse } from "@/interfaces/Playlist";
import { getSongById } from "@/services/song/getSongById";
import { SongResponse } from "@/interfaces/Song";
import MediaCard from "@/src/shared/components/MediaCard";

interface PlaylistProps {
	playlist: PlaylistResponse;
}

export default function Playlist({ playlist }: PlaylistProps) {
	const [songs, setSongs] = useState<SongResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadSongs = async () => {
			try {
				const songsData = await Promise.all(
					playlist.songsIds.map(async (id) => {
						try {
							const song = await getSongById(id);
							return song;
						} catch (error) {
							console.error(
								`Failed to load song with id ${id}`,
								error
							);
							return null;
						}
					})
				);
				setSongs(
					songsData.filter((song) => song !== null) as SongResponse[]
				);
			} catch (error) {
				setError("Failed to load songs");
			} finally {
				setLoading(false);
			}
		};

		loadSongs();
	}, [playlist.songsIds]);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	if (error) {
		return <Text style={{ color: "red" }}>{error}</Text>;
	}

	return (
		<View
			style={{
				padding: 16,
				marginBottom: 16,
				backgroundColor: "#fff",
				borderRadius: 8,
				gap: 20,
			}}
		>
			{songs.length === 0 ? (
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
				songs.map((song) => (
					<MediaCard
						key={song.id}
						mediaId={Number(song.id)}
						type="song"
					/>
				))
			)}
		</View>
	);
}
