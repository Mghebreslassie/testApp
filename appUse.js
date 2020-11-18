const express = require('express')
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const { allowedNodeEnvironmentFlags } = require('process');

app.use(helmet())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname + '/views'))
app.use((req, res, next) =>{
    if (req.query.msg == 'fail') {
        res.locals.msg = "Sorry this username and password combination does not exist"
    } else {
        res.locals.msg = "";
    }
    next()
})

app.get('/', (req, res, nex)=>{
    res.send('sanity check');
})

app.get('/login', (req, res, next)=>{
    // console.log(req.query)
    res.render('login')
})

app.post('/process_login', (req,res,next)=>{
    const password = req.body.password;
    const username = req.body.username;
    if (password === 'x') {
        res.cookie('username', username)
        res.redirect('/welcome')
    } else {
        res.redirect('/login?msg=fail&test=hello')
    }
})

app.get('/welcome', (req, res, next)=>{
    res.render('welcome',{
        username: req.cookies.username
    })
})

app.get('/logout', (req, res, next)=>{
    res.clearCookie('username');
    res.redirect('login');
})

app.listen(3000)
console.log('listening on port 3000')