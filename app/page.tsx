import { readFile } from "fs/promises";
import { join } from "path";
import ReactMarkdown from "react-markdown";

async function getAgentsContent(): Promise<string> {
  const path = join(process.cwd(), "data", "agents.md");
  try {
    return await readFile(path, "utf-8");
  } catch {
    return "# No content\n\nAdd `data/agents.md` to populate this directory.";
  }
}

export default async function Home() {
  const content = await getAgentsContent();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <header className="mb-16 border-b border-zinc-800 pb-10">
          <h1 className="font-mono text-sm font-medium uppercase tracking-widest text-emerald-400">
            Directory
          </h1>
          <p className="mt-2 text-zinc-500">
            A refined index for technical users
          </p>
        </header>

        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:text-zinc-50 prose-h2:mt-10 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2 prose-h2:text-lg prose-h3:mt-6 prose-h3:text-base prose-p:text-zinc-400 prose-p:leading-7 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 prose-strong:text-zinc-200 prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:text-emerald-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-th:text-zinc-300 prose-td:text-zinc-400 prose-hr:border-zinc-800">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>

        <footer className="mt-20 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          Edit <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-400">data/agents.md</code> to update this directory.
        </footer>
      </div>
    </div>
  );
}
