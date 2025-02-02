
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
});

const checkpointer = new PostgresSaver(pool)
export const getCheckPoint = checkpointer;


