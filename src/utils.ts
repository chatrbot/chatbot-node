import { UserMessage, GroupRole } from './define'

// 用来判断是否是群聊消息
export const IsGroupMessage = (fromUser: string) => {
    return fromUser.endsWith('@chatroom')
}

// 在群内机器人是不是被@了
export const IsBotBeenAt = (msg: UserMessage) => {
    if (!IsGroupMessage(msg.fromUser)) {
        return false
    }
    let at = false
    msg.atList.map((u) => {
        if (u === msg.clientUserName) {
            at = true
            return
        }
    })
    return at
}

// 如果机器人被@并带有文本信息,该方法可以用来分离文本
export const SplitAtContent = (msgContent: string) => {
    let content = msgContent

    let contents = msgContent.split('\u2005', 2)
    if (contents.length != 2) {
        contents = msgContent.split(' ', 2)
    }
    if (contents.length === 2) {
        content = contents[1].trim()
    }
    return content
}

export const IsGroupMember = (role: number) => {
    return role == GroupRole.Member
}
