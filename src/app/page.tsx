import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-end gap-4 p-4">
        <Link href="/login" className="text-neutral-400 hover:text-white">Sign in</Link>
        <Link href="/signup" className="rounded-lg bg-neutral-700 px-4 py-2 hover:bg-neutral-600">Sign up</Link>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Discover how the world really sees your face.
        </h1>
        <p className="text-lg text-neutral-400 text-center mb-8 max-w-xl">
          Upload a selfie. Get an honest face score and personalized improvement tips.
        </p>
        <Link
          href="/analyze"
          className="rounded-lg bg-white text-black px-8 py-3 font-semibold hover:bg-neutral-200 transition"
        >
          Analyze my face
        </Link>
        <p className="mt-6 text-sm text-neutral-500">
          Beauty is subjective. This result is for fun and guidance only.
        </p>
      </div>
    </main>
  );
}
