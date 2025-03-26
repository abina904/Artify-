import { NextResponse } from "next/server";
import { connectToDB } from "../../../../mongodb/database";
import User from "../../../../models/User";

export async function GET() {
  await connectToDB();

  try {
    // Fetch users along with their orders and populate the username
    const users = await User.find({}, "orders username").lean();

    const allOrders = users.flatMap(user =>
      (user.orders || []).map(order => ({
        id: order.id,
        user: user.username, // Populate username instead of just ID
        amountPaid: order.amountPaid ?? 0, // Default to 0 if undefined
      }))
    );

    return Response.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
