var { OpenAI } = require('openai');

// standardize error handling for bot interactions
class OpenAIError extends Error {
    constructor(originalError) {
        super(originalError.message, { cause: originalError });
        this.name = 'OpenAIError';
        this.stack = originalError.stack;
    }
}

function getAssistantID() {
    return process.env.OPENAI_ASSISTANT_ID;
}

function createClient() {
    try {
        return new OpenAI({
            apiKey: process.env.OPENAI_TOKEN,
        });
    } catch(e) {
        throw new OpenAIError(e);
    }
}

async function createThread(openAIClient) {
    try {
        const thread = await openAIClient.beta.threads.create();
        return thread.id;
    } catch(e) {
        throw new OpenAIError(e);
    }
}

async function queryBot(openAIClient, threadID, assistantID, userMessage) {
    try {
        // Add a message to the thread
        await openAIClient.beta.threads.messages.create(threadID, {
            role: 'user',
            content: userMessage,
        });

        // Create a completion and wait for the response
        const run = await openAIClient.beta.threads.runs.createAndPoll(
            threadID,
            {
                assistant_id: assistantID,
            }
        )

        // If the run is complete, print the response
        if (run.status === 'completed') {
            const messages = await openAIClient.beta.threads.messages.list(threadID);

            // Filter to messages with the same run id and the assistant role
            const lastMessage = messages.data.filter(msg => {
                return msg.run_id === run.id && msg.role === 'assistant'
            }).pop();

            if (!lastMessage) {
                // should not happen
                throw new Error('Assistant did not respond');
            }

            return {
                run: run,
                message: lastMessage,
                textContent: lastMessage.content[0].text.value,
            }
        } else {
            // if the run is not complete, throw an error
            throw new Error(`Run did not complete successfully. Status: ${run.status}`);
        }
    } catch(e) {
        throw new OpenAIError(e);
    }
}

module.exports = {
    getAssistantID,
    createClient,
    createThread,
    queryBot,
    OpenAIError,
};