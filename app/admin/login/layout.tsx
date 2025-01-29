interface AdminLoginLayoutProps {
  children: React.ReactNode;
}

export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      {children}
    </div>
  );
}
