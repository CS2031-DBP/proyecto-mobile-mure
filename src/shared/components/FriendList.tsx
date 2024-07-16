import React from "react";
import { ScrollView, TouchableOpacity, View, Text, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { UserResponse } from "@interfaces/UserResponse";

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
							backgroundColor: "#f9f9f9",
							borderRadius: 8,
						}}
						onPress={() => onFriendPress(friend.id)}
					>
						<View>
							<Image
								source={{ uri: friend.profileImageUrl }}
								style={{
									width: 60,
									height: 60,
									borderRadius: 30,
								}}
							/>
							{currentUser?.id !== friend.id && (
								<IconButton
									icon={
										currentUser?.friendsIds.includes(
											friend.id
										)
											? "trash-can"
											: "plus"
									}
									size={15}
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
										top: -15,
										right: -15,
										backgroundColor: "#B0ACAC",
									}}
								/>
							)}
						</View>
						<View style={{ flex: 1, marginLeft: 16 }}>
							<Text style={{ fontSize: 16, fontWeight: "bold" }}>
								@{friend.nickname}
							</Text>
							<Text style={{ fontSize: 14, fontWeight: "bold" }}>
								{friend.name}
							</Text>
							<Text style={{ fontSize: 12, color: "gray" }}>
								{friend.birthDate}
							</Text>
						</View>
						<View style={{ alignItems: "flex-end" }}>
							<Text>{friend.friendsIds.length} Friends</Text>
						</View>
					</TouchableOpacity>
				))
			) : (
				<Text>No friends found</Text>
			)}
		</ScrollView>
	);
}
