"use client";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useNewsletterSubscribers = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "newsletter_subscribers"),
      orderBy("subscribedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const subscribers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(subscribers);
        setIsLoading(false);
      },
      (error) => {
        setError(error?.message);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { data, error, isLoading };
};