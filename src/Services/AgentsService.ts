import Graphs from "../Graphs.js";
import {HumanMessage} from "@langchain/core/messages";
import {IterableReadableStream} from "@langchain/core/utils/stream";
import {PregelOutputType} from "@langchain/langgraph/pregel";


export default class AgentService {

    public static async GetAIResponseStreaming(prompt: string,conversationID:string):Promise<IterableReadableStream<PregelOutputType>> {

        if (!conversationID?.trim()) {
            // Example of generating a random 8-digit integer:
            const randomInt = Math.floor(Math.random() * 100000000);
            conversationID = randomInt.toString();
        }
        const graph = new Graphs();
        const compileGraph = await graph.getAllAgentsCompileGraph()
        return compileGraph.stream(
            {
                messages: [
                    new HumanMessage({
                        // content: "give me 3 best place to practice snowboarding",
                        content: prompt,
                    }),
                ],

            },
            {recursionLimit: 100,configurable:{ thread_id: conversationID }},
        )

    }
}
