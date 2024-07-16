import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";
import {
	NavigationProp,
	ParamListBase,
	RouteProp,
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { PlaylistResponse } from "./interfaces/PlaylistResponse";
import { deletePlaylistById } from "./services/deletePlaylistById";
import { getPlaylistById } from "./services/getPlaylistById";
import Playlist from "./components/Playlist";
import { useUserContext } from "@contexts/UserContext";
import { getRoleFromToken } from "@services/getRoleFromToken";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

type PlaylistPageRouteParams = {
	playlistId: number;
};

export default function PlaylistScreen() {
	const route =
		useRoute<RouteProp<{ params: PlaylistPageRouteParams }, "params">>();
	const { playlistId } = route.params;
	const { user } = useUserContext();
	const [role, setRole] = useState<string | null>(null);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const isCurrentUser = user?.id === playlist?.userId;

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const userRole = await getRoleFromToken();
				setRole(userRole);
			} catch (error) {
				console.error("Failed to fetch role", error);
			}
		};
		fetchRole();
	}, []);

	const isAdmin = role === "ROLE_ADMIN";

	const handleEdit = () => {
		navigation.navigate("EditPlaylistScreen", { playlist });
	};

	const handleDelete = () => {
		Alert.alert(
			"Delete playlist",
			"Are you sure you want to delete this playlist?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: async () => {
						try {
							await deletePlaylistById(playlistId);
							navigation.navigate("MainScreen", {
								screen: "LibraryScreen",
							});
						} catch (error) {
							showMessage({
								message: "Failed to delete playlist",
								type: "danger",
							});
						}
					},
				},
			]
		);
	};

	const fetchPlaylist = async () => {
		try {
			const playlistData = await getPlaylistById(playlistId);
			setPlaylist(playlistData);
		} catch (error) {
			setError("Failed to load playlist");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPlaylist();
	}, [playlistId]);

	useFocusEffect(
		useCallback(() => {
			fetchPlaylist();
		}, [playlistId])
	);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	if (error) {
		return <Text style={{ color: "red" }}>{error}</Text>;
	}

	if (!playlist) {
		return <Text>Playlist not found</Text>;
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.colors.background }}
		>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View style={{ alignItems: "center", marginTop: 16 }}>
					<Image
						source={{ uri: playlist.coverImageUrl }}
						style={{
							width: 180,
							height: 180,
							borderRadius: 8,
						}}
					/>
					<Text
						style={{
							fontSize: 24,
							fontWeight: "bold",
							marginTop: 16,
							textAlign: "center",
						}}
					>
						{playlist.name}
					</Text>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 16,
							width: "50%",
							justifyContent: "space-between",
						}}
					>
						{(isCurrentUser || isAdmin) && (
							<View>
								<IconButton
									icon="delete"
									size={24}
									onPress={handleDelete}
									iconColor={theme.colors.primary}
								/>
							</View>
						)}
						<Text
							style={{
								fontSize: 16,
								color: "gray",
							}}
						>
							by {playlist.nickname}
						</Text>
						{(isCurrentUser || isAdmin) && (
							<View>
								<IconButton
									icon="pencil"
									size={24}
									onPress={handleEdit}
									iconColor={theme.colors.primary}
								/>
							</View>
						)}
					</View>
				</View>
				<Playlist playlist={playlist} />
			</ScrollView>
		</SafeAreaView>
	);
}
