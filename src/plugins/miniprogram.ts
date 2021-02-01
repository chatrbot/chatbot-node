import { ChatBot } from '../chatbot'
import { Plugin } from '../plugins'
import { MsgType, PushMessage, PushMsgType, UserMessage } from '../define'

export class MiniProgramPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('小程序发送示例', bot)
    }

    /**
     * 私聊机器人发送"小程序"三个字,会返回一个肯德基的小程序二维码
     * 其中涉及到的几个参数字段需要从接收到的小程序xml中解析
     * 所以如果你想让机器人发送某个小程序需要先获得小程序的xml(手动发送一次给机器人)
     */
    do(msg: PushMessage) {
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            if (
                data.msgType === MsgType.MsgTypeText &&
                data.content === '小程序'
            ) {
                this.bot
                    .sendMiniProgram(
                        data.fromUser,
                        'http://mmbiz.qpic.cn/mmbiz_png/SE9ICmPPKWiaibdENZqwnjeIWiblOvnX4QFZMr2PJ704lOyphLBicqjwYbt9Rsiak2mYM8UBtTX91XgMg3lqs98DMMA/640?wx_fmt=png&wxfrom=200',
                        '肯德基自助点餐',
                        '肯德基+',
                        'https://mp.weixin.qq.com/mp/waerrpage?appid=wx23dde3ba32269caa&type=upgrade&upgradetype=3#wechat_redirect',
                        'gh_50338e5b8c9d',
                        '肯德基+',
                        'gh_50338e5b8c9d',
                        'wx23dde3ba32269caa',
                        2,
                        92,
                        'http://mmbiz.qpic.cn/mmbiz_png/SE9ICmPPKWiaibdENZqwnjeIWiblOvnX4QFZMr2PJ704lOyphLBicqjwYbt9Rsiak2mYM8UBtTX91XgMg3lqs98DMMA/640?wx_fmt=png&wxfrom=200',
                        'pages/home/home.html'
                    )
                    .catch((err) => {
                        console.log('消息发送失败', err)
                    })
            }
        }
    }
}
