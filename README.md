# PGB Maritime AVP Generator

Transform the PGB Maritime storyline into production-ready video content via Motion AI integration.

## Features

- **8-Scene Editor**: Pre-loaded AVP storyline (Problem → Cost Impact → Opportunity → Network → Live Proof → Structural Advantage → Shipper Wins → CTA)
- **Voice Control**: Voice type, tone, speed settings (professional narration ready)
- **Brand Settings**: Primary/accent color customization
- **4-Variant Output**: 
  - Full (3:45) → YouTube
  - Teaser (60s) → LinkedIn
  - Email (90s) → Campaigns
  - Social (30s) → TikTok/Reels
- **Anthropic API Orchestration**: Uses Claude to coordinate Motion API calls

## Architecture

```
User Input (Scenes + Voice + Brand)
    ↓
React UI (Scene Composer)
    ↓
Anthropic API (claude-sonnet-4-6)
    ↓
Motion API (Video Generation)
    ↓
4 Output Variants (Ready for Distribution)
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/jeiare01-lab/pgb-maritime-avp-generator.git
cd pgb-maritime-avp-generator
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Local Development

```bash
npm run dev
```

Opens on `http://localhost:5173`

## Workflow

1. **Edit Scenes**: Left panel shows all 8 scenes. Edit narration, visuals, duration for each.
2. **Configure Voice**: Select voice type, tone, playback speed.
3. **Set Brand Colors**: Primary (maritime blue) + Accent (warning orange).
4. **Generate**: Click "Generate Videos" → Anthropic API orchestrates Motion → 4 variants created.
5. **Download**: Copy links or download each variant directly.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
npm run build
vercel --prod
```

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

## API Flow

**Anthropic API Call**:
- Input: Scene script + voice settings + brand colors
- Processing: Claude generates Motion API configuration (JSON with timing, animations, transitions)
- Output: 4 video generation commands (full, teaser, email, social)

**Motion API Integration** (Production):
- POST to Motion `/videos` endpoint with config
- Wait for async processing
- Receive download URLs

## Customization

### Editing Scenes

Each scene is fully editable:
- **Narration**: Voiceover text
- **Visuals**: Asset/animation specs (fed to Motion)
- **Duration**: Scene length in seconds

### Voice Options

- `professional-male`: Authority, credibility
- `professional-female`: Modern, inclusive
- `narrator`: Storytelling tone

Speed: 0.8x - 1.3x (default 1.0x)

### Brand Colors

- **Primary**: Main UI accent (default: maritime blue `#1e3a5f`)
- **Accent**: Highlights, CTAs (default: warning orange `#ff8c00`)

## Testing

Use the local dev server to test all configurations before running generation.

Motion API integration is orchestrated via Anthropic—no additional API keys needed initially.

## Next Steps

1. **Production Motion API**: Replace mock links with real Motion API calls
2. **Asset Management**: Connect dashboard mockups (Scene 5) to live data
3. **Distribution Automation**: Auto-publish to YouTube, LinkedIn, email sequences
4. **Analytics**: Track video engagement per variant
5. **Multi-Language**: Generate voiceovers in English, Tagalog, Bisaya

## Support

Questions? Check `/areas/ports-logistics-operations.md` for full Maritime operation context.
