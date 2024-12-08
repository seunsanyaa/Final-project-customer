import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, email } = await request.json();

    // Get current user
    const user = await clerkClient.users.getUser(userId);
    
    // First update user details
    await clerkClient.users.updateUser(userId, {
      firstName,
      lastName,
    });

    // Add the new email address
    await user.createEmailAddress({ 
      email: email,
    });

    return NextResponse.json({ 
      success: true,
      message: "Verification email sent. Please check your inbox."
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}