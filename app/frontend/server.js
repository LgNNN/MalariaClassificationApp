const express = require('express');
const app = express();
const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.set('view engine','ejs'); 
app.use(express.json());
app.use(express.static('public'));
 

app.get('/land',(req,res)=>{ res.render('main/index'); });
app.get('/',(req,res)=>{ res.render('home', { backendUrl: BACKEND_URL }); });
app.get('/about',(req,res)=>{ res.render('about'); });
app.get('*', (req,res)=> res.render('home', { backendUrl: BACKEND_URL }));
app.listen(PORT,()=>console.log('Server listening on port : '+ PORT));
