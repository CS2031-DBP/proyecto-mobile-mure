import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { PlaylistResponse } from "../interfaces/PlaylistResponse";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { getSongById } from "@features/song/services/getSongById";
import MediaCard from "@components/MediaCard";
import { showMessage } from "react-native-flash-message";

interface PlaylistProps {
	playlist: PlaylistResponse;
}

export default function Playlist(props: PlaylistProps) {
	const [songs, setSongs] = useState<SongResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadSongs = async () => {
			try {
				const songsData = await Promise.all<SongResponse>(
					props.playlist.songsIds.map(async (id) => {
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
				setSongs(songsData.filter((song) => song !== null));
			} catch {
				showMessage({
					message: "Failed to load songs",
					type: "danger",
				});
			} finally {
				setLoading(false);
			}
		};

		loadSongs();
	}, [props.playlist.songsIds]);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
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
