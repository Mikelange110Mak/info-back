const express = require('express')
const JSONdb = require('simple-json-db');
const fs = require('fs');


const app = express();
app.use(express.urlencoded({ extended: false }))    //Подключаю body-parser
app.set('view engine', 'ejs')                      //Подключаю шаблонизатор EJS
app.set('views', './views')                       //Путь к шаблонизатору
app.use(express.static('public'))                //Статические файлы (для CSS)


const db = new JSONdb('db.json'); //Получаю JSON файлик
let selectedMonth  //Переменная для отображения текста в HTML (пригодится в функции arrays)
const storage = db.JSON()

//функция с массивами данных для отображения (пригодится в функции getResult)
function arrays(year, month) {

   //это чтобы не было багов с несколькими нулями
   if (+month < 10) {
      month = month.replace(/0/g, '');
      month = `0${month}`
   }

   //собсна массивы которые перебираются
   const filtered = storage[year][month];

   if (filtered) {
      dayfilter = filtered.map(item => item.day)   //Массив дней из отфильтрованного массива
      timefilter = filtered.map(item => item.time) //Массив времени из отфильтрованного массива
      ratefilter = filtered.map(item => item.rate); //Массив оценок из отфильтрованного массива
      averageValue = timefilter.reduce((a, b) => (a + b), 0) //Среднее значение времени за месяц
      averageRate = ratefilter.reduce((a, b) => (a + b), 0)
   } else {
      dayfilter = []
      timefilter = []
      ratefilter = []
      averageValue = []
   }

   //для отображения названий месяцев на странице
   switch (month) {
      case '01': selectedMonth = 'Январь'; break;
      case '02': selectedMonth = 'Февраль'; break;
      case '03': selectedMonth = 'Март'; break;
      case '04': selectedMonth = 'Апрель'; break;
      case '05': selectedMonth = 'Май'; break;
      case '06': selectedMonth = 'Июнь'; break
      case '07': selectedMonth = 'Июль'; break;
      case '08': selectedMonth = 'Август'; break;
      case '09': selectedMonth = 'Сентябрь'; break;
      case '10': selectedMonth = 'Октябрь'; break;
      case '11': selectedMonth = 'Ноябрь'; break;
      case '12': selectedMonth = 'Декабрь'; break;
   }
}
arrays('2022', '8')

//Просто главная страница
const mainPage = (req, res) => {
   res.render('index')
}


//Функция выбора месяца, в следствии которой уже выводится результат
const chooseMonth = (req, res) => {

   let year = req.body.year
   let month = req.body.month

   res.redirect(`/result/${year}/${month}`)
}


const getResult = (req, res) => {

   let year = req.params.year
   let month = req.params.month

   arrays(year, month) //функция с массивами

   res.render('result', {      //Рендер HTML
      title: `Результат за ${selectedMonth}`,
      monthName: selectedMonth,
      yearValue: year,
      daysItems: dayfilter,
      timeItems: timefilter,
      rateItems: ratefilter,
      average: Math.round(averageValue / dayfilter.length),
      averageRate: (averageRate / dayfilter.length).toFixed(2)
   })


}


//Функция добавления нового дня:
const addInfo = (req, res, next) => {

   // Введенные данные в переменную:
   let addDay = +req.body.addDay
   addMonth = req.body.addMonth
   addYear = req.body.addYear
   addTime = +req.body.addTime
   addRate = +req.body.addRate

   console.log([addDay, addMonth, addYear, addTime, addRate]);

   if (addMonth.length === 1) addMonth = `0${addMonth}` //это чтобы не было багов с несколькими нулями

   //Проверка на правильность введенных данных
   if (typeof (addMonth) !== 'string' || typeof (addYear) !== 'string' || isNaN(addDay) || isNaN(addTime) || isNaN(addRate) || addDay > 31 || addDay < 1 || addTime < 1) {
      res.render('blocks/wrongData'); //Рендер страницы если данные неверны
   } else {
      storage[addYear][addMonth].push({ day: addDay, time: addTime, rate: addRate })  //пушу новые данные в массив
      db.JSON(storage)  //кидаю их в хранилище
      db.sync();        //синхронизирую
      next()           //это чтобы нодмон не перезагружал страницу

      res.render('blocks/success', {   //Рендерим мой EJS
         day: addDay,
         month: addMonth,
         year: addYear,
         time: addTime,
         rate: addRate
      })
   }
}



//Маршруты:

app.get('/', mainPage)                //Главная
app.post('/result', chooseMonth)      //Выбрать месяц
app.get('/result/:year/:month', getResult) //Вывод результата
app.post('/add', addInfo)            //Добавить новый день

//Сервер:
const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
})