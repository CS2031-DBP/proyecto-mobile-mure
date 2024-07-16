import useImagePicker from "@hooks/useImagePicker";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddStoryScreen() {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const imagePickerHook = useImagePicker();

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} facing={facing}>
				<SafeAreaView
					style={{
						flex: 1,
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<IconButton
						icon="close"
						size={50}
						onPress={() => navigation.goBack()}
					/>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<IconButton
							icon="image"
							size={40}
							onPress={() => imagePickerHook.pickImage()}
						/>
						<IconButton icon="camera-iris" size={60} />
						<IconButton
							icon="camera-switch"
							size={40}
							onPress={toggleCameraFacing}
						/>
					</View>
				</SafeAreaView>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
