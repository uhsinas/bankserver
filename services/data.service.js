//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import db.js
const db =require('./db')

//database
database={
    1000:{acno:1000,username:'Neer',password:1000,balance:5000 ,transaction:[]},
    1001:{acno:1001,username:'Laisha',password:1001,balance:5000 ,transaction:[]},
    1002:{acno:1002,username:'Vyom',password:1002,balance:5000 ,transaction:[]}
     }

    //register
  const register=(username,acno,password)=>{
    //asynchronous
return db.User.findOne({
  acno
}).then(result=>{
  if(result){
    return {
      statusCode:404,
      status:false,
      message:'User already exist!! Please Log in'
  }
}

else{
  const newUser = new db.User({
    acno,
    username,
    password,
    balance:0,
    transaction:[]
  })



  newUser.save()
  return {
    
    statusCode:200,
    status:true,
    message:'Register successfully'
  }
}

})


  }
  









       
      
      //login API
const login=(acno,pswd) =>{

  //search acno,pswd in mongodb
    return db.User.findOne({
      acno,
      password:pswd

    }).then(result=>{
      if(result){
        currentuser = result.username
        currentacno = acno
        
        //token generation - sign()
        const token = jwt.sign({
         currentacno:acno
        },'supersecretkey12345')
        return{
          statusCode:200,
          status:true,
          message:'Login successfully',
          currentuser,
          currentacno,
          token
       }
    }
    else{
      return{
        statusCode:404,
        status:false,
        message:'incorrect account number/password'
   }
    }
      })
    }
 

//deposite
 const deposit = (acno, pswd,amt)=> {
 const amount = parseInt(amt)
 //search acno,pswd in mongodb
 return db.User.findOne({
  acno,
  password:pswd
 }).then(result=>{
  if(result){
    result.balance+=amount
    result.transaction.push({
      type:'credit',
      amount
})
result.save()
    return {
      statusCode:200,
      status:true,
      message:`${amount} depositted successfully and new balance is ${result.balance}`
    }
   }
  else{
    return{
    statusCode:404,
    status:false,
    message:'incorrect account number/password'
}}
  

 })
  
 }

//withdraw
 const withdraw=(acno, pswd,amt)=> {
 const amount = parseInt(amt)
 //asynchronous
 return db.User.findOne({
  acno,
  password:pswd
  
 }).then(result=>{
  if(result){
    if(result.balance>amount){
      result.balance-=amount
      result.transaction.push({
        type:'debit',
        amount
    })
  
result.save()
  return  {
    statusCode:200,
    status:true,
    message:`${amount} debitted successfully and new balance is ${result.balance}`
  }
}
 else{
  return{
    statusCode:404,
    status:false,
    message:'incorrect account number/password'
}

 }
  }


 })
}
 

 //transaction
 const gettransaction = (acno) =>{
  return db.User.findOne({
    acno
  }).then(result=>{
    if(result){
      return {
        statusCode:200,
        status:true,
        transaction:result.transaction
      }
    }
    else{
      return{
        statusCode:404,
        status:false,
        message:'User does not exist'
        }
  
    }
  }

  )
}
  //delete 
  const deleteAcc=(acno=>{
    return db.User.deleteOne({
      acno
    }).then(result=>{
      if(result){
        return{
          statusCode:200,
        status:true,
        message:"Account deleted successfully"

        }
      }
      else{
        return{
          statusCode:404,
          status:false,
          message:'User does not exist'
          }
      }
    })
  })

    
 module.exports = {
  register,
   login,
   deposit, 
   withdraw,
   gettransaction,
   deleteAcc
 }
