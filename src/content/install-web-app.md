---
title: One Less Reason to Build a Native App
description: Enjoy the look and feel of a native app without building one.
keywords: web, native, macOS, windows
date: 2023, 10, 10
---

## Install websites as applications

The line between web applications and natives apps continues to grow smaller as new browser features and APIs enable web application developers to make their website look and feel more like native applications.

With the release of macOS Sonoma, websites can now be installed to look like native applications without any extra configuration across macOS, iOS, Windows, and Android.

Installing websites as applications on both Windows and Mac creates a new icon in the dock for the application and displays the application in a separate window with more minimal controls. These apps can also be found in the launchpad and start menu just like native applications.

## macOS

macOS Sonoma just released at the end of September, and with it a new version of Safari. The **Add to Dock** option is a [new feature](https://support.apple.com/en-us/HT213583) that can be selected from the **File** menu in Safari for any website to add the it to the dock.

Here's an example of [a ChatGPT wrapper](https://gpt.robino.dev) I made after adding to the dock without changing any of the code.

![gpt.robino.dev added to the dock on macOS Sonoma](/images/install-web-app/add-to-dock.webp)

## Windows

On Windows, Edge already had a similar feature, it also allows you to install a site as an application. Select the **three dots** in the upper left, go to **Apps** and then select **Install this site as an app**.

Here's [Typo](https://typo.robino.dev) installed as an app on Windows. Again, this is without any extra configuration.

![typo.robino.dev installed as an app on Windows](/images/install-web-app/install-as-app.webp)

## Mobile

These features also exist on iOS and Android via the **Add to Home Screen** option.

## Customization

The appearance can be further customized by including a [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest). In the manifest file, you can customize things like icons, colors, or whether or not to display the url bar.

_Check out [Project Fugu](https://fugu-tracker.web.app/) to see many of the new APIs available to web developers enable new capabilities that are previously only available to native applications._

## Conclusion

Web applications are bridging the gap between their abilities and those of native applications. The introduction of new features and APIs have paved the way for web apps to look and feel more like native applications across platforms. These features come out of the box, and work without having to utilize extra tools like Electron or Tauri. Train users on the these new capabilities and be sure to consider them when evaluating between building a web or native application.
