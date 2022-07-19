const express=require('express');
const app=express();
const port=80;
const path=require('path');
const fs=require('fs');
const bodyparser=require('body-parser')

//mongoose
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contact');
}

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    mytext: String

  });

  const contactmodel = mongoose.model('contact', contactSchema);

  const contact = new contactmodel({ name: 'Silence' });

//serving static files
app.use('/static',express.static('static'));
app.use(express.urlencoded());

//set template as pug
app.set('view engine','pug');
//set views directory
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    res.status(200).render('home.pug')//you can also send title also optional
})                         //home.pug is in views folder


app.get('/contact',(req,res)=>{
    param={    };
    res.status(200).render('contact',param);
})
app.get('/home',(req,res)=>{
    param={    };
    res.status(200).render('home',param);
})

app.post('/contact',(req,res)=>{

    var data=new contactmodel(req.body);
    data.save().then(()=>{
        console.log("saved to database")
    }).catch(()=>{
        res.status(404).send("couldnt save to database");
    })
    console.log(req.body)//to get entered info in console
    let name=req.body.name;
    let email=req.body.email;
    let phno=req.body.phno;
    let area=req.body.mytext;   //required parameters body . " this is same as name in form"
    //let weight=req.body.weight;
    //let goal=req.body.goal;

    let output=`details of ${name} :- ${email}  ${phno} text:- ${area}\n`
    fs.appendFileSync('formdata.txt', output),

    res.status(200).render('aftercontact.pug')//index.pug is also same as home.pug 
})



app.listen(port, ()=>{
    console.log(`the spplication started succesfully on port ${port}`);
})

