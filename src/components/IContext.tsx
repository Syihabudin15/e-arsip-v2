"use client";

import { UserProvider } from "./contexts/UserContext";

export default function IContext({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
