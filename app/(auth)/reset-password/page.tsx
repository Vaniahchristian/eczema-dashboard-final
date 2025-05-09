"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RequestResetForm from "@/components/auth/request-reset-form";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8">
        <Suspense fallback={<div>Loading...</div>}>
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <RequestResetForm />
          )}
        </Suspense>
      </div>
    </div>
  );
}

