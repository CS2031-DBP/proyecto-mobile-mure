import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface RegisterViewProps {}

interface RegisterFieldProps {
	text: string;
}

function RegisterField(props: RegisterFieldProps) {
	<View style={{ gap: 20 }}>
		<Text variant="headlineMedium">{props.text}</Text>;
		<TextInput
			label=""
			mode="outlined"
			value={email}
			onChangeText={setEmail}
		/>
	</View>;
}

export default function RegisterView(props: RegisterViewProps) {
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
