import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";

// Generic CRUD operations for Firestore

// Create a document
export const createDocument = async (collectionName: string, data: DocumentData) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Create or update a document with a specific ID
export const setDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  try {
    await setDoc(
      doc(db, collectionName, docId),
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Read a single document
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: "Document not found" };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Read all documents from a collection
export const getDocuments = async (collectionName: string, constraints?: QueryConstraint[]) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: documents, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update a document
export const updateDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Query helpers
export { where, orderBy, limit };
