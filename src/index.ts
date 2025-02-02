// with this you load all .env vars
import "dotenv/config";
import {Server} from './MainFile.js';
import * as process from "node:process";

// here the service initalized
const server = new Server()