"use server";

import { prisma } from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { Types } from "@/types/global";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

type CreateEvent = Omit<
  Types.Event,
  "id" | "background" | "createdById" | "createdAt" | "updatedAt"
>;

export async function createEvent(formData: CreateEvent) {
  try {
    await sleep(5000);
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be signed in to create an event");
    }

    console.log("create event server action", formData);

    const data = await prisma.event.create({
      data: {
        ...formData,
        createdById: userId,
      },
    });

    revalidateTag("event");

    console.log("create Success", data);

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
