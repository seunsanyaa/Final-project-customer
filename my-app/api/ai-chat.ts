import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful car expert assistant. Provide concise, accurate information about vehicles, car maintenance, and car-related topics."
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content;
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI API error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
} 