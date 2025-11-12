// Firebase Configuration
// Get these values from your Firebase Console:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Select your project: personalwebsite-talia
// 3. Go to Project Settings (gear icon)
// 4. Scroll down to "Your apps" section
// 5. Click on the web app or create a new web app
// 6. Copy the config values from there

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "personalwebsite-talia.firebaseapp.com",
  projectId: "personalwebsite-talia",
  storageBucket: "personalwebsite-talia.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
}

