const express = require('express')
const JSONdb = require('simple-json-db');


const app = express();
app.use(express.urlencoded({ extended: false }))    //Подключаю body-parser
app.set('view engine', 'ejs')                      //Подключаю шаблонизатор EJS
app.set('views', './views')                       //Путь к шаблонизатору
app.use(express.static('public'))                //Статические файлы (для CSS)


const db = new JSONdb('./db.json'); //Получаю JSON файлик
let selectedMonth  //Переменная для отображения текста в HTML


//Функция где хранятся мои массивы и некоторые данные:
function arrays(month) {
   const filtered = db.storage.timeForCode.filter(item => item.month === month) //Применяю методы массива на JSON файл, фильтрую по месяцу
   dayfilter = filtered.map(item => item.day) //Массив дней из отфильтрованного массива
   timefilter = filtered.map(item => item.time) //Массив времени из отфильтрованного массива
   ratefilter = filtered.map(item => item.rate); //Массив оценок из отфильтрованного массива
   averageValue = timefilter.reduce((a, b) => (a + b), 0) //Среднее значение времени за месяц

   switch (month) {
      case 1: selectedMonth = 'Январь'; break;
      case 2: selectedMonth = 'Февраль'; break;
      case 3: selectedMonth = 'Март'; break;
      case 4: selectedMonth = 'Апрель'; break;
      case 5: selectedMonth = 'Май'; break;
      case 6: selectedMonth = 'Июнь'; break
      case 7: selectedMonth = 'Июль'; break;
      case 8: selectedMonth = 'Август'; break;
      case 9: selectedMonth = 'Сентябрь'; break;
      case 10: selectedMonth = 'Октябрь'; break;
      case 11: selectedMonth = 'Ноябрь'; break;
      case 12: selectedMonth = 'Декабрь'; break;
   }
}

//Просто главная страница, на которой пока ничего нету
const mainPage = (req, res) => {
   res.render('index')
}

//Функция вывода результата:
const getResult = (req, res) => {

   month = +req.params.month

   arrays(month)               //Массив с данными для работы
   res.render('result', {      //Рендер HTML
      title: `Результат за ${selectedMonth}`,
      message: selectedMonth,
      daysItems: dayfilter,
      timeItems: timefilter,
      rateItems: ratefilter,
      average: Math.round(averageValue / dayfilter.length)
   })

}
//Функция выбора месяца, в следствии которой уже выводится результат
const chooseMonth = (req, res) => {
   let selectedMonth = req.body.month
   res.redirect(`/result/${selectedMonth}`)
}


//Маршруты:
app.get('/', mainPage)                //Главная
app.post('/result', chooseMonth)      //Выбрать месяц
app.get('/result/:month', getResult) //Вывод результата



const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);

})