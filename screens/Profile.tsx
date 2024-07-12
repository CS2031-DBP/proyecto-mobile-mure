import React, { useState, useCallback } from "react";
import { SafeAreaView, Text } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import ProfileInfo from "@/components/ProfileInfo";
import { UserResponse } from "@/interfaces/User";
import { getUserById } from "@/services/profile/getUserById";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { useUserContext } from "@/contexts/UserContext";

export default function Profile() {
	const route = useRoute();
	const { userId } = route.params || {};
	const { user: currentUser, refreshUser } = useUserContext();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [friends, setFriends] = useState<UserResponse[]>([]);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [friendsCount, setFriendsCount] = useState<number>(0);
	const [errors, setErrors] = useState<string | null>(null);

	const loadUserData = async () => {
		try {
			const id = userId ?? currentUser?.id;
			const userData = await getUserById(id);
			setUser(userData);

			const friendStatus = currentUser?.friendsIds.includes(id) ?? false;
			setIsFriend(friendStatus);

			if (friendStatus || id === currentUser?.id) {
				const friendsData = await getUserFriends(userData.friendsIds);
				setFriends(friendsData);
				setFriendsCount(friendsData.length);
			} else {
				setFriendsCount(userData.friendsIds.length);
			}
		} catch (error) {
			setErrors("Failed to load user data");
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadUserData();
		}, [userId, currentUser])
	);

	return (
		<SafeAreaView
			style={{ flex: 1, justifyContent: "center", paddingTop: 32 }}
		>
			{user ? (
				<ProfileInfo
					user={user}
					isCurrentUser={
						userId === undefined || userId === currentUser?.id
					}
					isFriend={isFriend}
					setIsFriend={setIsFriend}
					friends={friends}
					setFriends={setFriends}
					friendsCount={friendsCount}
					setFriendsCount={setFriendsCount}
				/>
			) : (
				<Text>Loading...</Text>
			)}
		</SafeAreaView>
	);
}
