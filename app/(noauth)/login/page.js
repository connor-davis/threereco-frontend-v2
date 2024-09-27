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
      <div className="flex flex-col w-auto h-auto p-3 space-y-5 bg-muted lg:max-w-96">
        <div className="flex flex-col space-y-3 text-center">
          <div className="text-lg font-bold text-center">3rEco</div>
          <div className="text-sm text-neutral-500">
            Welcome to 3rEco, please enter your email and password below.
          </div>
        </div>
        <LoginForm />
      </div>
      {/* <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-black pattern-bg-white pattern-size-2 pattern-opacity-5"></div> */}
    </div>
  );
}
