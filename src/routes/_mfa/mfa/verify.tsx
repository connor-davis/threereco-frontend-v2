import { postApiAuthenticationMfaVerify } from "@/api-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

function Verify() {
  const { to } = useSearch({
    from: "/_mfa/mfa/verify",
  });
  const navigate = useNavigate();

  const [mfaCode, setMfaCode] = useState<string>();

  const verifyMfa = async () => {
    const { error, response } = await postApiAuthenticationMfaVerify({
      body: {
        code: mfaCode,
      },
    });

    if (error)
      return toast.error(response.statusText, {
        description: error.message,
        duration: 2000,
      });
    else return navigate({ to });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-muted p-3">
      <div className="flex flex-col w-full h-auto p-3 space-y-5 bg-muted lg:max-w-96">
        <div className="flex flex-col space-y-3 text-center">
          <Label className="text-lg font-bold text-center text-primary">
            3rEco MFA
          </Label>
          <Label className="text-sm text-muted-foreground">
            Please enter your MFA Code from your authenticator app below.
          </Label>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            onChange={(value: string) =>
              /^\d+$/g.test(value) && setMfaCode(value)
            }
            onComplete={() => verifyMfa()}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="bg-white" />
              <InputOTPSlot index={1} className="bg-white" />
              <InputOTPSlot index={2} className="bg-white" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="bg-white" />
              <InputOTPSlot index={4} className="bg-white" />
              <InputOTPSlot index={5} className="bg-white" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_mfa/mfa/verify")({
  component: Verify,
  validateSearch: z.object({ to: z.string() }),
});
