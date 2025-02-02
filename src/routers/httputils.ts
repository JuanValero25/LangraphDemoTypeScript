import {Request, Response, Router} from 'express';
import {v4 as uuidv4} from 'uuid';

export default class httpUtils {

    static GetConversationIDbyReq (req: Request) : string  {

        let conversationID = req.get('Conversation-ID')

        if (!conversationID) {
            conversationID = uuidv4();
        }

        return conversationID

    }


}