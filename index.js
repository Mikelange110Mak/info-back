const express = require('express')
const fs = require('fs');
const JSONdb = require('simple-json-db');

const app = express();

const db = new JSONdb('./db.json'); //Получаю JSON файлик


const getDataByMonth = (req, res) => {

   let month = +req.params.month  //Устанавливаю req.param на месяц

   const filtered = db.storage.timeForCode.filter(item => item.month === month)  //Применяю методы массива на JSON файл, фильтрую по месяцу
   dayfilter = filtered.map(item => item.day)  //Массив дней из отфильтрованного массива
   timefilter = filtered.map(item => item.time)  //Массив времени из отфильтрованного массива
   ratefilter = filtered.map(item => item.rate);  //Массив оценок из отфильтрованного массива

   res.json({
      status: 'success',
      notes: dayfilter.length,    //Сколько дней
      data: { dayfilter, timefilter, ratefilter }  //Объект с массивами дней, времени и оценками
   })
}



app.get('/get_info_by_month/:month', getDataByMonth)    //Вызов по маршруту, и указанному месяцу


const port = 8000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);

})