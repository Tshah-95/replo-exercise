"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { Block as BlockType } from "@prisma/client";
import { useState } from "react";
import useSWR, { mutate } from "swr";

const Block = ({
  text,
  id,
  index,
}: {
  text: string;
  id?: number;
  index: number;
}) => {
  const [localText, setLocalText] = useState(text);
  return (
    <div className="group w-full items-center flex h-8 rounded-md text-md ">
      <XMarkIcon
        className="invisible group-hover:visible h-4 w-4 rounded-md hover:bg-white"
        onClick={() => {
          if (id) {
            fetch(`/api/block/${id}`, {
              method: "DELETE",
            });
            mutate("/api/document/1");
          }
        }}
      />
      <input
        type="text"
        className="w-full min-h-max resize-none focus:outline-none py-2 px-2 bg-transparent invisible data-[nonempty=true]:visible group-hover:visible"
        placeholder="Add a line..."
        onChange={(e) => {
          console.log(e.target.value);
          // create debounced function to send updated text to server
          // then create a mutation to get the new values to the parent component
          // (inefficient since it refreshes all blocks, but it'd be a start)
          setLocalText(e.target.value);

          // mutating like this after editing is insane... and creates duplicates on each addition.
          // i should probably just do these mutations optimistically and deal with failures async
          // since having load times is awful ux... right now it's just busted as fuck
          if (!id) {
            fetch(`/api/block`, {
              method: "POST",
              body: JSON.stringify({
                text: e.target.value,
                position: index,
                type: "text",
                documentId: 1,
              }),
            });

            mutate("/api/document/1");
          } else {
            fetch(`/api/block/${id}`, {
              method: "PUT",
              body: JSON.stringify({
                text: e.target.value,
                position: index,
                type: "text",
                documentId: 1,
              }),
            });

            mutate("/api/document/1");
          }
        }}
        value={localText}
        data-nonempty={localText.length > 0 ? "true" : "false"}
      />
    </div>
  );
};

// should sort by position
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/document/1", fetcher);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl items-center justify-between text-md">
        {data
          ?.sort((a: BlockType, b: BlockType) => a.position - b.position)
          .map((block: BlockType, index: number) => (
            <Block
              key={block.id}
              text={block.text}
              index={index}
              id={block.id}
            />
          ))}
        <Block key={-1} text="" index={data?.length} />
      </div>
    </main>
  );
}
