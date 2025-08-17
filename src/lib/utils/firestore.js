// src/lib/firestore.js
import { db } from "../firebase/firebase-admin"; // Assume you have a Firebase Admin SDK setup

export const createFirestoreDocument = async (collection, data) => {
  const docRef = db.collection(collection).doc();
  await docRef.set(data);
  return { id: docRef.id, ...data };
};

export const updateFirestoreDocument = async (collection, id, data) => {
  const docRef = db.collection(collection).doc(id);
  await docRef.update(data);
  return { id, ...data };
};

export const deleteFirestoreDocument = async (collection, id) => {
  const docRef = db.collection(collection).doc(id);
  await docRef.delete();
  return { message: "Document deleted successfully" };
};
