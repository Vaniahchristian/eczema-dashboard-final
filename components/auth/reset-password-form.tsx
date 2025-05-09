"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message);
      if (res.success) {
        setTimeout(() => {
          router.push("/login");
        }, 5000); // 2 seconds delay so user can see the success message
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <input
        type="password"
        className="w-full border px-3 py-2 rounded"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        minLength={6}
        disabled={loading}
      />
      <input
        type="password"
        className="w-full border px-3 py-2 rounded"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        minLength={6}
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
      {message && <div className="text-green-600 mt-2">{message}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default ResetPasswordForm;
