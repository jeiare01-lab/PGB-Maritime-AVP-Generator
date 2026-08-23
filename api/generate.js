export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('GROQ_API_KEY not found');
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const body = req.body;
    const payload = body.payload || body;

    // Convert Anthropic format to OpenAI/Groq format
    const messages = payload.messages || [];
    const groqPayload = {
      model: payload.model,
      max_tokens: payload.max_tokens,
      messages: messages
    };

    console.log('Calling Groq API with model:', groqPayload.model);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify(groqPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', data);
      return res.status(response.status).json(data);
    }

    // Convert Groq response to Anthropic format
    const anthropicFormat = {
      content: [
        {
          type: 'text',
          text: data.choices[0].message.content
        }
      ]
    };

    return res.status(200).json(anthropicFormat);

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
}
