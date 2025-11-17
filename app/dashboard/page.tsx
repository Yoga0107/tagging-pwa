import { authOptions } from "app/api/auth/route";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-semibold">
        Dashboard PIC — {session?.user?.email}
      </h1>
    </div>
  );
}
