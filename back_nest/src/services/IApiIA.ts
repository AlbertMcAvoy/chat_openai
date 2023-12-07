export interface IApiIA {
  translate(msg: string, language: string | undefined): Promise<string>;

  suggestions(message: string, language: string): Promise<string[]>;

  verify(messagesSelected: any[]): Promise<string>;
}
