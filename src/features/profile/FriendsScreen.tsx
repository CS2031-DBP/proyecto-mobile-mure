import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Text } from "react-native-paper";
import { useUserContext } from "@contexts/UserContext";
import { UserResponse } from "@interfaces/UserResponse";
import { getUserFriends } from "./services/getUserFriends";
import { deleteFriend } from "@services/friend/deleteFriend";
import FriendList from "@components/FriendList";
import { addFriend } from "@services/friend/addFriend";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

export default function FriendsScreen() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const route = useRoute();
	const { friendIds, userId } = route.params as {
		friendIds: number[];
		userId?: number;
	};
	const { user: currentUser, refreshUser } = useUserContext();
	const [friends, setFriends] = useState<UserResponse[]>([]);
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
		if (currentUser?.id === friendId) {
			navigation.navigate("MainScreen", {
				screen: "ProfileScreen",
				params: { userId: friendId },
			});
		} else {
			navigation.navigate("ProfileScreen", { userId: friendId });
		}
	};

	const handleDeleteFriendCurrentUser = async (friendId: number) => {
		console.log("Deleting friend for current user");
		try {
			await deleteFriend(friendId);
			const updatedFriends = friends.filter(
				(friend) => friend.id !== friendId
			);
			setFriends(updatedFriends);
			await refreshUser();
			showMessage({
				message: "Friend Removed",
				description: "You have successfully removed this friend.",
				type: "success",
			});
		} catch (error) {
			setErrors("Failed to remove friend");
		}
	};

	const handleDeleteFriendOtherUser = async (friendId: number) => {
		console.log("Deleting friend for other user");
		try {
			await deleteFriend(friendId);
			await refreshUser();
			loadFriends();
			showMessage({
				message: "Friend Removed",
				description: "You have successfully removed this friend.",
				type: "success",
			});
		} catch (error) {
			setErrors("Failed to remove friend");
		}
	};

	const handleAddFriend = async (friendId: number) => {
		console.log("Adding friend");
		try {
			await addFriend(friendId);
			await refreshUser();
			loadFriends();
			showMessage({
				message: "Friend Added",
				description:
					"You have successfully added this user as a friend.",
				type: "success",
			});
		} catch (error) {
			setErrors("Failed to add friend");
		}
	};

	const isCurrentUser = userId === currentUser?.id;

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.colors.background }}
		>
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
			<FriendList
				friends={friends}
				currentUser={currentUser}
				onFriendPress={handleFriendPress}
				onAddFriend={handleAddFriend}
				onDeleteFriend={
					isCurrentUser
						? handleDeleteFriendCurrentUser
						: handleDeleteFriendOtherUser
				}
			/>
		</SafeAreaView>
	);
}
