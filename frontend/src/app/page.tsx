import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Note App",
};

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center min-h-screen flex-col">
        <h1 className="text-3xl font-bold underline">Welcome to Note App!</h1>
        <Link href="/register">
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Register
          </button>
        </Link>

        <Link href="/login">
          <button className="mt-4 ml-4 bg-green-500 text-white py-2 px-4 rounded">
            Login
          </button>
        </Link>
      </div>
    </main>
  );
}
