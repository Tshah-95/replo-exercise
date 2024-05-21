import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl items-center justify-between text-md">
        <div className="group w-full flex items-center h-8 rounded-md text-md ">
          <EllipsisVerticalIcon className="invisible group-hover:visible h-4 w-4" />
          <input
            type="text"
            className="w-full h-full px-2 invisible group-hover:visible"
            placeholder="Add a line..."
          />
        </div>
      </div>
    </main>
  );
}
