//回复关键词 舔狗，会回复一个舔狗段子
import { ChatBot } from '../chatbot'
import axios from 'axios'
import { Plugin } from '../plugins'
import { PushMessage, PushMsgType, UserMessage } from '../define'
import { IsGroupMessage } from '../utils'

export class DogPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('dog', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/dog', {
            params: { format: 'json' }
        })
    }

    do(msg: PushMessage) {
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            if (
                !IsGroupMessage(data.fromUser) &&
                data.content.includes('舔狗')
            ) {
                this.get().then((rsp) => {
                    const reply = rsp.data.data.content as string
                    console.log('请求接口', reply)
                    this.bot.sendText(data.fromUser, reply)
                })
            }
        }
    }
}
