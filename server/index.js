const express = require ('express');
//const bodyParser=require("body-parser");
//const cors=require("cors");
const db = require('./db');
const app = express();
const ejs=require('ejs');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/views'));
//app.use(bodyParser.json())

app.get(("/"),(req,res)=>{

    res.send('hello world');
});


function getdb(){

    var getUserQuery = `SELECT * from police_officer`;
    //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;
    
    db.query(getUserQuery, (error, result) => {
  
      if (error) {
        res.send(error);
      }

      console.log(result)
    })
}


//getdb();

app.get(('/police_officer'),(req,res) =>{

  
    var getUserQuery = `SELECT * from police_officer`;
    //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;
    

    db.query(getUserQuery, (error, result) => {
        
      if (error) {
        res.send(error);
      }

      res.render('database',{fields : result.fields,   rows : result.rows , table_name : 'Police Officer'});

    })   
});


function getdriver(){

    var getUserQuery = `SELECT * from driver_licence`;
    //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;
    
    db.query(getUserQuery, (error, result) => {
  
      if (error) {
        res.send(error);
      }

      console.log(result)
    })
}

//getdriver();

app.get(('/driver_l'),(req,res) =>{

  
    var getUserQuery = `SELECT * from driver_licence`;
    //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;
    

    db.query(getUserQuery, (error, result) => {
        
      if (error) {
        res.send(error);
      }

      res.render('database',{fields : result.fields,   rows : result.rows , table_name : 'Driver Licence'});

    })   
});


app.listen(8080,()=>{

    console.log("running on port 8080");

});