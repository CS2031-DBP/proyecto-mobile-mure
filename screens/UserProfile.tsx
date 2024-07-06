import React, { useState, useCallback } from "react";
import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	ScrollView,
	Alert,
} from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useRoute,
	useNavigation,
	useFocusEffect,
} from "@react-navigation/native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { addFriend } from "@/services/friend/addFriend";
import { deleteFriend } from "@/services/friend/deleteFriend";
import { UserResponse, UserFriends } from "@/interfaces/User";
import { useUserContext } from "@/contexts/UserContext";

export default function UserProfile() {
	const route = useRoute();
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { userId } = route.params as { userId: number };
	const [user, setUser] = useState<UserResponse | null>(null);
	const userContext = useUserContext();
	const [friends, setFriends] = useState<UserFriends[]>([]);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [errors, setErrors] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				if (!userContext.user) {
					setErrors("User data not loaded");
					return;
				}

				const userFriends = await getUserFriends(
					userContext.user.friendsIds
				);
				// setFriends(userFriends);

				// const friendStatus = await checkFriendStatus(userId);
				// setIsFriend(friendStatus);
			};

			fetchData();
		}, [userContext.user, userId])
	);

	async function handleAddFriend() {
		if (!user) return;

		try {
			await addFriend(user.id);
			setIsFriend(true);
			Alert.alert(
				"Friend Added",
				"You have successfully added this user as a friend."
			);
			navigation.navigate("Profile");
		} catch (error) {
			setErrors("Failed to add friend");
		}
	}

	async function handleDeleteFriend() {
		if (!user) return;
		try {
			await deleteFriend(user.id);
			setIsFriend(false);
			Alert.alert(
				"Friend Removed",
				"You have successfully removed this user from your friends."
			);
			navigation.navigate("Profile");
		} catch (error) {
			setErrors("Failed to delete friend");
		}
	}

	if (!user) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.profileContainer}>
				<View style={styles.headerContainer}>
					<IconButton
						icon="arrow-left"
						size={24}
						onPress={() => navigation.goBack()}
					/>
					<Text style={styles.headerTitle}>User Profile</Text>
				</View>
				<View style={styles.topContainer}>
					<Avatar.Image
						size={100}
						source={{ uri: user.profileImage }}
						style={styles.avatar}
					/>
					<View style={styles.infoContainer}>
						<Text style={styles.name}>{user.name}</Text>
						<Text style={styles.birthDate}>{user.birthDate}</Text>
					</View>
					{isFriend && (
						<View style={styles.friendsContainer}>
							<Text style={styles.friendsCount}>
								{friends.length} Friends
							</Text>
							<Button
								mode="outlined"
								onPress={() =>
									navigation.navigate("FriendList", {
										friendIds: user.friendsIds,
									})
								}
								style={styles.viewFriendsButton}
							>
								View Friends
							</Button>
						</View>
					)}
				</View>
				{errors ? <Text style={styles.errorText}>{errors}</Text> : null}
				<View style={styles.buttonsContainer}>
					{isFriend ? (
						<Button
							mode="contained"
							onPress={handleDeleteFriend}
							style={styles.button}
						>
							Delete Friend
						</Button>
					) : (
						<Button
							mode="contained"
							onPress={handleAddFriend}
							style={styles.button}
						>
							Add Friend
						</Button>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingTop: 20,
	},
	profileContainer: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 10,
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 10,
	},
	topContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	avatar: {
		marginRight: 20,
	},
	infoContainer: {
		flex: 1,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "left",
		marginBottom: 5,
	},
	birthDate: {
		fontSize: 18,
		color: "gray",
		textAlign: "left",
	},
	friendsContainer: {
		alignItems: "center",
	},
	friendsCount: {
		fontSize: 18,
	},
	viewFriendsButton: {
		marginTop: 10,
	},
	buttonsContainer: {
		width: "100%",
		marginTop: 20,
		alignItems: "center",
	},
	button: {
		width: "60%",
	},
	errorText: {
		color: "red",
		textAlign: "center",
		marginVertical: 16,
	},
});
