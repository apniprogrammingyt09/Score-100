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

export const createNewCollection = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.title) {
    throw new Error("Name is required");
  }
  const newId = doc(collection(db, `ids`)).id;
  
  // Generate slug from title
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Convert image to base64
  const imageURL = await compressAndConvertToBase64(image, 600, 0.8);

  await setDoc(doc(db, `collections/${newId}`), {
    ...data,
    id: newId,
    slug: slug,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCollection = async ({ data, image }) => {
  if (!data?.title) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  const id = data?.id;
  
  // Generate slug from title
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let imageURL = data?.imageURL;

  if (image) {
    // Convert new image to base64
    imageURL = await compressAndConvertToBase64(image, 600, 0.8);
  }

  await updateDoc(doc(db, `collections/${id}`), {
    ...data,
    slug: slug,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCollection = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `collections/${id}`));
};
