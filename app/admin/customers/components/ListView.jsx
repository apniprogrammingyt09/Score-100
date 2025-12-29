"use client";

import { useUsers } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ListView() {
  const { data: users, error, isLoading } = useUsers();
  const [userStats, setUserStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  useEffect(() => {
    if (users?.length > 0) {
      fetchUserStats(users.map(u => u.id));
    }
  }, [users]);

  const fetchAdminEmails = async () => {
    try {
      const adminQuery = query(collection(db, 'admins'));
      const adminSnapshot = await getDocs(adminQuery);
      const emails = adminSnapshot.docs.map(doc => doc.id);
      setAdminEmails(emails);
    } catch (error) {
      console.error('Failed to fetch admin emails:', error);
    }
  };

  const fetchUserStats = async (uids) => {
    setLoadingStats(true);
    try {
      const stats = {};
      
      for (const uid of uids) {
        // Fetch cart items with product details
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid));
        const cartSnapshot = await getDocs(cartQuery);
        const cartItems = [];
        
        for (const cartDoc of cartSnapshot.docs) {
          const cartData = cartDoc.data();
          if (cartData.productId) {
            const productDoc = await getDocs(query(collection(db, 'products'), where('id', '==', cartData.productId)));
            if (!productDoc.empty) {
              cartItems.push({ title: productDoc.docs[0].data().title });
            }
          }
        }
        
        // Get favorites with product details
        const user = users.find(u => u.id === uid);
        const favItems = [];
        
        if (user?.favorites?.length > 0) {
          for (const productId of user.favorites) {
            const productDoc = await getDocs(query(collection(db, 'products'), where('id', '==', productId)));
            if (!productDoc.empty) {
              favItems.push({ title: productDoc.docs[0].data().title });
            }
          }
        }
        
        stats[uid] = {
          cartCount: cartSnapshot.size,
          cartItems: cartItems,
          favCount: user?.favorites?.length || 0,
          favItems: favItems
        };
      }
      
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Photo</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Email
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Cart Items
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Favorites
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.filter(user => {
            // Filter out admin users by checking against admins collection
            return !adminEmails.includes(user.email);
          }).map((item, index) => {
            return <Row index={index} item={item} stats={userStats[item.id]} key={item?.id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index, stats }) {
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <Avatar src={item?.photoURL} showFallback name={item?.displayName?.charAt(0) || 'U'} aria-label={`${item?.displayName || 'User'} profile picture`} />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.displayName || 'N/A'}</td>
      <td className="border-y bg-white px-3 py-2">{item?.email || 'No email'}</td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex flex-col gap-1">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {stats?.cartCount || 0} items
          </span>
          {stats?.cartItems?.length > 0 && (
            <div className="text-xs text-gray-600 max-w-xs">
              {stats.cartItems.slice(0, 2).map((item, idx) => (
                <div key={idx} className="truncate">{item.title}</div>
              ))}
              {stats.cartItems.length > 2 && <div>+{stats.cartItems.length - 2} more</div>}
            </div>
          )}
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex flex-col gap-1">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {stats?.favCount || 0} items
          </span>
          {stats?.favItems?.length > 0 && (
            <div className="text-xs text-gray-600 max-w-xs">
              {stats.favItems.slice(0, 2).map((item, idx) => (
                <div key={idx} className="truncate">{item.title}</div>
              ))}
              {stats.favItems.length > 2 && <div>+{stats.favItems.length - 2} more</div>}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
