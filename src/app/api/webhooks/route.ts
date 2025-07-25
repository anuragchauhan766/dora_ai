import { env } from "@/config/env/server";
import { db } from "@/db/database";
import { users } from "@/db/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Create new Svix instance with secret
  const wh = new Webhook(env.CLERK_WEBHOOKS_SIGNING_SECRET);

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

  try {
    const eventType = evt.type;
    switch (eventType) {
      case "user.created":
        await db.insert(users).values({
          id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          emailVerified: evt.data.email_addresses[0].verification?.status === "verified",
          username: evt.data.username as string,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          avatarUrl: evt.data.image_url,
        });
        break;
      case "user.updated":
        await db.update(users).set({
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          avatarUrl: evt.data.image_url,
          username: evt.data.username as string,
          updatedAt: new Date(),
        });
        break;
      case "user.deleted":
        await db.delete(users).where(eq(users.id, evt.data.id as string));
        break;
      default:
        break;
    }
  } catch (error) {
    console.log("operation failed: ", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }

  return new Response("Webhook received", { status: 200 });
}
