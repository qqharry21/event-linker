"use server";

import { prisma } from "@/lib/prisma";
import { Types } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateEvent = Omit<
  Types.Event,
  "id" | "background" | "createdById" | "createdAt" | "updatedAt"
>;

export async function createEvent(formData: CreateEvent) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to create an event");
    }

    const data = await prisma.event.create({
      data: {
        ...formData,
        createdById: userId,
        participation: {
          create: [
            {
              userId,
              status: "ACCEPTED",
            },
          ],
        },
      },
    });

    revalidatePath("/events");

    console.log("Successfully created event", data);

    return {
      status: 201,
      message: `Event ${data.title} has been created!`,
    };
  } catch (error) {
    console.log("create event error", error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}

type UpdateEvent = Partial<CreateEvent>;

export async function updateEvent(eventId: string, data: UpdateEvent) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to update an event");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.createdById !== userId) {
      throw new Error("You are not authorized to update this event");
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    revalidatePath("/events");

    return {
      status: 200,
      message: `Event ${updatedEvent.title} has been updated!`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}

export async function closeEvent(eventId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to close an event");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.createdById !== userId) {
      throw new Error("You are not authorized to close this event");
    }

    // Set the end date to now to mark it as closed
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        endDate: new Date(),
      },
    });

    revalidatePath("/events");

    return {
      status: 200,
      message: `Event ${updatedEvent.title} has been closed`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}

export async function archiveEvent(eventId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to archive an event");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.createdById !== userId) {
      throw new Error("You are not authorized to archive this event");
    }

    // Add archived field to event model if not exists
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        // archived: true,
      },
    });

    revalidatePath("/events");

    return {
      status: 200,
      message: `Event ${updatedEvent.title} has been archived`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong, please try again later",
    };
  }
}
