import { Button } from '@repo/ui/button';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <h1 className="text-4xl font-bold tracking-tight">Paperkit</h1>
      <p className="max-w-lg text-center text-zinc-500">
        A Turborepo monorepo with Bun, Next.js, Tailwind CSS v4, TypeScript, and Biome.
      </p>
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  );
}
