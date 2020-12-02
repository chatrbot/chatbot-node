import axios, { AxiosInstance } from 'axios'
import { Parser } from 'xml2js'

//消息结构体定义
type BaseResponse<T = unknown> = {
    code: number
    msg: string
    data: T
    traceId: number
}

type DownloadPicResponse = {
    content: string
    imgUrl: string
}

type DownloadVideoResponse = {
    content: string
    videoUrl: string
}

type DownloadVoiceResponse = {
    content: string
    voiceUrl: string
    voiceLength: number
}

export class Request {
    private http: AxiosInstance
    private readonly token: string

    constructor(host: string, token: string, timeout = 10) {
        this.token = token
        this.http = axios.create({
            baseURL: 'http://' + host,
            timeout: timeout * 1000
        })
    }

    //generateUrl 拼接请求地址，附带上token
    private generateUrl(url: string) {
        return url + '?token=' + this.token
    }

    //sendTextMessage 发送文本消息
    async sendTextMessage(toUser: string, content: string, atList: string[]) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendText'),
                {
                    toUser: toUser,
                    content: content,
                    atList: atList
                }
            )
            if (rsp) {
                return rsp
            }
        } catch (err) {
            throw new Error('发送文本消息失败:' + err)
        }
    }

    //sendPicMessage 发送图片消息
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
                return rsp
            }
        } catch (e) {
            throw new Error('发送图片消息失败')
        }
    }

    //sendEmojiMessage 转发表情消息
    //emojiMd5 从收到的xml中可以解析md5字段
    //emojiLen 从收到的xml可以解析len字段
    async sendEmojiMessage(toUser: string, emojiMd5: string, emojiLen: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendEmoji'),
                {
                    toUser: toUser,
                    emojiMd5: emojiMd5,
                    emojiLen: emojiLen
                }
            )
            if (rsp) {
                return rsp
            }
        } catch (e) {
            throw new Error('发送表情消息失败')
        }
    }

    //sendVideoMessage 发送视频消息
    async sendVideoMessage(toUser: string, videoUrl: string, thumbUrl: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendVideo'),
                {
                    toUser: toUser,
                    videoUrl: videoUrl,
                    videoThumbUrl: thumbUrl
                }
            )
            if (rsp) {
                return rsp
            }
        } catch (err) {
            throw new Error('发送视频消息失败:' + err)
        }
    }

    //sendVoiceMessage 发送音频消息
    async sendVoiceMessage(toUser: string, silkUrl: string) {
        try {
            const rsp = await this.http.post(
                this.generateUrl('/api/v1/chat/sendVoice'),
                {
                    toUser: toUser,
                    silkUrl: silkUrl
                }
            )
            if (rsp) {
                return rsp
            }
        } catch (err) {
            throw new Error('发送音频消息失败:' + err)
        }
    }

    //downloadVideo 下载视频消息
    async downloadVideo(xml: string) {
        try {
            const rsp = await this.http.post<
                BaseResponse<DownloadVideoResponse>
            >(this.generateUrl('/api/v1/chat/downloadVideo'), {
                xml: xml
            })
            if (rsp) {
                return rsp.data.data
            }
        } catch (err) {
            throw new Error('下载视频消息失败:' + err)
        }
    }

    //downloadVoice 下载音频消息
    async downloadVoice(newMsgId: string, xml: string) {
        try {
            const rsp = await this.http.post<
                BaseResponse<DownloadVoiceResponse>
            >(this.generateUrl('/api/v1/chat/downloadVoice'), {
                newMsgId: newMsgId,
                xml: xml
            })
            if (rsp) {
                return rsp.data.data
            }
        } catch (e) {
            throw new Error('下载音频消息失败')
        }
    }

    //downloadPic 下载图片消息
    async downloadPic(xml: string) {
        try {
            const rsp = await this.http.post<BaseResponse<DownloadPicResponse>>(
                this.generateUrl('/api/v1/chat/downloadImage'),
                {
                    xml: xml
                }
            )
            if (rsp) {
                return rsp.data.data
            }
        } catch (e) {
            throw new Error('下载图片消息失败')
        }
    }

    //downloadEmoji 下载emoji/动态表情
    downloadEmoji(xml: string) {
        const parser = new Parser({ strict: false })
        let cdnUrl = ''
        parser.parseString(xml, (err: Error, result: any) => {
            if (err !== null) {
                console.error('download emoji err', err)
                return
            }
            cdnUrl = result.MSG.EMOJI[0].$.CDNURL
        })
        return cdnUrl
    }

    //parseEmoji 解析表情消息用来转发
    parseEmojiXML(xml: string) {
        const parser = new Parser({ strict: false })
        let info: any = null
        parser.parseString(xml, (err: Error, result: any) => {
            if (err !== null) {
                console.error('err', err)
                return
            }
            info = {
                md5: result.MSG.EMOJI[0].$.MD5,
                len: result.MSG.EMOJI[0].$.LEN
            }
        })
        return info
    }
}
