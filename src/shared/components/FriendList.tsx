import React from "react";
import { ScrollView, TouchableOpacity, View, Text, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { UserResponse } from "@interfaces/UserResponse";
import { theme } from "@navigation/Theme";

interface FriendListProps {
	friends: UserResponse[];
	currentUser: UserResponse | null;
	onFriendPress: (friendId: number) => void;
	onAddFriend: (friendId: number) => void;
	onDeleteFriend: (friendId: number) => void;
}

export default function FriendList({
	friends,
	currentUser,
	onFriendPress,
	onAddFriend,
	onDeleteFriend,
}: FriendListProps) {
	return (
		<ScrollView contentContainerStyle={{ padding: 16, marginTop: 16 }}>
			{friends.length > 0 ? (
				friends.map((friend) => (
					<TouchableOpacity
						key={friend.id}
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 16,
							padding: 16,
							backgroundColor: "#FFF",
							borderRadius: 8,
							borderWidth: 1,
							borderColor: theme.colors.primary,
						}}
						onPress={() => onFriendPress(friend.id)}
					>
						<View style={{ position: "relative" }}>
							<Image
								source={{ uri: friend.profileImageUrl }}
								style={{
									width: 70,
									height: 70,
									borderRadius: 40,
								}}
							/>
							{currentUser?.id !== friend.id && (
								<IconButton
									icon={
										currentUser?.friendsIds.includes(
											friend.id
										)
											? "minus"
											: "plus"
									}
									size={20}
									onPress={() => {
										if (
											currentUser?.friendsIds.includes(
												friend.id
											)
										) {
											onDeleteFriend(friend.id);
										} else {
											onAddFriend(friend.id);
										}
									}}
									style={{
										position: "absolute",
										bottom: -5,
										right: -10,
										backgroundColor: theme.colors.primary,
										width: 20,
										height: 20,
									}}
									iconColor={"#FFF"}
								/>
							)}
						</View>
						<View style={{ flex: 1, marginLeft: 16 }}>
							<Text
								style={{
									fontSize: 16,
									fontWeight: "bold",
									color: theme.colors.primary,
								}}
							>
								@{friend.nickname}
							</Text>
							<Text
								style={{
									fontSize: 14,
									color: theme.colors.primary,
								}}
							>
								{friend.name}
							</Text>
							<Text style={{ fontSize: 12, color: "gray" }}>
								{friend.birthDate}
							</Text>
						</View>
						<View style={{ alignItems: "flex-end" }}>
							<Text style={{ color: theme.colors.primary }}>
								{friend.friendsIds.length > 1
									? `${friend.friendsIds.length} Friends`
									: friend.friendsIds.length === 1
										? "1 Friend"
										: "No friends"}
							</Text>
						</View>
					</TouchableOpacity>
				))
			) : (
				<Text
					style={{
						textAlign: "center",
						color: theme.colors.primary,
						marginTop: 20,
					}}
				>
					No friends found
				</Text>
			)}
		</ScrollView>
	);
}
