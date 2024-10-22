import { postApiAuthenticationMfaVerify } from "@/api-client";
import { getApiAuthenticationMfaEnableOptions } from "@/api-client/@tanstack/react-query.gen";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { z } from "zod";

function Enable() {
  const { to } = useSearch({
    from: "/_mfa/mfa/enable",
  });
  const navigate = useNavigate();

  const [mfaCode, setMfaCode] = useState<string>();

  const {
    data: mfaData,
    isLoading: isLoadingMfaData,
    isError: isMfaDataError,
  } = useQuery({ ...getApiAuthenticationMfaEnableOptions() });

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
      <div className="flex flex-col w-full h-auto p-3 space-y-5 lg:max-w-96 bg-background rounded-md border">
        <div className="flex flex-col space-y-3 text-center">
          <Label className="text-lg font-bold text-center text-primary">
            3rEco MFA
          </Label>
          <Label className="text-sm text-muted-foreground">
            You are required to use MFA to access this application. Please scan
            the QR code with your authenticator app.
          </Label>
          <Label className="text-sm text-muted-foreground">
            After scanning the QR code, once you have the 6-digit code, enter it
            in the MFA code input.
          </Label>
        </div>

        <div className="flex flex-col items-center space-y-3">
          {mfaData && (
            <QRCode fgColor="text-primary" className="w-full" value={mfaData} />
          )}

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

export const Route = createFileRoute("/_mfa/mfa/enable")({
  component: Enable,
  validateSearch: z.object({ to: z.string() }),
});
