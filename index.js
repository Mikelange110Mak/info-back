const express = require('express')
const fs = require('fs');
const JSONdb = require('simple-json-db');

const app = express();
app.use(express.urlencoded({ extended: false }))
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


const mainPage = (req, res) => {
   res.render('index')
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
   console.log(req.path);
}

const chooseMonth = (req, res) => {
   console.log(req.path);
   let selectedMonth = req.body.month
   res.redirect(`/result/${selectedMonth}`)

}

app.get('/', mainPage)
app.get('/', chooseMonth)
app.post('/result', chooseMonth)

app.get('/result/:month', getResult) //Маршрут для вывода результата


const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);

})