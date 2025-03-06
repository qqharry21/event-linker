import { prisma } from "@/lib/prisma";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (evt.type === "user.created") await createUser(evt.data);
  else if (evt.type === "user.updated") await updateUser(evt.data);
  else if (evt.type === "user.deleted") await deleteUser(evt.data.id);

  return new Response("Webhook received", { status: 200 });
}

async function createUser(userData: UserJSON) {
  try {
    const displayName = userData.first_name
      ? `${userData.last_name ? userData.last_name + " " : ""}${userData.first_name}`
      : (userData.username ?? "User");

    const newUser = await prisma.user.create({
      data: {
        id: userData.id,
        avatarUrl: userData.image_url,
        displayName,
      },
    });
    console.log("User created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
async function updateUser(userData: UserJSON) {
  try {
    const displayName =
      userData.first_name && userData.last_name
        ? `${userData.last_name ? userData.last_name + " " : ""}${userData.first_name}`
        : (userData.username ?? "User");

    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        avatarUrl: userData.image_url,
        displayName,
      },
    });
    console.log("User updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
async function deleteUser(userId?: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log("User deleted:", deletedUser);
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
