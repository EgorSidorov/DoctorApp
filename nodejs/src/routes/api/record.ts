import express = require('express');
import {connector, mysql} from '../../db/Connector'
import {selectAllDoctorsQuery, addPatientQuery, addScheduleQuery, selectBusyTimeForDate} from '../../db/queries';
import {IRecord} from '../../models/Record';

var router = require('express').Router();

router.get('/getDoctors', function(req : express.Request, res : express.Response) {
    connector.getConnect().query(selectAllDoctorsQuery,
    function(err : any, results : any, fields : any) {
      if(err){
        console.log(err);
        res.status(500);
        res.send()
      } else {
        res.status(200);
        res.json(results);
      }
    });
})

function getDateStringFromDate(date: Date){
  return date.toLocaleString("en-CA").replace(',', '').slice(0,10);
}

function addDateTimeForDay(result : string [],dayTime : string){
    if(Date.parse(dayTime) > new Date().getTime())
        result.push(dayTime);
}

function generateDateForDay(day : string) : string[]{
  let dateFrom = Date.parse(day);
  let result : string[] = [];  
  //date less current
  if(dateFrom < new Date().getTime() && day !== getDateStringFromDate(new Date()))
    return result;
  //from 09 to 18 
  addDateTimeForDay(result, day + ' 09:00:00');
  addDateTimeForDay(result, day + ' 09:30:00');
  for(let i:number = 10; i < 18; i++){
      addDateTimeForDay(result, day + ' ' + i.toString() + ':00:00');
      addDateTimeForDay(result, day + ' ' + i.toString() + ':30:00');
  }
  return result;
}

router.post('/getFreeDateTimeForDate', function(req : express.Request, res : express.Response) {
  let record: {doctorId : number, date : string} = req.body as {doctorId : number, date : string};
  connector.getConnect().query(selectBusyTimeForDate,
  [record.doctorId, record.date],  
  function(err : any, results : any, fields : any) {
    if(err){
      console.log(err);
      res.status(500);
      res.send()
    } else {
      let dates = generateDateForDay(record.date);
      let resultDates : string[] = []
      let resultSql : string[] = results.map((element : any) => element.recordDate);
      dates.forEach(currDate => {
          if(resultSql.indexOf(currDate) < 0)
            resultDates.push(currDate)
      })
      res.status(200);
      res.json(resultDates);
    }
  });
})



router.post('/addRecord', function (req: express.Request, res: express.Response) {
  let record: IRecord = req.body as IRecord;
  console.log(record)
  addPatient(record, res)
})

function addPatient(record: IRecord,res: express.Response){
  connector.getConnect().query(addPatientQuery,
    [record.pFirstName, record.pLastName, record.pMiddleName],
    function (err: any, results: any, fields: any) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send()
      } else {
        addSchedule(record, results.insertId, res)
      };
    })
}

function addSchedule(record: IRecord, insertId : string,res: express.Response){
  let recordDateString : string = record.recordDate;
  connector.getConnect().query(addScheduleQuery,
    [record.doctorId, insertId, record.complaints, recordDateString],
    function (err: any, results: any, fields: any) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send()
      } else {
        res.status(201);
        res.send()
      }
    })
}

module.exports = router;