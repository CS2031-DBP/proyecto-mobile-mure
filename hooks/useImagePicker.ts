import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function useImagePicker() {
	const [image, setImage] = useState<string | null>(null);

	async function pickImage() {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	}

	return { image, pickImage };
}
