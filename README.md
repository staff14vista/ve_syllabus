# VE Syllabus App

This is a React Native Expo application for VE Syllabus. It serves as a secure wrapper around the web application hosted at [vesyllabus.fwh.is](https://vesyllabus.fwh.is).

## Features

- **Custom Splash Screen**: Displays an animated VE logo with a fade-out transition.
- **Web App Wrapper**: Loads the main web application seamlessly using `react-native-webview`.
- **Screenshot Prevention**: Employs OS-level (Android `FLAG_SECURE`) and runtime (`expo-screen-capture`) protections to prevent screenshots and screen recordings. It also disables web text selection, image dragging, and context menus.
- **Over-The-Air (OTA) Updates**: Configured with EAS Update to allow pushing updates instantly to users without going through app store reviews.
- **Cross-Platform**: Built for both Android and iOS.

## Project Structure

- `App.js`: Main application entry point containing the WebView, Splash Screen logic, and security measures.
- `app.json`: Expo configuration, including EAS linking and OTA settings.
- `assets/`: Contains app icons and splash screen images.
- `plugins/withScreenSecurity.js`: Custom Expo config plugin for Android OS-level screenshot prevention.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

## Deployment and OTA Updates

This project is linked to Expo Application Services (EAS).

**To publish an Over-The-Air (OTA) update:**
```bash
eas update --branch production --message "Update description"
```

**To build the Android APK/AAB:**
```bash
eas build --platform android
```

**To build the iOS app:**
```bash
eas build --platform ios
```
