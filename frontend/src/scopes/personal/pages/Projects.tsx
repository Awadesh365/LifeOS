import { useState } from 'react';
import {
  Box,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Collapse,
  ButtonBase,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Header from '../components/Header';

interface ProjectsProps {
  isMobile?: boolean;
}

const LIFE_PARTS = [
  {
    name: 'Part I — The Foundation',
    color: '#E55555',
    projects: [
      { title: 'The Project of Mind', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/1. The Project of Mind.md' },
      { title: 'The Project of Body', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/2. The Project of Body.md' },
      { title: 'The Project of Character', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/3. The Project of Character.md' },
      { title: 'The Project of Self-Realization', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part I — The Foundation/4. The Project of Self-Realization.md' },
    ],
  },
  {
    name: 'Part II — Knowledge',
    color: '#2196F3',
    projects: [
      { title: 'The Project of Education', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/5. The Project of Education.md' },
      { title: 'The Project of Skills', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/6. The Project of Skills.md' },
      { title: 'The Project of Creation', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part II — Knowledge/7. The Project of Creation.md' },
    ],
  },
  {
    name: 'Part III — Wealth',
    color: '#4CAF50',
    projects: [
      { title: 'The Project of Money', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part III — Wealth/8. The Project of Money.md' },
      { title: 'The Project of Career', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part III — Wealth/9. The Project of Career.md' },
    ],
  },
  {
    name: 'Part IV — Time',
    color: '#FF9800',
    projects: [
      { title: 'The Project of Time', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/10. The Project of Time.md' },
      { title: 'The Project of Attention', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/11. The Project of Attention.md' },
      { title: 'The Project of Energy', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part IV — Time/12. The Project of Energy.md' },
    ],
  },
  {
    name: 'Part V — Relationships',
    color: '#E91E63',
    projects: [
      { title: 'The Project of Relationships', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part V — Relationships/13. The Project of Relationships.md' },
      { title: 'The Project of Love', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part V — Relationships/14. The Project of Love.md' },
    ],
  },
  {
    name: 'Part VI — Legacy',
    color: '#9C27B0',
    projects: [
      { title: 'The Project of Purpose', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VI — Legacy/15. The Project of Purpose.md' },
      { title: 'The Project of Freedom', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VI — Legacy/16. The Project of Freedom.md' },
    ],
  },
  {
    name: 'Part VII — The Invisible Projects',
    color: '#9E9E9E',
    projects: [
      { title: 'The Project of Silence', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/17. The Project of Silence.md' },
      { title: 'The Project of Detachment', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/18. The Project of Detachment.md' },
      { title: 'The Project of Reputation', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/19. The Project of Reputation.md' },
      { title: 'The Project of Peace', path: 'c Clarity In life/8.Take Life Parts of LIfe as Projects/Projects of Life/Part VII — The Invisible Projects/20. The Project of Peace.md' },
    ],
  },
];

const PROFESSIONAL_PROJECTS = [
  {
    title: 'Life Tracker',
    description: 'This app — tracking life, habits, and philosophy',
    stack: ['React', 'Vite', 'React Router'],
    color: '#E55555',
    status: 'Active' as const,
  },
  {
    title: 'Personal Portfolio',
    description: 'Showcasing work, skills, and projects',
    stack: [],
    color: '#2196F3',
    status: 'Planned' as const,
  },
];

export default function Projects({ isMobile }: ProjectsProps) {
  const [tab, setTab] = useState<'life' | 'professional'>('life');
  const [openParts, setOpenParts] = useState<Record<string, boolean>>({});

  const togglePart = (name: string) => {
    setOpenParts((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <Header title="Projects" subtitle="Life projects and professional work" />

      <Box sx={{ p: isMobile ? 2 : 3 }}>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab label="Life Projects" value="life" />
        <Tab label="Professional Projects" value="professional" />
      </Tabs>

      {tab === 'life' && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Treat Life as Projects</Typography>
            <Typography variant="body2" color="text.secondary">
              The Most Neglected Person in Your Life Is You
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {LIFE_PARTS.map((part) => {
              const isOpen = openParts[part.name] || false;
              return (
                <Card key={part.name} variant="outlined">
                  <ButtonBase
                    sx={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: isOpen ? '1px solid' : 'none',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => togglePart(part.name)}
                    aria-expanded={isOpen}
                  >
                    <Box sx={{ display: 'grid', width: 28, height: 28, placeItems: 'center', color: 'text.secondary' }}>
                      {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700} fontSize="0.95rem">
                        {part.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.78rem">
                        {part.projects.length} {part.projects.length === 1 ? 'project' : 'projects'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 4,
                        height: 40,
                        bgcolor: part.color,
                        borderRadius: 1,
                        opacity: 0.6,
                      }}
                    />
                  </ButtonBase>
                  <Collapse in={isOpen}>
                    <Box sx={{ p: 1 }}>
                      {part.projects.map((project, j) => (
                        <Box
                          key={j}
                          component="a"
                          href="/articles"
                          onClick={() => {
                            localStorage.setItem('selectedArticlePath', project.path);
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            py: 1.5,
                            px: 2,
                            mx: 1,
                            borderRadius: 1,
                            textDecoration: 'none',
                            color: 'text.primary',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: part.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography fontSize="0.9rem" fontWeight={500}>
                            {project.title}
                          </Typography>
                          <Typography
                            sx={{ ml: 'auto' }}
                            fontSize="0.75rem"
                            color="text.secondary"
                          >
                            →
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      {tab === 'professional' && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Professional Projects</Typography>
            <Typography variant="body2" color="text.secondary">
              Software projects, apps, and professional work
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {PROFESSIONAL_PROJECTS.map((project, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card variant="outlined" sx={{ borderTop: `3px solid ${project.color}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>{project.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {project.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={project.status}
                        color={project.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    {project.stack.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5 }}>
                        {project.stack.map((tech, j) => (
                          <Chip
                            key={j}
                            label={tech}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.72rem' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderStyle: 'dashed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                  cursor: 'pointer',
                  opacity: 0.6,
                }}
              >
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <Typography fontSize="2rem">+</Typography>
                  <Typography fontSize="0.88rem" fontWeight={600}>
                    Add Project
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      </Box>
    </>
  );
}
