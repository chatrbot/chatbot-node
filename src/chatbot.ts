import WebSocket from 'ws'
import { Plugin } from './plugins'
import { Request } from './request'

export interface ReceiveMessage {
    msgType: number
    msgId: number
    createTime: number
    pushContent: string
    msgSource: string
    reportMsgType: number
    toUser: string
    imgBuf?: any
    clientUserName: string
    content: string
    newMsgId: number
    atList: any[]
    clientId: string
    fromUser: string
    msgSeq: number
}

export class ChatBot {
    private readonly host: string
    private readonly token: string

    private ws: WebSocket | undefined
    private request: Request
    private plugins: Plugin[] = []

    constructor(host: string, token: string) {
        this.host = host
        this.token = token
        this.request = new Request(host, token)
    }

    async start() {
        await this.init()
    }

    async init() {
        try {
            console.log('开始连接服务器')
            this.ws = new WebSocket(
                'ws://' + this.host + '/ws?token=' + this.token
            )
            this.ws.on('open', () => {
                console.log('连接websocket成功')
            })
            this.ws.on('message', (data) => {
                console.log('收到新的消息', data)
                const msg: ReceiveMessage = JSON.parse(data as string)
                this.plugins.map((plugin) => {
                    plugin.do(msg)
                })
            })
            this.ws.on('close', async () => {
                if (this.ws) {
                    this.ws.close()
                }
                console.log('连接断开，5s后重连')
                await new Promise((resolve) =>
                    setTimeout(() => resolve(), 5000)
                )
                console.log('开始重连')
                await this.init()
            })
            this.ws.on('error', () => {
                console.log('on error')
            })
        } catch (err) {
            console.log('连接websocket失败:' + err)
            await new Promise((resolve) => setTimeout(() => resolve(), 5000))
            await this.init()
        }
    }

    use(...p: Plugin[]) {
        this.plugins.push(...p)
    }

    sendText(toUser: string, content: string) {
        return this.request.sendTextMessage(toUser, content)
    }

    sendPic(toUser: string, imgUrl: string) {
        return this.request.sendPicMessage(toUser, imgUrl)
    }

    sendEmoji(toUser: string, gifUrl: string) {
        return this.request.sendEmojiMessage(toUser, gifUrl)
    }
}
