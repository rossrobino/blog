export class LogView extends HTMLElement {
	constructor() {
		super();
	}

	fmt = Intl.NumberFormat();

	async connectedCallback() {
		const res = await fetch("/view" + location.pathname);
		const data = await res.json();

		const views = this.fmt.format(data.views ?? 0);

		const div = document.createElement("div");
		div.textContent = views + " view" + (data.views > 1 ? "s" : "");
		this.append(div);
	}
}
