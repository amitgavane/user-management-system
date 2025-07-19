const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override")
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride ("_method"));
app.use(express.urlencoded ({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2023bit011',
  database: 'delta_app'
});

let getRandomuser = () =>  {
    return [
     faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
     faker.internet.password(),
    ]
   
};


app.get("/",(req,res)=>{
  let q = `select count(*) from user`;
  try{
connection.query(q, (err,result)=>{
  if(err) throw err ;
 let count = result[0]["count(*)"];
  res.render("home.ejs",{count});
})
}catch (err){
  console.log(err);
  res.send("some error in database");
}
});

app.get("/user",(req,res)=>{
  let q= `select* from user`;
  try{
    connection.query(q,(err,user)=>{
      if(err) throw err;
      //let data = result ;
      //console.log(data);
      res.render("users.ejs", { users: user });
    });
  } catch(err){
    res.send("some error occurred");
  }
});

//edit route
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q=`select * from user where id='${id}'`;
  
 try{
connection.query(q, (err,result)=>{
  if(err) throw err ;
  let user=result[0];
  res.render("edit.ejs",{user, error: req.query.error});
});
}catch (err){
  console.log(err);
  res.send("some error in database");
}
});


app.patch("/user/:id",(req,res)=>{
  let{id}=req.params;
  let{password:formPass, username:newUsername}=req.body;
  let q =`select*from user where id='${id}'`;

  try{
    connection.query(q,(err,result)=>{
      if(err)throw err;
      let user =result[0];
      if(formPass != user.password){
        res.redirect(`/user/${id}/edit?error=wrong_password`);
      
      }else{
        let q2=`update user set username='${newUsername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect ("/user");
        });
      }
    });
  }catch(err){
    console.log(err);
  res.send("some error in database");
  }

});


app.listen("8080",()=>{
    console.log("listening on port 8080");
});

