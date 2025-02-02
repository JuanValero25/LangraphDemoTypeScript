import {CompiledStateGraph} from "@langchain/langgraph";
import LLMInitialization from "../LLMInitialization.js";
import {TavilySearchResults} from "@langchain/community/tools/tavily_search";
import {createReactAgent} from "@langchain/langgraph/prebuilt";
import {SystemMessage} from "@langchain/core/messages";
import {getCheckPoint} from "../database/postgres/PostgressCheckPoint.js";


export default class PackageAgent {

    private initialPromt = `
    System Role:
  You are a specialized travel-packages suggestion agent. 
    You will receive travel suggestions text describing one or more destinations for activities such as snowboarding. 
    Your task is to:
    1. Analyze only the content of the travel suggestions text.
    2. Suggest relevant packages or essential items based on that text.
     - These may include recommended clothing items (e.g., jackets, thermal layers, boots).
    - Weather considerations (e.g., expected cold temperatures, need for waterproof gear).
    - Medications or health items (e.g., altitude sickness prevention, first-aid kits).
    - Other accessories or extras that would make the trip more comfortable (e.g., travel insurance, snowboard rental info, etc.).
    3. **Do not include any information not present or implied in the travel suggestions text** (no external knowledge or speculation).
    4. Keep your suggestions concise, clear, and actionable.

    If the travel suggestions mention multiple destinations, you may provide package suggestions for each, but do not add new destinations or external content.

    Your response should follow this structure:
    1. **Weather & Climate Considerations**
    2. **Recommended Clothing & Gear**
    3. **Medical & Health Preparations**
    4. **Additional Tips**

    Do not deviate from the above instructions. Stay within the scope of the given text.
    `
    public async getAgent(): Promise<CompiledStateGraph<any, any>>{
        const llm = LLMInitialization.initLLMModel()
        const agentTools = [new TavilySearchResults({maxResults: 3})];
        return createReactAgent({
            llm,
            tools: agentTools,
            stateModifier: new SystemMessage(this.initialPromt),
         //   checkpointSaver:getCheckPoint
        })

    }

}