import { LogView } from "./view";
import "drab/dialog/define";
import "drab/prefetch/define";
import "drab/share/define";
import "drab/tablesort/define";

const cmdK = () => {
	const search = document.querySelector("dialog");
	document.body.addEventListener("keydown", (e) => {
		if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
			search?.showModal();
		}
	});
};

const copyCode = () => {
	const pres = document.querySelectorAll("pre");
	for (const pre of pres) {
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
	customElements.define("log-view", LogView);

	cmdK();
	copyCode();
};

main();
