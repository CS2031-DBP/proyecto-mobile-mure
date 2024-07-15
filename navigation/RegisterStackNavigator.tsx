import RegisterBasicInfo from "@/screens/RegisterBasicInfo";
import RegisterDetails, {
	RegisterDetailsProps,
} from "@/screens/RegisterDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultScreenOptions } from "./ScreenOptions";

export type RegisterStackParamList = {
	RegisterBasicInfo: undefined;
	RegisterDetails: RegisterDetailsProps;
};

const RegisterStack = createNativeStackNavigator<RegisterStackParamList>();

export default function RegisterStackNavigator() {
	return (
		<RegisterStack.Navigator
			initialRouteName={"RegisterBasicInfo"}
			screenOptions={{ ...defaultScreenOptions }}
		>
			<RegisterStack.Screen
				name="RegisterBasicInfo"
				component={RegisterBasicInfo}
				options={{ headerTitle: "Create account" }}
			/>
			<RegisterStack.Screen
				name="RegisterDetails"
				component={RegisterDetails}
				options={{ headerTitle: "" }}
				initialParams={{ email: "", birthdate: new Date() }}
			/>
		</RegisterStack.Navigator>
	);
}
