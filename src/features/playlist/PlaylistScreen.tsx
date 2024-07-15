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
							Alert.alert("Failed to delete playlist");
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
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					paddingTop: 24,
					paddingHorizontal: 4,
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<IconButton
					icon="arrow-left"
					size={20}
					onPress={() => navigation.goBack()}
				/>
				<Text style={{ fontSize: 20, fontWeight: "bold" }}>
					Playlist Details
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginVertical: 16,
					paddingHorizontal: 16,
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						paddingLeft: 64,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 8,
						}}
					>
						{playlist.name}
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: "gray",
							marginBottom: 16,
						}}
					>
						by {playlist.nickname}
					</Text>
					{(isCurrentUser || isAdmin) && (
						<View style={{ flexDirection: "row" }}>
							<IconButton
								icon="pencil"
								size={24}
								onPress={handleEdit}
							/>
							<IconButton
								icon="delete"
								size={24}
								onPress={handleDelete}
							/>
						</View>
					)}
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						paddingRight: 64,
					}}
				>
					{playlist.coverImageUrl ? (
						<Image
							source={{ uri: playlist.coverImageUrl }}
							style={{ width: 160, height: 160, borderRadius: 8 }}
						/>
					) : (
						<Image
							source={require("../../../assets/images/mure-logo-solid-background.jpg")}
							style={{ width: 160, height: 160, borderRadius: 8 }}
						/>
					)}
				</View>
			</View>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<Playlist playlist={playlist} />
			</ScrollView>
		</SafeAreaView>
	);
}
