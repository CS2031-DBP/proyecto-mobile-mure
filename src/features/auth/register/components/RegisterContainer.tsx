import { theme } from "@navigation/Theme";
import { ReactNode } from "react";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface RegisterViewProps {
	children: ReactNode[];
	onButtonPress: () => void;
	buttonText: string;
}

export default function RegisterContainer(props: RegisterViewProps) {
	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: "column",
				paddingTop: 100,
				gap: 40,
				padding: 20,
				backgroundColor: theme.colors?.background,
			}}
		>
			{props.children}
			<Button mode="contained" onPress={props.onButtonPress}>
				{props.buttonText}
			</Button>
		</SafeAreaView>
	);
}
