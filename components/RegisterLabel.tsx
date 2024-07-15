import { Text } from "react-native-paper";

interface RegisterLabelProps {
	text: string;
}

export default function RegisterLabel(props: RegisterLabelProps) {
	return <Text variant="headlineMedium">{props.text}</Text>;
}
