import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import Header from '../components/Header';

interface PhilosophyProps {
  isMobile?: boolean;
}

export default function Philosophy({ isMobile }: PhilosophyProps) {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: isMobile ? 2 : 3 }}>
      <Header title="Core Philosophy" subtitle="The fundamental laws of execution and reality." />

      <Card sx={{ mt: 3, mb: 4, textAlign: 'center' }}>
        <CardContent sx={{ p: '40px !important' }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ letterSpacing: '-1px', mb: 2, lineHeight: 1.2 }}
          >
            Winning as a Life Principle:
            <br />
            <Typography
              component="span"
              variant="h3"
              fontWeight={800}
              color="primary.main"
              sx={{ lineHeight: 1.2 }}
            >
              Why Defeat Must Never Become Your Identity
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2.5 }}>
            <Chip label="Core Principle 01" color="warning" size="small" />
            <Chip label="Identity & Power" color="info" size="small" />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'text.primary', px: isMobile ? 0 : 2.5 }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            color: 'text.secondary',
            fontWeight: 500,
            mb: 4,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2.5,
            lineHeight: 1.8,
          }}
        >
          There are people who treat life casually. They move without urgency, think without
          intensity, and live without a standard. They compromise with weakness, negotiate with
          mediocrity, and slowly make peace with defeat. Then there are those who decide something
          far more dangerous and far more powerful: <strong>losing is not an option as a way of life</strong>.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          This mindset is not about arrogance. It is not about shouting slogans. It is not about
          pretending to be strong. It is about making a deep internal decision that in every
          important dimension of life—physical strength, mental resilience, financial power, career
          growth, discipline, self-respect, and character—<strong>you will not accept decay,
          helplessness, or voluntary weakness</strong>.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Winning, then, stops being an event. It becomes a standard.
        </Typography>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          The real enemy is not failure. It is weakness.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          A lot of people misunderstand this. They think the opposite of winning is failing once.
          That is not true.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Failure can be temporary. Failure can teach. Failure can sharpen. Failure can expose gaps.
          Failure can become fuel.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>But weakness is different.</strong>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Weakness is when a person stops resisting decline. Weakness is when someone knows what
          must be done but avoids it. Weakness is when excuses replace action, comfort replaces
          discipline, and fear replaces courage. Weakness is not about lacking power one day; it is
          about accepting powerlessness as normal.
        </Typography>

        <Card variant="outlined" sx={{ my: 4, p: 3 }}>
          <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
            <Box component="li" sx={{ mb: 1 }}>
              <strong>A weak body</strong> affects confidence.
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <strong>A weak mind</strong> affects decisions.
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <strong>A weak will</strong> affects execution.
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <strong>A weak financial position</strong> affects freedom.
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <strong>A weak career position</strong> affects dignity.
            </Box>
            <Box component="li">
              <strong>A weak character</strong> affects everything.
            </Box>
          </Box>
        </Card>

        <Typography sx={{ mb: 2 }}>
          So the battle is not merely to "succeed." The battle is to refuse weakness in all its
          forms.
        </Typography>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          Strength is not optional in life
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Life does not reward good intentions alone. Life tests capability.
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2.5 }}>
          <Box component="li">It tests whether you can endure pressure.</Box>
          <Box component="li">It tests whether you can think clearly in chaos.</Box>
          <Box component="li">It tests whether you can keep moving when emotions are unstable.</Box>
          <Box component="li">
            It tests whether you can build value, command respect, protect yourself, and carry
            responsibility.
          </Box>
        </Box>
        <Typography sx={{ mb: 2 }}>
          Strength, therefore, is not a luxury. It is a requirement.
        </Typography>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          Winning is non-negotiable
        </Typography>
        <Typography sx={{ mb: 2 }}>
          To say that winning is non-negotiable does not mean life will always go according to
          plan. It means something deeper.
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2.5 }}>
          <Box component="li">You do not normalize losing.</Box>
          <Box component="li">You do not build an identity around excuses.</Box>
          <Box component="li">You do not stay down.</Box>
          <Box component="li">You do not call your surrender "peace."</Box>
          <Box component="li">You do not dress your fear up as "balance."</Box>
          <Box component="li">You do not glorify passivity when action is required.</Box>
        </Box>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          The philosophy of total responsibility
        </Typography>
        <Typography sx={{ mb: 2 }}>
          People often lose because they hand over responsibility for their lives to circumstances.
          They blame family, economy, office politics, bad luck, lack of support, lack of
          recognition, unfair systems, or difficult environments. Some of those things may be real.
          Many times they are real. But even when reality is unfair, one principle remains undefeated:
        </Typography>
        <Typography
          sx={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center',
            my: 4,
          }}
        >
          "Your progress still demands your responsibility."
        </Typography>

        <Grid container spacing={2} sx={{ my: 4 }}>
          {[
            { t: 'Body', c: 'No one is coming to save your body. You must train it.' },
            { t: 'Mind', c: 'No one is coming to save your mind. You must discipline it.' },
            { t: 'Finances', c: 'No one is coming to save your finances. You must build them.' },
            { t: 'Career', c: 'No one is coming to save your career. You must sharpen your value.' },
            { t: 'Future', c: 'No one is coming to save your future. You must earn it.' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.t}>
              <Card variant="outlined">
                <CardContent>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>
                    {item.t}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.c}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          Strength is built through resistance
        </Typography>
        <Typography sx={{ mb: 2 }}>
          No one becomes powerful accidentally. Strength is built by carrying what is heavy. Mental
          resilience is built by facing what is uncomfortable. Skill is built by repetition.
          Confidence is built by evidence. Discipline is built by obedience to principle, even when
          feelings resist.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          The gym is one example of life itself. Weight resists you. Your muscles adapt. You become
          stronger. In the same way, hard work resists your comfort. Pressure resists your emotions.
          Competition resists your ego. Reality resists your fantasies. And if you keep engaging
          those forces correctly, you become harder, sharper, calmer, and more capable.
        </Typography>

        <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
          Conclusion: Live in a way that weakness cannot survive in you
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Life is not a place for passive existence. It is a field of pressure, competition,
          responsibility, uncertainty, and opportunity. To move through it well, a person must
          become strong—physically, mentally, financially, professionally, and morally.
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2.5 }}>
          <Box component="li">Defeat must never become your identity.</Box>
          <Box component="li">Weakness must never become your comfort zone.</Box>
          <Box component="li">Winning must become your discipline, not just your desire.</Box>
        </Box>

        <Card
          variant="outlined"
          sx={{
            mt: 5,
            p: 3,
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            The goal is not to appear powerful. The goal is to become so solid that life itself
            feels your presence. And once you choose that standard fully, there is only one
            direction left:
          </Typography>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ textTransform: 'uppercase', letterSpacing: 3 }}
          >
            Forward, upward, stronger.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
