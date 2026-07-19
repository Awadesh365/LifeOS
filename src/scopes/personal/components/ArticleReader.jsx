import { useMemo } from 'react';

// Simple markdown parser (handles basic formatting)
function parseMarkdown(md) {
  if (!md) return '';
  
  let html = md;
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border); margin: 32px 0;" />');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="margin: 16px 0; padding-left: 24px; list-style-type: disc;">${match}</ul>`);
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Single newlines to <br>
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
}

export default function ArticleReader({ article, onBack, prevArticle, nextArticle, onNavigate }) {
  const renderedContent = useMemo(() => {
    return parseMarkdown(article.content);
  }, [article.content]);

  // Extract first line as potential title if no heading found
  const displayTitle = article.title || article.name.replace(/\.md$/, '');

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '32px 40px',
      minHeight: '100%'
    }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          marginBottom: '24px',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--accent-light)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        ← Back to list
      </button>

      {/* Article header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-heading)',
          lineHeight: 1.2,
          marginBottom: '16px',
          letterSpacing: '-0.5px'
        }}>
          {displayTitle}
        </h1>
        
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>📁</span>
          <span>{article.path.split('/').slice(0, -1).join(' → ')}</span>
        </div>
      </div>

      {/* Article content */}
      <article style={{
        fontSize: '1.05rem',
        lineHeight: 1.8,
        color: 'var(--text-primary)'
      }}>
        <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </article>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border)',
        gap: '16px'
      }}>
        {prevArticle ? (
          <button
            onClick={() => onNavigate(prevArticle)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'var(--transition)',
              flex: 1,
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span>←</span>
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {prevArticle.title || prevArticle.name.replace(/\.md$/, '')}
            </span>
          </button>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        
        {nextArticle ? (
          <button
            onClick={() => onNavigate(nextArticle)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'var(--transition)',
              flex: 1,
              textAlign: 'right',
              justifyContent: 'flex-end'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {nextArticle.title || nextArticle.name.replace(/\.md$/, '')}
            </span>
            <span>→</span>
          </button>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>
    </div>
  );
}
