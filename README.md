# VE Syllabus App

A React Native mobile application built with Expo for VE Syllabus.

## Features

- **WebView Integration**: Seamlessly loads [vesyllabus.fwh.is](https://vesyllabus.fwh.is).
- **Custom Splash Screen**: Animated splash screen with the VE logo.
- **Screenshot Prevention**: Security measures to prevent screenshots and screen recordings on both iOS and Android. Includes custom Android `FLAG_SECURE` configuration.
- **OTA Updates**: Configured with EAS (Expo Application Services) for Over-The-Air updates.
- **Hardware Navigation**: Supports Android hardware back button for WebView navigation.
- **Content Protection**: Disables long-press context menus, text selection, and image dragging within the WebView.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

## Building the App

This project uses EAS Build.

To build an APK for Android testing:
```bash
eas build --platform android --profile preview
```

To build for production (Android App Bundle / iOS IPA):
```bash
eas build --platform all
```

## Publishing Updates

To push an Over-The-Air (OTA) update to users without going through the app stores:
```bash
eas update --branch production --message "Update description"
```
