const express = require('express');
const bodyParser = require("body-parser");
//const cors=require("cors");
const db = require('./db');
const app = express();
const ejs = require('ejs');
const { query } = require('express');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get(("/"), (req, res) => {

  res.render('home');
});


function getdb() {

  let getUserQuery = `SELECT * from police_officer`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;

  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    console.log(result)
  })
}


//getdb();

app.get(('/police_officer'), (req, res) => {


  let getUserQuery = `SELECT * from police_officer`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('police_officer', { fields: result.fields, rows: result.rows, table_name: 'Police Officer' });

  })
});



app.get(('/add_officer'), (req, res) => {

  //must pair with a unique driver licence number in DBMS 
  // console.log('here');

  res.render('insert/police_officer');

  //res.render("insert/police_officer")

});



app.post(('/insert_officer'), (req, res) => {

  //we do not check for uniqueness of DL number as each is unique to a person it becomes a primary key
  //we assume user input is valid 

  //check driver l is unique

    let insertQuery_dl = `INSERT INTO public.driver_licence(
      driver_l, name, birth_date, height_cm, eye_colour, address)
      VALUES ('${req.body.licence}', 
        '${req.body.name}', 
        '${req.body.birth_date}', 
        '${req.body.height}', 
        '${req.body.eye_colour}', 
        '${req.body.address}');`;

    let insertQuery_police = `INSERT INTO public.police_officer
    (badge, driver_l,duty_name,rank_name)
    VALUES
    (nextval('badge_sequence'), '${req.body.licence}','${req.body.duty_name}','${req.body.duty_rank}');`;


  db.query(insertQuery_dl, (error, result) => {

    if (error) {

      console.log(error);
      res.send("driver licence is not unique to person resubmit form wiht correct");
    }

        db.query(insertQuery_police,(error,result) =>{

          if(error){

          console.log(error);
          res.send("this officer could not be inserted licence number will also be removed");

          }

          res.redirect('/police_officer');


        })

      //console.log(result);
      //res.render('police_officer',{fields : result.fields,   rows : result.rows , table_name : 'Police Officer'});

  })


    //res.render('police_officer',{fields : result.fields,   rows : result.rows , table_name : 'Police Officer'});

  

  //res.send('invalid input check driver licence number ')

});

function getdriver() {

  let getUserQuery = `SELECT * from driver_licence`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;

  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    console.log(result)
  })
}

//getdriver();

app.get(('/driver_l'), (req, res) => {


  let getUserQuery = `SELECT * from driver_licence`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Driver Licence' });

  })
});

app.get(('/gov_officer'), (req, res) => {


  let getUserQuery = `SELECT * from goverment_officer`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result.rows)

    res.render('delete/gov_officer', { fields: result.fields, rows: result.rows, table_name: 'Goverment officer' });

  })
});


app.get('/delete_officer/:id', (req, res) => {

   //if two prams are required add /: for second and make source include this ;

    console.log(req.params.id)
    let getUserQuery = `DELETE FROM goverment_officer where goverment_id='${req.params.id}';`

    console.log(getUserQuery);
    db.query(getUserQuery, (error, result) => {

      if (error) {
        console.log(error);
      }
  
      console.log(result);
      
      res.redirect('/gov_officer');
      
  
    })


})

app.get(('/gov_oversee'), (req, res) => {


  let getUserQuery = `SELECT * from oversees`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Goverment officer' });

  })
});





app.listen(8080, () => {

  console.log("running on port 8080");

});