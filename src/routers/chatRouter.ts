import {Request, Response, Router} from 'express';
import AgentService from "../Services/AgentsService.js";

export default class ChatController {

    public router: Router      // Express router instance

    constructor() {
        this.router = Router();      // Express router instance
        this.initializeRoutes();
    }

    public async PostPrompt(req: Request, res: Response): Promise<void> {
        const {prompt} = req.body

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        let conversationID = req.get('Conversation-ID')

        const response = await AgentService.GetAIResponseStreaming(prompt, conversationID)
        try {
            // Iterate over your async iterable and write each chunk
            for await (const chunk of response) {
                // Convert your chunk to JSON and add a newline
                const jsonChunk = JSON.stringify(chunk) + "\n";
                res.write(jsonChunk);

                if (!chunk?.__end__) {
                    console.log(chunk);
                    console.log("----");
                }
            }
        } catch (err) {
            console.error('Error while streaming:', err);
            res.status(500).end();
            return;
        }
        res.end();

    }

    /**
     * Define the routes handled by this controller.
     */
    private initializeRoutes(): void {
        // POST /users
        this.router.post("/", this.PostPrompt);
    }
}


