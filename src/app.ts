import { ChatBot } from './chatbot'
import { GroupPlugin } from './plugins/'
import * as Commander from 'commander'
import { MiniProgramPlugin } from './plugins/miniprogram'

// 从这里获取token https://github.com/chatrbot/chatbot#faq
// 启动命令 npx ts-node app.ts -token your_token
const program = new Commander.Command()
program
    .description('A Customizable ChatBot')
    .option('-t,--token <token>', '激活后获得的机器人token', '')
    .option('-h,--host <host>', '服务端地址', '118.25.84.114:18881')
program.parse(process.argv)

if (!program.token || !program.host) {
    program.help()
    process.exit()
}
// 机器人主体，包含了一系列的主动接口调用方法
const bot = new ChatBot(program.host, program.token)
// 插件
const group = new GroupPlugin(bot)
const miniProgram = new MiniProgramPlugin(bot)

bot.use(group, miniProgram)

bot.start()
