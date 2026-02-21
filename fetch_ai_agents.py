#!/usr/bin/env python3
"""
Fetch AI Agent related repositories from GitHub and summarize them with OpenAI.
Outputs to data/agents.md. Designed for Windows and GitHub Actions.
"""

import json
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests is required. Run: pip install requests openai")
    sys.exit(1)

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai is required. Run: pip install openai")
    sys.exit(1)


def get_env(key: str, required: bool = True) -> str | None:
    """Get environment variable, optionally required."""
    val = os.environ.get(key)
    if required and not val:
        print(f"Error: Environment variable {key} is not set.")
        sys.exit(1)
    return val or None


def fetch_github_repos(github_token: str | None, max_repos: int = 10) -> list[dict]:
    """Fetch latest AI Agent related repositories from GitHub API."""
    url = "https://api.github.com/search/repositories"
    params = {
        "q": "AI Agent",
        "sort": "updated",
        "order": "desc",
        "per_page": max_repos,
    }
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "AI-Agents-Fetch-Script",
    }
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    resp = requests.get(url, params=params, headers=headers, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    repos = []
    for item in data.get("items", [])[:max_repos]:
        repos.append({
            "name": item["full_name"],
            "url": item["html_url"],
            "description": item.get("description") or "(No description)",
            "stars": item.get("stargazers_count", 0),
            "language": item.get("language") or "N/A",
            "updated_at": item.get("updated_at", ""),
            "topics": item.get("topics", [])[:5],
        })
    return repos


def summarize_with_openai(repos: list[dict], api_key: str) -> str:
    """Summarize repository overview in English using GPT-4o-mini."""
    client = OpenAI(api_key=api_key)
    prompt = f"""Summarize the following AI Agent related GitHub repositories in English.

For each repository, provide a brief overview (2-3 sentences) covering:
- Purpose and main features
- Notable aspects (stars, language, topics)

Repositories data (JSON):
{json.dumps(repos, indent=2)}

Output a well-structured Markdown document with:
1. A short introductory paragraph about the AI Agent ecosystem based on these repos
2. Individual sections for each repository with clear headings and bullet points
3. A brief concluding summary

Use ## for repository headings and ### for subsections if needed."""

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )
    return resp.choices[0].message.content


def main() -> None:
    github_token = os.environ.get("GITHUB_TOKEN")  # Optional for higher rate limit
    openai_key = get_env("OPENAI_API_KEY", required=True)

    print("Fetching AI Agent repositories from GitHub...")
    repos = fetch_github_repos(github_token)
    print(f"Found {len(repos)} repositories.")

    print("Summarizing with OpenAI (gpt-4o-mini)...")
    summary = summarize_with_openai(repos, openai_key)

    out_dir = Path(__file__).resolve().parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "agents.md"

    header = f"""# AI Agent Related Repositories - Summary

> Generated from GitHub API search for "AI Agent", sorted by latest update.
> Total repositories analyzed: {len(repos)}

---

"""
    content = header + summary

    out_path.write_text(content, encoding="utf-8")
    print(f"Saved to {out_path}")


if __name__ == "__main__":
    main()
