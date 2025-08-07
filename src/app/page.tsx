import { getSession } from "@/components/utils/Auth";
import { LoginPage } from "@/components/utils/LayoutUtil";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session) redirect("/dashboard");
  return <LoginPage />;
}
