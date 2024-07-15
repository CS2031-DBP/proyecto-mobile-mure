import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultScreenOptions } from "./ScreenOptions";
import RegisterDetails, {
	RegisterDetailsProps,
} from "@features/auth/register-2/RegisterDetails";
import RegisterBasicInfo from "@features/auth/register-2/RegisterBasicInfo";

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
