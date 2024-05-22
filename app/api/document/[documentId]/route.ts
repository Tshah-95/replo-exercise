import prisma from "@/prisma";
import { Block } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: any, { params }: any) => {
  const { documentId } = params;

  // This should really have a flow for creating a document first and then adding blocks to it
  try {
    const blocks = await prisma.block.findMany({
      where: {
        documentId: parseInt(documentId),
      },
    });

    return NextResponse.json<Block[]>(blocks);
  } catch (e) {
    throw new Error("Community not found");
  }
};
