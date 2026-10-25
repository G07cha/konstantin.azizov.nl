---
title: AI security audit for mere mortals
date: 2026-10-25
head:
  - - meta
    - property: og:image
      content: https://konstantin.azizov.nl/blog/assets/ai-audits-for-mere-mortals-preview.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:image
      content: https://konstantin.azizov.nl/blog/assets/ai-audits-for-mere-mortals-preview.jpg
---

# AI security audit for mere mortals

There's a lot of talk in the news about big AI companies (allegedly) accidentally hacking other big companies with their swarms of agents, new critical vulnerabilities being found everywhere and so on. So I decided to explore what someone on a regular Claude or Codex subscription can actually do to protect their code.

The information in this post is likely to become hopelessly outdated in less than 6 months, but I believe that it's good to get a snapshot of what's already out there and see where we are.

## The lay of the land

Many popular options target API access only, where you're billed per token, which can feel scary. So I stuck to tools that work with AI subscriptions and picked the three most promising.

### Deepsec CLI

First stop, [Deepsec](https://github.com/vercel-labs/deepsec) CLI from Vercel:

![Deepsec CLI](./assets/ai-audits-for-mere-mortals-1.png)

- Ships with its own CLI/harness and a recommended list of models tested against their own [benchmark](https://vercel.com/blog/deepsecbench-evaluating-model-performance-in-finding-cybersecurity-vulnerabilities)
- Going by their defaults, it's very token-hungry (Opus 5 on max effort, baby!), especially since almost all subagents use the same model and effort as the main agent
- Doesn't handle usage limits gracefully yet, so it will likely require multiple restarts depending on your subscription tier

<hr />

### Anthropic security scan plugin

Next up, a [security scan plugin](https://code.claude.com/docs/en/claude-security) from Anthropic:

![Claude Code security scan plugin](./assets/ai-audits-for-mere-mortals-2.png)

- Limited to Claude only (duh)
- Installs as a plugin, which leads to a nicer integration, including pausing when hitting usage limits
- Similar to Deepsec, relies purely on static analysis and doesn't validate findings
- Unlike Deepsec, assigns a specific model and effort level to each agent, which makes it much more efficient in token usage
- Streamlined flow to generate patches for vulnerabilities with the "Suggest patches" option
- Proprietary license

<hr />

### Cloudflare security audit skill

Last but not least, the [security audit skill](https://github.com/cloudflare/security-audit-skill) from Cloudflare:

![Spawned agents list](./assets/ai-audits-for-mere-mortals-3.png)

- Takes a very similar recon + deeper research approach to the previous two
- Attempts to verify all findings in an available sandbox (e.g. Docker)
- By default, spawns subagents at the same effort level as the main agent, so running it at max effort is an absolute no-go
- The only one that triggered Claude's safety guardrails, even though it was for a seemingly benign reason

## Verdict

I ran all three against a decently sized codebase. Here's how the reports compared:

|                              | Cloudflare skill     | CC plugin | Deepsec               |
| ---------------------------- | -------------------- | --------- | --------------------- |
| Security findings reported   | 39                   | 81        | 282                   |
| Distinct after deduplication | 39                   | ~46       | ~170–200              |
| Critical / High              | 1 / 9                | 0 / 16    | 12\* / 74             |
| Verified                     | Yes, in a sandbox    | No        | No                    |
| Extra output                 | 29 leads to validate | –         | 191 non-security bugs |

\* mostly overstated, closer to high in reality

Based on the table above, it might seem like Deepsec is leading far ahead with almost 500 items and a dozen of them being critical. But as it turned out on a second look, most of them were either duplicates in one way or another or not security issues at all (still bugs though). The Claude plugin was somewhere between the two, with fewer overall findings but still around half of them being duplicates.

The Cloudflare skill reported the fewest findings (39), but they came already deduplicated and verified in a sandbox. It still reported quite a lot of things that it couldn't verify, organized into a separate list. It leaned heavily toward minimizing false positives, which allowed for a more efficient manual review.

**Only a dozen and a half issues showed up in all three reports, so try to run at least two tools. If you can only pick one, the Cloudflare skill gives you the least noise and the Claude Code plugin costs the fewest tokens with the most straightforward follow-up path.**

But the real cost of an AI audit isn't the tokens, it's the triage. Even with the most conservative tool on a regular subscription, I ended up with one critical and nine high-severity issues that had built up in the codebase over the years. For me, that was well worth an afternoon of usage limits.

And remember, kids, the only way to stop a bad guy with an AI agent is with a good guy with an AI agent /s.
