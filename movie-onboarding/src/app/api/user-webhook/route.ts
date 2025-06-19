import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { MongoClient } from 'mongodb';

interface ClerkWebhookEvent {
  data: {
    id: string;
    object: 'user';
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    username?: string;
    // ...add more Clerk fields as needed
  };
  object: 'event';
  type: string;
}



export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = await headers();

  const svix_id = headersList.get("svix-id")!;
  const svix_timestamp = headersList.get("svix-timestamp")!;
  const svix_signature = headersList.get("svix-signature")!;
  
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const evt = webhook.verify(
    JSON.stringify(payload),
    {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }
  ) as ClerkWebhookEvent;

  const { id } = evt.data;

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db("tl-onboarding");
  const col = db.collection("users");

  await col.insertOne({
    userId: id,
    seen: [],
    recommended: {},
  });

  await client.close();

  return NextResponse.json({ success: true });
}