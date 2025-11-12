# Firebase Setup Instructions for Cars Page

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **personalwebsite-talia**
3. Click the gear icon (⚙️) next to "Project Overview" and select **Project Settings**
4. Scroll down to the **"Your apps"** section
5. If you don't have a web app yet:
   - Click **"Add app"** and select the web icon (`</>`)
   - Register your app with a nickname (e.g., "Personal Website")
   - Click **"Register app"**
6. Copy the Firebase configuration object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "personalwebsite-talia.firebaseapp.com",
  projectId: "personalwebsite-talia",
  storageBucket: "personalwebsite-talia.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 2: Update firebase-config.js

1. Open `public/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config values
3. Save the file

## Step 3: Verify Your Firestore Collection

1. In Firebase Console, go to **Firestore Database**
2. Make sure you have a collection named **"cars"**
3. Add some test documents to your "cars" collection if you haven't already

## Step 4: Test the Page

1. Open `cars.html` in your browser (or deploy to Firebase Hosting)
2. You should see your cars displayed in a grid layout

## Troubleshooting

- **"Error loading cars: Firebase not initialized"**: Make sure you've updated `firebase-config.js` with your actual Firebase config
- **"No cars found"**: Make sure your Firestore collection is named exactly "cars" (case-sensitive)
- **CORS errors**: Make sure your Firestore security rules allow read access (they should be configured already)

## Security Note

The current Firestore rules allow read/write access until December 11, 2025. Make sure to update your security rules before that date to restrict access appropriately.

