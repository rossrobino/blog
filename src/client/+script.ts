import { inject } from "@vercel/analytics";
import "drab/dialog/define";
import "drab/prefetch/define";
import "drab/share/define";
import "drab/tablesort/define";

const cmdK = () => {
	document.body.addEventListener("keydown", (e) => {
		if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
			document.querySelector("dialog")?.showModal();
		}
	});
};

const copyCode = () => {
	for (const pre of document.querySelectorAll("pre")) {
		pre.tabIndex = 0;
		pre.role = "button";
		pre.ariaDescription = "Copy code to clipboard";

		const copyText = () => navigator.clipboard.writeText(pre.textContent ?? "");

		pre.addEventListener("click", copyText);
		pre.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				copyText();
			}
		});
	}
};

const main = () => {
	cmdK();
	copyCode();
	inject({ mode: import.meta.env.PROD ? "production" : "development" });
};

main();
