"use client";

interface POSLayoutProps {
  children: React.ReactNode;
}

export default function POSLayout({ children }: POSLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">{children}</main>
    </div>
  );
}
