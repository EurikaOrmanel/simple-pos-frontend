import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedGradient } from "@/components/animated-gradient";

export default function LoginPage() {
  return (
    <>
      <AnimatedGradient />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
