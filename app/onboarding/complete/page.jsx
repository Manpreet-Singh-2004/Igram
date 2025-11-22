"use client"

import Link from 'next/link'

export default function Complete() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Onboarding Complete 🎉</h1>
      <p>You can now use your account</p>
      <Link href={'/'}><p>Click here to go back to the main page </p> </Link>
    </div>
  );
}
