# Flora — notes for agents

Expo (SDK 56) + React Native + TypeScript app. Yoga / Pilates / Gym daily
routines. See `README.md` for the full overview.

> Expo HAS CHANGED — read the versioned docs at
> https://docs.expo.dev/versions/v56.0.0/ before writing Expo-specific code.

## Commands

```bash
npx tsc --noEmit                                   # type-check
npx expo export --platform android -d /tmp/out     # validate the JS bundle builds
npx expo start                                     # dev server
```

> `npx expo install` can't reach `api.expo.dev` in this sandbox. To add a
> dependency, look up the SDK-compatible version in
> `node_modules/expo/bundledNativeModules.json` and run
> `npm install <pkg>@<ver> --legacy-peer-deps` (Expo's nested peer deps require
> the legacy flag).

## Android APK releases

`.github/workflows/build-apk.yml` builds a release APK on every push to
`main` (or manual `workflow_dispatch`) via `expo prebuild` + Gradle
`assembleRelease`, then publishes it as a GitHub Release (tag
`v1.0.<run_number>`) with `app-release.apk` attached. No Expo/EAS account or
secrets needed — the release build type signs with the default debug
keystore, same as the React Native template does out of the box. This
sandbox can't run it end-to-end (`expo prebuild` needs `api.expo.dev`), so
verify on an actual push/dispatch on GitHub.

## Conventions

- Path alias `@/*` → `src/*`.
- Strings go through i18n (`useI18n().t('section.key')`); add to BOTH locales in
  `src/i18n/translations.ts`. Exercise content is bilingual in the data layer.
- Theme via `useTheme()`; never hardcode colors. Discipline accents:
  `disciplineColor(colors, discipline)`.
- New exercises: add to `src/data/exercises.ts` with level/zone/goal/avoidWith
  tags and an existing `IllustrationKey` (poses live in
  `src/components/illustrations/PoseIllustration.tsx`).
- Persistence is local-only (AsyncStorage) via `src/store/AppState.tsx`.
