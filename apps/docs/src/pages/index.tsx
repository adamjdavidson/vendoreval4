import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="http://localhost:5174">
            Start Evaluation →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/framework">
            Learn the Framework
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({title, description, link}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="card" style={{height: '100%'}}>
        <div className="card__header">
          <h3>{title}</h3>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={link}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`AI Vendor Evaluation Framework`}
      description="Systematic evaluation framework for Fortune 500 AI procurement decisions">
      <HomepageHeader />
      <main>
        {/* Why This Framework */}
        <section className={styles.section}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <h2 className="text--center margin-bottom--lg">Why This Framework Exists</h2>
                <p className="text--center text--lg">
                  AI procurement is fundamentally different from traditional software buying.
                  The stakes are higher, the risks are less obvious, and vendors often hide
                  critical details behind "proprietary" claims. This framework cuts through
                  the marketing noise to focus on what actually matters for enterprise deployment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Six Criteria */}
        <section className={styles.section} style={{background: '#f5f5f5'}}>
          <div className="container">
            <h2 className="text--center margin-bottom--lg">The Six Evaluation Criteria</h2>
            <div className="row">
              <FeatureCard
                title="SEE - Transparency"
                description="Can you see how it works? Visibility into system prompts, models, and decision-making processes."
                link="/docs/framework/see"
              />
              <FeatureCard
                title="CHANGE - Control"
                description="Can you control it? Ability to customize prompts, swap models, and configure behavior."
                link="/docs/framework/change"
              />
              <FeatureCard
                title="USE - Quality"
                description="Is it actually useful? Real-world output quality, user adoption, and practical value delivered."
                link="/docs/framework/use"
              />
            </div>
            <div className="row margin-top--md">
              <FeatureCard
                title="ADAPT - Future-Proof"
                description="Can it evolve? Support for latest models, autonomy controls, and architectural flexibility."
                link="/docs/framework/adapt"
              />
              <FeatureCard
                title="LEAVE - Exit Strategy"
                description="Can you exit gracefully? Data portability, knowledge retention, and migration paths."
                link="/docs/framework/leave"
              />
              <FeatureCard
                title="LEARN - Capability"
                description="Does it build internal capability? Skills transfer, documentation, and team development."
                link="/docs/framework/learn"
              />
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className={styles.section}>
          <div className="container">
            <h2 className="text--center margin-bottom--lg">How to Use This Framework</h2>
            <div className="row">
              <div className="col col--3">
                <div className="text--center padding--md">
                  <h3>1. Start Evaluation</h3>
                  <p>Answer 20 questions about your vendor across the six criteria.</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center padding--md">
                  <h3>2. Review Grades</h3>
                  <p>Each criterion receives a color-coded grade based on your answers.</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center padding--md">
                  <h3>3. Generate Reports</h3>
                  <p>Export comprehensive PDFs or Markdown reports for stakeholders.</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center padding--md">
                  <h3>4. Compare Vendors</h3>
                  <p>Use pre-analyzed examples as benchmarks for your evaluation.</p>
                </div>
              </div>
            </div>
            <div className="text--center margin-top--lg">
              <Link
                className="button button--primary button--lg"
                to="http://localhost:5174">
                Start Your First Evaluation
              </Link>
            </div>
          </div>
        </section>

        {/* Maturity Model */}
        <section className={styles.section} style={{background: '#f5f5f5'}}>
          <div className="container">
            <h2 className="text--center margin-bottom--lg">AI Adoption Maturity Model</h2>
            <div className="row">
              <div className="col col--8 col--offset-2">
                <p className="text--center text--lg margin-bottom--lg">
                  Different maturity levels require different vendor evaluation priorities.
                  Understand where you are and where you're going.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col col--6">
                <div className="card margin-bottom--md">
                  <div className="card__header">
                    <h3>Level 1: Individual Use</h3>
                  </div>
                  <div className="card__body">
                    <p>AI as personal productivity tool. Focus: usability and output quality.</p>
                  </div>
                  <div className="card__footer">
                    <Link to="/docs/maturity-model/level-1">Learn More →</Link>
                  </div>
                </div>
              </div>
              <div className="col col--6">
                <div className="card margin-bottom--md">
                  <div className="card__header">
                    <h3>Level 2: Workflow Augmentation</h3>
                  </div>
                  <div className="card__body">
                    <p>AI integrated into business processes. Focus: integration and consistency.</p>
                  </div>
                  <div className="card__footer">
                    <Link to="/docs/maturity-model/level-2">Learn More →</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col--6">
                <div className="card margin-bottom--md">
                  <div className="card__header">
                    <h3>Level 3: Organizational Transformation</h3>
                  </div>
                  <div className="card__body">
                    <p>AI reshapes how work gets done. Focus: all six criteria are critical.</p>
                  </div>
                  <div className="card__footer">
                    <Link to="/docs/maturity-model/level-3">Learn More →</Link>
                  </div>
                </div>
              </div>
              <div className="col col--6">
                <div className="card margin-bottom--md">
                  <div className="card__header">
                    <h3>Level 4: B2B Integration</h3>
                  </div>
                  <div className="card__body">
                    <p>AI as organizational interface. Focus: ecosystem governance and autonomy.</p>
                  </div>
                  <div className="card__footer">
                    <Link to="/docs/maturity-model/level-4">Learn More →</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="text--center margin-top--md">
              <Link
                className="button button--outline button--primary"
                to="/docs/maturity-model/overview">
                Explore the Full Maturity Model
              </Link>
            </div>
          </div>
        </section>

        {/* Vendor Examples */}
        <section className={styles.section}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <h2 className="text--center margin-bottom--lg">Pre-Analyzed Vendor Examples</h2>
                <p className="text--center text--lg margin-bottom--lg">
                  See how real vendors score across the six criteria. Use these as benchmarks
                  for your own evaluations.
                </p>
                <div className="card">
                  <div className="card__header">
                    <h3>Coming Soon</h3>
                  </div>
                  <div className="card__body">
                    <p>
                      Detailed vendor analyses across all six criteria will be added soon,
                      including enterprise search platforms, AI coding assistants, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.section} style={{background: '#f5f5f5'}}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2 text--center">
                <h2 className="margin-bottom--md">Ready to Evaluate Your First Vendor?</h2>
                <p className="text--lg margin-bottom--lg">
                  Use the interactive evaluation tool to systematically assess AI vendors
                  across the six critical criteria.
                </p>
                <Link
                  className="button button--primary button--lg"
                  to="http://localhost:5174">
                  Start Evaluation Tool
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
