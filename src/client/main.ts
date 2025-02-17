import "drab/copy/define";
import "drab/dialog/define";
import "drab/prefetch/define";
import "drab/share/define";
import "drab/youtube/define";
import posthog from "posthog-js";

const analytics = () => {
	const init = () => {
		if (import.meta.env.PROD) {
			posthog.init("phc_lV7DfhfO7GHWiPsWHpFu1aDqXPfvg9FMETDIVxZafk1", {
				api_host: "https://us.i.posthog.com",
			});
		} else {
			console.info("no analytics in development mode");
		}
	};

	// @ts-expect-error prerendering is experimental
	if (document.prerendering) {
		document.addEventListener("prerenderingchange", init, {
			once: true,
		});
	} else {
		init();
	}
};

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

		const copyText = () => {
			navigator.clipboard.writeText(pre.textContent ?? "");
		};

		pre.addEventListener("click", copyText);
		pre.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				copyText();
			}
		});
	}
};

const fixTableOverflow = () => {
	const tables = document.querySelectorAll("table");
	tables.forEach((table) => {
		const div = document.createElement("div");
		div.classList.add("overflow-x-auto");
		table.insertAdjacentElement("beforebegin", div);
		div.append(table);
	});
};

const main = () => {
	cmdK();
	copyCode();
	fixTableOverflow();
	analytics();
};

main();
