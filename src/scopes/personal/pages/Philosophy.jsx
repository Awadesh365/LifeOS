import Header from '../components/Header';

export default function Philosophy() {
  return (
    <div className="page-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Header 
        title="Core Philosophy" 
        subtitle="The fundamental laws of execution and reality." 
      />

      <div className="article-container" style={{ marginTop: '24px' }}>
        <div className="article-hero" style={{ 
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            letterSpacing: '-1px',
            background: 'var(--text-heading)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Winning as a Life Principle:<br/>
            <span style={{ color: 'var(--accent-light)', WebkitTextFillColor: 'var(--accent-light)' }}>Why Defeat Must Never Become Your Identity</span>
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <span className="card-badge badge-warning">Core Principle 01</span>
            <span className="card-badge badge-info">Identity & Power</span>
          </div>
        </div>

        <article className="article-body" style={{ 
          fontSize: '1.05rem', 
          lineHeight: 1.8, 
          color: 'var(--text-primary)',
          padding: '0 20px'
        }}>
          <p className="article-lead" style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            marginBottom: '32px',
            borderLeft: '4px solid var(--accent)',
            paddingLeft: '20px'
          }}>
            There are people who treat life casually. They move without urgency, think without intensity, and live without a standard. They compromise with weakness, negotiate with mediocrity, and slowly make peace with defeat. Then there are those who decide something far more dangerous and far more powerful: <strong>losing is not an option as a way of life</strong>.
          </p>

          <p>
            This mindset is not about arrogance. It is not about shouting slogans. It is not about pretending to be strong. It is about making a deep internal decision that in every important dimension of life—physical strength, mental resilience, financial power, career growth, discipline, self-respect, and character—<strong>you will not accept decay, helplessness, or voluntary weakness</strong>.
          </p>

          <p>Winning, then, stops being an event. It becomes a standard.</p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>The real enemy is not failure. It is weakness.</h2>
          <p>A lot of people misunderstand this. They think the opposite of winning is failing once. That is not true.</p>
          <p>Failure can be temporary. Failure can teach. Failure can sharpen. Failure can expose gaps. Failure can become fuel.</p>
          <p><strong>But weakness is different.</strong></p>
          <p>Weakness is when a person stops resisting decline. Weakness is when someone knows what must be done but avoids it. Weakness is when excuses replace action, comfort replaces discipline, and fear replaces courage. Weakness is not about lacking power one day; it is about accepting powerlessness as normal.</p>
          
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-light)', 
            padding: '24px', 
            borderRadius: 'var(--radius)',
            margin: '32px 0'
          }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong>A weak body</strong> affects confidence.</li>
              <li style={{ marginBottom: '8px' }}><strong>A weak mind</strong> affects decisions.</li>
              <li style={{ marginBottom: '8px' }}><strong>A weak will</strong> affects execution.</li>
              <li style={{ marginBottom: '8px' }}><strong>A weak financial position</strong> affects freedom.</li>
              <li style={{ marginBottom: '8px' }}><strong>A weak career position</strong> affects dignity.</li>
              <li><strong>A weak character</strong> affects everything.</li>
            </ul>
          </div>
          <p>So the battle is not merely to "succeed." The battle is to refuse weakness in all its forms.</p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>Strength is not optional in life</h2>
          <p>Life does not reward good intentions alone. Life tests capability.</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>It tests whether you can endure pressure.</li>
            <li>It tests whether you can think clearly in chaos.</li>
            <li>It tests whether you can keep moving when emotions are unstable.</li>
            <li>It tests whether you can build value, command respect, protect yourself, and carry responsibility.</li>
          </ul>
          <p>Strength, therefore, is not a luxury. It is a requirement.</p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>Winning is non-negotiable</h2>
          <p>To say that winning is non-negotiable does not mean life will always go according to plan. It means something deeper.</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>You do not normalize losing.</li>
            <li>You do not build an identity around excuses.</li>
            <li>You do not stay down.</li>
            <li>You do not call your surrender "peace."</li>
            <li>You do not dress your fear up as "balance."</li>
            <li>You do not glorify passivity when action is required.</li>
          </ul>
          
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>The philosophy of total responsibility</h2>
          <p>People often lose because they hand over responsibility for their lives to circumstances. They blame family, economy, office politics, bad luck, lack of support, lack of recognition, unfair systems, or difficult environments. Some of those things may be real. Many times they are real. But even when reality is unfair, one principle remains undefeated:</p>
          <p style={{ 
            fontSize: '1.3rem', 
            fontWeight: 700, 
            color: 'var(--accent)', 
            textAlign: 'center', 
            margin: '32px 0' 
          }}>
            "Your progress still demands your responsibility."
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '32px 0' }}>
            {[
              { t: 'Body', c: 'No one is coming to save your body. You must train it.' },
              { t: 'Mind', c: 'No one is coming to save your mind. You must discipline it.' },
              { t: 'Finances', c: 'No one is coming to save your finances. You must build them.' },
              { t: 'Career', c: 'No one is coming to save your career. You must sharpen your value.' },
              { t: 'Future', c: 'No one is coming to save your future. You must earn it.' }
            ].map(item => (
              <div key={item.t} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>{item.t}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.c}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>Strength is built through resistance</h2>
          <p>No one becomes powerful accidentally. Strength is built by carrying what is heavy. Mental resilience is built by facing what is uncomfortable. Skill is built by repetition. Confidence is built by evidence. Discipline is built by obedience to principle, even when feelings resist.</p>
          <p>The gym is one example of life itself. Weight resists you. Your muscles adapt. You become stronger. In the same way, hard work resists your comfort. Pressure resists your emotions. Competition resists your ego. Reality resists your fantasies. And if you keep engaging those forces correctly, you become harder, sharper, calmer, and more capable.</p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginTop: '40px', marginBottom: '16px' }}>Conclusion: Live in a way that weakness cannot survive in you</h2>
          <p>Life is not a place for passive existence. It is a field of pressure, competition, responsibility, uncertainty, and opportunity. To move through it well, a person must become strong—physically, mentally, financially, professionally, and morally.</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Defeat must never become your identity.</li>
            <li>Weakness must never become your comfort zone.</li>
            <li>Winning must become your discipline, not just your desire.</li>
          </ul>

          <p style={{ 
            background: 'var(--bg-card)', 
            padding: '24px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border)',
            textAlign: 'center', 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: 'var(--text-heading)',
            marginTop: '40px' 
          }}>
            The goal is not to appear powerful. The goal is to become so solid that life itself feels your presence. And once you choose that standard fully, there is only one direction left:<br/><br/>
            <span style={{ fontSize: '1.5rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '2px' }}>Forward, upward, stronger.</span>
          </p>
        </article>
      </div>
    </div>
  );
}
