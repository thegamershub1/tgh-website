import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVzQ4WL_m8-2Uwq3wuCdzxPdIERO58z_c",
  authDomain: "gamershub-booking-2.firebaseapp.com",
  projectId: "gamershub-booking-2",
  storageBucket: "gamershub-booking-2.appspot.com",
  messagingSenderId: "574057359345",
  appId: "1:574057359345:web:e9a693fd6eedeed765c650"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);