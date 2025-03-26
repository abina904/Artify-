import { NextResponse } from "next/server";
import { connectToDB } from "../../../../mongodb/database";
import User from "../../../../models/User";

export async function GET() {
  await connectToDB();

  try {
    const users = await User.find({}, "orders").lean();

    // Collect all orders with user IDs
    const allOrders = users.flatMap(user =>
      (user.orders || []).map(order => ({
        id: order.id || "N/A",
        userId: user._id.toString(), // Display user ID instead of username
        amountPaid: order.amountPaid ?? 0,
      }))
    );

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
