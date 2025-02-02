import {z} from "zod";
import {END} from "@langchain/langgraph";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import LLMInitialization from "../LLMInitialization.js"
import {BaseChatModel} from "@langchain/core/language_models/chat_models";
import {InputValues} from "@langchain/core/memory";
import {Runnable} from "@langchain/core/runnables";

interface supervisorAgentRoutingTool {
    name: string,
    description: string,
    schema: z.ZodObject<any>,

}

export default class SupervisorAgent {
    private static singelton: SupervisorAgent;
    public readonly members = ["travelAgent", "packageAgent"] as const
    public options: string[]
    private systemPrompt: string
    private AgentLLM: BaseChatModel
    private routingTool: supervisorAgentRoutingTool
    private supervisorChain: Runnable<InputValues, Exclude<Record<string, any>, Error>>

    private constructor() {
        this.initAgent()
    }

//TODO https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/agent_supervisor.ipynb
    static async StartAgent(): Promise<SupervisorAgent> {
        if (SupervisorAgent.singelton == null) {
            SupervisorAgent.singelton = new SupervisorAgent()
            const resp = await SupervisorAgent.singelton.RunAgent()
        }
        return SupervisorAgent.singelton
    }

    public getAgent(): Runnable<InputValues, Exclude<Record<string, any>, Error>> {
        return this.supervisorChain
    }

    private initAgent(): void {

        this.systemPrompt =
            "You are a supervisor tasked with managing a conversation between the" +
            " following workers: {members}. Given the following user request," +
            " respond with the worker to act next. Each worker will perform a" +
            " task and respond with their results and status. When finished," +
            " respond with FINISH.";
        this.options = [END, ...this.members];
        this.AgentLLM = LLMInitialization.initLLMModel()
        this.routingTool = {
            name: "route",
            description: "Select the next role.",
            schema: z.object({
                next: z.enum([END, ...this.members]),
            }),
        }
    }

    private async RunAgent(): Promise<void> {

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", this.systemPrompt],
            new MessagesPlaceholder("messages"),
            [
                "human",
                "Given the conversation above, who should act next?" +
                " Or should we FINISH? Select one of: {options}",
            ],
        ])

        const formattedPrompt = await prompt.partial({
            options: this.options.join(", "),
            members: this.members.join(", "),
        });
        this.supervisorChain = formattedPrompt.pipe(this.AgentLLM.bindTools([this.routingTool],
            {
                tool_choice: "route",
            },
        )).pipe((x) => (x.tool_calls[0].args))
    }
}

