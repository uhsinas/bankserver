//import express
  const express= require('express')

  //import dataservice
  const dataservice= require('./services/data.service')

  //jsonwebtoken import
   const jwt = require('jsonwebtoken')

   //import cors
   const cors = require('cors')

   

  //using express create server app
  const app = express()

  //use cors to specify orgin 
  app.use(cors({
    origin:'http://localhost:4200'
   }))

  //to parse json data
  app.use(express.json())

  //application middleware
  const appMiddleware = (req,res,next)=>{
    console.log('Inside Application Mjddleware');
    next
  }
  //app.use(appMiddleware)


  

  //http
  //get - to fetch/read data from server
  app.get('/',(req,res)=>{
    res.send('GET METHOD')
  }) 

  //post - server create 
  app.post('/',(req,res)=>{
    res.send('post METHOD')
}) 

//put - modify
app.put('/',(req,res)=>{
  res.send('put METHOD')
}) 

//patch - partially modify
app.patch('/',(req,res)=>{
  res.send('patch METHOD')
}) 

//delete - delete
app.delete('/',(req,res)=>{
  res.send('delete METHOD')
}) 
//http error
//1xx - information
//2xx - success
//3xx - redirection
//4xx - client error
//5xx - server error
//bank app

//routers specific middleware
const jwtMiddleware =(req,res,next)=>{
console.log('Inside jwtMiddleware');
  //to fetch token
  const  token = req.headers['x-access-token']
  //verify token - verify()
  try{
    const data = jwt.verify(token,'supersecretkey12345')
    console.log(data);
    next()
  }
  catch{
    res.status(404).json({
      statusCode:404,
      status:true,
      message:'Please Log In'
    })
  }
 
}

//register API
app.post('/register',(req,res)=>{
  console.log(req.body);
   dataservice.register( req.body.username,req.body.acno, req.body.password)
  .then(result=>{ res.status(result.statusCode).json(result)})
 

})

//login API
 app.post('/login',(req,res)=>{
  console.log(req.body);
   dataservice.login(req.body.acno,req.body.pswd)
   .then(result=>{ res.status(result.statusCode).json(result)})
 })

//deposit API
 app.post('/deposit',jwtMiddleware,(req,res)=>{
   console.log(req.body);
    dataservice.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{ res.status(result.statusCode).json(result)})
 })

 //withdraw api
 app.post('/withdraw',jwtMiddleware,(req,res)=>{
   console.log(req.body);
   dataservice.withdraw(req.body.acno,req.body.pswd,req.body.amt)
   .then(result=>{ res.status(result.statusCode).json(result)})
 })
 //transaction api
 app.post('/transaction',jwtMiddleware,(req,res)=>{
  console.log(req.body);
  dataservice.gettransaction(req.body.acno)
  .then(result=>{ res.status(result.statusCode).json(result)})
})

//deleteAcc api
app.delete('/deleteAcc/:acno',(req,res)=>{
  dataservice.deleteAcc(req.params.acno)
  .then(result=>{
    res.status(result.statusCode).json(result)
  })
})


  //set port number 
  app.listen(3000,()=>{
    console.log('server started at 3001');
  }) 