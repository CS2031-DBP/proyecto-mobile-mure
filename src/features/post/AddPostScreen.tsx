import { Image, ScrollView, View } from "react-native";
import {
	Button,
	Divider,
	IconButton,
	Modal,
	Portal,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import useImagePicker from "@hooks/useImagePicker";
import { Audio } from "expo-av";
import SearchMediaEntity from "@components/SearchMediaEntity";
import MediaCard from "@components/MediaCard";
import createPost from "./services/createPost";
import { useUserContext } from "@contexts/UserContext";
import { PostRequest } from "./interfaces/PostRequest";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

export default function AddPostScreen() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [description, setDescription] = useState("");
	const imagePickerHook = useImagePicker();
	const bottomIconsSize = 27;
	const [recording, setRecording] = useState<Audio.Recording>();
	const [isRecording, setIsRecording] = useState(false);
	const [permissionResponse, requestPermission] = Audio.usePermissions();
	const [sound, setSound] = useState<Audio.Sound>();
	const [recordingUri, setRecordingUri] = useState<string | null | undefined>(
		null
	);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [mediaId, setMediaId] = useState<number | null>(null);
	const userContext = useUserContext();

	async function startRecording() {
		try {
			if (permissionResponse?.status !== "granted") {
				console.log("Requesting permission..");
				await requestPermission();
			}

			setIsRecording(true);

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			console.log("Starting recording..");
			const { recording } = await Audio.Recording.createAsync(
				Audio.RecordingOptionsPresets.HIGH_QUALITY
			);
			setRecording(recording);
			console.log("Recording started");
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		console.log("Stopping recording..");
		setRecording(undefined);
		await recording?.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
		});
		const uri = recording?.getURI();
		setIsRecording(false);
		setRecordingUri(uri);
		console.log("Recording stopped and stored at", uri);
	}

	async function playSound() {
		console.log("Loading Sound");
		console.log("Recording URI", recordingUri);
		const { sound } = await Audio.Sound.createAsync({
			uri: recordingUri as string,
		});

		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	}

	async function handlePost() {
		try {
			if (!userContext.user) throw new Error("User not found");

			const postRequest: PostRequest = {
				userId: userContext.user.id,
				description: description,
				image: imagePickerHook.image
					? {
							uri: imagePickerHook.image,
							name: "image.jpg",
							type: "image/jpeg",
						}
					: undefined,
			};
			await createPost(postRequest);
			showMessage({
				message: "Post created successfully",
				type: "success",
			});
			navigation.goBack();
		} catch (error) {
			console.error("Failed to create post", error);
		}
	}

	useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
				}
			: undefined;
	}, [sound]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
			}}
		>
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					backgroundColor: theme.colors.headerBackgroundColor,
					paddingTop: 30,
					paddingBottom: 10,
					paddingHorizontal: 15,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<IconButton
					icon="close"
					size={30}
					onPress={() => navigation.goBack()}
					iconColor={theme.colors.primary}
				/>
				<Button
					mode="contained"
					onPress={handlePost}
					style={{
						backgroundColor: theme.colors.primary,
						marginRight: 12,
					}}
				>
					Post
				</Button>
			</View>
			<View style={{ marginTop: 70, padding: 10, flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<Image
						source={{ uri: userContext.user?.profileImageUrl }}
						style={{
							width: 50,
							height: 50,
							borderRadius: 25,
							marginBottom: 300,
						}}
					/>
					<TextInput
						style={{
							flex: 1,
							backgroundColor: "white",
							marginLeft: 10,
							borderRadius: 10,
							borderBottomColor: theme.colors.primary,
							borderBottomWidth: 1,
							textAlignVertical: "top",
							minHeight: 360,
							maxHeight: 360,
							padding: 10,
						}}
						placeholder="What's happening?"
						value={description}
						onChangeText={setDescription}
						multiline
					/>
				</View>
				<ScrollView style={{ flex: 1 }}>
					{imagePickerHook.image && (
						<View
							style={{ alignItems: "center", marginBottom: 20 }}
						>
							<Image
								source={{ uri: imagePickerHook.image }}
								style={{
									width: 200,
									height: 200,
									borderRadius: 10,
								}}
							/>
							<IconButton
								icon="delete"
								iconColor={theme.colors.primary}
								size={30}
								onPress={() =>
									imagePickerHook.setImageUri(null)
								}
							/>
						</View>
					)}
					{mediaId && (
						<View
							style={{ alignItems: "center", marginBottom: 20 }}
						>
							<IconButton
								icon="delete"
								iconColor="red"
								size={30}
								onPress={() => setMediaId(null)}
							/>
							<MediaCard mediaId={mediaId} type="song" />
						</View>
					)}
				</ScrollView>
				<Divider />
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
					paddingVertical: 10,
					paddingHorizontal: 15,
					borderTopColor: theme.colors.primary,
					borderTopWidth: 1,
					backgroundColor: theme.colors.background,
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
				}}
			>
				<IconButton
					icon="image"
					size={bottomIconsSize}
					iconColor={theme.colors.primary}
					onPress={() => imagePickerHook.pickImage()}
				/>
				<IconButton
					icon={isRecording ? "stop" : "microphone"}
					size={bottomIconsSize}
					iconColor={theme.colors.primary}
					onPress={() => {
						isRecording ? stopRecording() : startRecording();
					}}
				/>
				<IconButton
					icon="music"
					size={bottomIconsSize}
					iconColor={theme.colors.primary}
					onPress={() => setIsModalVisible(true)}
				/>
				{recordingUri && (
					<View style={{ flexDirection: "row" }}>
						<IconButton
							icon="play"
							size={bottomIconsSize}
							iconColor={theme.colors.primary}
							onPress={() => playSound()}
						/>
						<IconButton
							icon="delete"
							size={bottomIconsSize}
							iconColor={theme.colors.primary}
							onPress={() => setRecordingUri(null)}
						/>
					</View>
				)}
			</View>
			<Portal>
				<Modal
					visible={isModalVisible}
					onDismiss={() => setIsModalVisible(false)}
				>
					<View
						style={{
							margin: 40,
							padding: 5,
							backgroundColor: "white",
							borderRadius: 40,
							height: "80%",
						}}
					>
						<SearchMediaEntity
							mode="static"
							onMediaEntityPres={(mediaId) => {
								setMediaId(mediaId);
								setIsModalVisible(false);
							}}
						/>
					</View>
				</Modal>
			</Portal>
		</SafeAreaView>
	);
}
