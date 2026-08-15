import {
  AccountBalanceWalletOutlined,
  ArrowForwardRounded,
  AutoAwesomeOutlined,
  FitnessCenterOutlined,
  PsychologyOutlined,
  ShieldOutlined,
  TrendingUpRounded,
  WorkOutlineRounded,
} from '@mui/icons-material';
import { Box, Chip, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Header from '../components/Header';

interface PhilosophyProps {
  isMobile?: boolean;
}

interface PrincipleCardProps {
  icon: ReactNode;
  title: string;
  copy: string;
  tone: string;
}

const responsibilityAreas: PrincipleCardProps[] = [
  {
    icon: <FitnessCenterOutlined />,
    title: 'Body',
    copy: 'Train for capability, energy, and confidence.',
    tone: 'coral',
  },
  {
    icon: <PsychologyOutlined />,
    title: 'Mind',
    copy: 'Build calm focus and disciplined thinking.',
    tone: 'violet',
  },
  {
    icon: <AccountBalanceWalletOutlined />,
    title: 'Finances',
    copy: 'Create margin, freedom, and long-term security.',
    tone: 'green',
  },
  {
    icon: <WorkOutlineRounded />,
    title: 'Career',
    copy: 'Sharpen your value until opportunity can find you.',
    tone: 'blue',
  },
];

const standards = [
  'Take responsibility before seeking excuses.',
  'Choose consistency over temporary intensity.',
  'Treat failure as information, never identity.',
  'Build proof through action every single day.',
];

function PrincipleCard({ icon, title, copy, tone }: PrincipleCardProps) {
  return (
    <Box className="philosophy-principle-card">
      <Box className={`philosophy-principle-icon philosophy-principle-icon--${tone}`}>
        {icon}
      </Box>
      <Box>
        <Typography component="h3">{title}</Typography>
        <Typography component="p">{copy}</Typography>
      </Box>
    </Box>
  );
}

export default function Philosophy(_props: PhilosophyProps) {
  return (
    <Box className="philosophy-page">
      <Header
        title="Core Philosophy"
        subtitle="The operating principles behind a stronger life."
      />

      <Box className="philosophy-workspace">
        <Box component="section" className="philosophy-hero">
          <Box className="philosophy-hero-glow" aria-hidden="true" />
          <Box className="philosophy-hero-content">
            <Box className="philosophy-eyebrow">
              <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
              Personal operating system · Principle 01
            </Box>
            <Typography component="h1">
              Build a life where weakness
              <Box component="span"> cannot become your identity.</Box>
            </Typography>
            <Typography component="p" className="philosophy-hero-copy">
              Winning is not a single outcome. It is the standard of taking responsibility,
              building capability, and returning stronger whenever reality pushes back.
            </Typography>
            <Box className="philosophy-hero-actions">
              <Chip label="Identity & discipline" className="philosophy-chip philosophy-chip--light" />
              <Chip label="Read time · 6 min" className="philosophy-chip philosophy-chip--ghost" />
            </Box>
          </Box>
          <Box className="philosophy-hero-mark" aria-hidden="true">
            <ShieldOutlined />
          </Box>
        </Box>

        <Box component="section" className="philosophy-summary-grid">
          <Box className="philosophy-summary-card">
            <Typography component="span">01</Typography>
            <Box>
              <Typography component="h2">Responsibility first</Typography>
              <Typography component="p">Own the next move, even when the situation is unfair.</Typography>
            </Box>
          </Box>
          <Box className="philosophy-summary-card">
            <Typography component="span">02</Typography>
            <Box>
              <Typography component="h2">Capability compounds</Typography>
              <Typography component="p">Strength grows through repeated, deliberate evidence.</Typography>
            </Box>
          </Box>
          <Box className="philosophy-summary-card">
            <Typography component="span">03</Typography>
            <Box>
              <Typography component="h2">Standards over moods</Typography>
              <Typography component="p">Keep the promise after motivation has disappeared.</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="philosophy-reading-layout">
          <Box component="article" className="philosophy-article">
            <Box component="section" className="philosophy-section">
              <Box className="philosophy-section-label">The foundation</Box>
              <Typography component="h2">Failure is an event. Weakness is an agreement.</Typography>
              <Typography component="p" className="philosophy-lead">
                Failure can teach, expose gaps, and become fuel. The real danger begins when a
                temporary setback becomes permission to stop resisting decline.
              </Typography>
              <Typography component="p">
                This philosophy is not about arrogance or pretending to be invincible. It is the
                quieter decision to reject voluntary helplessness—in health, work, money,
                relationships, and character. You can have a difficult day without making defeat
                your permanent address.
              </Typography>
              <Box className="philosophy-quote">
                <TrendingUpRounded />
                <Typography component="blockquote">
                  Winning stops being an event when it becomes the standard you return to.
                </Typography>
              </Box>
            </Box>

            <Box component="section" className="philosophy-section">
              <Box className="philosophy-section-label">Total responsibility</Box>
              <Typography component="h2">Own the response, not every circumstance.</Typography>
              <Typography component="p">
                Family, economics, office politics, luck, and unfair systems can all shape the
                field. Responsibility does not deny that reality. It protects your agency inside
                it. The question is not whether everything was your fault; the question is what
                useful move remains yours.
              </Typography>

              <Box className="philosophy-principle-grid">
                {responsibilityAreas.map((area) => (
                  <PrincipleCard key={area.title} {...area} />
                ))}
              </Box>
            </Box>

            <Box component="section" className="philosophy-section philosophy-section--last">
              <Box className="philosophy-section-label">The practice</Box>
              <Typography component="h2">Strength is built through intelligent resistance.</Typography>
              <Typography component="p">
                Muscles adapt to weight. Skill adapts to repetition. Confidence adapts to evidence.
                The goal is not constant struggle; it is choosing enough meaningful resistance to
                keep growing without destroying the system that must carry you forward.
              </Typography>

              <Box className="philosophy-closing-card">
                <Box>
                  <Typography component="span">The direction</Typography>
                  <Typography component="h3">Forward. Upward. Stronger.</Typography>
                  <Typography component="p">
                    Become so reliable that your future can safely depend on your present actions.
                  </Typography>
                </Box>
                <ArrowForwardRounded />
              </Box>
            </Box>
          </Box>

          <Box component="aside" className="philosophy-standard-card">
            <Box className="philosophy-standard-icon">
              <ShieldOutlined />
            </Box>
            <Typography component="span" className="philosophy-standard-kicker">
              Personal standard
            </Typography>
            <Typography component="h2">The daily code</Typography>
            <Typography component="p" className="philosophy-standard-intro">
              A philosophy becomes useful only when it changes behaviour.
            </Typography>
            <Box component="ol">
              {standards.map((standard, index) => (
                <Box component="li" key={standard}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Typography component="p">{standard}</Typography>
                </Box>
              ))}
            </Box>
            <Box className="philosophy-standard-footer">
              <AutoAwesomeOutlined />
              <Typography component="p">Review weekly. Practice daily.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
