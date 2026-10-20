import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI client with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System status and telemetry validation endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!aiClient,
    environment: process.env.NODE_ENV || 'development',
    supportedModels: [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Standard Multimodal)', recommended: true },
      { id: 'gemini-4-argon', name: 'Gemini 4 Argon (Flagship MoE & Long-Horizon)', paidTier: true },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (High-Speed)', recommended: false },
    ],
    timestamp: new Date().toISOString(),
  });
});

interface TrialRequestBody {
  model?: string;
  prompt: string;
  systemInstruction?: string;
  thinkingLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  temperature?: number;
  conditionLabel?: string;
  inlineMedia?: {
    mimeType: string;
    data: string; // base64
  };
}

// Single trial execution endpoint
app.post('/api/gemini/run-trial', async (req: Request, res: Response) => {
  if (!aiClient) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured on the server. Please add your API key in AI Studio Secrets.',
      isLiveApi: false,
    });
  }

  const {
    model = 'gemini-3.8-flash',
    prompt,
    systemInstruction,
    thinkingLevel,
    temperature = 0.7,
    conditionLabel,
    inlineMedia,
  }: TrialRequestBody = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'A valid text prompt is required.' });
  }

  const startTime = performance.now();

  try {
    const config: Record<string, unknown> = {};

    if (systemInstruction && systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    if (typeof temperature === 'number') {
      config.temperature = Math.max(0, Math.min(2, temperature));
    }

    // Set thinkingLevel if supported and specified
    if (thinkingLevel && (model.startsWith('gemini-3') || model.startsWith('gemini-4'))) {
      if (thinkingLevel === 'LOW') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      } else if (thinkingLevel === 'MEDIUM') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.MEDIUM };
      } else if (thinkingLevel === 'HIGH') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }
    }

    // Multimodal or text-only content assembly
    let contents: unknown = prompt;
    if (inlineMedia && inlineMedia.data && inlineMedia.mimeType) {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: inlineMedia.mimeType,
              data: inlineMedia.data,
            },
          },
          { text: prompt },
        ],
      };
    }

    const response = await aiClient.models.generateContent({
      model,
      contents: contents as any,
      config: Object.keys(config).length > 0 ? (config as any) : undefined,
    });

    const elapsedMs = Math.round(performance.now() - startTime);
    const responseText = response.text || '';

    // Honest behavioral observation signals (strictly based on observable text output)
    const refusalPatterns = [
      /I cannot fulfill/i,
      /I am unable to/i,
      /as an AI/i,
      /against my safety policies/i,
      /I'm sorry, but I can't/i,
    ];
    const refusalDetected = refusalPatterns.some((pattern) => pattern.test(responseText));

    // Shortcut indicator heuristic (detects whether answer jumped to conclusion without working)
    const hasChainOfThought = /step 1|first,|reasoning:|analysis:|therefore/i.test(responseText);

    return res.json({
      success: true,
      text: responseText,
      latencyMs: elapsedMs,
      model,
      conditionLabel: conditionLabel || 'Default Condition',
      timestamp: new Date().toISOString(),
      usageMetadata: response.usageMetadata || null,
      finishReason: response.candidates?.[0]?.finishReason || 'STOP',
      isLiveApi: true,
      telemetry: {
        measuredLatencyMs: elapsedMs,
        tokenEstimate: Math.round(responseText.length / 4),
        refusalDetected,
        hasExplicitReasoningMarkers: hasChainOfThought,
        internalMoEWeightsAccessible: false,
        note: 'Internal MoE routing paths and raw attention weights are proprietary to Google inference infrastructure and inaccessible via public endpoints.',
      },
    });
  } catch (err: any) {
    const elapsedMs = Math.round(performance.now() - startTime);
    console.error('Error in /api/gemini/run-trial:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An error occurred while communicating with Gemini API.',
      latencyMs: elapsedMs,
      model,
      isLiveApi: true,
    });
  }
});

// Batch comparison endpoint for dual-condition experimental runs
app.post('/api/gemini/batch-compare', async (req: Request, res: Response) => {
  if (!aiClient) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured on the server.',
      isLiveApi: false,
    });
  }

  const { conditionA, conditionB } = req.body;
  if (!conditionA?.prompt || !conditionB?.prompt) {
    return res.status(400).json({ success: false, error: 'Both conditionA and conditionB require prompts.' });
  }

  const executeCondition = async (cond: TrialRequestBody, defaultLabel: string) => {
    const model = cond.model || 'gemini-3.8-flash';
    const startTime = performance.now();
    try {
      const config: Record<string, unknown> = {};
      if (cond.systemInstruction) config.systemInstruction = cond.systemInstruction;
      if (typeof cond.temperature === 'number') config.temperature = cond.temperature;
      if (cond.thinkingLevel) {
        if (cond.thinkingLevel === 'LOW') config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        if (cond.thinkingLevel === 'MEDIUM') config.thinkingConfig = { thinkingLevel: ThinkingLevel.MEDIUM };
        if (cond.thinkingLevel === 'HIGH') config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await aiClient!.models.generateContent({
        model,
        contents: cond.prompt,
        config: Object.keys(config).length > 0 ? (config as any) : undefined,
      });

      const elapsedMs = Math.round(performance.now() - startTime);
      const text = response.text || '';

      return {
        success: true,
        text,
        latencyMs: elapsedMs,
        model,
        conditionLabel: cond.conditionLabel || defaultLabel,
        timestamp: new Date().toISOString(),
        usageMetadata: response.usageMetadata || null,
        isLiveApi: true,
      };
    } catch (err: any) {
      const elapsedMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        error: err.message || 'Generation failed',
        latencyMs: elapsedMs,
        model,
        conditionLabel: cond.conditionLabel || defaultLabel,
        isLiveApi: true,
      };
    }
  };

  const [resA, resB] = await Promise.all([
    executeCondition(conditionA, 'Condition A'),
    executeCondition(conditionB, 'Condition B'),
  ]);

  res.json({
    trialA: resA,
    trialB: resB,
    comparedAt: new Date().toISOString(),
  });
});

// Boot development or production server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gemini 4 Argon Research Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
