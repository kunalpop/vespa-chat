
require('./model/db')
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')
const express = require('express')
const path = require('path')
const homeRouter = require('./routes/home')
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const messengerRouter = require('./routes/message')
const shareLinkRouter = require('./routes/share-profile-link')
const profileRouter = require('./routes/profile')
const removeRouter = require('./routes/remove')
const checkoutRouter = require('./routes/checkout')
const session = require('express-session')
const app = express()
const server = require('http').createServer(app)
const cookieParser = require('cookie-parser')
const datetime = require('node-datetime')
const mongoosePaginate = require('mongoose-paginate')
const mongoose = require('mongoose')
const paginate = require('express-paginate')
var flash = require('connect-flash')
var Chat = mongoose.model('Chat')
const uuid = require('uuid')

global.limChat = 2

const PORT = process.env.PORT || 5000
const DOMAIN = `http://localhost:${PORT}/`
//Serve static files
//app.use('/static',express.static(__dirname + '/public'))
app.use('/static',express.static(__dirname + '/views'))

//Template engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'pug')

var sessionMiddleware = session({
    secret:'secretVespa123',
    resave:true,
    saveUninitialized:true,
    cookie: {maxAge: 15 * 60 * 1000}
})

//Body parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(paginate.middleware(10, 50));
app.use(flash())
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.json())

//Setting up the server
server.listen(PORT,() => {
    console.log(`listening on port ${PORT}`)
})

//routes
app.use('/',homeRouter)
app.use('/home',homeRouter)
app.use('/signup',signupRouter)
app.use('/login',loginRouter)
app.use('/message',messengerRouter)
app.use('/share-profile-link',shareLinkRouter)
app.use('/profile',profileRouter)
app.use('/remove',removeRouter)
app.use('/checkout',checkoutRouter)

//Logout
app.get('/logout',(req,res,next) => {
    if(req.session.user){
        console.log(`Logged out: ${req.session.user.username}`)
        req.session.room = null
        req.session.destroy((err) => {
            res.redirect('/') 
        })
    }
})

//checkout
app.post('/create-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Stubborn Attachments',
              images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}success.html`,
      cancel_url: `${DOMAIN}cancel.html`
    })
  
    res.json({ id: session.id });
  })

//*******Start Socket Server*******
const io = require('socket.io')(server)
var users = {}
var numClients = {}
global.clients = {}
global.roomID = Math.round(Math.random()*1000)
global.rooms = []

io.on('connection', (socket) => {

    socket.on('user-connect', ({room,name}) => {

        if(clients[room]==undefined){
            clients[room] = [name]
            socket.join(room)
            socket.room = room
            rooms.push(room)
            //times.push(datetime.create().format('n D Y I:M p'))
            numClients[room] = 1 
            users[socket.id] = name
            console.log("User: "+name+", joined in room: "+room)
        }else{
            if(clients[room].indexOf(name) == -1){
                clients[room].push(name)
                socket.join(room)
                socket.room = room
                numClients[room] = numClients[room] + 1
                users[socket.id] = name
                console.log("User: "+name+", joined in room: "+room)
            }
        }

        console.log("Number of users in the "+socket.room+" : "+numClients[room])

        socket.to(room).emit('user-connected', `${name}`)
    })

    socket.on('send-to-server', (msg) => {
        var chat = new Chat()
        chat.room = msg.room
        chat.sender = msg.user
        chat.receiver = clients[chat.room].filter(client => client!=chat.sender)[0]       
        chat.timestamp = datetime.create().format('n D Y I:M p')
        chat.message = msg.chat
        console.log(chat)
        chat.save((err,doc) => {
          if (err) return console.log(err)
        })
        socket.to(msg.room).emit('send-to-client', {user: users[socket.id],message: msg.chat})
    })

    socket.on('send-page', (info) => {
        Chat.paginate({$or: [{sender: info.name},{receiver: info.name}]}, { page: info.page, limit: limChat }, function(err, posts) {
            io.in(info.room).emit('client-data', {user: info.name, chats: posts.docs})
        })
        console.log("Scroll page: "+info.page)
    })

    socket.on('disconnect', () => {
        numClients[socket.room] = numClients[socket.room] - 1;
        console.log("User: "+users[socket.id]+", left room: "+socket.room)
        console.log("Number of users in the "+socket.room+": "+numClients[socket.room])
        socket.to(socket.room).emit('user-disconnected', `${users[socket.id]}`)
        clients[socket.room] = clients[socket.room].filter(client => client!=users[socket.id])
        delete users[socket.id]
        if(numClients[socket.room]==0){
            rooms = rooms.filter(rm => rm !== socket.room)
            delete socket.room
        }
    })

})



module.exports = app