import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../mongodb/database";
import User from "../../../../../models/User";

export async function DELETE(req, { params }) {
    await connectToDB();

    try {
        const { id } = params;
        if (!id) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
