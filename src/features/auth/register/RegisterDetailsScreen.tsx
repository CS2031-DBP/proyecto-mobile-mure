import { RootStackParamList } from "@navigation/AppNavigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import RegisterField from "./components/RegisterField";
import RegisterContainer from "./components/RegisterContainer";
import { register } from "./services/register";

export interface RegisterDetailsProps {
	email: string;
	birthdate: Date;
}

export default function RegisterDetailsScreen(props: RegisterDetailsProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [name, setName] = useState("");

	async function handleRegister() {
		if (password.length < 6)
			showMessage({
				message: "Password must be at least 6 characters long",
				type: "warning",
			});

		try {
			const response = await register({
				name,
				email: props.email,
				password,
				birthdate: props.birthdate,
				nickname: username,
			});

			if (response && response.token) {
				showMessage({
					message: "Registration Successful",
					type: "success",
				});
				navigation.navigate("MainScreen");
			} else {
				showMessage({
					message: "One or more fields are invalid",
					type: "warning",
				});
			}
		} catch (error) {
			showMessage({ message: "Something went wrong", type: "danger" });
		}
	}

	return (
		<RegisterContainer onButtonPress={handleRegister} buttonText="Save">
			<RegisterField label="Name" value={name} onChangeText={setName} />
			<RegisterField
				label="Username"
				value={username}
				onChangeText={setUsername}
			/>
			<RegisterField
				label="Password"
				value={password}
				onChangeText={setPassword}
			/>
			<RegisterField
				label="Confirm password"
				value={passwordConfirm}
				onChangeText={setPasswordConfirm}
			/>
		</RegisterContainer>
	);
}
