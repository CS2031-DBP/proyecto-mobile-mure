import { Text, View } from "react-native";
import {
	Avatar,
	Button,
	Divider,
	IconButton,
	Modal,
	Portal,
	Searchbar,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import useImagePicker from "@/hooks/useImagePicker";
import { Audio } from "expo-av";
import { Image } from "react-native";
import Search from "@/components/Search";

export default function AddPost() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [postText, setPostText] = useState("");
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
			style={{ flex: 1, flexDirection: "column", gap: 5, margin: 5 }}
		>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<IconButton
					icon="close"
					size={30}
					onPress={() => navigation.goBack()}
				/>
				<Button mode="contained">Post</Button>
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					gap: 10,
				}}
			>
				<Avatar.Icon
					icon="account"
					size={40}
					style={{ marginTop: 10 }}
				/>
				<View style={{ flex: 1 }}>
					<TextInput
						contentStyle={{ fontSize: 17 }}
						placeholder="What's happennig?"
						style={{
							flex: 1,
							backgroundColor: "transparent",
							borderWidth: 0,
							borderBlockColor: "transparent",
							borderBlockEndColor: "transparent",
						}}
						onChangeText={setPostText}
						value={postText}
						outlineColor="transparent"
						activeOutlineColor="transparent"
						activeUnderlineColor="transparent"
						selectionColor="transparent"
						cursorColor="purple"
					/>
					<View style={{ flex: 0.5 }}>
						{imagePickerHook.image ? (
							<>
								<IconButton
									icon="close"
									size={30}
									style={{ position: "absolute", zIndex: 2 }}
									onPress={() =>
										imagePickerHook.setImageUri(null)
									}
								/>
								<Image
									src={imagePickerHook.image ?? ""}
									style={{ flex: 1 }}
								/>
							</>
						) : null}
					</View>
				</View>
			</View>
			<Divider />
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<View style={{ flexDirection: "row" }}>
					<IconButton
						icon="image"
						size={bottomIconsSize}
						onPress={() => imagePickerHook.pickImage()}
					/>
					<IconButton
						icon={isRecording ? "stop" : "microphone"}
						size={bottomIconsSize}
						onPress={() => {
							isRecording ? stopRecording() : startRecording();
						}}
					/>
					<IconButton
						icon="music"
						size={bottomIconsSize}
						onPress={() => setIsModalVisible(true)}
					/>
				</View>
				{recordingUri ? (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<IconButton
							icon="play"
							size={bottomIconsSize}
							onPress={() => playSound()}
						/>
						<IconButton
							icon="delete"
							onPress={() => setRecordingUri(null)}
						/>
					</View>
				) : null}
			</View>
			<Portal>
				<Modal
					visible={isModalVisible}
					onDismiss={() => setIsModalVisible(false)}
				>
					<View
						style={{
							margin: 30,
							padding: 20,
							backgroundColor: "white",
							borderCurve: "continuous",
							borderRadius: 40,
							height: "80%",
						}}
					>
						<Search />
					</View>
				</Modal>
			</Portal>
		</SafeAreaView>
	);
}
