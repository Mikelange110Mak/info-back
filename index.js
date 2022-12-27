const express = require('express')
const fs = require('fs');
const JSONdb = require('simple-json-db');

const app = express();
app.set('view engine', 'ejs')      //Подключаю шаблонизатор EJS
app.set('views', './views')        //Путь к шаблонизатору
app.use(express.static('public'))  //Статические файлы (для CSS)

const db = new JSONdb('./db.json'); //Получаю JSON файлик

//Функция где хранятся мои массивы:
function arrays(month) {
   const filtered = db.storage.timeForCode.filter(item => item.month === month) //Применяю методы массива на JSON файл, фильтрую по месяцу
   dayfilter = filtered.map(item => item.day) //Массив дней из отфильтрованного массива
   timefilter = filtered.map(item => item.time) //Массив времени из отфильтрованного массива
   ratefilter = filtered.map(item => item.rate); //Массив оценок из отфильтрованного массива
   averageValue = timefilter.reduce((a, b) => (a + b), 0) //Среднее значение времени за месяц
}


const getDataByMonth = (req, res) => {

   let month = +req.params.month  //Устанавливаю req.param на месяц

   arrays(month)

   res.json({
      status: 'success',
      notes: dayfilter.length,    //Сколько дней
      data: { dayfilter, timefilter, ratefilter }  //Объект с массивами дней, времени и оценками
   })
}

//Функция вывода результата в хтмле:
const getResult = (req, res) => {

   month = +req.params.month

   arrays(month)
   res.render('result', {
      title: 'This is a title',
      message: 'This is a message',
      daysItems: dayfilter,
      timeItems: timefilter,
      rateItems: ratefilter,
      average: Math.round(averageValue / dayfilter.length)
   })
}

const chooseMonth = (req, res) => {
   res.render('main', {
      title: 'Главная'
   })

   console.log(req.query.month);
}

app.get('/', chooseMonth)
app.get('/result/:month', getResult) //Вызов маршрута для вывода результата

app.get('/get_info_by_month/:month', getDataByMonth)    //Вызов по маршруту, и указанному месяцу

const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);

})