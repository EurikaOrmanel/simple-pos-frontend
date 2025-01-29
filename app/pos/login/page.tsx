import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function POSLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">POS Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the POS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm type="pos" />
        </CardContent>
      </Card>
    </div>
  );
}
