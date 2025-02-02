import {BaseChatModel} from "@langchain/core/language_models/chat_models";
import {ChatOpenAI} from "@langchain/openai";


export default class LLMInitialization {

    private constructor() {
    }

    // here we can add more models/llms we just add those to initial structure
    public static initLLMModel(model?: string): BaseChatModel {
        switch (model) {
            case "gpt-o1-mini": {
            }
                return this.buildOPenAIClient("gpt-o1-mini")
            default:

                return this.buildOPenAIClient("gpt-4o-mini")
        }
    }

    private static buildOPenAIClient(model: string): ChatOpenAI {
        return new ChatOpenAI({temperature: 0, model: model})
    }


}