import { RootStackParamList } from "@navigation/AppNavigation";
import { NavigationProp } from "@react-navigation/native";
import { Text } from "react-native-paper";

interface RegisterLinkProps {
	navigation: NavigationProp<RootStackParamList>;
}

export default function RegisterLink(props: RegisterLinkProps) {
	return (
		<Text onPress={() => props.navigation.navigate("RegisterScreen")}>
			Don't have an account? Register
		</Text>
	);
}
