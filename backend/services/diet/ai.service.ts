import { createHttpError } from '../../utils/httpError.js';

const MAX_IMAGE_CHARS = 7_000_000;
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function complete(messages: Array<Record<string, any>>, json = false) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw createHttpError(503, 'AI tools are not configured. Add OPENAI_API_KEY to the backend environment to enable them.');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages, ...(json ? { response_format: { type: 'json_object' } } : {}), max_tokens: 700 }),
    signal: AbortSignal.timeout(45_000),
  }).catch(() => { throw createHttpError(502, 'The AI service could not be reached. Try again shortly.'); });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw createHttpError(503, 'The configured AI API key was rejected. Check the backend environment settings.');
    throw createHttpError(502, 'The AI service could not complete this request. Try again shortly.');
  }
  const payload: any = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw createHttpError(502, 'The AI service returned an empty response.');
  return content;
}

export async function scanMeal(input: Record<string, unknown>) {
  const image = String(input.image || '');
  const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !allowedMimeTypes.has(match[1]) || image.length > MAX_IMAGE_CHARS) throw createHttpError(400, 'Choose a JPEG, PNG, or WebP image smaller than 5 MB.');
  const answer = await complete([
    { role: 'system', content: 'Estimate the visible meal from the image. Do not claim exactness. Return a JSON object with mealName (string), visibleItems (array of strings), calories (number or null), proteinGrams (number or null), confidence (low|medium|high), assumptions (array of strings). Use null when portion size or ingredients are not inferable. Do not infer allergies or medical suitability. Keep estimates conservative and explain uncertainty.' },
    { role: 'user', content: [{ type: 'text', text: 'Estimate this meal as a rough starting point. State portion assumptions and use low confidence when scale or ingredients are unclear.' }, { type: 'image_url', image_url: { url: image, detail: 'high' } }] },
  ], true);
  let result: any;
  try { result = JSON.parse(answer); } catch { throw createHttpError(502, 'The AI service returned an unreadable meal estimate.'); }
  const amount = (value: unknown, max: number) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.min(max, Math.round(value)) : null;
  return {
    mealName: String(result.mealName || 'Meal estimate').slice(0, 100),
    visibleItems: Array.isArray(result.visibleItems) ? result.visibleItems.map(String).slice(0, 12) : [],
    calories: amount(result.calories, 10000),
    proteinGrams: amount(result.proteinGrams, 1000),
    confidence: ['low', 'medium', 'high'].includes(result.confidence) ? result.confidence : 'low',
    assumptions: Array.isArray(result.assumptions) ? result.assumptions.map(String).slice(0, 8) : [],
    source: 'AI visual estimate; user confirmation required',
  };
}

export async function askFitnessAssistant(input: Record<string, unknown>) {
  const question = String(input.question || '').trim().slice(0, 2000);
  if (question.length < 3) throw createHttpError(400, 'Enter a question first.');
  const context = String(input.context || '').slice(0, 1500);
  const answer = await complete([
    { role: 'system', content: 'You are a general fitness and nutrition education assistant inside LifeOS. Give practical, evidence-aware, non-diagnostic information. Ask clarifying questions when needed. Do not prescribe restrictive diets, diagnose conditions, or replace a clinician or registered dietitian. For severe pain, urgent symptoms, pregnancy, eating-disorder concerns, medication, or chronic disease, advise qualified professional care. Clearly say when evidence or personal context is insufficient.' },
    { role: 'user', content: `${context ? `User-provided context (unverified): ${context}\n\n` : ''}${question}` },
  ]);
  return { answer: answer.slice(0, 6000), source: 'AI-generated general information; verify for your circumstances' };
}
