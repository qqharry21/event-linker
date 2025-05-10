"use server";

import { prisma } from "@/lib/prisma";
import { Types } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function joinEvent(
  eventId: string,
  status: Types.ParticipationStatus = "PENDING",
  comment: string = "",
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to join an event");
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const participation = await prisma.eventParticipation.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {
        status,
        comment,
      },
      create: {
        eventId,
        userId,
        status,
        comment,
      },
    });

    revalidatePath("/events");

    console.log("Successfully joined event", participation);

    return {
      status: 201,
      message: "You have joined the event",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}

export async function removeParticipant(participationId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to remove a participant");
    }

    const participation = await prisma.eventParticipation.findUnique({
      where: { id: participationId },
      include: { event: true },
    });

    if (!participation) {
      throw new Error("Participation not found");
    }

    if (participation.event.createdById !== userId) {
      throw new Error(
        "You are not authorized to remove participants from this event",
      );
    }

    await prisma.eventParticipation.delete({
      where: { id: participationId },
    });

    revalidatePath("/events");

    return {
      status: 200,
      message: "Participant has been removed",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}

export async function updateParticipation(
  eventId: string,
  status: Types.ParticipationStatus,
  comment?: string,
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to update participation status");
    }

    const participation = await prisma.eventParticipation.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!participation) {
      throw new Error("Participation not found");
    }

    await prisma.eventParticipation.update({
      where: {
        id: participation.id,
      },
      data: {
        status,
        comment: status === "DECLINED" && comment ? comment : undefined,
      },
    });

    revalidatePath("/events");

    return {
      status: 200,
      message: `Participation status updated to ${status.toLowerCase()}`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}
