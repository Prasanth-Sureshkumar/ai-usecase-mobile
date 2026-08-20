# Regent AI Mobile

React Native CLI prototype built in JavaScript from the supplied Figma/reference screenshots. This is intentionally not an Expo app.

## Project Setup Commands

```sh
cd /Users/prasanth/Development
npx @react-native-community/cli init RegentAIMobile --version 0.80.3
```

This repository folder is already created as:

```sh
cd /Users/prasanth/Development/regent-ai-mobile
```

## Dependency Installation Commands

```sh
npm install
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-webview
```

For iOS:

```sh
npm run pods
```

## Folder Structure

```text
src/
|-- assets/
|   |-- icons/
|   `-- images/
|-- components/
|-- constants/
|-- navigation/
|-- screens/
|-- services/
|-- types/
`-- utils/
```

## Mock Flow Testing

The mock auth behavior lives in `src/services/authService.js`.

Use these emails in the app:

- `regentsschool@gmail.com`: existing user, opens Login
- `newuser@regents.school`: new user, opens Registration
- `error@regents.school`: backend-style error
- Any other valid email: invitation-not-found error screen treatment

For the registration mock OTP, use:

```text
123456
```

## Assets

Place supplied visual assets here when available:

- App logo placeholder replacement: `src/assets/images/app-logo.png`
- Regents School crest: `src/assets/images/regents-crest.png`
- Any custom icons: `src/assets/icons/`

The current implementation uses React Native views/text for the placeholder logo and crest so the app runs even before image assets are supplied.

## Run

Start Metro:

```sh
npm start
```

Run Android:

```sh
npm run android
```

Run iOS:

```sh
npm run ios
```

## Notes

- `InitialSplash`, `RegistrationSuccess`, and `PostAuthSplash` all clean up timers.
- Dynamic menu data comes from `src/services/menuService.js`.
- The reserved `More` item is appended locally and never comes from the dynamic menu array.
- `DynamicWebViewScreen` handles invalid URLs, load errors, loading UI, and Android hardware back navigation inside WebView history.
