const express = require ('express');
const bodyParser=require("body-parser");
//const cors=require("cors");
const db = require('./db');
const app = express();
const ejs=require('ejs');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended:true
}));

app.get(("/"),(req,res)=>{

    res.render('home');
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

      res.render('police_officer',{fields : result.fields,   rows : result.rows , table_name : 'Police Officer'});

    })   
});

app.get(('/add_officer'),(req,res)=>{

    //must pair with a unique driver licence number in DBMS 
   // console.log('here');

    res.render('insert/police_officer');

    //res.render("insert/police_officer")

});



app.post(('/insert_officer'),(req,res)=>{

    let body = (req.body.name)

    console.log(req.body);

    res.send('invalid input check driver licence number ')



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