import { IApiIA } from './IApiIA';
import fetch from 'node-fetch';

export class KoboldCppApi implements IApiIA {
  url = 'http://localhost:5001/api/v1/generate';

  request = {
    n: 1,
    max_context_length: 1600,
    max_length: 120,
    rep_pen: 1.1,
    temperature: 0.5,
    top_p: 0.92,
    top_k: 100,
    top_a: 0,
    typical: 1,
    tfs: 1,
    rep_pen_range: 320,
    rep_pen_slope: 0.7,
    sampler_order: [6, 0, 1, 3, 4, 2, 5],
    memory: '',
    min_p: 0,
    prompt: '',
    quiet: true,
    use_default_badwordsids: false,
  };

  async translate(msg: string, language: string | undefined): Promise<string> {
    let result = '';
    this.request.prompt = `Traduis en ${
      language != '' ? language : 'Français'
    } ce message : "${msg}"`;

    await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(this.request),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        result = response.results[0].text;
      });

    return result;
  }

  async suggestions(message: string, language: string): Promise<string[]> {
    let result = '';
    this.request.prompt = `Proposes moi 3 réponses pour ce message "${message}", en ${language}, séparés par un |`;

    await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(this.request),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        result = response.results[0].text;
      });

    return result.split(' | ');
  }

  verify(messagesSelected: string[]): Promise<string> {
    return Promise.resolve("");
  }
}
