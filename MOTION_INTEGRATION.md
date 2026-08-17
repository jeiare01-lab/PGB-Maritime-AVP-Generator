# Motion API Integration Guide

## Overview

This tool orchestrates Motion AI video generation via the Anthropic API. The flow:

```
Your Script + Settings
  ↓
Anthropic Claude (claude-sonnet-4-6)
  ↓
Motion API Configuration (JSON)
  ↓
Motion API (Video Generation)
  ↓
4 Output Variants Ready
```

---

## How It Works

### 1. Scene Composition (UI)

User edits 8 scenes in the React interface:
- Narration (voiceover text)
- Visuals (animation/asset specs)
- Duration (seconds)

Example:

```json
{
  "id": 1,
  "title": "Problem",
  "duration": 60,
  "narration": "Philippine shipping is broken. Govt ports are congested, expensive, and slow.",
  "visuals": "Problem montage: crowded port, waiting ships, cost charts"
}
```

### 2. Anthropic API Call

The UI sends scenes + voice + brand settings to Anthropic:

```javascript
const payload = {
  model: "claude-sonnet-4-6",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: `Given this script and settings, generate Motion API video configuration JSON...`
    }
  ]
};

fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
```

### 3. Claude Response (Motion Config)

Claude returns JSON that describes each video variant:

```json
{
  "videos": {
    "full": {
      "duration": 225,
      "scenes": [
        {
          "sceneIndex": 0,
          "duration": 60,
          "textOverlay": "Philippine shipping is broken...",
          "animationStyle": "fade-in montage",
          "transitionType": "cross-dissolve"
        }
      ],
      "voiceSettings": {
        "type": "professional-male",
        "speed": 1.0,
        "tone": "authoritative"
      },
      "brandColors": {
        "primary": "#1e3a5f",
        "accent": "#ff8c00"
      }
    },
    "teaser60": { ... },
    "email90": { ... },
    "social30": { ... }
  }
}
```

### 4. Motion API Execution (Production)

Currently mocked, but in production:

```javascript
const generateMotionVideo = async (variant, config) => {
  const response = await fetch("https://api.motion.dev/videos", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MOTION_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: `PGB Maritime AVP - ${variant}`,
      scenes: config.scenes,
      voiceover: {
        text: config.scenes.map(s => s.textOverlay).join(' '),
        settings: config.voiceSettings
      },
      branding: config.brandColors,
      outputFormat: variant === 'full' ? 'mp4' : 'h.264'
    })
  });

  const data = await response.json();
  return data.videoUrl; // Ready for download
};
```

---

## Scene Configuration

Each scene maps to Motion API segments:

```javascript
{
  "sceneIndex": 0,           // Scene order
  "duration": 60,             // Seconds
  "textOverlay": "...",       // What appears on screen
  "animationStyle": "...",    // fade-in, slide, zoom, etc
  "transitionType": "...",    // cross-dissolve, wipe, cut, etc
  "assets": {                 // Images, footage, graphics
    "background": "url/path",
    "overlay": "url/path"
  }
}
```

### Animation Styles

- `fade-in` — Smooth opacity increase
- `slide-left` / `slide-right` — Directional movement
- `zoom-in` / `zoom-out` — Scale transformation
- `montage` — Multiple clips in sequence
- `static` — No animation (flat text/graphics)

### Transition Types

- `cross-dissolve` — Fade between scenes (default)
- `wipe` — Directional transition
- `cut` — Hard cut (immediate)
- `fade-to-black` — Black frame transition
- `fade-through-color` — Transition via color (brand color)

---

## Voice Configuration

Motion voice settings:

```javascript
"voiceSettings": {
  "type": "professional-male",  // or professional-female, narrator
  "speed": 1.0,                 // 0.8 - 1.3x
  "tone": "authoritative",      // or conversational, energetic
  "language": "en-US"           // or tl-PH for Tagalog
}
```

**Voice Types**:
- `professional-male`: Credible, formal
- `professional-female`: Modern, inclusive
- `narrator`: Storytelling, warm

**Tones**:
- `authoritative`: Commanding, confident
- `conversational`: Friendly, casual
- `energetic`: Upbeat, motivational

---

## Output Variants

### Full (3:45 / 225s)

All 8 scenes at full length.

```
Scene 1: Problem (60s)
Scene 2: Cost Impact (30s)
Scene 3: Opportunity (30s)
Scene 4: Network (45s)
Scene 5: Live Proof (45s)
Scene 6: Advantages (45s)
Scene 7: Shipper Wins (30s)
Scene 8: CTA (30s)
```

**Use**: YouTube, long-form content

### Teaser (60s)

Highlights: Problem → Opportunity → Solution

```
Scene 1: Problem (20s) — condensed
Scene 3: Opportunity (15s) — highlight
Scene 4: Network (15s) — key visual
Scene 8: CTA (10s) — call to action
```

**Use**: LinkedIn, social teaser

### Email (90s)

Problem → Solution → Proof → CTA

```
Scene 1-2: Problem (30s)
Scene 4: Solution (30s)
Scene 5: Proof (20s)
Scene 8: CTA (10s)
```

**Use**: Email campaigns, newsletters

### Social (30s)

Eye-catching hook → CTA

```
Scene 3: Opportunity (10s) — hook
Scene 5: Dashboard (15s) — visual proof
Scene 8: CTA (5s) — action
```

**Use**: TikTok, Instagram Reels, YouTube Shorts

---

## Brand Settings

Colors applied throughout:

```javascript
"brandColors": {
  "primary": "#1e3a5f",    // Maritime blue (main accent)
  "accent": "#ff8c00",     // Warning orange (highlights/CTA)
  "background": "#ffffff", // Video background
  "text": "#1e3a5f"        // Text color
}
```

**Where colors appear**:
- Primary: Text, headings, borders
- Accent: Buttons, highlights, transitions
- Background: Video canvas
- Text: Narration/overlay text

---

## Integration Checklist

- [ ] Motion AI account created
- [ ] Motion API key obtained
- [ ] Anthropic API key configured
- [ ] `.env.local` has both keys
- [ ] Test API call in local dev
- [ ] Mock videos replaced with real API calls
- [ ] Output storage configured (S3, Vercel Blob, etc)
- [ ] Error handling added for API failures
- [ ] Logging added for monitoring
- [ ] CDN configured for video delivery

---

## Example: Full Production Flow

```javascript
// 1. User edits scenes in UI
const scenes = [
  { id: 1, title: "Problem", duration: 60, narration: "...", visuals: "..." },
  // ... 7 more scenes
];

// 2. Call Anthropic to generate Motion config
const motionConfig = await generateMotionConfig(scenes, voiceSettings, brandSettings);

// 3. For each variant, call Motion API
const videoUrls = {};
for (const [variant, config] of Object.entries(motionConfig.videos)) {
  const videoUrl = await generateMotionVideo(variant, config);
  videoUrls[variant] = videoUrl;
}

// 4. Return video links to user
return {
  full: videoUrls.full,        // https://motion.dev/videos/full-xxx.mp4
  teaser60: videoUrls.teaser60,
  email90: videoUrls.email90,
  social30: videoUrls.social30
};
```

---

## Troubleshooting

### Issue: "Invalid scene configuration"
- Check all required fields: `sceneIndex`, `duration`, `textOverlay`
- Verify durations sum correctly for each variant
- Ensure animation/transition types are valid

### Issue: "Motion API returns 401"
- Check API key is valid
- Verify Bearer token format
- Check API key not expired

### Issue: "Video generation times out"
- Motion API is async—may need polling
- Implement retry logic with exponential backoff
- Check Motion API status page

### Issue: "Audio sync is off"
- Verify voiceover text matches narration length
- Adjust animation duration to match audio
- Use Motion's auto-sync feature

---

## Next Steps

1. **Production Integration**: Replace mock video generation with real Motion API calls
2. **Async Processing**: Implement job queue for long video generation
3. **Storage**: Configure video storage (S3, Vercel Blob, Cloudinary)
4. **Distribution**: Auto-publish to YouTube, LinkedIn, email platforms
5. **Analytics**: Track video views, engagement, shares per variant
6. **Multi-Language**: Generate Tagalog/Bisaya voiceovers

---

## Resources

- Motion AI Docs: https://motion.dev/api
- Anthropic Docs: https://docs.anthropic.com
- Video Configuration Reference: See `AVPGenerator.jsx` for full UI
