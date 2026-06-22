# Flora 🌿 — Yoga · Pilates · Gym

Tu práctica diaria de yoga, pilates y movimiento **en casa, sin equipo**. Flora
genera cada día una rutina personalizada según tu nivel, enfoque, tiempo
disponible, zonas a trabajar y posibles lesiones — con una estética minimalista
y moderna inspirada en iOS.

> La idea nació de un problema real: encontrar, agrupados y bien guiados, los
> ejercicios que tocaba hacer cada día. Flora reúne ese catálogo y te lleva de
> la mano.

## ✨ Características

- **Rutina diaria automática** personalizada (nivel · enfoque · tiempo · zonas ·
  objetivos · lesiones), estable durante el día y regenerable a un toque.
- **Biblioteca completa** de ejercicios de yoga, pilates y gym (peso corporal),
  con búsqueda y filtros por disciplina, nivel y zona del cuerpo.
- **Reproductor guiado** con cuenta atrás de preparación, temporizador o conteo
  de repeticiones, manejo de ejercicios bilaterales, descansos y pantalla de
  cierre que registra la sesión.
- **Progreso y constancia**: rachas, estadísticas, actividad de los últimos 7
  días y logros.
- **Bilingüe** (Español / English) y **modo claro/oscuro** (automático).
- **100 % local y privado**: sin cuentas, sin internet. Tus datos viven en tu
  dispositivo.

## 🧱 Stack

- [Expo](https://expo.dev) (SDK 56) + React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) (navegación basada en archivos)
- `react-native-svg` para las ilustraciones de posturas
- `AsyncStorage` para la persistencia local
- `expo-haptics` para el tacto tipo iOS

## 🗂️ Arquitectura

```
app/                         Rutas (Expo Router)
  _layout.tsx                Providers + Stack
  index.tsx                  Gate: onboarding o app
  onboarding.tsx             Flujo de bienvenida por pasos
  (tabs)/                    Hoy · Biblioteca · Progreso · Ajustes
  exercise/[id].tsx          Detalle de ejercicio
  player.tsx                 Reproductor de sesión guiada

src/
  theme/                     Sistema de diseño (tokens, paletas, tema)
  i18n/                      Diccionario ES/EN + contexto
  data/                      Tipos, catálogo y base de datos de ejercicios
  logic/                     Generador de rutinas (algoritmo)
  store/                     Estado global + persistencia local
  components/                UI (botones, tarjetas, chips…) e ilustraciones
  utils/                     Utilidades de formato
```

El **generador de rutinas** (`src/logic/routineGenerator.ts`) filtra el catálogo
por disciplina, nivel y lesiones, lo ordena según las zonas/objetivos del usuario
con algo de aleatoriedad sembrada por fecha (rutina estable cada día) y compone
una sesión con calentamiento → bloque principal → vuelta a la calma, ajustada al
tiempo elegido.

## ▶️ Ejecutar

```bash
npm install
npx expo start          # escanea el QR con Expo Go (iOS/Android)
# o
npm run android         # emulador / dispositivo Android
npm run ios             # simulador iOS (requiere macOS)
```

## ⚠️ Aviso

Flora ofrece ejercicios de peso corporal para hacer en casa con fines de
bienestar general. **No es consejo médico.** Ante dudas o lesiones, consulta a un
profesional de la salud.
