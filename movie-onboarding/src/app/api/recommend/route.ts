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
      
        const user = await col.findOne({ userId });
        if (!user) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const recommend = user.recommended;
        if (recommend && recommend[movieId] !== undefined) {
            return NextResponse.json({ recommendation: recommend[movieId] });
      }
      
    }
    client.close();
    return NextResponse.json({ recommendation: null });
}

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const movieId = payload.movieId;
    const { userId } = await auth();
    const recommendation = payload.recommendation;

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
    if (!col) {
        client.close();
        return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    try {
        await col.updateOne(
        { userId },
        { $set: { [`recommended.${movieId}`]: recommendation } }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DB update failed", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    } finally {
        client.close();
    }
}
