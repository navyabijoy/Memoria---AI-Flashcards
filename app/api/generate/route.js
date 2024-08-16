import { NextResponse } from "next/server";
import axios from 'axios'; // or any HTTP client library you're using

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards that facilitate learning and retention of information. Each flashcard should:

1. Be Clear and Concise: The question or prompt on the front of the flashcard should be straightforward, while the answer or explanation on the back should be clear and to the point.
2. Focus on Key Concepts: Identify and emphasize the most important information, concepts, definitions, or questions relevant to the subject.
3. Be Engaging: Whenever possible, use examples, analogies, or mnemonic devices to make the content more memorable.
4. Incorporate Active Recall: Design questions that challenge the learner to actively recall information rather than just recognize it.
5. Promote Understanding: If the topic requires, include brief explanations or context that aid in deeper understanding, rather than just rote memorization.
6. Be Organized: Group related flashcards together to help the learner build connections between concepts and ensure a logical flow of information.
7. Encourage Repetition: Consider the spacing effect in learning; design the flashcards in a way that encourages spaced repetition to enhance long-term retention.
8. Adapt to User Needs: Tailor the difficulty level and content of the flashcards to the specific knowledge level and learning goals of the user.
9. Keep It Visual: Where applicable, incorporate visual aids like diagrams, charts, or images to enhance understanding and retention.
10. Only generate 10 flashcards.
Return in the following JSON format:
{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}`;

export async function POST(req) {
    const data = await req.text();

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            model: 'qwen/qwen-2-7b-instruct:free', // Specify the Qwen model
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // Use environment variable for the API key
                'Content-Type': 'application/json',
            },
        });

        const flashcards = response.data.choices[0].message.content; // Access the correct path to retrieve flashcards
        return NextResponse.json({ flashcards }); // Return the flashcards in the required format
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.error(); // Handle the error accordingly
    }
}
