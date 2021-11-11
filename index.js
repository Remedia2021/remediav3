// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import * as firebaseui from 'firebaseui';

// Document elements
const signinButton = document.getElementById('signin');
const guestbookContainer = document.getElementById('guestbook-container');
const guestbook = document.getElementById('guestbook');


let guestbookListener = null;
let db, auth,storage;


async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyBIL-lWS90ga5ATsyVTyoOqfzRbCGnB0To",
    authDomain: "edtech-tr.firebaseapp.com",
    projectId: "edtech-tr",
    storageBucket: "edtech-tr.appspot.com",
    messagingSenderId: "457756233241",
    appId: "1:457756233241:web:0cb9f038cd82d4e1ce6488",
    measurementId: "G-E5K8F19YY0"
  };
  // Make sure Firebase is initilized
  try {
    if (firebaseConfig && firebaseConfig.apiKey) {
      initializeApp(firebaseConfig);
    }
    db = getFirestore();
    auth = getAuth();
    storage = getStorage();
    
    
  } catch (e) {
    console.log('error:', e);
    document.getElementById('app').innerHTML =
      '<h1>Welcome to the Codelab! Add your Firebase config object to <pre>/index.js</pre> and refresh to get started</h1>';
    throw new Error(
      'Welcome to the Codelab! Add your Firebase config object from the Firebase Console to `/index.js` and refresh to get started'
    );
  }

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };
  const ui = new firebaseui.auth.AuthUI(getAuth());

  // Listen to RSVP button clicks
  signinButton.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth);
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });
  getDownloadURL(ref(storage, 'txtimage.jpg'))
  .then((url) => {
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });
  // Listen to the current Auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      signinButton.textContent = 'LOGOUT';
      // Show guestbook to logged-in users
      guestbookContainer.style.display = 'block';

      // Subscribe to the guestbook collection
      subscribeGuestbook();
      // Subcribe to the user's RSVP
    } else {
      signinButton.textContent = 'Sign-in';
      // Hide guestbook for non-logged-in users
      guestbookContainer.style.display = 'none';
      // Unsubscribe from the guestbook collection
      unsubscribeGuestbook();
      // Unsubscribe from the guestbook collection
    }
  });

}
main();

// Listen to guestbook updates
function subscribeGuestbook() {
  const q = query(collection(db, 'RemedIA'), orderBy('date', 'asc'));
  guestbookListener = onSnapshot(q, snaps => {
    // Reset page
    guestbook.innerHTML = ' ';

    // Loop through documents in database
    snaps.forEach(doc => {
      // Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().text;
     //  guestbook.appendChild(entry);
      document.getElementById("checktext").value = entry.textContent
      
    });
  });
}

// Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}



// Listen for attendee list

