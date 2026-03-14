// Import Firebase
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from "firebase/auth";


import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkAEYd8OWXkHMcA3AXP11wNAvd3bLUtp8",
  authDomain: "free-sms-27bf4.firebaseapp.com",
  projectId: "free-sms-27bf4",
  storageBucket: "free-sms-27bf4.firebasestorage.app",
  messagingSenderId: "576142187938",
  appId: "1:576142187938:web:8999420fb074efddf326fb",
  measurementId: "G-8YFS9TTXTG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Auth
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


// Firestore
export const db = getFirestore(app);






/* ===== Get Live GPS ===== */

function getLiveLocation() {

  return new Promise((resolve) => {

    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

        resolve({
          latitude: lat,
          longitude: lng,
          googleMap: mapLink
        });

      },
      () => resolve(null)
    );

  });

}


// Save user to Firestore
async function saveUser(user) {

  const userRef = doc(db, "users", user.uid);

  const data = {
    uid: user.uid,

    fullname: user.displayName || "",
    firstname: user.displayName?.split(" ")[0] || "",
    lastname: user.displayName?.split(" ")[1] || "",

    gmail: user.email || "",
    mobilenumber: user.phoneNumber || "",

    profileimg: user.photoURL || "",   // profile image
    address: "",                       // user address

    dateofbirth: "",

    profileComplete: false,

    createdAt: new Date()
  };

  await setDoc(userRef, data, { merge: true });
}


/* ================= GOOGLE LOGIN ================= */

export const googleLogin = async () => {

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  await saveUser(user);

  return user;
};



/* ================= FACEBOOK LOGIN ================= */

export const facebookLogin = async () => {

  const result = await signInWithPopup(auth, facebookProvider);
  const user = result.user;

  await saveUser(user);

  return user;
};


/* ================= VIDEO UPLOAD ================= */
export const uploadVideo = async (url, title, description, editId = null) => {
  if (editId) {
    // UPDATE existing video
    const docRef = doc(db, "videos", editId);
    await updateDoc(docRef, { url, title, description });
    alert("ভিডিও আপডেট সফল হয়েছে");
    return;
  }

  // Check duplicate URL
  const q = query(collection(db, "videos"), where("url", "==", url));
  const snap = await getDocs(q);

  if (!snap.empty) {
    alert("এই ভিডিও URL আগে ব্যবহার হয়েছে");
    return;
  }

  await addDoc(collection(db, "videos"), {
    url,
    title,
    description,
    createdAt: new Date()
  });
  alert("ভিডিও আপলোড সফল হয়েছে");
};

/* ================= REEL UPLOAD ================= */
export const uploadReel = async (url, title, description, editId = null) => {
  if (editId) {
    // UPDATE existing reel
    const docRef = doc(db, "reels", editId);
    await updateDoc(docRef, { url, title, description });
    alert("Reel আপডেট সফল হয়েছে");
    return;
  }

  // Check duplicate URL
  const q = query(collection(db, "reels"), where("url", "==", url));
  const snap = await getDocs(q);

  if (!snap.empty) {
    alert("এই Reel URL আগে ব্যবহার হয়েছে");
    return;
  }

  await addDoc(collection(db, "reels"), {
    url,
    title,
    description,
    createdAt: new Date()
  });
  alert("Reel আপলোড সফল হয়েছে");
};/* ================= UPDATE USER PROFILE ================= */
export const updateUsernamePassword = async (uid, username, password) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    username: username.toLowerCase(),
    password: password.toLowerCase()
  });

  alert("Username এবং Password আপডেট সফল হয়েছে");
};