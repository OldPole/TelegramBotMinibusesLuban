const { Bot, GrammyError, HttpError, InlineKeyboard } = require('grammy');
const { startChecking } = require('./monitoring.js');
const { getCurrentDates } = require('./dateManager.js');

const bot = new Bot('7979289100:AAFasw8-ijCBoveKHIXY9IeUx1v-jckgMVE');
let route = 'Минск-Любань';
let date = getCurrentDates()[0];
const dates = getCurrentDates();

bot.api.setMyCommands([
    {
        command : 'start', 
        description : 'Запуск бота',
    },
    {
        command : 'route_date', 
        description : 'Выбор маршрута и даты',
    },
    {
        command : 'show',
        description : 'Текущий маршрут и дата',
    },
    {
        command : 'help',
        description : 'Помощь'
    },
    {
        command : 'donate',
        description : 'Донат',
    },
])

bot.command('start', async (ctx) => {
    isChecking = true;
    ctx.reply(`Как только освободится место мы вас уведомим, ${ctx.from.first_name}`);
    const availableSeats = await startChecking(route, date);
    if(availableSeats.length) {
        const message = availableSeats.map(item => `Есть места на ${item.time}, количество мест ${item.seats}.`).join('\n');
        ctx.reply(message);
    } else {
        ctx.reply(`На ${date} нет ресов ${route}`);
    }
})

bot.command('route_date', async (ctx) => {
    const inlineKeyboardRoute = new InlineKeyboard()
    .text('Минск-Любань', 'set_route_Минск-Любань').row()
    .text('Любань-Минск', 'set_route_Любань-Минск');

    await ctx.reply('Выберите маршрут', {
        reply_markup: inlineKeyboardRoute
    })
})

bot.callbackQuery('set_route_Минск-Любань', async (ctx) => {
    route = 'Минск-Любань';
    await ctx.answerCallbackQuery();
    await ctx.reply(`Маршрут установлен: ${route}`);

    const inlineKeyboardDate = new InlineKeyboard()
    .text(dates[0], 'set_first_date').row()
    .text(dates[1], 'set_second_date').row()
    .text(dates[2], 'set_third_date');
    await ctx.reply('Выберите дату:', {
        reply_markup: inlineKeyboardDate
    })
})

bot.callbackQuery('set_route_Любань-Минск', async (ctx) => {
    route = 'Любань-Минск';
    await ctx.answerCallbackQuery();
    await ctx.reply(`Маршрут установлен: ${route}`);

    const inlineKeyboardDate = new InlineKeyboard()
    .text(dates[0], 'set_first_date').row()
    .text(dates[1], 'set_second_date').row()
    .text(dates[2], 'set_third_date');
    await ctx.reply('Выберите дату:', {
        reply_markup: inlineKeyboardDate
    })
})

bot.callbackQuery('set_first_date', async (ctx) => {
    date = dates[0];
    await ctx.answerCallbackQuery();
    await ctx.reply(`Дата установлена: ${dates[0]}`);
})

bot.callbackQuery('set_second_date', async (ctx) => {
    date = dates[1];
    await ctx.answerCallbackQuery();
    await ctx.reply(`Дата установлена: ${dates[1]}`);
})

bot.callbackQuery('set_third_date', async (ctx) => {
    date = dates[2];
    await ctx.answerCallbackQuery();
    await ctx.reply(`Дата установлена: ${dates[2]}`);
})

bot.command('show', async (ctx) => {
    await ctx.reply(`Текущий маршрут: ${route}\nТекущая дата: ${date}`);
})

bot.command('help', async (ctx) => {
    const helpMessage = `📜 <b>Команды бота:</b>
    
    /start - Запускает бота и уведомляет вас о наличии мест на выбранный маршрут и дату.
    
    /route_date - Позволяет вам выбрать маршрут и дату для проверки наличия мест.
    
    /show - Показывает текущий маршрут и дату, которые вы выбрали.
    
    /help - Выводит это сообщение с описанием всех команд.
    
    /donate - Информация о том, как поддержать проект.`;
    
    await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

bot.command('donate', async (ctx) => {
    await ctx.reply('https://youtu.be/dQw4w9WgXcQ?si=USinHzmI3u8mwlhi');
})

bot.on('message', async (ctx) => {
    console.log(`Сообщение от ${ctx.from.first_name} ${ctx.from.last_name}: ${ctx.message.text}`);
    await ctx.reply(`Ты так не шути, ${ctx.from.first_name}`);
    await ctx.reply(`Твой тг id: ${ctx.from.id}\n`);
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if(e instanceof GrammyError){
        console.error("Error in request:", e.description);
    } else if(e instanceof HttpError){
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
})

bot.start();