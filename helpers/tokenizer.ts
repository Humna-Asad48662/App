export const tokenizer = (text: string) => {
    const tiktoken = require("js-tiktoken");
    const encoding = tiktoken.getEncoding("cl100k_base");

    return encoding.encode(text).length;
};