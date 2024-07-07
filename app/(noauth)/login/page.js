import LoginForm from "@/components/forms/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <Card className="z-50 shadow-none">
        <CardHeader>
          <CardTitle className="text-center">3rEco</CardTitle>
          <CardDescription className="text-center">
            Please login with your email and password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-black pattern-bg-white pattern-size-2 pattern-opacity-5"></div>
    </div>
  );
}
