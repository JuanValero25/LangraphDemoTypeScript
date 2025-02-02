import PackageAgent from "./Agents/PackageAgent.js";
import TravelPlacesAgent from "./Agents/TravelPlacesAgent.js";
import {Runnable, RunnableConfig} from "@langchain/core/runnables";
import {Annotation,  END,  START, StateGraph} from "@langchain/langgraph";
import {BaseMessage, HumanMessage} from "@langchain/core/messages";
// @ts-ignore
import {AnnotationRoot} from "@langchain/langgraph/dist/graph";
import SupervisorAgent from "./Agents/SupervisorAgent.js";


export default class Graphs {

    PackageAgent: PackageAgent;
    TravelPlacesAgent: TravelPlacesAgent;

    AgentState: AnnotationRoot<any>

    constructor() {
        this.PackageAgent = new PackageAgent();
        this.TravelPlacesAgent = new TravelPlacesAgent();


        this.AgentState = Annotation.Root({
            messages: Annotation<BaseMessage[]>({
                reducer: (x, y) => x.concat(y),
                default: () => [],
            }),
            // The agent node that last performed work
            next: Annotation<string>({
                reducer: (x, y) => y ?? x ?? END,
                default: () => END,
            }),
        });

    }

    private async initNode(nodeName: string, compileGraphAgent) {
        const travelNode = async (
            state: typeof this.AgentState.State,
            config?: RunnableConfig,
        ) => {
            const result = await compileGraphAgent.invoke(state, config);
            const lastMessage = result.messages[result.messages.length - 1];
            return {
                messages: [
                    new HumanMessage({content: lastMessage.content, name: nodeName}),
                ],
            };
        };
        return travelNode
    }

    public async getAllAgentsCompileGraph() {
        const superAgent = await SupervisorAgent.StartAgent();
        const travelAgent =await this.TravelPlacesAgent.getAgent()
        const PackageAgent =await this.PackageAgent.getAgent()
        const travelNode = await this.initNode("travelAgent", travelAgent)
        const packageNode = await this.initNode("packageAgent",  PackageAgent)
        //   const Supervisor = await this.initNode("supervisor", superAgent.getAgent())
        const workflow = new StateGraph(this.AgentState)
            // 2. Add the nodes; these will do the work
            .addNode("travelAgent", travelNode)
            .addNode("packageAgent", packageNode)
            .addNode("supervisor", superAgent.getAgent());

        let members = superAgent.members
        members.forEach((member) => {
            workflow.addEdge(member, "supervisor");
        });

        workflow.addConditionalEdges(
            "supervisor",
            (x: typeof this.AgentState.State) => x.next,
        );

        workflow.addEdge(START, "supervisor");
      //  const checkpointer = new MemorySaver();
        return  workflow.compile();
    }

}