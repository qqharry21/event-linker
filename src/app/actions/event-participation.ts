"use server";

import { prisma } from "@/lib/prisma";
import { Types } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function joinEvent(
  eventId: string,
  status: Types.ParticipationStatus = "PENDING",
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

    const participation = await prisma.eventParticipation.create({
      data: {
        eventId,
        userId,
        status,
      },
    });

    revalidatePath("/dashboard/events");

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

    revalidatePath("/dashboard/events");

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

export async function updateParticipationStatus(
  eventId: string,
  status: Types.ParticipationStatus,
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
      },
    });

    revalidatePath("/dashboard/events");

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
