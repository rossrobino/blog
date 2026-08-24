const months = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
];

/** Parses the calendar date formats used by local and external posts. */
export const parseDate = (value: string) => {
	const numeric = /^(\d{4})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})$/.exec(value);

	if (numeric) {
		return new Date(
			Date.UTC(
				Number(numeric[1]),
				Number(numeric[2]) - 1,
				Number(numeric[3]),
				12,
			),
		);
	}

	const named = /^([a-z]+)\s+(\d{1,2}),\s+(\d{4})$/i.exec(value);

	if (named) {
		const month = months.findIndex((value) =>
			value.startsWith(named[1]?.toLowerCase() ?? ""),
		);

		if (month >= 0) {
			return new Date(Date.UTC(Number(named[3]), month, Number(named[2]), 12));
		}
	}

	throw new Error(`Invalid date: ${value}`);
};

export const formatDate = (value: string) => {
	const formatted = parseDate(value).toLocaleDateString("en-us", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});

	return formatted;
};
