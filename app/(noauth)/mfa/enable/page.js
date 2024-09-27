"use client";

import LoadingSpinner from "@/components/loadingSpinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useUserStore from "@/lib/state/user";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import QRCode from "react-qr-code";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useUserStore();

  const [loading, setLoading] = useState(false);

  const [mfaData, setMfaData] = useState(null);
  const [mfaCode, setMfaCode] = useState("");

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      setLoading(true);

      if (!user) return router.replace("/login");
      if (user.mfaEnabled)
        return router.replace("/mfa/verify?redirect=" + params.get("redirect"));

      const mfaResponse = await fetch("/api/authentication/mfa/enable", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (mfaResponse.status !== 200) {
        const error = await mfaResponse.json();

        toast(error.error, {
          description: error.reason,
          type: "error",
        });

        return;
      }

      const mfaData = await mfaResponse.text();

      setMfaData(mfaData);

      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user]);

  const verifyMfa = async () => {
    if (!onlyContainsNumbers(mfaCode) || mfaCode.length !== 6) {
      toast("MFA Invalid", {
        description: "MFA code must be a 6-digit number.",
        type: "error",
      });

      return;
    }

    const mfaVerifyResponse = await fetch("/api/authentication/mfa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      credentials: "include",
      body: JSON.stringify({ code: mfaCode }),
    });

    if (mfaVerifyResponse.status !== 200) {
      const error = await mfaVerifyResponse.json();

      toast(error.error, {
        description: error.reason,
        type: "error",
      });

      return;
    }

    toast("MFA Verified", {
      type: "success",
    });

    setTimeout(() => {
      if (params.get("redirect")) {
        let redirect = params.get("redirect");

        return router.replace(redirect);
      }

      return router.replace("/");
    }, 1000);
  };

  const onlyContainsNumbers = (str) => /^\d+$/.test(str);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-3 bg-muted">
      {loading && <LoadingSpinner />}

      {!loading && mfaData && (
        <div className="flex flex-col w-auto h-auto p-3 space-y-5 border rounded-md bg-background lg:max-w-96">
          <div className="flex flex-col space-y-3 text-center">
            <div className="text-lg font-bold text-center">3rEco MFA</div>
            <div className="text-sm text-neutral-500">
              You are required to use MFA to access this application. Please
              scan the QR code with your authenticator app.
              <br />
              <br />
              After scanning the QR code, once you have the 6-digit code, enter
              it in the MFA code input and click the continue button.
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex flex-col items-center space-y-2">
              {mfaData && (
                <QRCode
                  size={256}
                  className="w-full"
                  value={mfaData}
                  viewBox={`0 0 256 256`}
                />
              )}

              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                onChange={(value) => setMfaCode(value)}
                onComplete={() => verifyMfa()}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
