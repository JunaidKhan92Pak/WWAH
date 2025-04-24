export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  _id?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  _id?: string;
  name: string;
  content: string;
  createdAt: Date;
}
