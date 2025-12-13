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

export const createNewAdmin = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const newId = data?.email;

  // Convert image to base64
  const imageURL = await compressAndConvertToBase64(image, 300, 0.8);

  await setDoc(doc(db, `admins/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateAdmin = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    // Convert new image to base64
    imageURL = await compressAndConvertToBase64(image, 300, 0.8);
  }

  if (id === data?.email) {
    await updateDoc(doc(db, `admins/${id}`), {
      ...data,
      imageURL: imageURL,
      timestampUpdate: Timestamp.now(),
    });
  } else {
    const newId = data?.email;

    await deleteDoc(doc(db, `admins/${id}`));

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampUpdate: Timestamp.now(),
    });
  }
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `admins/${id}`));
};
