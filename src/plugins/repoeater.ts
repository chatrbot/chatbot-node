//消息复读机 会重复用户发送消息的 包括群内和群外
import { ChatBot } from '../chatbot'
import { Plugin } from '../plugins'
import { MsgType, PushMessage, PushMsgType, UserMessage } from '../define'
import { IsBotBeenAt, IsGroupMessage } from '../utils'

export class RepeaterPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('复读机', bot)
    }

    do(msg: PushMessage, rawData: string) {
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            let content = data.content
            //判断是否是群内消息
            if (IsGroupMessage(data.fromUser)) {
                content = data.groupContent
            }
            switch (data.msgType) {
                case MsgType.MsgTypeText:
                    //判断机器人是否被@了
                    if (IsBotBeenAt(data)) {
                        this.bot.sendText(
                            data.fromUser,
                            '@' + data.whoAtBot + ' 叫我干嘛',
                            [data.groupMember]
                        )
                    } else {
                        this.bot.sendText(data.fromUser, '你好')
                    }
                    break
                //图片消息
                case MsgType.MsgTypeImage:
                    this.bot.downloadPic(content).then((d) => {
                        if (d) {
                            this.bot.sendPic(data.fromUser, d.imgUrl)
                        }
                    })
                    break
                //表情消息
                case MsgType.MsgTypeEmoji:
                    {
                        const info = this.bot.parseEmojiXML(content)
                        if (info) {
                            this.bot.sendEmoji(
                                data.fromUser,
                                info.md5,
                                info.len
                            )
                        }
                        console.log(
                            '收到的表情下载地址是',
                            this.bot.downloadEmoji(content)
                        )
                    }
                    break
                //视频消息
                case MsgType.MsgTypeVideo:
                    this.bot.downloadVideo(content).then((d) => {
                        if (d) {
                            const defaultThumb =
                                'http://5b0988e595225.cdn.sohucs.com/images/20200213/cfcf842cd2284a5f91de0b1ee60a23b0.jpeg'
                            this.bot.sendVideo(
                                data.fromUser,
                                d.videoUrl,
                                defaultThumb
                            )
                        }
                    })
                    break
                //音频消息
                case MsgType.MsgTypeVoice:
                    {
                        //这里之所以用正则去匹配newMsgId是因为NewMsgId超过了ts的number最大值
                        //会造成精度丢失，所以直接用string来处理，服务端兼容了int和string
                        //暂时不会因为ts这边把原始数据改为string了
                        let newMsgId = ''
                        const matches = rawData.match(/newMsgId":(\d+)/)
                        if (matches && matches[1]) {
                            newMsgId = matches[1]
                        }
                        this.bot.downloadVoice(newMsgId, content).then((d) => {
                            console.log(d)
                            if (d) {
                                this.bot.sendVoice(data.fromUser, d.voiceUrl)
                            }
                        })
                    }
                    break
                default:
                    console.log('不能识别的消息类型')
            }
        }
    }
}
