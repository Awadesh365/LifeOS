const strongStack = {
  frontend: ['React', 'React Router DOM', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Material UI', 'CSS', 'Recharts', 'ChartJS', 'Framer Motion'],
  backend: ['MongoDB', 'PostgreSQL', 'Express', 'Redis', 'RabbitMQ'],
  cloud: ['AWS', 'GCP'],
};

const quotes = [
  'Mindset without execution is hallucination.',
  'Career is God. Everything else can wait.',
  'Your work is your worship. Code is your temple.',
  'No bullshit. Keep learning, keep building.',
  'These are your years (20-35). Make them count.',
  'The real flex is quiet competence.',
  'A small environment creates a small destiny.',
  "Stop fighting the mind. Find your 'Ras' (flow).",
  'Strength, money, and upskilling - without them, everything collapses.',
  'I am responsible for my life, and I have the power to change it.',
  'Quality is not negotiable.',
  'Learn or be crushed.',
  'Do something great in life. Or be nothing.',
];

export function getContent() {
  return { strongStack, quotes };
}

export function getStrongStack() {
  return strongStack;
}

export function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return { quote: quotes[index] };
}
