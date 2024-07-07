import React, { useState, useEffect, useCallback } from "react";
import {
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	View,
	Text,
	Alert,
} from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
	useRoute,
	useFocusEffect,
} from "@react-navigation/native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { UserResponse } from "@/interfaces/User";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { deleteFriend } from "@/services/friend/deleteFriend";
import { addFriend } from "@/services/friend/addFriend";
import { useUserContext } from "@/contexts/UserContext";

export default function FriendList() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const route = useRoute();
	const { friendIds } = route.params as { friendIds: number[] };
	const [friends, setFriends] = useState<UserResponse[]>([]);
	const { user: currentUser, refreshUser } = useUserContext();
	const [errors, setErrors] = useState<string | null>(null);

	const loadFriends = async () => {
		try {
			const friendsData = await getUserFriends(friendIds);
			setFriends(friendsData);
		} catch (error) {
			setErrors("Failed to load friends data");
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadFriends();
		}, [friendIds])
	);

	useEffect(() => {
		(async () => {
			await refreshUser();
			loadFriends();
		})();
	}, []);

	const handleFriendPress = (friendId: number) => {
		if (currentUser && friendId === currentUser.id) {
			navigation.navigate("Profile");
		} else {
			navigation.navigate("UserProfile", { userId: friendId });
		}
	};

	const handleDeleteFriend = async (friendId: number) => {
		Alert.alert(
			"Remove Friend",
			"Are you sure you want to remove this friend?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Remove",
					onPress: async () => {
						try {
							await deleteFriend(friendId);
							const updatedFriends = friends.filter(
								(friend) => friend.id !== friendId
							);
							setFriends(updatedFriends);
							await refreshUser();
							navigation.navigate("Profile");
							Alert.alert(
								"Friend Removed",
								"You have successfully removed this friend."
							);
						} catch (error) {
							setErrors("Failed to remove friend");
						}
					},
				},
			]
		);
	};

	const handleAddFriend = async (friendId: number) => {
		try {
			await addFriend(friendId);
			await refreshUser();
			loadFriends();
			Alert.alert(
				"Friend Added",
				"You have successfully added this user as a friend."
			);
		} catch (error) {
			setErrors("Failed to add friend");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 16, marginTop: 16 }}>
				{errors ? (
					<Text
						style={{
							color: "red",
							textAlign: "center",
							marginBottom: 16,
						}}
					>
						{errors}
					</Text>
				) : null}
				{friends.length > 0 ? (
					friends.map((friend) => (
						<TouchableOpacity
							key={friend.id}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 16,
								padding: 16,
								backgroundColor: "#f9f9f9",
								borderRadius: 8,
							}}
							onPress={() => handleFriendPress(friend.id)}
						>
							<View>
								<Avatar.Image
									size={60}
									source={{ uri: friend.profileImageUrl }}
								/>
								{currentUser.id !== friend.id && (
									<IconButton
										icon={
											currentUser.friendsIds.includes(
												friend.id
											)
												? "trash-can"
												: "plus"
										}
										size={15}
										onPress={() => {
											if (
												currentUser.friendsIds.includes(
													friend.id
												)
											) {
												handleDeleteFriend(friend.id);
											} else {
												handleAddFriend(friend.id);
											}
										}}
										style={{
											position: "absolute",
											top: -15,
											right: -15,
											backgroundColor: "#B0ACAC",
										}}
									/>
								)}
							</View>
							<View style={{ flex: 1, marginLeft: 16 }}>
								<Text
									style={{ fontSize: 18, fontWeight: "bold" }}
								>
									{friend.name}
								</Text>
								<Text style={{ color: "gray" }}>
									{friend.birthDate}
								</Text>
							</View>
							<View style={{ alignItems: "flex-end" }}>
								<Text>{friend.friendsIds.length} Friends</Text>
								<Button
									mode="outlined"
									onPress={() => handleFriendPress(friend.id)}
									style={{ marginTop: 8 }}
								>
									View Profile
								</Button>
							</View>
						</TouchableOpacity>
					))
				) : (
					<Text>No friends found</Text>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
