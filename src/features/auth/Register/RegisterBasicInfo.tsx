import { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RegisterStackParamList } from "@navigation/RegisterStackNavigator";
import RegisterContainer from "@features/auth/register/components/RegisterContainer";
import RegisterField from "@features/auth/register/components/RegisterField";
import { showMessage } from "react-native-flash-message";

export default function RegisterBasicInfo() {
	const [email, setEmail] = useState("");
	const [date, setDate] = useState(new Date(Date.now()));
	const navigation = useNavigation<NavigationProp<RegisterStackParamList>>();

	function showMode(currentMode: "date" | "time") {
		DateTimePickerAndroid.open({
			value: date,
			onChange: (_event, selectedDate) => {
				if (selectedDate) {
					setDate(selectedDate);
				}
			},
			mode: currentMode,
			is24Hour: true,
		});
	}

	function handleNext() {
		if (!email || !date) {
			showMessage({
				message: "All fields are required",
				type: "warning",
			});
			return;
		}

		navigation.navigate("RegisterDetails", {
			email,
			birthdate: date,
		});
	}

	return (
		<RegisterContainer onButtonPress={handleNext} buttonText="Next">
			<RegisterField
				label="What's your email?"
				value={email}
				onChangeText={setEmail}
			/>
			<RegisterField
				label="What's you date of birth?"
				value={date.toDateString()}
				onPress={() => showMode("date")}
			/>
		</RegisterContainer>
	);
}
