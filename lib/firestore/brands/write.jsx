import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { compressAndConvertToBase64 } from "@/lib/utils/imageUtils";

export const createNewBrand = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }

  const newId = doc(collection(db, `ids`)).id;
  
  // Convert image to base64
  const imageURL = await compressAndConvertToBase64(image, 400, 0.8);

  await setDoc(doc(db, `brands/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateBrand = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    // Convert new image to base64
    imageURL = await compressAndConvertToBase64(image, 400, 0.8);
  }

  await updateDoc(doc(db, `brands/${id}`), {
    ...data,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteBrand = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `brands/${id}`));
};
