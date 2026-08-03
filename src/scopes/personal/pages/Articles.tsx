import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { api } from '../api/client';
import Header from '../components/Header';
import ArticleSidebar from '../components/ArticleSidebar';
import ArticleReader from '../components/ArticleReader';

interface ArticlesProps {
  isMobile?: boolean;
}

const SECTION_META: Record<string, { icon: string; color: string; description: string }> = {
  'a. State of mind: Wise and Relaxed': {
    icon: '🧘',
    color: '#E55555',
    description: 'Peace, focus, emotional control, and the art of staying unshakeable.',
  },
  'b Mastery of Mind, Career & Purpose': {
    icon: '🎯',
    color: '#2196F3',
    description: 'Winning in career, office politics, negotiation, leadership, and strategic thinking.',
  },
  'c Clarity In life': {
    icon: '💡',
    color: '#FF9800',
    description: 'Life choices, distractions, relationships, wealth execution, and ownership.',
  },
  'd. Stength, improvment and health': {
    icon: '💪',
    color: '#4CAF50',
    description: 'Physical dominance, gym discipline, health, and building the strongest version of yourself.',
  },
  'e. High Standard Life': {
    icon: '⭐',
    color: '#FF9800',
    description: 'Big thinking, universal laws, and living at a higher standard.',
  },
  'f. Path to Enlightenment and Spirituality': {
    icon: '🕉️',
    color: '#9C27B0',
    description: 'Spiritual transformation, religion to reality, and squeezing the juice of life.',
  },
  'g. Current Path': {
    icon: '🛤️',
    color: '#2196F3',
    description: 'Current plans, AI learning, interviews, and the strong stack.',
  },
};

function countArticles(items: any[]): number {
  let count = 0;
  for (const item of items) {
    if (item.type === 'article') count++;
    else if (item.children) count += countArticles(item.children);
  }
  return count;
}

export default function Articles({ isMobile }: ArticlesProps) {
  const [articleTree, setArticleTree] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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
      } catch (err: any) {
        if (isActive) setError(err.message || 'Unable to load articles from backend.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadArticles();
    return () => { isActive = false; };
  }, []);

  const allArticles = useMemo(() => {
    const articles: any[] = [];
    const flatten = (items: any[]) => {
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
    const filterTree = (items: any[]): any[] => {
      return items.reduce<any[]>((acc, item) => {
        if (item.type === 'article') {
          if (
            item.title?.toLowerCase().includes(query) ||
            item.name?.toLowerCase().includes(query)
          ) {
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

  const toggleSection = (path: string) => {
    setExpandedSections((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article);
    if (isMobile) setSidebarOpen(false);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleSectionClick = (section: any) => {
    setExpandedSections((prev) => ({ ...prev, [section.path]: true }));
    const findFirst = (items: any[]): any => {
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

  const currentIndex = selectedArticle
    ? allArticles.findIndex((a) => a.path === selectedArticle.path)
    : -1;
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const sidebarWidth = 320;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 0 }}>
      <Header
        title="The Manifesto"
        subtitle={loading ? 'Loading from backend...' : 'A life philosophy written by Awadesh'}
      />
      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      {isMobile && !sidebarOpen && (
        <Button
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 3,
            right: 3,
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: '#fff',
            minWidth: 0,
            fontSize: '1.5rem',
            zIndex: 200,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          📚
        </Button>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 0,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isMobile && sidebarOpen && (
          <Box
            onClick={() => setSidebarOpen(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(30, 37, 48, 0.45)',
              zIndex: 150,
            }}
          />
        )}

        <Box
          sx={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...(isMobile
              ? {
                  position: 'fixed',
                  top: 64,
                  left: 0,
                  bottom: 0,
                  zIndex: 160,
                  transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'transform 0.3s ease',
                }
              : {}),
          }}
        >
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: '12px 16px',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography fontWeight={700} fontSize="0.95rem">
                📜 The Manifesto
              </Typography>
              <Button
                onClick={() => setSidebarOpen(false)}
                sx={{ minWidth: 0, color: 'text.secondary' }}
              >
                <CloseIcon />
              </Button>
            </Box>
          )}

          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            <ArticleSidebar
              items={filteredArticles}
              selectedArticle={selectedArticle}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onSelectArticle={handleArticleSelect}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            bgcolor: 'background.default',
            ...(isMobile ? { width: '100%' } : {}),
          }}
        >
          {selectedArticle ? (
            <ArticleReader
              article={selectedArticle}
              onBack={handleBack}
              prevArticle={prevArticle}
              nextArticle={nextArticle}
              onNavigate={handleArticleSelect}
            />
          ) : (
            <Box sx={{ p: isMobile ? '20px 16px' : '40px', maxWidth: 900, mx: 'auto' }}>
              <Card sx={{ mb: 4, textAlign: 'center' }}>
                <CardContent sx={{ p: isMobile ? '32px 20px !important' : '48px 32px !important' }}>
                  <Typography fontSize={isMobile ? '2.5rem' : '3.5rem'} sx={{ mb: 2 }}>
                    📜
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{ letterSpacing: '-1px', mb: 1.5, lineHeight: 1.2 }}
                  >
                    The Manifesto
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 500, mx: 'auto', mb: 3, lineHeight: 1.6 }}
                  >
                    Principles, lessons, and clarity on how to live with strength, purpose, and
                    awareness.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="primary.main">
                        {allArticles.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Articles
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="primary.main">
                        {articleTree.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chapters
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 2,
                }}
              >
                {articleTree.map((section: any) => {
                  const meta = SECTION_META[section.name] || {
                    icon: '📂',
                    color: '#9E9E9E',
                    description: '',
                  };
                  const articleCount = countArticles(section.children);
                  return (
                    <Card
                      key={section.path}
                      variant="outlined"
                      onClick={() => handleSectionClick(section)}
                      sx={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: meta.color,
                          opacity: 0.8,
                        }}
                      />
                      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Typography fontSize="1.8rem">{meta.icon}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={700} sx={{ mb: 1, lineHeight: 1.3 }}>
                            {section.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.5, mb: 1.5 }}
                          >
                            {meta.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
