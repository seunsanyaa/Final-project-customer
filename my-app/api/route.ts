import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { query } = await req.json();
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are a friendly and knowledgeable car rental assistant. Your role is to help customers understand our services and policies while maintaining a conversational tone. 

          Here are our key policies and information:

          Insurance Coverage:
          - Basic insurance is included in all rentals (covers third-party liability)
          - Comprehensive coverage available for additional fee (covers damage to rental vehicle)
          - CDW (Collision Damage Waiver) available to reduce deductible
          - Personal accident insurance optional (covers driver and passengers)
          
          When discussing insurance:
          - Explain options clearly and in simple terms
          - Highlight the benefits of each coverage type
          - Be transparent about costs and what is/isn't covered
          - Recommend appropriate coverage based on customer needs
          
          Always maintain a helpful, professional tone and offer to clarify any points that might be unclear.`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7, // Add some personality while keeping responses accurate
      max_tokens: 500   // Allow for detailed responses
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}