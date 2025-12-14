"use client";
import { useNewsletterSubscribers } from "@/lib/firestore/newsletter/read";
import { CircularProgress } from "@nextui-org/react";

export default function ListView() {
  const { data: subscribers, error, isLoading } = useNewsletterSubscribers();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Newsletter Subscribers</h2>
        <p className="text-gray-600">Total subscribers: {subscribers?.length || 0}</p>
      </div>

      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Email
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Subscribed Date
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {subscribers?.map((subscriber, index) => (
            <tr key={subscriber.id}>
              <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
                {index + 1}
              </td>
              <td className="border-y bg-white px-3 py-2">
                {subscriber.email}
              </td>
              <td className="border-y bg-white px-3 py-2">
                {subscriber.subscribedAt?.toDate?.()?.toLocaleDateString() || 
                 new Date(subscriber.subscribedAt?.seconds * 1000).toLocaleDateString()}
              </td>
              <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                  {subscriber.status || 'Active'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subscribers?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No newsletter subscribers yet.
        </div>
      )}
    </div>
  );
}