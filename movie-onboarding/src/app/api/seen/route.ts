import { run } from '@/funcs/db'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server';



export async function GET(req: NextRequest) {
    const { userId } = await auth();
    const movieId = req.nextUrl.searchParams.get("movieId");
    if (!userId || !movieId) {
        console.error("User ID or Movie ID is not available");
        return NextResponse.json({ error: "User ID or Movie ID is not available" }, { status: 400 });
    }
    
    const result = await run();

    if (!result) {
      console.error("Collection not found");
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const { col, client } = result;
    if (col) {
        const user = await col.findOne({ userId })
        const all = await col.find({}).toArray();
        console.log("All users:", all);
        if (!user) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const seenSet = new Set(user.seen);
        client.close();
        return NextResponse.json({ seen: seenSet.has(movieId) });
    }

    client.close();
    return NextResponse.json({ seen: false });
}

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const movieId = payload.movieId;
    const { userId } = await auth();


    if (!userId) {
        console.error("User ID is not available");
        return NextResponse.json({ error: "User ID is not available" }, { status: 400 });
    }

    const result = await run();

    if (!result) {
        console.error("Collection not found");
        return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const { col, client } = result;
    if (col) {
        const user = await col.findOne({ userId });
        if (!user) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const seenSet = new Set(user.seen);

        const hasSeen = seenSet.has(movieId);

        const updateOp = hasSeen
            ? { $pull: { seen: movieId } }    // remove
            : { $addToSet: { seen: movieId } }; // add

        await col.updateOne({ userId }, updateOp );
        return NextResponse.json({ success: true });
    }
    client.close();
}