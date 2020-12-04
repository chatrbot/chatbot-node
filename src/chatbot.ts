import WebSocket from 'ws'
import { Plugin } from './plugins'
import { Request } from './request'
import { PushMessage } from './define'

export class ChatBot {
    private readonly host: string
    private readonly token: string

    private ws: WebSocket | undefined
    private request: Request
    private plugins: Plugin[] = []
    private heartBeatTimer: NodeJS.Timer | undefined

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
                if (this.ws?.readyState === 1) {
                    this.heartBeatTimer = setInterval(() => {
                        this.ws?.send('ping')
                    }, 10000)
                } else {
                    console.log('ws is not ready')
                }
            })
            this.ws.on('message', (data) => {
                if (data === 'pong') {
                    return
                }
                console.log('收到新的消息', data)
                const msg: PushMessage = JSON.parse(data as string)
                this.plugins.map((plugin) => {
                    plugin.do(msg, data as string)
                })
            })
            this.ws.on('close', async (code: number) => {
                if (this.ws) {
                    this.ws.close()
                }
                if (this.heartBeatTimer) {
                    clearInterval(this.heartBeatTimer)
                }
                console.log('连接断开，5s后重连' + ' closeEvent code:' + code)
                await new Promise((resolve) =>
                    setTimeout(() => resolve(null), 5000)
                )
                console.log('开始重连')
                await this.init()
            })
            this.ws.on('error', (err: Error) => {
                console.log('on error:', err)
            })
        } catch (err) {
            console.log('连接websocket失败:' + err)
            await new Promise((resolve) =>
                setTimeout(() => resolve(null), 5000)
            )
            await this.init()
        }
    }

    use(...p: Plugin[]) {
        this.plugins.push(...p)
    }

    sendText(toUser: string, content: string, atList: string[] = []) {
        return this.request.sendTextMessage(toUser, content, atList)
    }

    sendPic(toUser: string, imgUrl: string) {
        return this.request.sendPicMessage(toUser, imgUrl)
    }

    sendEmoji(toUser: string, md5: string, emojiLen: string) {
        return this.request.sendEmojiMessage(toUser, md5, emojiLen)
    }

    sendVideo(toUser: string, videoUrl: string, thumbUrl: string) {
        return this.request.sendVideoMessage(toUser, videoUrl, thumbUrl)
    }

    sendVoice(toUser: string, silkUrl: string) {
        return this.request.sendVoiceMessage(toUser, silkUrl)
    }

    downloadPic(xml: string) {
        return this.request.downloadPic(xml)
    }

    downloadVideo(xml: string) {
        return this.request.downloadVideo(xml)
    }

    downloadVoice(newMsgId: string, xml: string) {
        return this.request.downloadVoice(newMsgId, xml)
    }

    downloadEmoji(xml: string) {
        return this.request.downloadEmoji(xml)
    }

    parseEmojiXML(xml: string) {
        return this.request.parseEmojiXML(xml)
    }
}
