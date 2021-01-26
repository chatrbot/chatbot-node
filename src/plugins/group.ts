//群事件处理示例
import { ChatBot } from '../chatbot'
import { Plugin } from '../plugins'
import {
    GroupBotEvent,
    GroupEvent,
    MsgType,
    PushMessage,
    PushMsgType,
    UserMessage
} from '../define'
import { IsGroupMessage, SplitAtContent, IsGroupMember } from '../utils'

export class GroupPlugin extends Plugin {
    constructor(bot: ChatBot) {
        super('group', bot)
    }

    do(msg: PushMessage) {
        //踢人操作要求机器人必须为群管理员
        if (msg.msgType === PushMsgType.Message) {
            const data = msg.data as UserMessage
            const keyword = '踢'
            /**
             * 必须是文本消息
             * 必须是群内消息
             * 必须匹配到触发关键字
             */
            if (
                data.msgType === MsgType.MsgTypeText &&
                IsGroupMessage(data.fromUser) &&
                SplitAtContent(data.groupContent) === keyword
            ) {
                if (IsGroupMember(data.groupMemberRole)) {
                    this.bot
                        .sendText(
                            data.fromUser,
                            '@' +
                                data.groupMemberNickname +
                                ' 你不是管理员,休想命令我',
                            [data.groupMember]
                        )
                        .catch((err) => {
                            console.log(err)
                        })
                    return
                }
                this.bot
                    .delGroupMembers(data.fromUser, data.atList)
                    .then(() => {
                        this.bot
                            .sendText(
                                data.fromUser,
                                '@' + data.groupMemberNickname + ' 搞定了老板',
                                [data.groupMember]
                            )
                            .catch((err) => console.log(err))
                    })
            }
        }
        if (msg.msgType === PushMsgType.Event) {
            const data = msg.data as GroupBotEvent
            switch (data.event) {
                case GroupEvent.GroupEventInvited:
                    console.log('机器人人被邀请进群:', data.group.groupNickName)
                    this.bot.sendText(
                        data.group.groupUserName,
                        '大家好我是机器人'
                    )
                    break
                case GroupEvent.GroupEventKicked:
                    console.log('机器人被踢出群:', data.group.groupNickName)
                    break
                case GroupEvent.GroupEventNewMember:
                    data.members.map((m) => {
                        this.bot.sendText(
                            data.group.groupUserName,
                            '欢迎新成员:' + m.nickName
                        )
                    })
                    break
                case GroupEvent.GroupEventMemberQuit:
                    data.members.map((m) => {
                        this.bot.sendText(
                            data.group.groupUserName,
                            '有人离开了:' + m.nickName
                        )
                    })
                    break
                default:
                    console.log('未知的群事件')
            }
        }
    }
}
