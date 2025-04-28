# Product Quality Assessment App

A mobile application for evaluating food products based on their composition and nutritional information.

## Features

- Scan product barcodes to retrieve nutrition information
- Search for products by name or category
- View detailed nutritional information with Nutri-Score rating
- Save favorite products for quick access
- View history of previously scanned/searched products
- Filter products by categories
- Sort products by nutritional quality

## Tech Stack

### Frontend

- React Native with Expo
- TypeScript
- Redux Toolkit for state management
- React Navigation for navigation
- AsyncStorage for local data persistence

### Backend (Firebase)

- Firebase Authentication
- Firebase Firestore for database
- Firebase Storage for storing images

### API Integration

- Open Food Facts API for product information

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/ProductQualityApp.git
cd ProductQualityApp
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Set up Firebase:

   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration in `src/utils/config.ts`

4. Start the development server:

```
npm start
# or
yarn start
```

5. Open the app on your device or emulator:
   - Press 'a' for Android Emulator
   - Press 'i' for iOS Simulator
   - Scan the QR code with Expo Go app on your device

## Project Structure

```
ProductQualityApp/
├── src/
│   ├── api/             # API integration
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   ├── redux/           # Redux store, slices, etc.
│   ├── screens/         # App screens
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions and constants
├── App.tsx              # Main application component
└── package.json         # Dependencies and scripts
```

## Dependencies

The main dependencies used in this project:

- `react-native`
- `expo`
- `@reduxjs/toolkit`
- `react-navigation`
- `firebase`
- `@react-native-async-storage/async-storage`
- `axios`

Check `package.json` for the complete list of dependencies.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
