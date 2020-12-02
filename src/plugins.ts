import { ChatBot } from './chatbot'
import { PushMessage } from './define'

//插件抽象类,只需要实现do方法即可增加自定义插件
export abstract class Plugin {
    protected bot: ChatBot
    protected name: string

    protected constructor(name: string, bot: ChatBot) {
        this.name = name
        this.bot = bot
    }

    //rawData 是转发过来的原始数据，在特殊时候可能会用到，例如bigint精度丢失等
    //具体可以参考repeater插件中的情况
    abstract do(msg: PushMessage, rawData?: string): void
}
