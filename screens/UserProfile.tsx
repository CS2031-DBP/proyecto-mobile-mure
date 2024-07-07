import React, { useState, useCallback } from "react";
import { SafeAreaView, Text } from "react-native";
import {
	useFocusEffect,
	NavigationProp,
	ParamListBase,
	useRoute,
	useNavigation,
} from "@react-navigation/native";
import { getUserById } from "@/services/profile/getUserById";
import { UserResponse } from "@/interfaces/User";
import ProfileInfo from "@/components/ProfileInfo";
import { useUserContext } from "@/contexts/UserContext";
import { getUserFriends } from "@/services/profile/getUserFriends";

export default function UserProfile() {
	const route = useRoute();
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { userId } = route.params as { userId: number };
	const [user, setUser] = useState<UserResponse | null>(null);
	const { user: currentUser, refreshUser } = useUserContext();
	const [friends, setFriends] = useState<UserResponse[]>([]);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [errors, setErrors] = useState<string | null>(null);
	const [friendsCount, setFriendsCount] = useState<number>(0);

	const loadUserData = async () => {
		try {
			if (userId === currentUser.id) {
				navigation.navigate("Profile");
				return;
			}

			const userData = await getUserById(userId);
			setUser(userData);

			const friendStatus = currentUser.friendsIds.includes(userId);
			setIsFriend(friendStatus);

			if (friendStatus) {
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
			style={{ flex: 1, justifyContent: "center", paddingTop: 20 }}
		>
			{user ? (
				<ProfileInfo
					user={user}
					isCurrentUser={false}
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
