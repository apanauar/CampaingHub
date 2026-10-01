import { Groq } from 'groq-sdk';

export const groqService = async (prompt) => {

    const groq = new Groq();   
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "openai/gpt-oss-120b",
        "temperature": 1,
        "max_completion_tokens": 2048,
        "top_p": 1,
        "stream": true,
        "reasoning_effort": "medium",
        "stop": null
    });

    let result = '';

    for await (const chunk of chatCompletion) {
        result += chunk.choices[0]?.delta?.content || '';
    }

    return result;
};
