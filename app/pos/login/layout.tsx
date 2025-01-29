interface POSLoginLayoutProps {
  children: React.ReactNode;
}

export default function POSLoginLayout({ children }: POSLoginLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      {children}
    </div>
  );
}
