"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { Block as BlockType } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const Block = ({
  id,
  index,
  deleteHandler,
}: {
  id?: number;
  index: number;
  deleteHandler: (id: number) => void;
}) => {
  const [localBlock, setLocalBlock] = useState<BlockType>();

  useEffect(() => {
    fetch(`/api/block/${id}`)
      .then((res) => res.json())
      .then((block) => setLocalBlock(block));
  }, [id]);

  return (
    <div className="group w-full items-center flex h-8 rounded-md text-md ">
      <XMarkIcon
        className="invisible group-hover:visible h-4 w-4 rounded-md hover:bg-white"
        onClick={() => id && deleteHandler(id)}
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

          // mutating like this after editing is insane... and creates duplicates on each addition.
          // i should probably just do these mutations optimistically and deal with failures async
          // since having load times is awful ux... right now it's just busted as fuck
          if (!localBlock && !id) {
            fetch(`/api/block`, {
              method: "POST",
              body: JSON.stringify({
                text: e.target.value,
                position: index,
                type: "text",
                documentId: 1,
              }),
            }).then((createdBlock) => {});
          } else {
            setLocalBlock((localBlock) => {
              if (!localBlock) {
                return { text: e.target.value ?? "" };
              } else {
                return {
                  ...localBlock,
                  text: e.target.value ?? "",
                };
              }
            });

            fetch(`/api/block/${id}`, {
              method: "PUT",
              body: JSON.stringify({
                text: e.target.value,
                position: index,
                type: "text",
                documentId: 1,
              }),
            });
          }
        }}
        value={localText}
        data-nonempty={localText.length > 0 ? "true" : "false"}
      />
    </div>
  );
};

// should sort by position
const fetcher = (url: string): Promise<BlockType[]> =>
  fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/document/1", fetcher);
  const [blocks, setBlocks] = useState<BlockType[]>([]);

  useEffect(() => {
    data &&
      setBlocks(
        data.sort((a: BlockType, b: BlockType) => a.position - b.position)
      );
  }, [data]);

  console.log(blocks);

  const deleteBlock = useCallback((id: number) => {
    fetch(`/api/block/${id}`, {
      method: "DELETE",
    });

    setBlocks((blocks) => blocks.filter((block) => block.id !== id));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl items-center justify-between text-md">
        {blocks.map((block: BlockType, index: number) => (
          <Block
            key={block.id}
            index={index}
            id={block.id}
            deleteHandler={deleteBlock}
          />
        ))}
        <Block key={-1} index={data?.length ?? 0} deleteHandler={deleteBlock} />
      </div>
    </main>
  );
}
