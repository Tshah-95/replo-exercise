import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const block = await prisma.block.create({
      data: {
        documentId: 1,
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
