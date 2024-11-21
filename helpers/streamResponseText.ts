import { Message } from "ai";

export default function streamResponseText(messages: Message[]): string {
    const lastIdMessage = messages.at(-1)?.id; 
    
    return messages
        .filter(({ role, id }) => role !== 'user' && id === lastIdMessage)
        .map(({ content }) => content)
        .join('\n');
};
