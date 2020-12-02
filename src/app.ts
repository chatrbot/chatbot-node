import { ChatBot } from './chatbot'
import { GroupPlugin, RepeaterPlugin } from './plugins/'

// 从这里获取token https://github.com/chatrbot/chatbot#faq
const token = ''
const host = '118.25.84.114:18881'

//机器人主体，包含了一系列的主动接口调用方法
const bot = new ChatBot(host, token)
//插件
const group = new GroupPlugin(bot)
const repeater = new RepeaterPlugin(bot)

bot.use(repeater, group)

bot.start()
