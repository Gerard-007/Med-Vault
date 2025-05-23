// pages/api/ai-doctor.js
export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful and responsible AI doctor. Always remind users that your advice does not replace a medical diagnosis.' },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, something went wrong.";

  res.status(200).json({ reply });
}
