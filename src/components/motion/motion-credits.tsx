import type { MotionCredit } from '@/content/types';

export function MotionCredits({ credits, projectSlug }: { readonly credits: readonly [MotionCredit, ...MotionCredit[]]; readonly projectSlug: string }) {
  const titleId = `motion-credits-title-${projectSlug}`;
  return (
    <section className="motion-credits" aria-labelledby={titleId} data-motion-credits>
      <p className="motion-credits-label">CREDITS</p>
      <h2 id={titleId}>THE PEOPLE BEHIND THE FRAME</h2>
      <dl className="motion-credits-list">
        {credits.map((credit, index) => (
          <div className="motion-credit" key={`${credit.role.en}-${credit.name}-${index}`}>
            <dt>
              <span>{credit.role.en}</span>
              {credit.role.zhHant ? <span lang="zh-Hant">{credit.role.zhHant}</span> : null}
            </dt>
            <dd>
              {credit.url ? (
                <a href={credit.url} target="_blank" rel="noopener noreferrer">{credit.name}</a>
              ) : credit.name}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
