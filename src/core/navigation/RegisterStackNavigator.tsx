import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultScreenOptions } from "./ScreenOptions";
import RegisterDetailsScreen, {
	RegisterDetailsProps,
} from "@features/auth/register/RegisterDetailsScreen";
import RegisterBasicInfoScreen from "@features/auth/register/RegisterBasicInfoScreen";

export type RegisterStackParamList = {
	RegisterBasicInfoScreen: undefined;
	RegisterDetailsScreen: RegisterDetailsProps;
};

const RegisterStack = createNativeStackNavigator<RegisterStackParamList>();

export default function RegisterStackNavigator() {
	return (
		<RegisterStack.Navigator
			initialRouteName={"RegisterBasicInfoScreen"}
			screenOptions={{ ...defaultScreenOptions }}
		>
			<RegisterStack.Screen
				name="RegisterBasicInfoScreen"
				component={RegisterBasicInfoScreen}
				options={{ headerTitle: "Create account" }}
			/>
			<RegisterStack.Screen
				name="RegisterDetailsScreen"
				component={RegisterDetailsScreen}
				options={{ headerTitle: "" }}
				initialParams={{ email: "", birthdate: new Date() }}
			/>
		</RegisterStack.Navigator>
	);
}
