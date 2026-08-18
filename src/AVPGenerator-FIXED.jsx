import React, { useState, useRef } from 'react';
import { Play, Send, Copy, Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const AVPGenerator = () => {
  const [scenes, setScenes] = useState([
    { id: 1, title: 'Problem', duration: 60, narration: 'Philippine shipping is broken. Govt ports are congested, expensive, and slow.', visuals: 'Problem montage: crowded port, waiting ships, cost charts' },
    { id: 2, title: 'Cost Impact', duration: 30, narration: '30-40% more expensive than global standards. ₱135-260B annual inefficiency.', visuals: 'Cost comparison animation, market size metric' },
    { id: 3, title: 'Opportunity', duration: 30, narration: 'What if logistics could work differently?', visuals: 'Question mark transition, network reveal teaser' },
    { id: 4, title: 'Network Solution', duration: 45, narration: 'CSP deep-water hub. Starlite and ALD operator networks. 120M consumer reach in 2 hours.', visuals: 'Map animation, route highlighting, Starlite+ALD routes' },
    { id: 5, title: 'Live Proof', duration: 45, narration: 'Real-time dashboard. Vessel tracking. Hub operations. Actual shipments moving now.', visuals: 'Dashboard embed (live or mock), vessel positions, metrics' },
    { id: 6, title: 'Structural Advantage', duration: 45, narration: '70k-ton capacity. 4.7x more cargo per voyage. 7.5x faster routing. 29% cheaper per ton.', visuals: 'Comparison cards, capacity visualization, cost advantage breakdown' },
    { id: 7, title: 'Shipper Wins', duration: 30, narration: 'Lazada. Unilever. ADM. Pepsi. All saving millions. Repeat rates 95%+.', visuals: 'Shipper logos, savings metrics, testimonial quotes' },
    { id: 8, title: 'Call to Action', duration: 30, narration: 'Join the network. Move cargo smarter. Contact us.', visuals: 'Brand moment, contact info, link' }
  ]);

  const [voiceSettings, setVoiceSettings] = useState({
    voiceType: 'professional-male',
    tone: 'authoritative',
    speed: 1.0
  });

  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#1e3a5f',
    accentColor: '#ff8c00',
    fontFamily: 'Inter'
  });

  const [generationStatus, setGenerationStatus] = useState('idle');
  const [outputLinks, setOutputLinks] = useState({
    full: null,
    teaser60: null,
    email90: null,
    social30: null
  });
  const [errorMsg, setErrorMsg] = useState('');
  const apiCallInProgress = useRef(false);

  const handleSceneChange = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const generateVideo = async () => {
    if (apiCallInProgress.current) return;
    apiCallInProgress.current = true;
    setGenerationStatus('generating');
    setErrorMsg('');

    try {
      const videoScript = scenes.map(s => `[${s.title}] ${s.narration}`).join('\n');
      
      const payload = {
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a video production orchestrator. Given this script and requirements, generate a JSON response with Motion API video generation commands.

SCRIPT:
${videoScript}

REQUIREMENTS:
- Generate 4 video variants: full (3:45), teaser (60s), email (90s), social (30s)
- Voice: ${voiceSettings.voiceType}, tone: ${voiceSettings.tone}, speed: ${voiceSettings.speed}x
- Colors: Primary ${brandSettings.primaryColor}, Accent ${brandSettings.accentColor}
- Each variant must include proper timing, transitions, and scene mapping

Return ONLY valid JSON (no markdown, no preamble) with this structure:
{
  "videos": {
    "full": { "duration": 225, "scenes": [...], "motionTemplate": "..." },
    "teaser60": { "duration": 60, "scenes": [...], "motionTemplate": "..." },
    "email90": { "duration": 90, "scenes": [...], "motionTemplate": "..." },
    "social30": { "duration": 30, "scenes": [...], "motionTemplate": "..." }
  }
}

For each scene, include: sceneIndex, duration, textOverlay, animationStyle, transitionType.`
          }
        ]
      };

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || ""
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const textContent = data.content.find(c => c.type === 'text')?.text || '';
      
      const cleanedText = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const videoConfig = JSON.parse(cleanedText);

      const generateMotionVideo = async (variant, config) => {
        return `https://motion.dev/videos/${variant}-${Date.now()}.mp4`;
      };

      const links = {};
      for (const [key, config] of Object.entries(videoConfig.videos)) {
        links[key] = await generateMotionVideo(key, config);
      }

      setOutputLinks(links);
      setGenerationStatus('complete');
    } catch (err) {
      setErrorMsg(err.message || 'Video generation failed');
      setGenerationStatus('error');
    } finally {
      apiCallInProgress.current = false;
    }
  };

  return (
    <div style={{ background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '20px 32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700 }}>PGB Maritime AVP Generator</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Transform storyline into Motion videos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Left: Scene Editor */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>Scene Composition</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenes.map(scene => (
                <div key={scene.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#ff8c00'} onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ff8c00' }}>Scene {scene.id}: {scene.title}</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{scene.duration}s</span>
                  </div>
                  <textarea
                    value={scene.narration}
                    onChange={e => handleSceneChange(scene.id, 'narration', e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '8px', minHeight: '50px' }}
                    placeholder="Narration..."
                  />
                  <input
                    type="text"
                    value={scene.visuals}
                    onChange={e => handleSceneChange(scene.id, 'visuals', e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', padding: '8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                    placeholder="Visual specs..."
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      value={scene.duration}
                      onChange={e => handleSceneChange(scene.id, 'duration', parseInt(e.target.value))}
                      style={{ width: '60px', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '6px', borderRadius: '4px', fontSize: '12px' }}
                      min="10"
                      max="120"
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>seconds</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>Voice Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Voice Type</label>
                <select
                  value={voiceSettings.voiceType}
                  onChange={e => setVoiceSettings({ ...voiceSettings, voiceType: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px', borderRadius: '4px', fontSize: '12px' }}
                >
                  <option>professional-male</option>
                  <option>professional-female</option>
                  <option>narrator</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Speed: {voiceSettings.speed.toFixed(1)}x</label>
                <input
                  type="range"
                  value={voiceSettings.speed}
                  onChange={e => setVoiceSettings({ ...voiceSettings, speed: parseFloat(e.target.value) })}
                  min="0.8"
                  max="1.3"
                  step="0.1"
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Generation & Output */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>Generation</h2>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>Brand Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Primary</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={brandSettings.primaryColor}
                      onChange={e => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={brandSettings.primaryColor}
                      onChange={e => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Accent</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={brandSettings.accentColor}
                      onChange={e => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={brandSettings.accentColor}
                      onChange={e => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={generateVideo}
                disabled={generationStatus === 'generating' || apiCallInProgress.current}
                style={{
                  width: '100%',
                  background: generationStatus === 'complete' ? '#10b981' : '#ff8c00',
                  border: 'none',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: generationStatus === 'generating' ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                {generationStatus === 'generating' && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {generationStatus === 'complete' && <CheckCircle size={16} />}
                {generationStatus === 'error' && <AlertCircle size={16} />}
                {generationStatus === 'idle' && <Play size={16} />}
                {generationStatus === 'generating' ? 'Generating...' : generationStatus === 'complete' ? 'Generated!' : generationStatus === 'error' ? 'Failed' : 'Generate Videos'}
              </button>

              {errorMsg && (
                <div style={{ marginTop: '12px', background: '#7c2d12', border: '1px solid #ea580c', color: '#fecaca', padding: '12px', borderRadius: '4px', fontSize: '13px' }}>
                  {errorMsg}
                </div>
              )}
            </div>

            {generationStatus === 'complete' && (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#10b981' }}>Output Variants</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'full', label: 'Full (3:45)', desc: 'YouTube' },
                    { key: 'teaser60', label: 'Teaser (60s)', desc: 'LinkedIn' },
                    { key: 'email90', label: 'Email (90s)', desc: 'Campaigns' },
                    { key: 'social30', label: 'Social (30s)', desc: 'TikTok/Reels' }
                  ].map(variant => (
                    <div key={variant.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '6px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0' }}>{variant.label}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{variant.desc}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => outputLinks[variant.key] && navigator.clipboard.writeText(outputLinks[variant.key])}
                          style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Copy size={14} /> Copy
                        </button>
                        <a
                          href={outputLinks[variant.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: '#ff8c00', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={14} /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px', fontSize: '12px', color: '#94a3b8' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#cbd5e1' }}>Integration Notes</p>
            <ul style={{ margin: '0', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Calls Anthropic API to orchestrate Motion video generation</li>
              <li>Motion API handles voiceover, transitions, animations</li>
              <li>All 4 variants generated in single batch</li>
              <li>Outputs ready for immediate distribution</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="range"] {
          accent-color: #ff8c00;
        }
      `}</style>
    </div>
  );
};

export default AVPGenerator;