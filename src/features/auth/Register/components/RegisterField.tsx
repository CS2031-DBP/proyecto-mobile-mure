import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface RegisterFieldProps {
	label: string;
	value: string;
	onChangeText?: (value: string) => void;
	onPress?: () => void;
}

export default function RegisterField(props: RegisterFieldProps) {
	return (
		<View style={{ gap: 20 }}>
			<Text variant="headlineMedium">{props.label}</Text>
			<TextInput
				label=""
				mode="outlined"
				value={props.value}
				onChangeText={props.onChangeText}
			/>
		</View>
	);
}
