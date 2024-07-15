import { UserResponse } from "@interfaces/UserResponse";
import { getCurrentUserInfo } from "@services/getUserInfo";
import {
	createContext,
	useState,
	useEffect,
	useContext,
	Dispatch,
	ReactNode,
} from "react";

interface UserProviderProps {
	children: ReactNode;
}

interface UserContextProps {
	user: UserResponse | null;
	setUser: Dispatch<React.SetStateAction<UserResponse | null>>;
	refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider(props: UserProviderProps) {
	const [user, setUser] = useState<UserResponse | null>(null);

	async function refreshUser() {
		try {
			const userData = await getCurrentUserInfo();
			setUser(userData);
		} catch (error) {}
	}

	useEffect(() => {
		refreshUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, refreshUser }}>
			{props.children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (!context) throw new Error("useUser must be used within a UserProvider");
	return context;
}
