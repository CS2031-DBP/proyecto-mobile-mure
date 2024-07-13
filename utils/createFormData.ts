export default function createFormData<T extends Record<string, any>>(
	data: T
): FormData {
	const formData = new FormData();

	Object.keys(data).forEach((key) => {
		const value = data[key];

		if (
			value &&
			typeof value === "object" &&
			"uri" in value &&
			"name" in value &&
			"type" in value
		) {
			formData.append(key, value as any);
		} else if (value != undefined) {
			formData.append(key, value.toString());
		}
	});

	return formData;
}
