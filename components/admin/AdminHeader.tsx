import { LogoutButton } from "@/components/auth/LogoutButton";

export function AdminHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="font-semibold">Simple POS Admin</div>

        <div className="flex items-center gap-4">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
