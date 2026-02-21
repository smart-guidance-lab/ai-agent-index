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
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <header className="mb-20 border-b-2 border-zinc-700 pb-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
            Index
          </p>
          <h1 className="mt-3 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Directory
          </h1>
        </header>

        <article className="prose prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-white prose-h1:text-3xl prose-h1:uppercase prose-h1:tracking-tighter prose-h2:mt-14 prose-h2:border-b-2 prose-h2:border-zinc-700 prose-h2:pb-2 prose-h2:text-xl prose-h2:uppercase prose-h2:tracking-tight prose-h3:mt-8 prose-h3:text-base prose-h3:uppercase prose-h3:tracking-wider prose-p:text-zinc-400 prose-p:leading-[1.75] prose-p:font-normal prose-a:font-semibold prose-a:text-white prose-a:no-underline prose-a:underline-offset-2 hover:prose-a:underline prose-strong:text-white prose-strong:font-bold prose-code:rounded-none prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:text-zinc-200 prose-code:font-normal prose-pre:rounded-none prose-pre:bg-zinc-800 prose-pre:border-2 prose-pre:border-zinc-700 prose-th:font-bold prose-th:uppercase prose-th:tracking-wider prose-th:text-zinc-300 prose-td:text-zinc-400 prose-hr:border-zinc-700 prose-hr:border-2">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>

        <footer className="mt-24 border-t-2 border-zinc-700 pt-8">
          <a
            href="https://donate.stripe.com/3cIaEWbdJd4c3mg2wy8so01"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-block border-2 border-zinc-700 bg-zinc-800 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-zinc-700"
          >
            Support this AI Index ($15)
          </a>
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Edit <code className="bg-zinc-800 px-1.5 py-0.5 text-zinc-400">data/agents.md</code> to update.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            AI-Curation Policy: Data is autonomously updated daily.
          </p>
        </footer>
      </div>
    </div>
  );
}
