import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-bold">Admin Dashboard</h2>
        <nav>
          <ul className="mt-4 space-y-2">
            <li className="p-2 hover:bg-gray-300 rounded">
              <Link href="/admin/users">👤 Users</Link>
            </li>
            <li className="p-2 hover:bg-gray-300 rounded">
              <Link href="/admin/payments">📄 Payments</Link>
            </li>
            <li className="p-2 hover:bg-gray-300 rounded">
              <Link href="/admin/summary">📊 Summary</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
