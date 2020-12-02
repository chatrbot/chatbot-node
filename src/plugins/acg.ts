//发送关键词acg,会回复一张随机的acg图片
import { ChatBot } from '../chatbot'
import axios from 'axios'
import { Plugin } from '../plugins'
import { PushMessage, PushMsgType, UserMessage } from '../define'
import { IsGroupMessage } from '../utils'

export class ACGPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('acg', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/acg', {
            params: { format: 'json' }
        })
    }

    do(msg: PushMessage) {
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            if (
                !IsGroupMessage(data.fromUser) &&
                data.content.includes('acg')
            ) {
                this.get().then((rsp) => {
                    const imgUrl = rsp.data.data.url
                    this.bot.sendPic(data.fromUser, imgUrl)
                })
            }
        }
    }
}
