"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    setLoading(true);
    setError(null);

    try {
      // Trigger OAuth flow
      const result = await signIn(`${platform}-dashboard`, {
        redirect: false,
        callbackUrl: "/test",
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Failed to connect account");
      console.error("Error connecting account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Test Social Media Integration</h1>

      <div className="space-y-4">
        <button
          onClick={() => handleConnect("facebook")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Meta"}
        </button>

        <button
          onClick={() => handleConnect("youtube")}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect YouTube (Google)"}
        </button>

        <button
          onClick={() => handleConnect("linkedin")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect LinkedIn"}
        </button>

        <button
          onClick={() => handleConnect("twitter")}
          className="bg-blue-400 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Twitter"}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}