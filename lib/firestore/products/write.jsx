import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { compressAndConvertToBase64 } from "@/lib/utils/imageUtils";

export const createNewProduct = async ({ data, featureImage, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature Image is required");
  }
  if (!data?.brandIds || data?.brandIds?.length === 0) {
    throw new Error("At least one Board must be selected");
  }
  
  // Convert feature image to base64
  const featureImageURL = await compressAndConvertToBase64(featureImage, 800, 0.7);

  // Convert all images in imageList to base64
  let imageURLList = [];
  for (let i = 0; i < imageList?.length; i++) {
    const image = imageList[i];
    const base64 = await compressAndConvertToBase64(image, 800, 0.7);
    if (base64) {
      imageURLList.push(base64);
    }
  }

  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateProduct = async ({ data, featureImage, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.brandIds || data?.brandIds?.length === 0) {
    throw new Error("At least one Board must be selected");
  }

  let featureImageURL = data?.featureImageURL ?? "";

  if (featureImage) {
    // Convert new feature image to base64
    featureImageURL = await compressAndConvertToBase64(featureImage, 800, 0.7);
  }

  let imageURLList = imageList?.length === 0 ? data?.imageList : [];

  // Convert all new images to base64
  for (let i = 0; i < imageList?.length; i++) {
    const image = imageList[i];
    const base64 = await compressAndConvertToBase64(image, 800, 0.7);
    if (base64) {
      imageURLList.push(base64);
    }
  }

  await setDoc(doc(db, `products/${data?.id}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteProduct = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  
  // Delete the product
  await deleteDoc(doc(db, `products/${id}`));
  
  // Clean up from all user carts and favorites
  try {
    await fetch('/api/cleanup-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    });
  } catch (error) {
    console.error('Failed to cleanup product from user collections:', error);
  }
};
