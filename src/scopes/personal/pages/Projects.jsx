import { useState } from 'react';
import Header from '../components/Header';

const LIFE_PARTS = [
  {
    name: 'Part I — The Foundation',
    icon: '🏛️',
    color: 'var(--accent)',
    projects: [
      { title: 'The Project of Mind', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/1. The Project of Mind.md' },
      { title: 'The Project of Body', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/2. The Project of Body.md' },
      { title: 'The Project of Character', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/3. The Project of Character.md' },
      { title: 'The Project of Self-Realization', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/4. The Project of Self-Realization.md' }
    ]
  },
  {
    name: 'Part II — Knowledge',
    icon: '📚',
    color: 'var(--info)',
    projects: [
      { title: 'The Project of Education', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/5. The Project of Education.md' },
      { title: 'The Project of Skills', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/6. The Project of Skills.md' },
      { title: 'The Project of Creation', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/7. The Project of Creation.md' }
    ]
  },
  {
    name: 'Part III — Wealth',
    icon: '💰',
    color: 'var(--success)',
    projects: [
      { title: 'The Project of Money', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part III — Wealth/8. The Project of Money.md' },
      { title: 'The Project of Career', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part III — Wealth/9. The Project of Career.md' }
    ]
  },
  {
    name: 'Part IV — Time',
    icon: '⏱️',
    color: 'var(--warning)',
    projects: [
      { title: 'The Project of Time', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/10. The Project of Time.md' },
      { title: 'The Project of Attention', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/11. The Project of Attention.md' },
      { title: 'The Project of Energy', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/12. The Project of Energy.md' }
    ]
  },
  {
    name: 'Part V — Relationships',
    icon: '❤️',
    color: 'var(--danger)',
    projects: [
      { title: 'The Project of Relationships', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part V — Relationships/13. The Project of Relationships.md' },
      { title: 'The Project of Love', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part V — Relationships/14. The Project of Love.md' }
    ]
  },
  {
    name: 'Part VI — Legacy',
    icon: '🏆',
    color: 'var(--accent-light)',
    projects: [
      { title: 'The Project of Purpose', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VI — Legacy/15. The Project of Purpose.md' },
      { title: 'The Project of Freedom', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VI — Legacy/16. The Project of Freedom.md' }
    ]
  },
  {
    name: 'Part VII — The Invisible Projects',
    icon: '👻',
    color: 'var(--text-muted)',
    projects: [
      { title: 'The Project of Silence', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/17. The Project of Silence.md' },
      { title: 'The Project of Detachment', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/18. The Project of Detachment.md' },
      { title: 'The Project of Reputation', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/19. The Project of Reputation.md' },
      { title: 'The Project of Peace', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/20. The Project of Peace.md' }
    ]
  }
];

const PROFESSIONAL_PROJECTS = [
  {
    title: 'Life Tracker',
    description: 'This app — tracking life, habits, and philosophy',
    stack: ['React', 'Vite', 'React Router'],
    icon: '📊',
    color: 'var(--accent)',
    status: 'Active'
  },
  {
    title: 'Personal Portfolio',
    description: 'Showcasing work, skills, and projects',
    stack: [],
    icon: '💼',
    color: 'var(--info)',
    status: 'Planned'
  }
];

export default function Projects() {
  const [tab, setTab] = useState('life');
  const [openParts, setOpenParts] = useState({});

  const togglePart = (name) => {
    setOpenParts(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="page-content">
      <Header 
        title="Projects" 
        subtitle="Life projects and professional work" 
      />

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '28px' }}>
        <button 
          className={`tab ${tab === 'life' ? 'active' : ''}`}
          onClick={() => setTab('life')}
        >
          🧠 Life Projects
        </button>
        <button 
          className={`tab ${tab === 'professional' ? 'active' : ''}`}
          onClick={() => setTab('professional')}
        >
          💻 Professional Projects
        </button>
      </div>

      {/* Life Projects */}
      {tab === 'life' && (
        <div>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h3>Treat Life as Projects</h3>
            <p>The Most Neglected Person in Your Life Is You</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LIFE_PARTS.map((part) => {
              const isOpen = openParts[part.name] || false;
              return (
                <div key={part.name} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}>
                  {/* Part Header */}
                  <div
                    onClick={() => togglePart(part.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      borderBottom: isOpen ? '1px solid var(--border)' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{
                      fontSize: '0.7rem',
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                      color: 'var(--text-muted)'
                    }}>
                      ▶
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>{part.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: 'var(--text-heading)',
                        fontSize: '0.95rem'
                      }}>
                        {part.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.78rem', 
                        color: 'var(--text-muted)',
                        marginTop: '2px'
                      }}>
                        {part.projects.length} {part.projects.length === 1 ? 'project' : 'projects'}
                      </div>
                    </div>
                    <div style={{
                      width: '4px',
                      height: '40px',
                      background: part.color,
                      borderRadius: '2px',
                      opacity: 0.6
                    }} />
                  </div>

                  {/* Projects List */}
                  {isOpen && (
                    <div style={{ padding: '8px' }}>
                      {part.projects.map((project, j) => (
                          <a
                            key={j}
                            href={`/articles`}
                            onClick={() => {
                              // Store selected article path for Articles page
                              localStorage.setItem('selectedArticlePath', project.path);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              margin: '4px 8px',
                              borderRadius: 'var(--radius)',
                              textDecoration: 'none',
                              transition: 'var(--transition)',
                              color: 'var(--text-primary)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(108, 92, 231, 0.06)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: part.color,
                              flexShrink: 0
                            }} />
                            <span style={{
                              fontSize: '0.9rem',
                              fontWeight: 500
                            }}>
                              {project.title}
                            </span>
                            <span style={{
                              marginLeft: 'auto',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)'
                            }}>
                              →
                            </span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Professional Projects */}
      {tab === 'professional' && (
        <div>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h3>Professional Projects</h3>
            <p>Software projects, apps, and professional work</p>
          </div>
          <div className="goals-grid">
            {PROFESSIONAL_PROJECTS.map((project, i) => (
              <div key={i} className="goal-card">
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: project.color,
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                }} />
                <div className="goal-header">
                  <span className="goal-icon">{project.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="goal-title">{project.title}</div>
                    <div className="goal-category">{project.description}</div>
                  </div>
                  <span className={`status-tag ${project.status === 'Active' ? 'status-offered' : 'status-applied'}`}>
                    {project.status}
                  </span>
                </div>
                {project.stack.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '6px', 
                    flexWrap: 'wrap',
                    marginTop: '12px' 
                  }}>
                    {project.stack.map((tech, j) => (
                      <span key={j} style={{
                        fontSize: '0.72rem',
                        padding: '3px 10px',
                        background: 'rgba(108, 92, 231, 0.1)',
                        border: '1px solid rgba(108, 92, 231, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--accent-light)',
                        fontWeight: 500
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div 
              className="goal-card"
              style={{
                borderStyle: 'dashed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                cursor: 'pointer',
                opacity: 0.6
              }}
            >
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>+</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Add Project</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
