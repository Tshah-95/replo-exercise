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

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      documentId: string;
    };
  }
) => {
  const { documentId } = params;
  const body = await req.json();

  try {
    const block = await prisma.block.create({
      data: {
        documentId: parseInt(documentId),
        position: body.position,
        type: body.type,
        text: body.text,
      },
    });

    return NextResponse.json(block);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "An error occurred while creating the block" },
      { status: 500 }
    );
  }
};
