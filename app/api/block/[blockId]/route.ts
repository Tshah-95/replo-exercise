import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: any,
  {
    params,
  }: {
    params: {
      blockId: string;
    };
  }
) => {
  const { blockId } = params;

  try {
    const block = await prisma.block.findUnique({
      where: {
        id: parseInt(blockId),
      },
    });

    return NextResponse.json(block);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "An error occurred while fetching the block" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      blockId: string;
    };
  }
) => {
  const { blockId } = params;
  const body = await req.json();

  try {
    const block = await prisma.block.update({
      where: {
        id: parseInt(blockId),
      },
      data: {
        id: parseInt(blockId),
        documentId: body.documentId,
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

export const DELETE = async (
  _: any,
  {
    params,
  }: {
    params: {
      blockId: string;
    };
  }
) => {
  const { blockId } = params;

  try {
    const block = await prisma.block.delete({
      where: {
        id: parseInt(blockId),
      },
    });

    return NextResponse.json(block);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "An error occurred while deleting the block" },
      { status: 500 }
    );
  }
};
