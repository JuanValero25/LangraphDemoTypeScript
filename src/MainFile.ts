//import {createServer, Server as httpServer} from 'http';
import express from 'express';
import cors from 'cors';
import ChatController from './routers/chatRouter.js';
import * as path from "node:path";
import {getCheckPoint} from "./database/postgres/PostgressCheckPoint.js";

export class Server {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    // private server: httpServer;
    private port: number;
    private chatController: ChatController;

    constructor() {
        this.createApp();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private createApp(): void {
        this.app = express();
        this.port = Number(process.env.PORT) || Server.PORT;
        // express runs the middlewares in order so to not break the app the middleware should be first and then the routers
        this.initializeMiddlewares();
        this.initializeControllers();
        this.app.listen(this.port,async ()=>{
            console.log("init service")
            const resp= await getCheckPoint.setup()
            console.log("finish databse init")
        })
    }

    private initializeMiddlewares(): void {
      //  this.app.use(cors());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json()); // for parsing application/json
    }

    private initializeControllers(): void {
        // Mount the controller's router
        this.chatController = new ChatController();
        this.app.use('/chat', this.chatController.router);
    }

}

