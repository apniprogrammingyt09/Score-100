import ListView from "./components/ListView";

export default function Page() {
  return (
    <main className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-xl">Newsletter Subscribers</h1>
      </div>
      <ListView />
    </main>
  );
}