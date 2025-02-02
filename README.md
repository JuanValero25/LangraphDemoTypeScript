# LangraphDemoTypeScript

Langraph skeleton :) 

esto fue construido de la siguiente manera primero 
tienes que sacar todas las api keys con que se cordina langraph


* https://app.tavily.com/
* https://platform.openai.com/
* https://www.langchain.com/langsmith

depues que se tiene las api keys basandome en la documentacion de langraph

use este cliente inicial para ver  los values 
https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/#making-your-first-agent-using-langgraph

depues cree las config de langraph en `langgraph.json` basandome en esto 
me base en esto como ejemplo
* https://github.com/langchain-ai/chat-langchain/blob/6119e1e79c13fdeefda464fba50e12cdeec6a882/langgraph.json#L5

el archivo `.env` definido en `langgraph.json` **NUNCA SE DEBE SUBIR YA QUE CONTIENE LAS API KEYS**

el archivo `.env` un ejemplo como seria 


```
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY="<FANCY_LANGSMIT_API_KEY>"
LANGSMITH_PROJECT="<UR_FANCY_PROJECT>"
OPENAI_API_KEY="<FANCY_OPENAI_API_KEY>"
TAVILY_API_KEY="<TAVILY_API_KEY>"
```


depues que tienes eso configurado se corre el comando para generar el docker file principal

`npx @langchain/langgraph-cli dockerfile -c langgraph.json Dockerfile`

basandome en el ejemplo de multi bot de langrah
* https://github.com/langchain-ai/langgraphjs/tree/main/examples/multi_agent


benchmark de cual modelo es el mejor para esta integracion
https://artificialanalysis.ai/models