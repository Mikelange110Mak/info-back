const express = require('express')
const fs = require('fs');

const app = express();

const data = JSON.parse(fs.readFileSync(`./db.json`)) //Получаю JSON файлик и сразу парсю его

const getDataByMonth = (req, res) => {

   let month = +req.params.month  //Устанавливаю req.param на месяц

   const filtered = data.timeForCode.filter(item => item.month === month)  //Применяю методы массива на JSON файл, фильтрую по месяцу
   dayfilter = filtered.map(item => item.day)  //Массив дней из отфильтрованного массива
   timefilter = filtered.map(item => item.time)  //Массив времени из отфильтрованного массива
   ratefilter = filtered.map(item => item.rate);  //Массив оценок из отфильтрованного массива

   res.status(200)   //Вывожу сообщение при статусе 200
      .json({
         status: 'success',
         notes: dayfilter.length,    //Сколько дней
         data: { dayfilter, timefilter, ratefilter }  //Объект с массивами дней, времени и оценками
      })
}

app.get('/check/:month', getDataByMonth)    //Вызов по маршруту, и указанному времени


const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
})