"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import type { Post } from "@/lib/types";

export function Writing({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      className="scroll-anchor section-x border-t border-[var(--color-line-soft)] py-14"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 font-display text-[clamp(22px,3.5vw,26px)] leading-[1.1] font-semibold tracking-[-0.02em]">
          {t(UI.writingTitle)}
        </h2>
        <span className="font-body text-[13px] leading-none font-medium text-muted">
          {t(UI.writingNote)}
        </span>
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-[var(--color-line)] bg-surface p-[22px]"
          >
            <div className="mb-3 font-mono text-[11.5px] leading-none font-medium text-muted-2">
              {t(post.category)}
            </div>
            <h3 className="m-0 font-display text-base leading-[1.35] font-semibold">
              {t(post.title)}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
