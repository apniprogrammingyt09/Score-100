"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import useSWR from "swr";

export const getOrdersCounts = async ({ date }) => {
  const ref = collection(db, `orders`);
  let q = query(ref);

  if (date) {
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(date);
    toDate.setHours(23, 59, 59, 999);
    q = query(
      q,
      where("timestampCreate", ">=", fromDate),
      where("timestampCreate", "<=", toDate)
    );
  }

  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map(doc => doc.data());
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const amount = order?.checkout?.amount_total || order?.checkout?.amount || 0;
    return sum + amount;
  }, 0);

  const result = { totalOrders, totalRevenue };
  
  if (date) {
    return {
      date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      data: result,
    };
  }
  return result;
};

const getTotalOrdersCounts = async (dates) => {
  let promisesList = [];
  for (let i = 0; i < dates?.length; i++) {
    const date = dates[i];
    promisesList.push(getOrdersCounts({ date: date }));
  }
  const list = await Promise.all(promisesList);
  return list;
};

export function useOrdersCounts() {
  const { data, error, isLoading } = useSWR("ordrs_counts", (key) =>
    getOrdersCounts({ date: null })
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}

export function useOrdersCountsByTotalDays({ dates }) {
  const { data, error, isLoading } = useSWR(
    ["orders_count", dates],
    ([key, dates]) =>
      getTotalOrdersCounts(dates?.sort((a, b) => a?.getTime() - b?.getTime()))
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}
