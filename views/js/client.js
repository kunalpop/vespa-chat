const socket = io.connect()
const container  = document.getElementById("chat-window")
var queryObj = document.location.search
const name = queryObj.substring(10,).split('&')[0]
const room = queryObj.substring(10,).split('&')[1]

container.appendChild(document.createElement("br"))
container.appendChild(document.createElement("br"))
container.appendChild(document.createElement("br"))
container.appendChild(document.createElement("br"))
container.appendChild(document.createElement("br"))

//Send name and room to the server
socket.on('connect', function() {
    socket.emit('user-connect',{room,name})
})

//Display user connected on client page
displayMyMessage(`Connected: ${name}`,getTime())

//Display user connected on server page
socket.on('user-connected', (name) =>{
    displayOtherMessage(`User Connected: Anonymous User`,getTime())//${name}
})

//Post message on server page
socket.on('send-to-client', (data) =>{
    displayOtherMessage(`${data.message}`,getTime())//${data.user}
})

socket.on('user-disconnected', (name) =>{
    displayOtherMessage(`User disconnected: Anonymous User`,getTime())//${name}
})

//Send message event. Display message on client page
const messageForm = document.getElementById('send-container')
//Listener for the submit action on client chat
function sendMessage(e){
    let timestamp = Math.round(Date.now() / 1000)
    var datetime = new Date();
    timestamp = timestamp + " " + datetime.toISOString().slice(0,10)
    e.preventDefault()
    const content = document.querySelector('#message-input').value.trim()
    displayMyMessage("You: " + content ,getTime())
    socket.emit('send-to-server',{room: room,user: name,chat: content})
}

//Display messages on the chat page
function displayMyMessage(message,time){
    var div = document.createElement("div") 
    div.style.float = 'right'
    div.style.color = '#000'
    div.style.backgroundColor = '#F4F4F4'
    div.style.alignSelf = 'flex-end'
    div.style.animation.name = 'slideFromRight'
    div.style.padding = '8px'
    div.style.borderRadius = '10px'
    div.style.whiteSpace = 'pre-line'
    div.style.fontSize = "14px"
    var textnode = document.createTextNode(`${message}`)
    div.appendChild(textnode)

    var para = document.createElement("P");
    para.style.textAlign = "right"
    para.style.right = '-61px'
    para.style.bottom = '0'
    para.style.fontSize = "10px"
    var time = document.createTextNode(time);
    para.appendChild(time);
    div.appendChild(para)

    container.appendChild(div)
    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("br"))
    container.scrollTop = container.scrollHeight;
}

function displayOtherMessage(message,time){
    var div = document.createElement("div") 
    div.style.float = 'left'
    div.style.color = '#000'
    div.style.backgroundColor = '#EBEDFF'
    div.style.alignSelf = 'flex-end'
    div.style.animation.name = 'slideFromLeft'
    div.style.padding = '8px'
    div.style.borderRadius = '10px'
    div.style.whiteSpace = 'pre-line'
    div.style.fontSize = "14px"
    var textnode = document.createTextNode(`${message}`)
    div.appendChild(textnode)

    var para = document.createElement("P");
    para.style.textAlign = "right"
    para.style.right = '-61px'
    para.style.bottom = '0'
    para.style.fontSize = "10px"
    var time = document.createTextNode(time);
    para.appendChild(time);
    div.appendChild(para)

    container.appendChild(div)
    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("br"))
    container.scrollTop = container.scrollHeight;
}

function getTime() {
    date = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime.toUpperCase();
}

page = 1
container.onscroll = function(){
    var y = container.scrollTop

    if(y === 0){
        ++page
        //alert(++page)
        socket.emit('send-page',{page,room,name})
    } 
}

//print historical chats
socket.on('client-data', (data) =>{
    var chats = data.chats

    if(chats.length>0 && page==2){
        container.prepend(document.createElement("br"))
        container.prepend(document.createElement("br"))
        container.prepend(document.createElement("br"))
    }

    if(data.user===name){
        for (var i = chats.length - 1; i >= 0; i--) {
            chat = chats[i]
            if(chat.sender===name){
                displayHistMyMessage(chat.message,chat.timestamp)
            }else{
                displayHistOtherMessage(chat.message,chat.timestamp)
            }
        }
    }
})


function displayHistMyMessage(message,time){
    var div = document.createElement("div") 
    div.style.float = 'right'
    div.style.color = '#000'
    div.style.backgroundColor = '#F4F4F4'
    div.style.alignSelf = 'flex-end'
    div.style.animation.name = 'slideFromRight'
    div.style.padding = '8px'
    div.style.borderRadius = '10px'
    div.style.whiteSpace = 'pre-line'
    div.style.fontSize = "14px"
    div.style.alignSelf = "flex-end"
    
    var textnode = document.createTextNode(`${message}`)
    div.appendChild(textnode)

    var para = document.createElement("P");
    para.style.textAlign = "right"
    para.style.right = '-61px'
    para.style.bottom = '0'
    para.style.fontSize = "10px"
    var time = document.createTextNode(time);
    para.appendChild(time);
    div.appendChild(para)

    container.prepend(div)
    container.prepend(document.createElement("br"))
    container.prepend(document.createElement("br"))
    container.prepend(document.createElement("br"))
    container.scrollTop = container.scrollHeight;
}

function displayHistOtherMessage(message,time){
    var div = document.createElement("div") 
    div.style.float = 'left'
    div.style.color = '#000'
    div.style.backgroundColor = '#EBEDFF'
    div.style.alignSelf = 'flex-end'
    div.style.animation.name = 'slideFromLeft'
    div.style.padding = '8px'
    div.style.borderRadius = '10px'
    div.style.whiteSpace = 'pre-line'
    div.style.fontSize = "14px"
    div.style.alignSelf = "flex-end"

    var textnode = document.createTextNode(`${message}`)
    div.appendChild(textnode)

    var para = document.createElement("P");
    para.style.textAlign = "right"
    para.style.right = '-61px'
    para.style.bottom = '0'
    para.style.fontSize = "10px"
    var time = document.createTextNode(time);
    para.appendChild(time);
    div.appendChild(para)

    container.prepend(div)
    container.prepend(document.createElement("br"))
    container.prepend(document.createElement("br"))
    container.prepend(document.createElement("br"))
    container.scrollTop = container.scrollHeight;
}