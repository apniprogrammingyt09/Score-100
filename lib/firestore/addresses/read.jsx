"use client";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useUserAddresses({ uid }) {
  const { data, error } = useSWRSubscription(
    uid ? ["user_addresses", uid] : null,
    ([path, uid], { next }) => {
      const ref = collection(db, `users/${uid}/addresses`);
      const q = query(ref, orderBy("timestampCreate", "desc"));
      
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          next(null, snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          next(error?.message);
        }
      );
      return () => unsub();
    }
  );

  return { data, error, isLoading: data === undefined };
}