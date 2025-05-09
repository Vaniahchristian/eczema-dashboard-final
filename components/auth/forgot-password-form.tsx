import React, { useState } from "react";
import { forgotPassword } from "@/lib/auth";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
      <p className="mb-4 text-gray-600">Enter your email to receive a password reset link.</p>
      <input
        type="email"
        className="w-full border px-3 py-2 rounded"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      {message && <div className="text-green-600 mt-2">{message}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default ForgotPasswordForm;
