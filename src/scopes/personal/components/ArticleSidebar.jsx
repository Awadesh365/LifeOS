export default function ArticleSidebar({ 
  items, 
  selectedArticle, 
  expandedSections, 
  onToggleSection, 
  onSelectArticle 
}) {
  const getIcon = (item) => {
    if (item.type === 'article') return '📄';
    if (item.type === 'section') return '📁';
    if (item.name.includes('a.')) return '🧘';
    if (item.name.includes('b')) return '🎯';
    if (item.name.includes('c')) return '💡';
    if (item.name.includes('d.')) return '💪';
    if (item.name.includes('e.')) return '⭐';
    if (item.name.includes('f.')) return '🕉️';
    if (item.name.includes('g.')) return '🛤️';
    return '📂';
  };

  const renderItem = (item, depth = 0) => {
    const isExpanded = expandedSections[item.path] !== false; // Default expanded
    const isSelected = selectedArticle?.path === item.path;
    const hasChildren = item.children && item.children.length > 0;

    if (item.type === 'article') {
      return (
        <div
          key={item.path}
          onClick={() => onSelectArticle(item)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            paddingLeft: `${16 + depth * 16}px`,
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'var(--transition)',
            background: isSelected ? 'rgba(229, 85, 85, 0.12)' : 'transparent',
            color: isSelected ? 'var(--accent-light)' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: isSelected ? 600 : 400,
            marginBottom: '2px',
            borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(229, 85, 85, 0.06)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>📄</span>
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {item.title || item.name.replace(/\.md$/, '')}
          </span>
        </div>
      );
    }

    // Folder or section
    return (
      <div key={item.path}>
        <div
          onClick={() => onToggleSection(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            paddingLeft: `${16 + depth * 16}px`,
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'var(--transition)',
            color: 'var(--text-heading)',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '2px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(229, 85, 85, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span style={{ 
            fontSize: '0.7rem', 
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
            width: '12px'
          }}>
            ▶
          </span>
          <span style={{ fontSize: '0.95rem' }}>{getIcon(item)}</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </span>
          {item.children && (
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'var(--text-muted)',
              background: 'var(--bg-card)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {item.children.length}
            </span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {item.children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontSize: '0.85rem' }}>
      {items.map(item => renderItem(item))}
    </div>
  );
}
