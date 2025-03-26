import { NextResponse } from "next/server";
import { connectToDB } from "../../../../mongodb/database";
import User from "../../../../models/User";

// Fetch all users
export async function GET() {
  await connectToDB();
  try {
    const users = await User.find();
    console.log("Fetched Users:", users);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Delete a user by ID
export async function DELETE(req) {
  await connectToDB();
  try {
    // Extract user ID from request URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract last part of the URL

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
