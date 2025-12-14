import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";

export const saveUserAddress = async ({ uid, address }) => {
  const addressId = doc(collection(db, "ids")).id;
  
  await setDoc(doc(db, `users/${uid}/addresses/${addressId}`), {
    ...address,
    id: addressId,
    timestampCreate: Timestamp.now(),
  });
  
  return addressId;
};

export const deleteUserAddress = async ({ uid, addressId }) => {
  await deleteDoc(doc(db, `users/${uid}/addresses/${addressId}`));
};