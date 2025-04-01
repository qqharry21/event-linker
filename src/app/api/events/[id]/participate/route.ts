import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ParticipationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, comment } = body as {
      status: ParticipationStatus;
      comment: string;
    };

    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const participation = await prisma.eventParticipation.upsert({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId: user.id,
        },
      },
      update: {
        status,
        comment,
      },
      create: {
        eventId: params.id,
        userId: user.id,
        status,
        comment,
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.error("[EVENT_PARTICIPATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
