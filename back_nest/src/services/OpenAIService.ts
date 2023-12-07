import OpenAI from 'openai';
import 'dotenv/config';
import {IApiIA} from './IApiIA';

export class OpenAIService implements IApiIA {
  openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  async translate(message: string, language: string): Promise<string> {
    const prompt = `Traduis en ${
      language != '' ? language : 'Français'
    } : ${message}`;
    const completion = await this.openai.chat.completions.create({
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Tu es un traducteur',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }

  async suggestions(message: string, language: string): Promise<string[]> {
    const prompt = `Proposes moi 3 manières de répondre à ce message en ${
      language != '' ? language : 'Français'
    } : "${message}". Sépares tes réponses par un |`;

    const completion = await this.openai.chat.completions.create({
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Tu es un robot qui donne réponses à des messages. Tu sépares tes réponses par des |',
        },
        {
          role: 'assistant',
          content: 'Salut ! ça va et toi ? | Bonjour, je vais bien et vous ? | Salut, ça va.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content.split(' | ');
  }

  async verify(messagesSelected: any[]): Promise<string> {

    const messages: any[] = [
      {
        role: 'system',
        content: 'Tu es un robot qui vérifie des informations. Tu réponds uniquement par true ou false.',
      },
      {
        role: 'assistant',
        content: 'Je vais t\'envoyer les données sous cette forme : [{"question": 1, "question": \'Il y a eu un attentat le 09/11/2001\'},].'
      },
      {
        role: 'assistant',
        content: 'Tu réponds avec un tableau d\'objet sous cette forme: [{"question": 1, "response": \'true\'},]. Si tu ne peux pas répondre par vrai ou faux, tu réponds faux.'
      },
      {
        role: 'user',
        content: '[',
      },
    ];

    messagesSelected.forEach((ms) => {
      messages[3].content += `{"question": ${ms.id}, "question": ${ms.content}},`;
    });

    messages[3].content += ']';

    const completion = await this.openai.chat.completions.create({
      temperature: 0,
      messages,
      model: 'gpt-3.5-turbo',
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}
