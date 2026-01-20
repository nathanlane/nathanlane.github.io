type CopyCodeButtonOptions = {
	preSelector?: string;
	buttonClassName?: string;
};

function attachCopyButtons({
	preSelector = "pre",
	buttonClassName = "copy-code",
}: CopyCodeButtonOptions = {}) {
	document.querySelectorAll<HTMLPreElement>(preSelector).forEach((pre) => {
		if (pre.querySelector(`.${buttonClassName}`)) return;

		pre.style.position = "relative";

		const copyButton = document.createElement("button");
		copyButton.className =
			"copy-code absolute flex items-center justify-center font-medium rounded-md font-sans text-xs top-3 right-3 z-10 border border-color-200 bg-bgColor/90 backdrop-blur-sm hover:bg-bgColor hover:border-color-300 transition-all duration-150";

		const buttonText = document.createElement("span");
		buttonText.innerText = "Copy";
		buttonText.className = "flex items-center px-3 py-1 text-xs font-medium text-light";

		copyButton.appendChild(buttonText);
		pre.appendChild(copyButton);

		copyButton.addEventListener("click", async () => {
			const code = pre.querySelector("code")?.textContent;
			if (!code) return;

			try {
				await navigator.clipboard.writeText(code);
			} catch {
				return;
			}

			buttonText.innerText = "Copied!";
			copyButton.classList.add("text-accent-base");
			copyButton.classList.remove("text-light");

			setTimeout(() => {
				buttonText.innerText = "Copy";
				copyButton.classList.remove("text-accent-base");
				copyButton.classList.add("text-light");
			}, 2000);
		});
	});
}

export function initializeCopyCodeButtons(options?: CopyCodeButtonOptions) {
	if (typeof document === "undefined") return;

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => attachCopyButtons(options));
		return;
	}

	attachCopyButtons(options);
}

