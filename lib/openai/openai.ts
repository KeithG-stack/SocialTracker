export async function OpenAIStream(config: {
    model: string;
    messages: { role: string; content: string }[];
    temperature: number;
    stream: boolean;
  }) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
  
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: config.model,
        messages: config.messages,
        temperature: config.temperature,
        stream: config.stream,
      }),
    });
  
    const stream = new ReadableStream({
      async start(controller) {