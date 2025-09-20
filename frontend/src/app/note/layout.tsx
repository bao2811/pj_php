import Navbar from "@/layout/Navbar";
import { UserProvider, useUser } from "@/components/User";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserProvider>
        <Navbar />
        {children}
      </UserProvider>
    </div>
  );
}
