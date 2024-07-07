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
import { getRoleFromToken } from "@/services/auth/getRoleFromToken";
import { Button } from "react-native-paper";

interface PlaylistProps {
	playlist: PlaylistResponse;
	onDelete: () => void;
}

export default function Playlist({ playlist, onDelete }: PlaylistProps) {
	const { user } = useUserContext();
	const [songs, setSongs] = useState<SongResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const userRole = await getRoleFromToken();
				setRole(userRole);
				console.log("Fetched user role:", userRole);
			} catch (error) {
				console.error("Failed to fetch role", error);
			}
		};
		fetchRole();
	}, []);

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

	const handleDelete = async () => {
		try {
			await deletePlaylist(playlist.id);
			Alert.alert("Success", "Playlist deleted successfully");
			onDelete();
		} catch (error) {
			Alert.alert("Error", "Failed to delete playlist");
			console.error(
				`Failed to delete playlist with id ${playlist.id}`,
				error
			);
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
		<View
			style={{
				padding: 16,
				marginBottom: 16,
				backgroundColor: "#fff",
				borderRadius: 8,
				gap: 20,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 8,
						}}
					>
						{playlist.name}
					</Text>
					{user?.id !== playlist.userId && (
						<Text
							style={{
								fontSize: 16,
								color: "gray",
								marginBottom: 16,
							}}
						>
							by {user?.name}
						</Text>
					)}
				</View>
				{(user?.id === playlist.userId || role === "ROLE_ADMIN") && (
					<View style={{ flexDirection: "row" }}>
						<Button
							mode="contained"
							onPress={handleEdit}
							style={{ marginRight: 8 }}
						>
							Edit
						</Button>
						<Button mode="contained" onPress={handleDelete}>
							Delete
						</Button>
					</View>
				)}
			</View>
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
