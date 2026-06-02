export default function Home() {
  return (
    <div className="rr-shell">
      <div className="rr-glow rr-glow-one" aria-hidden="true" />
      <div className="rr-glow rr-glow-two" aria-hidden="true" />

      <main className="rr-main">
        <section className="rr-hero rr-fade-up">
          <p className="rr-kicker">Reason & Roots</p>
          <h1>
            Where clear thinking and deep belonging
            <span> meet.</span>
          </h1>
          <p className="rr-lead">
            A modern home for people who want to think rigorously, live
            courageously, and stay rooted in what matters.
          </p>
          <div className="rr-actions">
            <a href="#join" className="rr-btn rr-btn-primary">
              Join The First Letters
            </a>
            <a href="#focus" className="rr-btn rr-btn-secondary">
              Explore The Vision
            </a>
          </div>
        </section>

        <section id="focus" className="rr-grid rr-fade-up rr-delay-1">
          <article>
            <h2>Reason</h2>
            <p>
              Essays, frameworks, and conversations that sharpen discernment
              and invite honest debate.
            </p>
          </article>
          <article>
            <h2>Roots</h2>
            <p>
              Practices, stories, and traditions that keep life grounded,
              humane, and connected.
            </p>
          </article>
          <article>
            <h2>Formation</h2>
            <p>
              A path that turns ideas into action through community, rhythm,
              and personal responsibility.
            </p>
          </article>
        </section>

        <section id="join" className="rr-note rr-fade-up rr-delay-2">
          <p>
            First public release is coming soon. Early subscribers will get the
            launch essays and opening guide.
          </p>
          <a href="mailto:hello@reasonandroots.com" className="rr-mail">
            hello@reasonandroots.com
          </a>
        </section>
      </main>
    </div>
  );
}
