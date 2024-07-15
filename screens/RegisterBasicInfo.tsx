import RegisterLabel from "@/components/RegisterLabel";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RegisterStackParamList } from "@/navigation/RegisterStackNavigator";

export default function RegisterBasicInfo() {
	const [email, setEmail] = useState("");
	const [date, setDate] = useState(new Date(Date.now()));
	const navigation = useNavigation<NavigationProp<RegisterStackParamList>>();

	function showMode(currentMode: "date" | "time") {
		DateTimePickerAndroid.open({
			value: date,
			onChange: (event, selectedDate) => {
				if (selectedDate) {
					setDate(selectedDate);
				}
			},
			mode: currentMode,
			is24Hour: true,
		});
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: "column",
				paddingTop: 100,
				gap: 40,
				padding: 20,
			}}
		>
			<View style={{ gap: 20 }}>
				<RegisterLabel text="What's your email" />
				<TextInput
					label=""
					mode="outlined"
					value={email}
					onChangeText={setEmail}
				/>
			</View>
			<View style={{ gap: 20 }}>
				<RegisterLabel text="What's your date of birth?" />
				<TextInput
					label=""
					mode="outlined"
					value={date.toDateString()}
					onPress={() => showMode("date")}
				/>
			</View>
			<Button
				mode="contained"
				onPress={() => navigation.navigate("RegisterDetails")}
			>
				Next
			</Button>
		</SafeAreaView>
	);
}
