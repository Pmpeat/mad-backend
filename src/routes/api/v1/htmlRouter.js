const router = require('express').Router();
const express = require("express");
const path = require("path");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * /api/v1/view/register
 * */
router.get('/register',(req,res)=>{
  res.render('register')
})


/**
 * /api/v1/view/request-vacation
 * */
router.get('/request-vacation',(req,res)=>{
  res.render('requestVacation')
  
})

module.exports = router;
