const socket = io('/')
const video_sender = document.querySelector('.video-container-sender')
// const video_reciever= document.querySelector('.video-container-receiver')
const myPeer = new Peer()
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    console.log("sanyam")
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    setTimeout(connectToNewUser,1000,userId,stream)
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  console.log(video);
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.classList.add("video");
  video_sender.append(video)
}




let chatinput = document.getElementById("chat-input");
let chatwindow = document.querySelector(".chat-area");

chatinput.addEventListener("keypress",function(e){
if(e.key=="Enter"&& chatinput.value){
    let chatDiv = document.createElement("div");
    chatDiv.classList.add("chats");
    chatDiv.classList.add("right");
    chatDiv.textContent = chatinput.value;
    chatwindow.append(chatDiv);
    socket.emit("chat" , {chat:chatinput.value})
    chatinput.value="";
}
})

socket.on("chatLeft" , function(chatObj){
  let chatDiv = document.createElement("div");
  chatDiv.classList.add("chats");
  chatDiv.classList.add("left");
  chatDiv.textContent = chatObj.chat;
  chatwindow.append(chatDiv);
})