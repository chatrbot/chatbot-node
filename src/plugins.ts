import { ChatBot, ReceiveMessage } from './chatbot'
import axios from 'axios'

export abstract class Plugin {
    protected bot: ChatBot
    protected name: string

    protected constructor(name: string, bot: ChatBot) {
        this.name = name
        this.bot = bot
    }

    abstract do(msg: ReceiveMessage): void
}

//acg图片
export class ACGPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('acg', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/acg', {
            params: { format: 'json' }
        })
    }

    do(msg: ReceiveMessage) {
        if (msg.content.includes('acg')) {
            this.get().then((rsp) => {
                const imgUrl = rsp.data.data.url
                this.bot.sendPic(msg.fromUser, imgUrl)
            })
        }
    }
}

//诗歌
export class PoeTryPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('PoeTry', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/shici', {
            params: { type: 'all' }
        })
    }

    do(msg: ReceiveMessage) {
        if (msg.content.includes('诗歌')) {
            this.get().then((rsp) => {
                const { content, author, origin } = rsp.data.data
                this.bot.sendText(
                    msg.fromUser,
                    `${content} \n` + `--《${origin}》${author}`
                )
            })
        }
    }
}

//舔狗插件
export class DogPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('dog', bot)
    }

    async get() {
        return await axios.get('https://v1.alapi.cn/api/dog', {
            params: { format: 'json' }
        })
    }

    do(msg: ReceiveMessage) {
        if (msg.content.includes('舔狗')) {
            this.get().then((rsp) => {
                const reply = rsp.data.data.content as string
                console.log('请求接口', reply)
                this.bot.sendText(msg.fromUser, reply)
            })
        }
    }
}
