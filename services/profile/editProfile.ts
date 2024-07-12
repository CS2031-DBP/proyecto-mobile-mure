import Api from "../api";
import { UserUpdate } from "@/interfaces/User";

const api = new Api({});

export default async function editProfile(data: UserUpdate) {
  const formData = new FormData();
  if (data.name) {
	formData.append("name", data.name);
  }
  if (data.email) {
	formData.append("email", data.email);
  }
  if (data.nickname) {
	formData.append("nickname", data.nickname);
  }
  if (data.password) {
    formData.append("password", data.password);
  }
  
  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  try {
    await api.patchForm<UserUpdate, void>(formData, {
      url: "/user/update/me",
    });
  } catch (error) {
    throw error;
  }
}
