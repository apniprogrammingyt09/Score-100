import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";

export const saveUserAddress = async ({ uid, address, addressId = null }) => {
  const id = addressId || doc(collection(db, "ids")).id;
  
  const addressData = {
    ...address,
    id,
  };
  
  if (!addressId) {
    addressData.timestampCreate = Timestamp.now();
  }
  
  await setDoc(doc(db, `users/${uid}/addresses/${id}`), addressData);
  
  return id;
};

export const deleteUserAddress = async ({ uid, addressId }) => {
  await deleteDoc(doc(db, `users/${uid}/addresses/${addressId}`));
};