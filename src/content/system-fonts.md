---
title: Use System Fonts to Speed Up your Website
description: Enhance your website’s performance by leveraging fonts already available on users’ devices.
keywords: performance, fonts, font stacks
date: 2024, 06, 13
---

<drab-youtube aria-label="YouTube Tutorial" uid="1aG-Z_NHeiI">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

## Built-in fonts

Websites require various assets to be loaded on a user's device---among these assets are fonts. Adding an extra font for users to download can negatively impact your page’s load time and cause layout shift when a fallback font gets replaced.

Fortunately, users already have built-in fonts on their devices, and there is a surprising variety available. For instance, on Apple devices, the San Francisco font is readily accessible for web developers to use without requiring a network request.

Here’s how you can specify to use San Francisco on Apple devices:

```css
body {
	font-family: system-ui;
}
```

## Font stacks

Many fonts can be specified in a list to fallback to when the preceding fonts are unavailable. For example, here are the default [tailwindcss](https://tailwindcss.com/docs/font-family) font stacks.

```css
.font-sans {
	font-family:
		ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
		"Segoe UI Symbol", "Noto Color Emoji";
}

.font-serif {
	font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.font-mono {
	font-family:
		ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
		"Courier New", monospace;
}
```

Using these font stacks ensures that your text will look good on a wide range of devices and operating systems.

## Resources

The [Modern Font Stacks](https://modernfontstacks.com/) project provides a variety of pre-built font stacks, ready to drop in to any project. I have implemented these in a [tailwindcss plugin](https://uico.robino.dev) as well.

Apple and Microsoft also provide resources showing which fonts are currently shipped with the latest versions of their OS.

- [Apple Fonts](https://developer.apple.com/fonts/system-fonts/)
- [Microsoft Fonts](https://learn.microsoft.com/en-us/typography/fonts/windows_11_font_list)

By leveraging system fonts and well-designed font stacks, you can improve your website’s performance and provide a better user experience.
