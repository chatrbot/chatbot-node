//推送的消息类型
export const enum PushMsgType {
    //转发的消息
    Message = 10000,
    //事件消息
    Event = 10001
}

//收到的推送消息统一格式
//根据msgType字段来区别消息类型
//data为具体的消息内容,目前只有UserMessage和GroupBotEvent两种
export interface PushMessage {
    msgType: PushMsgType
    data: UserMessage | GroupBotEvent
}

//收到的转发消息具体分类
export const enum MsgType {
    MsgTypeText = 1, //文本消息
    MsgTypeImage = 3, //图片消息
    MsgTypeVoice = 34, //语音消息
    MsgTypeVideo = 43, //视频消息
    MsgTypeEmoji = 47 //表情动图消息
}

//UserMessage 机器人转发的消息
export interface UserMessage {
    //消息id,只有在下载音频文件时候会用到
    newMsgId: string
    //谁发的消息的,如果你是私聊机器人则是你的微信id
    //如果是群新消息,则是群id号
    fromUser: string
    //这条消息@的人
    atList: string[]
    createTime: number
    //推送内容，群消息就会变成 xxx在群内在发送了一张图片 这种
    pushContent: string
    //机器人的微信id
    clientUserName: string
    //消息接收人，统一是机器人id
    toUser: string
    //暂时无用
    imgBuf: string
    //具体的消息类型，比如文本、视频、图片等
    msgType: number
    //消息内容，如果是文本则为实际字符串，其他格式为xml
    content: string
    //暂时无用
    msgSource: string
    //以下三个字段是群内消息才会用到
    //whoAtBot 谁@了机器人,显示的是用户昵称
    //groupMember 群内说话人的微信id
    //groupContent 群内消息主体
    whoAtBot: string
    groupMember: string
    groupContent: string
}

//目前支持的群内事件
export const enum GroupEvent {
    //机器人被邀请入群
    GroupEventInvited = 100000,
    //机器人被踢出群
    GroupEventKicked,
    //群内有新用户加群
    GroupEventNewMember,
    //群内有用户离开
    GroupEventMemberQuit
}

//群内事件消息结构
export interface GroupBotEvent {
    event: GroupEvent
    //具体事件的中文描述
    EventText: string
    //发生事件的群基本信息
    group: Group
    //发生事件的相关群员信息
    members: Member[]
}

interface Member {
    userName: string
    nickName: string
    headImg: string
}

interface Group {
    groupUserName: string
    groupNickName: string
    groupHeadImg: string
}
