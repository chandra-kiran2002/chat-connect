var express = require('express');
var cors =require('cors')
var mysql = require('mysql');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var http = require('http');
var app = express();
const {Server}=require("socket.io")
var server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
require("dotenv").config()
app.use(cookieParser());
app.use(
    cors({
        origin:"*"
    })
)
// Create application/x-www-form-urlencoded parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({  extended: false}))

app.get('/', function (req, res) {
  res.send("hello")
    // console.log(req.body.email+"  "+req.body.password)
    // if(req.body.email=="kiran"&&req.body.password=="123"){
    //     res.cookie("kin",'jhvgv')
    //     res.send('Hello World');
    // }
    // else{
    //   res.cookie("kin",'jhvgv')
    //     res.send('Hello');
    // }
})

app.post('/login', function (req, res) {
    console.log(req.body.email+"  "+req.body.password)
    var sql="SELECT * FROM persons WHERE EMAIL='"+req.body.email+"' AND PASSWORD='"+req.body.password+"';"
    con.query(sql,function(err,result){
      if (err) throw err;
      // console.log(result)
      if(result.length==1){
        // res.cookie('name',"'"+result[0].id+"'")
        res.send([{"status":"success","result":result}])
      }
      else{
        res.send([{"status":"failed"}])
      }
    })
})

app.post('/uploadmessage',function(req,res){
  var from=req.body.from
  var to=req.body.to
  var message=req.body.message
  var sql="INSERT INTO chat (`FROM`,`TO`,`MESSAGE`,date) VALUES ('"+from+"','"+to+"','"+message+"',now());"
  var sql1="insert into `seen` (`from`,`to`, `count`) values ('"+from+"','"+to+"','0');"
  var sql2="update `seen` set count=count+1 where `from`="+from+" and `to`="+to+";"

  con.query(sql,function(err,result){
    if (err){ 
      res.send("failed")
      throw err}
    else{
      res.send("success")
      console.log("message database updated")
      con.query(sql1,function(err,result){
        if(err){

        }
      })
      con.query(sql2,function(err,result){
        
      })
    }
  })
})
app.post('/getprofiles',function(req,res){
  var from =req.body.from
  // var sql ="select persons.name ,x.chatlist from (SELECT date, Case when `from`='"+from+"' then `to` when `to`='"+from+"' then `from` END as chatlist  from chat where `from`='"+from+"' or `to`='"+from+"' ORDER BY date desc) x left join persons on persons.id=x.chatlist  GROUP BY x.chatlist order by max(x.date) desc,x.chatlist"
  var sql="select ids, name,count from(select ids,persons.name from (select ids,date from (SELECT distinct  CASE when `from`='"+from+"' then `to`when `to`='"+from +"'then `from`end as ids,id,date FROM chat where `from`='"+from+"'or `to`='"+from+"' order by date desc) y group by y.ids) z left join persons on z.ids=persons.id) w left join seen on w.ids=seen.from and seen.to='"+from+"';"
  con.query(sql,function(err,result){
    if(err){
      res.send("failed")
      throw err
    }
    else{
      // console.log(result)
      res.send(result)
    }
  })

})
app.post('/signup',function(req,res){
   
    var email=req.body.email
    var name=req.body.name
    var password=req.body.password
    console.log(email+"  "+name+"   "+password)
    var sql = "SELECT * FROM persons WHERE EMAIL='"+email+"';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result)
      if(result.length!=0){
        res.send("user already exist")
      }
      else{
        var otp=getRndInteger();
        ifexistthendelete(email)
        insertotp(email,otp)
        sendotp(email,otp)
        res.send("otp success")
      }
    });

})

app.post('/checkotp',function(req,res){
    var email=req.body.email
    var name=req.body.name
    var password=req.body.password
    var otp=req.body.otp
    console.log(email+"  "+name+"   "+password+"  "+otp)
    
    var sql="SELECT * FROM otplog WHERE PERSONID='"+email+"'"

    con.query(sql,function(err,result){
      if (err) throw err;
      if(result.length>0&&result[0].otp==otp){
        sql="INSERT INTO persons (email, name, password) VALUES ('"+email+"', '"+name+"', '"+password+"');"
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted cxv fdghfg");
          res.send("success")
        });
      }
      else{
        console.log("wrong otp")
        res.send("failed")
      }
  })

})

app.post('/getmessages',function(req,res){
  var from =req.body.from
  var to=req.body.to
  var sql="select `from`,`to`,message,date,seen from chat where (`from`='"+from+"' and `to`='"+to+"') or (`from`='"+to+"' and `to`='"+from+"') order by date"
  var sql1="update `seen` set count=0 where `from`="+to+" and `to`="+from+";"
  con.query(sql,function(err,result){
    if(err){
      res.send("failed")
      throw err
    }
    else{
      res.send(result)
      con.query(sql1,function(err,result){

      })
    }
  })
})
app.post("/msgtonew",function(req,res){
  var user=req.body.user
  var sql="select name,id from persons where email='"+user+"';"
  con.query(sql,function(err,result){
    if(err){
      res.send("failed")
      throw err
    }
    else{
      res.send(result)
    }
  })
})

// db connection---------------------


var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  port:process.env.DB_PORT,
  user: process.env.DB_USER,
  password:process.env.DB_PASS,
  database :process.env.DB_DATABASE

});
con.connect(function(err) {
  if (err) throw err;
  console.log("db Connected!");
});
 


function checkifalreadyregistred(email){
     con.connect(function(err) {
        // if (err) throw err
        console.log("Connected!");})
        
        var sqlresult=[];
         
        console.log(sqlresult)
        if(sqlresult.length==0){
            return 0
        }
        else{
            return 1;
        }
    //   con.end()
}

function insertotp(email,otp){
    con.connect(function(err) {
        // if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO otplog (personid, otp) VALUES ('"+email+"', '"+otp+"');";

        con.query(sql, function (err, result) {
        //   if (err) throw err;
          console.log("1 record inserted otp");
        });
      });
}
function ifexistthendelete(email){
    con.connect(function(err) {
        // if (err) throw err;
        console.log("Connected!");
        var sql = "DELETE FROM otplog WHERE personid = '"+email+"';";

        con.query(sql, function (err, result) {
        //   if (err) throw err;
          console.log("1 deleted inserted otp");
        });
      });
}
// ------------------------------------------

// random otp generator------------------------------------
function getRndInteger() {
    return Math.floor(Math.random() * (999999 - 100000) ) + 100000;
  }
// ------------------------------------------------------------



// emial-------------------------------------------------------


  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});
function sendotp(to,otp){
    var mailOptions = {
        from: 'dummy.python10@gmail.com',
        to: to,
        subject: 'OTP for website signup',
        text: "To authenticate, please use the following One Time Password (OTP):"+otp+"\nDon't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card, or banking info.\nWe hope to see you again soon."
      };
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}


// ---------------------------------------------------------------
let port =8001;
server.listen( process.env.PORT || port, function () {
 var host = "localhost"
 var port = 8001
 console.log("Example app listening at http://%s:%s", host, port)
})
var online_users=new Map();

io.on('connection', function(socket){
  console.log(socket.id+"  user connected")
  socket.on("on-signin",function(id){
    console.log(id+"    "+socket.id)
    online_users.set(id,socket.id)
    console.log(online_users)
  })

  socket.on('disconnect', function () {
    for (const x of online_users.entries()) {
      console.log("socket.io ")
      console.log(x)
      if(x[1]==socket.id){
        online_users.delete(x[0])
        // console.log(online_users)
      }
    }
   console.log('A user disconnected');
  });

  socket.on("message-sent",function(to,from){
    if(online_users.has(to))
    socket.to(online_users.get(to)).emit("update-chat",to,from)
  })

})



