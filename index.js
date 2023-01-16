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



/*
const check = (req, res, next) => {
   storage["2022"]["11"].push({ day: 77, time: 777, rate: 7 })
   db.JSON(storage)
   db.sync();
   next()
}
*/
//const filtered = db.filter(item => item.year === year)
//console.log(filtered);



function arrays(year, month) {

   //это чтобы не было багов с несколькими нулями
   if (+month < 10) {
      month = month.replace(/0/g, '');
      month = `0${month}`
   }

   //собсна массивы которые перебираются
   const filtered = storage[year][month]
   dayfilter = filtered.map(item => item.day)   //Массив дней из отфильтрованного массива
   timefilter = filtered.map(item => item.time) //Массив времени из отфильтрованного массива
   ratefilter = filtered.map(item => item.rate); //Массив оценок из отфильтрованного массива
   averageValue = timefilter.reduce((a, b) => (a + b), 0) //Среднее значение времени за месяц

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



   arrays(year, month)
   //if (+month < 10) month = `0${month}`
   console.log(year, month);

   res.render('result', {      //Рендер HTML
      title: `Результат за ${selectedMonth}`,
      monthName: selectedMonth,
      yearValue: year,
      daysItems: dayfilter,
      timeItems: timefilter,
      rateItems: ratefilter,
      average: Math.round(averageValue / dayfilter.length)
   })
}


//Функция добавления нового дня:
const addInfo = (req, res, next) => {
   //Чтобы вся эта залупа работала, мне надо прочитать мой json, спарсить, запушить новые данные в паршенный массив и застрингифайнуть
   const arr = fs.readFileSync('db.json') //Собсна мой массива
   const parsedArr = JSON.parse(arr)      //Паршу его

   //Инфа из формочки:
   let dayAdd = +req.body.addDay;
   let monthAdd = +req.body.addMonth;
   let timeAdd = +req.body.addTime;
   let rateAdd = +req.body.addRate;

   //Проверка чтобы введеная в форму инфа была правильной:
   if (isNaN(dayAdd) || isNaN(monthAdd) || isNaN(timeAdd) || isNaN(rateAdd) || dayAdd > 31 || dayAdd < 1 || timeAdd < 1) return res.render('blocks/wrongData');
   else {
      parsedArr.push({ day: dayAdd, month: monthAdd, time: timeAdd, rate: rateAdd })   //Пушим новую инфу в массив
      let stringArr = JSON.stringify(parsedArr)  //Стрингифаем его
      fs.writeFileSync('db.json', stringArr);   //Переписываем JSON
      console.log(`Day ${dayAdd}.${monthAdd} have been added`);
      next() //Происходит баг что данные пушатся несколько раз, это его исправляет
      res.render('blocks/success', {   //Рендерим мой EJS
         day: dayAdd,
         month: monthAdd,
         time: timeAdd,
         rate: rateAdd
      })
   }
}



//Маршруты:

app.get('/', mainPage)                //Главная
app.post('/result', chooseMonth)      //Выбрать месяц
app.get('/result/:year/:month', getResult) //Вывод результата
//app.post('/add', addInfo)            //Добавить новый день

//app.get('/check', check)
//Сервер:
const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
})