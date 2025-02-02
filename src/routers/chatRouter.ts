import { Request, Response, Router } from 'express';
import AgentService from '../Services/AgentsService.js'; // Adjust if you use .ts instead of .js
import httpUtils from './httputils.js';

export default class ChatController {
    // Instead of a separate field declaration, it's common to declare and initialize together.
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    /**
     * POST handler for prompt streaming.
     * - Renamed to `postPrompt` (lowerCamelCase) to follow typical method naming conventions in JS/TS.
     * - Defined as an arrow function so it retains the `this` context automatically
     *   (important when passing to `this.router.post`).
     */
    public postPrompt = async (req: Request, res: Response): Promise<void> => {
        try {
            // Destructure `prompt` from the request body (type definition can be improved if you have a specific DTO)
            const { prompt } = req.body;
            const conversationId = httpUtils.GetConversationIDbyReq(req); // Use camelCase if possible: getConversationIdByReq

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.setHeader('Conversation-ID',conversationId)
            // Get the async iterable for AI response streaming
            const aiResponseIterable = await AgentService.GetAIResponseStreaming(prompt, conversationId);

            // Stream each chunk to the client
            for await (const chunk of aiResponseIterable) {
                const jsonChunk = JSON.stringify(chunk) + '\n';
                res.write(jsonChunk);

                // Example logging (remove in production or handle more gracefully)
                if (true /*!chunk?.__end__*/) {
                    console.log(chunk);
                    console.log('----');
                }
            }

            // End the response once the streaming finishes
            res.end();

        } catch (error) {
            console.error('Error while streaming:', error);
            res.status(500).end();
        }
    };

    /**
     * Define routes handled by this controller.
     */
    private initializeRoutes(): void {
        // For clarity, we bind the postPrompt handler to the POST / route
        this.router.post('/', this.postPrompt);
    }
}
