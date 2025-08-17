// src/lib/firebase/firestore.js
import { db } from "./firebase-admin";

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

export const deleteCollection = async (collectionName) => {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const listCollections = async () => {
  const collections = await db.listCollections();
  return collections.map((col) => col.id);
};
