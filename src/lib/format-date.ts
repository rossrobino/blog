export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const formatted = date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	if (formatted === "Invalid Date") {
		throw new Error(formatted);
	}

	return formatted;
};
