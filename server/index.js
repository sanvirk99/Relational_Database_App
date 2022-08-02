const express = require('express');
const bodyParser = require("body-parser");
//const cors=require("cors");
const db = require('./db');
const app = express();
const ejs = require('ejs');



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

app.post(('/table'), (req, res) => {
    let table_name = req.body.table;
    let getUserQuery = `SELECT * from ${table_name}`;
    db.query(getUserQuery, (error, result) => {

        if (error) {
          res.send(error);
        }
        res.render('database', { fields: result.fields, rows: result.rows, table_name: `${table_name}`});
    
      })
})

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

    res.render('delete/gov_officer', { fields: result.fields, rows: result.rows, table_name: 'Goverment officer (deleting officer also deletes asocciation in oversee table)' });

  })
});


app.get('/delete_officer/:id', (req, res) => {

   //if two prams are required add /: for second and make source include this ;

    console.log(req.params.id)
    let getUserQuery = `DELETE FROM goverment_officer where goverment_id='${req.params.id}';`

    console.log(getUserQuery);
    db.query(getUserQuery, (error, result) => {

      if (error) {
        res.send('error while deleting in database');
      }
  
      //console.log(result);
      
      res.redirect('/gov_officer');
      
  
    })


})

app.get(('/complaints'), (req, res) => {


  let getUserQuery = `SELECT * from complaint`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result.rows)

    res.render('delete/complaints', { fields: result.fields, rows: result.rows, table_name: 'List of complaints (deleting officer also deletes asocciation in officer review table)' });

  })
});

app.get('/delete_complaint/:id', (req, res) => {

  //if two prams are required add /: for second and make source include this ;

   console.log(req.params.id)
   let getUserQuery = `DELETE FROM public.complaint
   WHERE complaint_id = '${req.params.id}';`

   console.log(getUserQuery);
   db.query(getUserQuery, (error, result) => {

     if (error) {
       res.send('error while deleting in database');
     }
 
     //console.log(result);
     
     res.redirect('/complaints');
     
 
   })


})

app.get(('/suspects'), (req, res) => {


  let getUserQuery = `SELECT * from suspect`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result.rows)

    res.render('update/suspect', { fields: result.fields, rows: result.rows, table_name: 'List of all suspects' });

  })
});


app.get(('/update_suspect/:update_id'), (req, res) => {


  //let getUserQuery = `SELECT from suspect where suspect_id='${req.params.update_id}';`;
  let getUserQuery= `SELECT * FROM suspect where suspect_id=${req.params.update_id};`;
 
  //console.log(getUserQuery);

  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result.rows)

    res.render('update/form', { fields: result.fields, rows: result.rows, table_name: 'List of all suspects' });

  })
});


app.post(('/new_info/:id'), (req, res) => {

  //console.log(req.body)

  //let getUserQuery = `SELECT from suspect where suspect_id='${req.params.update_id}';`;
  let getUserQuery= `UPDATE public.suspect
	SET  name='${req.body.name}', birth_date='${req.body.birth_date}', height_cm='${req.body.height}', eye_colour='${req.body.eye_colour}', address='${req.body.address}'
	WHERE suspect_id=${req.params.id};`;
 
   //console.log(getUserQuery);

  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.redirect('/suspects')

  })
});




// app.get('/update_suspect/<%=update_id%>', (req, res) => {

//   //if two prams are required add /: for second and make source include this ;

//    //console.log(req.params.id)
//    let getUserQuery = `UPDATE FROM suspect 
   
//    name= '${req.body.name}', birth_date='${req.body.birth_date}', height_cm='${req.body.height}', eye_colour='${req.body.eye_colour}', address= '${req.body.address}'
   
//    where complaint_id='${req.params.update_id}';`;

//    //console.log(req.params.id)

//    console.log(getUserQuery);
//    db.query(getUserQuery, (error, result) => {

//      if (error) {
//        res.send('error while deleting in database');
//      }
 
//      //console.log(result);
     
//      res.redirect('/suspects');
     
 
//    })


// })
app.get(('/reviews'), (req, res) => {


  let getUserQuery = `SELECT * from office_review`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result.rows)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Reviewed complaints by office worker police specified with id along with time' });

  })
});

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



app.get(('/select_officer'), (req, res) => {


  let getUserQuery = `SELECT badge, duty_name AS officer_name
  FROM public.police_officer
  WHERE badge > '123458';`;
  //var getUserQuery=`SELECT table_name FROM information_schema.tables WHERE table_schema='public`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Select police officers with badge number greater than 123458'});

  })
});


app.get(('/select_prison'), (req, res) => {


  let getUserQuery = `SELECT * FROM prison
  WHERE max_capacity < '10';`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    console.log(result)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Select prison cells with max capacity less than 10'});

  })
});

app.get(('/projection_equipment'), (req, res) => {


  let getUserQuery = `SELECT equipment.type
  FROM public.equipment;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'All the types of equipment in the database'});

  })
});

app.get(('/projection_officer'), (req, res) => {


  let getUserQuery = `SELECT duty_name AS officer_name
  FROM public.police_officer;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Names of all the police officers '});

  })
});

app.get(('/join_query_1'), (req, res) => {


  let getUserQuery = `SELECT suspect.name
  FROM suspect, locked_up
  WHERE suspect.suspect_id = locked_up.suspect_id AND locked_up.locked_in_cell = 1;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Join the Suspects and Locked Up table to find the name(s) of the suspect(s) in cell no. 1'});

  })
});



app.get(('/join_query_2'), (req, res) => {


  let getUserQuery = `SELECT suspect.birth_date
  FROM suspect, locked_up
  WHERE suspect.suspect_id = locked_up.suspect_id AND locked_up.locked_in_cell = 2;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    //console.log(result)

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Join the Suspects and Locked Up table to find the Birth date(s) of the suspect(s) in cell no. 2'});

  })
});



app.get(('/aggregation_1'), (req, res) => {


  let getUserQuery = `SELECT COUNT(*) AS total_suspects
  FROM public.locked_up;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Number of suspects that are locked up in the cells'});

  })
});


app.get(('/aggregation_2'), (req, res) => {


  let getUserQuery = `SELECT COUNT(*) AS total_crimes
  FROM public.crime;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Number of crimes that are commited and logged into the database'});

  })
});

app.get(('/aggregation_3'), (req, res) => {


  let getUserQuery = `SELECT MAX(DATE_PART('day', release_date::timestamp - start_date::timestamp)) AS Max_Days_Locked_Up
  FROM public.locked_up;`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'What is the longest duration that a suspect is locked up for?'});

  })
});

app.get(('/nested_aggregation_1'), (req, res) => {


  let getUserQuery = `SELECT suspect.suspect_id, name, locked_in_cell, birth_date, 
  DATE_PART('day', release_date::timestamp - start_date::timestamp) AS DaysLockedUp
  FROM public.suspect, public.locked_up
  WHERE (suspect.suspect_id = locked_up.suspect_id) AND (suspect.suspect_id IN
          (SELECT suspect_id
          FROM public.locked_up
          GROUP BY suspect_id
          HAVING DATE_PART('day', release_date::timestamp - start_date::timestamp) 
          > (SELECT MIN(DATE_PART('day', release_date::timestamp - start_date::timestamp))
            FROM public.locked_up)));`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Show all suspects that have a locked up duration which is greater than the lowest/minimum locked up duration of suspects'});

  })
});

app.get(('/nested_aggregation_2'), (req, res) => {


  let getUserQuery = `SELECT suspect.suspect_id, name, locked_in_cell, birth_date, 
  DATE_PART('day', release_date::timestamp - start_date::timestamp) AS DaysLockedUp
  FROM public.suspect, public.locked_up
  WHERE (suspect.suspect_id = locked_up.suspect_id) AND (suspect.suspect_id IN
          (SELECT suspect_id
          FROM public.locked_up
          GROUP BY suspect_id
          HAVING DATE_PART('day', release_date::timestamp - start_date::timestamp) 
           > (SELECT AVG(DATE_PART('day', release_date::timestamp - start_date::timestamp))
            FROM public.locked_up)));`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Show all suspects that have a locked up duration which is greater than the average locked up duration of suspects'});

  })
});


app.get(('/division'), (req, res) => {


  let getUserQuery = `SELECT DISTINCT checkout_officer as badge_no, duty_name as officer_name
  FROM public.equipment_checkout, public.police_officer
  WHERE equipment_checkout.checkout_officer = police_officer.badge AND checkout_officer NOT IN (SELECT checkout_officer
                   FROM ((SELECT checkout_officer, equipment_id
                     FROM (SELECT equipment.equipment_id
                        FROM public.equipment) as equip
                     cross join (SELECT DISTINCT checkout_officer
                           FROM public.equipment_checkout) as officer)
                    EXCEPT 
                    (SELECT checkout_officer, equipment_id
                     FROM public.equipment_checkout)) as checkedout);`;


  db.query(getUserQuery, (error, result) => {

    if (error) {
      res.send(error);
    }

    res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Find the Checkout Officer(s) badge no. and name who have checked out all the different equipments'});

  })
});

app.get(('/division2'), (req, res) => {


    let getUserQuery = `select police.badge, police.duty_name from police_officer police where not exists
        (select * from crime where not exists
        (select investigates.crime_id from investigates where
        investigates.crime_id = crime.crime_id and investigates.officer = police.badge))`;
  
  
    db.query(getUserQuery, (error, result) => {
  
      if (error) {
        res.send(error);
      }
  
      res.render('database', { fields: result.fields, rows: result.rows, table_name: 'Find the Officer(s) badge no. and name who have investigated all crime'});
  
    })
  });


app.listen(8080, () => {

  console.log("running on port 8080");

});