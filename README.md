# read4me

An Android app that reads documents aloud. Pick a `.txt` or `.json` file and read4me speaks it segment by segment with text-to-speech, showing the current text, image, or code snippet on screen.

Built with [Expo](https://expo.dev) and React Native.

## Features

- **Text mode** – plain `.txt` files are split into sentences.
- **Medium post mode** – `.json` files with a `content` array of segments (`text`, `img`, or code `files`).
- Play / pause, skip forward or back 5 segments, seek bar.
- Playback speed (x0.5 – x1.5) and repeat / repeat-one / stop-at-end modes.

## Get started

Requires Node, yarn, and the Android SDK with an emulator or device. The app uses native modules (TTS, file system, document picker), so it does not run in Expo Go.

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build and run on Android

   ```bash
   yarn android
   ```

   This generates the native `android/` project with `expo prebuild` (it is not committed) and starts Metro.

## Scripts

| Script          | What it does                                 |
| --------------- | -------------------------------------------- |
| `yarn android`  | Build and run the app on Android             |
| `yarn start`    | Start the Metro dev server                   |
| `yarn lint`     | Run ESLint                                   |
| `yarn prebuild` | Regenerate native projects from `app.json`   |
