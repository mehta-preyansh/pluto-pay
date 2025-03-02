import MobileNavigation from "@/components/ui/MobileNavigation";
import Sidebar from "@/components/ui/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("/sign-in");
  return (
    <main className="flex w-full h-screen font-inter">
      <Sidebar user={loggedInUser} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="logo" width={30} height={30} />
          <div>
            <MobileNavigation user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
