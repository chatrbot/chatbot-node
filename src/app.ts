import { ChatBot } from './chatbot'
import { ACGPlugin, DogPlugin, PoeTryPlugin } from './plugins'

// 从这里获取token https://github.com/chatrbot/chatbot#faq
const token = ''
const host = '121.199.64.183:8811'

const bot = new ChatBot(host, token)

const dog = new DogPlugin(bot)
const poetry = new PoeTryPlugin(bot)
const acg = new ACGPlugin(bot)

bot.use(dog, poetry, acg)

bot.start()
