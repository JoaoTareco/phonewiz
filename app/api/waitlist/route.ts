import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const waitlistEntry = await prismadb.requested_access.create({
      data: { 
        email,
        // We're not setting user_id here since the user isn't authenticated
      },
    });

    return NextResponse.json({ message: "Successfully added to waitlist", data: waitlistEntry });
  } catch (error) {
    console.error('[WAITLIST_POST]', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "This email is already on the waitlist" }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}