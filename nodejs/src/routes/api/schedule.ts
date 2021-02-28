import express = require('express');
import {connector} from '../../db/Connector'
import {selectScheduleQuery, removeScheduleQuery} from '../../db/queries';

var router = require('express').Router();

router.post('/selectSchedule', function(req : express.Request, res : express.Response) {
    let record: {doctorId : number, date : string} = req.body as {doctorId : number, date : string};
    connector.getConnect().query(selectScheduleQuery,
    [record.doctorId, record.date],  
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

  router.delete('/removeSchedule', function(req : express.Request, res : express.Response) {
    let scheduleID: string = req.query.scheduleId as string;
    connector.getConnect().query(removeScheduleQuery,
    [scheduleID],  
    function(err : any, results : any, fields : any) {
      if(err){
        console.log(err);
        res.status(500);
        res.send()
      } else {
        res.status(202);
        res.send();
      }
    });
  })

module.exports = router;