import { inject } from "@vercel/analytics";
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

const analytics = () => {
	inject({ mode: import.meta.env.PROD ? "production" : "development" });
};

const contents = () => {
	for (const list of document.querySelectorAll<HTMLElement>(
		"[data-article-navigation]",
	)) {
		const items: { link: HTMLAnchorElement; target: HTMLElement }[] = [];

		for (const link of list.querySelectorAll<HTMLAnchorElement>(
			'a[href^="#"]',
		)) {
			const id = link.getAttribute("href")?.slice(1);
			const target = id
				? document.getElementById(id)
				: document.documentElement;

			if (target) items.push({ link, target });
		}

		const update = () => {
			const point = window.innerHeight * 0.25;
			let active = items[0];

			for (const item of items.slice(1)) {
				if (item.target.getBoundingClientRect().top > point) break;
				active = item;
			}

			for (const item of items) {
				if (item === active) {
					item.link.setAttribute("aria-current", "location");
				} else {
					item.link.removeAttribute("aria-current");
				}
			}
		};
		const observer = new IntersectionObserver(update, {
			rootMargin: "0px 0px -75% 0px",
		});

		for (const { target } of items.slice(1)) observer.observe(target);
		update();
	}
};

const previews = () => {
	for (const element of document.querySelectorAll<HTMLElement>(
		"[data-preview-truncate]",
	)) {
		const source = element.innerHTML;
		const size = element.textContent?.length ?? 0;
		const overflow = () =>
			element.scrollWidth > element.clientWidth + 1 ||
			element.scrollHeight > element.clientHeight + 1;
		const render = (limit = size) => {
			element.innerHTML = source;

			if (limit >= size) return;

			const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
			let count = 0;
			let current = walker.nextNode();

			while (current) {
				if (current instanceof Text) {
					if (count + current.data.length >= limit) {
						let end = Math.max(0, limit - count);
						const text = current.data.slice(0, end);

						if (end < current.data.length && !/\s$/.test(text)) {
							end = text.search(/\s+\S*$/);
							if (end < 0) end = text.length;
						}

						const range = document.createRange();
						range.setStart(current, end);
						range.setEnd(element, element.childNodes.length);
						range.deleteContents();
						current.data = `${current.data.trimEnd()}…`;
						return;
					}

					count += current.data.length;
				}

				current = walker.nextNode();
			}
		};
		const fit = () => {
			render();

			if (!overflow()) return;

			let start = 0;
			let end = size;
			let best = 0;

			while (start <= end) {
				const middle = Math.floor((start + end) / 2);
				render(middle);

				if (overflow()) {
					end = middle - 1;
				} else {
					best = middle;
					start = middle + 1;
				}
			}

			render(best);
		};

		new ResizeObserver(() => requestAnimationFrame(fit)).observe(element);
		requestAnimationFrame(fit);
		void document.fonts.ready.then(fit);
	}
};

const main = () => {
	cmdK();
	contents();
	previews();

	if ("prerendering" in document && document.prerendering === true) {
		document.addEventListener("prerenderingchange", analytics, { once: true });
	} else {
		analytics();
	}
};

main();
