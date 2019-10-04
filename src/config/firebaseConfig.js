import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// init
const config = {
  apiKey: "AIzaSyCi2aY1xNsVwafJCv7CZ5k1cC3h8O15AOU",
  authDomain: "howmuchdidipayfor.firebaseapp.com",
  databaseURL: "https://howmuchdidipayfor.firebaseio.com",
  projectId: "howmuchdidipayfor",
  storageBucket: "howmuchdidipayfor.appspot.com",
  messagingSenderId: "345523843482"
};
firebase.initializeApp(config);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collections
const users = db.collection("users");
const settings = db.collection("settings");
const billings = db.collection("billings");
const billingEntries = db.collection("billingEntries");

export { auth, users, settings, billings, billingEntries };
