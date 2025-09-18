'use client'
import { useState } from 'react'
import URLForm from '@/components/URLForm'
import URLDisplay from '@/components/URLDisplay'

// type User = {
//   id: string;
//   email: string;
//   name: string;
//   password: string;
//   urls: [
//     {
//       id: string;
//       original: string;
//       slug: string;
//       createdAt: string;
//       clicks: number;
//       userId: string;
//     }
//   ]
// }
export default function Home() {

  const [slug, setSlug] = useState<string | null>(null);

  return (
    <main className="flex h-[90vh] w-full flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Magic URL Shortener</h1>
      <URLForm onShorten={setSlug} />
      {slug && <URLDisplay shortUrl={slug} />}
    </main>
  )
}
