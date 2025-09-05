// app/api/register-profile/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address, ensName, reverseOK, did } = await req.json();

    if (!address || !did) {
      return NextResponse.json(
        { error: "Missing address or DID" },
        { status: 400 }
      );
    }

    // Store minimal identity (works without ENS)
    const user = {
      address: address.toLowerCase(),
      did,
      ensName: ensName ?? null,
      ensVerified: !!ensName && !!reverseOK, // true only if reverse matches
      createdAt: Date.now(),
    };

    // TODO: In a real app, you would store this in your database
    // For now, we'll just return success
    // await db.users.upsert({ where: { address: user.address }, update: user, create: user })

    console.log("User profile registered:", user);

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Error registering profile:", error);
    return NextResponse.json(
      { error: "Failed to register profile" },
      { status: 500 }
    );
  }
}
