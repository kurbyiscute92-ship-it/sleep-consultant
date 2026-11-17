export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sleepCycles?: {
    cycles: number;
    hours: number;
    wakeTime: string;
    tag?: string;
  }[];
}

export interface ChatConfig {
  botName: string;
  mode: 'embedded' | 'llm';
  apiKey?: string;
}
