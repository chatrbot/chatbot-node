//回复关键字 诗词，会随机返回一句诗词
import { ChatBot } from '../chatbot'
import axios from 'axios'
import { Plugin } from '../plugins'
import { PushMessage, PushMsgType, UserMessage } from '../define'
import { IsGroupMessage } from '../utils'

export class PoetryPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('PoeTry', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/shici', {
            params: { type: 'all' }
        })
    }

    do(msg: PushMessage) {
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            if (
                !IsGroupMessage(data.fromUser) &&
                data.content.includes('诗词')
            ) {
                this.get().then((rsp) => {
                    const { content, author, origin } = rsp.data.data
                    this.bot.sendText(
                        data.fromUser,
                        `${content} \n` + `--《${origin}》${author}`
                    )
                })
            }
        }
    }
}
