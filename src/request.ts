import axios, { AxiosInstance } from 'axios'

export class Request {
    private http: AxiosInstance
    private token: string

    constructor(host: string, token: string, timeout = 10) {
        this.token = token
        this.http = axios.create({
            baseURL: 'http://' + host,
            timeout: timeout * 1000
        })
    }

    private generateUrl(url: string) {
        return url + '?token=' + this.token
    }

    async sendTextMessage(toUser: string, content: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendText'),
                {
                    toUser: toUser,
                    content: content
                }
            )

            if (rsp) {
                console.log('请求成功')
                return rsp
            }
        } catch (err) {
            throw new Error('发送文本消息失败:' + err)
        }
    }

    async sendPicMessage(toUser: string, imgUrl: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendPic'),
                {
                    toUser: toUser,
                    imgUrl: imgUrl
                }
            )

            if (rsp) {
                console.log('请求成功')
                return rsp
            }
        } catch (e) {
            throw new Error('发送图片消息失败')
        }
    }

    async sendEmojiMessage(toUser: string, gifUrl: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendEmoji'),
                {
                    toUser: toUser,
                    gifUrl: gifUrl
                }
            )

            if (rsp) {
                console.log('请求成功')
                return rsp
            }
        } catch (e) {
            throw new Error('发送表情消息失败')
        }
    }
}
