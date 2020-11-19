import { ChatBot } from './chatbot'
import { ACGPlugin, DogPlugin, PoeTryPlugin } from './plugins'

// 从这里获取token https://github.com/chatrbot/chatbot#faq
const token = ''
const host = '118.25.84.114:18881'

const bot = new ChatBot(host, token)

const dog = new DogPlugin(bot)
const poetry = new PoeTryPlugin(bot)
const acg = new ACGPlugin(bot)

bot.use(dog, poetry, acg)

bot.start()
