const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6091305871:AAHk0HxkFpoS1KY1TSUxJunKltinlPUtTTM'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Зараз я згенерую число від 0 до 9, спробуйте відгадати його!`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Відгадуйте`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description: 'Запуск та привітання бота'},
        {command:'/help', description: 'Допомога'},
        {command:'/game', description: 'Гра "Відгадай число'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return await bot.sendMessage(chatId, `Доброго дня, вас вітає бот @new_anime_series_alert_tg_bot`);
        }
        if (text === '/help') {
            return await bot.sendMessage(chatId, `Якщо вам знадобилась допомога, то зверніться до мого творця @Nurikan1`)
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Такої команди не існує, спробуйте щось інше!`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Вітаю, ви відгадали число ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Нажаль ви не вгадали, я загадав число ${chats[chatId]}`, againOptions)
        }
    })
}

start()
