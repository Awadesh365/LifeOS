import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';
import ArticleSidebar from '../components/ArticleSidebar';
import ArticleReader from '../components/ArticleReader';

const SECTION_META = {
  'a. State of mind: Wise and Relaxed': {
    icon: '🧘',
    color: 'var(--accent)',
    description: 'Peace, focus, emotional control, and the art of staying unshakeable.'
  },
  'b Mastery of Mind, Career & Purpose': {
    icon: '🎯',
    color: 'var(--info)',
    description: 'Winning in career, office politics, negotiation, leadership, and strategic thinking.'
  },
  'c Clarity In life': {
    icon: '💡',
    color: 'var(--warning)',
    description: 'Life choices, distractions, relationships, wealth execution, and ownership.'
  },
  'd. Stength, improvment and health': {
    icon: '💪',
    color: 'var(--success)',
    description: 'Physical dominance, gym discipline, health, and building the strongest version of yourself.'
  },
  'e. High Standard Life': {
    icon: '⭐',
    color: 'var(--warning)',
    description: 'Big thinking, universal laws, and living at a higher standard.'
  },
  'f. Path to Enlightenment and Spirituality': {
    icon: '🕉️',
    color: 'var(--accent-light)',
    description: 'Spiritual transformation, religion to reality, and squeezing the juice of life.'
  },
  'g. Current Path': {
    icon: '🛤️',
    color: 'var(--info)',
    description: 'Current plans, AI learning, interviews, and the strong stack.'
  }
};

function countArticles(items) {
  let count = 0;
  for (const item of items) {
    if (item.type === 'article') count++;
    else if (item.children) count += countArticles(item.children);
  }
  return count;
}

export default function Articles({ isMobile }) {
  const [articleTree, setArticleTree] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadArticles() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getArticles();
        if (isActive) setArticleTree(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isActive) setError(err.message || 'Unable to load articles from backend.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadArticles();

    return () => {
      isActive = false;
    };
  }, []);

  const allArticles = useMemo(() => {
    const articles = [];
    const flatten = (items) => {
      for (const item of items) {
        if (item.type === 'article') articles.push(item);
        else if (item.children) flatten(item.children);
      }
    };
    flatten(articleTree);
    return articles;
  }, [articleTree]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articleTree;
    const query = searchQuery.toLowerCase();
    const filterTree = (items) => {
      return items.reduce((acc, item) => {
        if (item.type === 'article') {
          if (item.title.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)) {
            acc.push(item);
          }
        } else if (item.children) {
          const filteredChildren = filterTree(item.children);
          if (filteredChildren.length > 0) acc.push({ ...item, children: filteredChildren });
        }
        return acc;
      }, []);
    };
    return filterTree(articleTree);
  }, [articleTree, searchQuery]);

  const toggleSection = (path) => {
    setExpandedSections(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    if (isMobile) setSidebarOpen(false);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleSectionClick = (section) => {
    setExpandedSections(prev => ({ ...prev, [section.path]: true }));
    const findFirst = (items) => {
      for (const item of items) {
        if (item.type === 'article') return item;
        if (item.children) {
          const found = findFirst(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    const firstArticle = findFirst(section.children);
    if (firstArticle) {
      setSelectedArticle(firstArticle);
      if (isMobile) setSidebarOpen(false);
    }
  };

  const currentIndex = selectedArticle ? allArticles.findIndex(a => a.path === selectedArticle.path) : -1;
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const sidebarWidth = 320;

  return (
    <div className="page-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0' }}>
      <Header 
        title="The Manifesto" 
        subtitle={loading ? 'Loading from backend...' : 'A life philosophy written by Awadesh'}
      />
      {error && <div className="inline-alert">{error}</div>}

      {/* Mobile: floating menu button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--gradient-1)',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          📚
        </button>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '0', 
        marginTop: '0',
        height: 'calc(100vh - var(--header-height))',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 150
            }}
          />
        )}

        {/* Sidebar */}
        <div style={{
          width: `${sidebarWidth}px`,
          minWidth: `${sidebarWidth}px`,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...(isMobile ? {
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            bottom: 0,
            zIndex: 160,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease'
          } : {})
        }}>
          {/* Mobile close button */}
          {isMobile && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                📜 The Manifesto
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>
          )}
          
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'var(--transition)'
              }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            <ArticleSidebar
              items={filteredArticles}
              selectedArticle={selectedArticle}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onSelectArticle={handleArticleSelect}
            />
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg-primary)',
          ...(isMobile ? { width: '100%' } : {})
        }}>
          {selectedArticle ? (
            <ArticleReader
              article={selectedArticle}
              onBack={handleBack}
              prevArticle={prevArticle}
              nextArticle={nextArticle}
              onNavigate={handleArticleSelect}
            />
          ) : (
            <div style={{ 
              padding: isMobile ? '20px 16px' : '40px', 
              maxWidth: '900px', 
              margin: '0 auto' 
            }}>
              {/* Hero */}
              <div style={{
                textAlign: 'center',
                marginBottom: isMobile ? '32px' : '48px',
                padding: isMobile ? '32px 20px' : '48px 32px',
                background: 'var(--gradient-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '16px' }}>📜</div>
                <h1 style={{
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  letterSpacing: '-1px',
                  marginBottom: '12px',
                  lineHeight: 1.2
                }}>
                  The Manifesto
                </h1>
                <p style={{
                  fontSize: isMobile ? '0.95rem' : '1.1rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '500px',
                  margin: '0 auto 24px',
                  lineHeight: 1.6
                }}>
                  Principles, lessons, and clarity on how to live with strength, purpose, and awareness.
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '32px',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-light)', fontSize: '1.5rem' }}>{allArticles.length}</span>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Articles</div>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-light)', fontSize: '1.5rem' }}>{articleTree.length}</span>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Chapters</div>
                  </div>
                </div>
              </div>

              {/* Section Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {articleTree.map((section) => {
                  const meta = SECTION_META[section.name] || { icon: '📂', color: 'var(--text-muted)', description: '' };
                  const articleCount = countArticles(section.children);
                  return (
                    <div
                      key={section.path}
                      onClick={() => handleSectionClick(section)}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: isMobile ? '20px' : '24px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: meta.color,
                        opacity: 0.8
                      }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{meta.icon}</span>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-heading)',
                            marginBottom: '8px',
                            lineHeight: 1.3
                          }}>
                            {section.name}
                          </h3>
                          <p style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                            marginBottom: '12px'
                          }}>
                            {meta.description}
                          </p>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600
                          }}>
                            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
