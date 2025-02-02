FROM langchain/langgraphjs-api:20
ADD . /deps/LangraphDemoTypeScript
ENV LANGSERVE_GRAPHS='{"SupervisorAgent":"./src/Agents/SupervisorAgent.ts:graph"}'
WORKDIR /deps/LangraphDemoTypeScript
RUN npm ci
RUN (test ! -f /api/langgraph_api/js/build.mts && echo "Prebuild script not found, skipping") || tsx /api/langgraph_api/js/build.mts