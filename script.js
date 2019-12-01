$(document).ready(function () {
    socket  = io('http://91.177.24.77:3007');
  chatlog = "";
  username = "Anonymous";
  id = "";
  
  typing = false;

  $('input[name=send]').on('click', function () {
    sendMessage();
  })

  $('input[name=join]').on('click', function () {
    username = $("input[name=username]").val();
    socket.emit("joined", {username: username});
    if(username !== ""){
      $('#loginScreen').hide();
    }
  })

  socket.on('message', function (data) { //recieve message
    playSound("message");
    addMessage(data.message, data.username, false);
  })

  socket.on("id", function (data) {
    id = data;
  })

  socket.on("chatLog", function (data) {
    data.forEach(function (element) {
      if(element.id == id){
        addMessage(element.message, element.username, true);
      } else {
        addMessage(element.message, element.username, false);
      }
    })
  })


  function addMessage(message, username, me) {
    if(me){
      chatlog += `<div class='message me'><div class='innerMessage'><p><b>${username}</b>: ${message}</p></div></div>`;
    } else {
      chatlog += `<div class='message'><div class='innerMessage'><p><b>${username}</b>: ${message}</p></div></div>`;
    }
    $("#mainChat").html(chatlog);
    $('#mainChat').scrollTop($('#mainChat')[0].scrollHeight); //scroll down when new message appears
  }

  function playSound(sound) {
    var audio = new Audio(`https://elitfox.be/sololearn/projects/chat/audio/${sound}.mp3`);
    audio.play();
  }

    $('input[name=message]').on('keydown', function (e) {
    switch(e.keyCode){
      case 13:
      sendMessage();
      break;
    }
  })


  function sendMessage() {
    message = $("input[name=message]").val();
    $("input[name=message]").val("");
    $("input[name=message]").focus();

    addMessage(message, username, true);
    if(message !== ""){
      socket.emit("message", {username: username, message: message}); //send message
    }
  }

  $('input[name=message]').on('keydown', function () {
    socket.emit("typing");
  })

  socket.on('typing', function () {
    if(typing == false){
      $("#mainChat").html($("#mainChat").html() + "<div class='message' id='typing'><div class='innerMessage'><p>Someone is typing a message ...</p></div></div>");
      typing = true;
      $('#mainChat').scrollTop($('#mainChat')[0].scrollHeight); //scroll down when new message appears
    }

  })

  setInterval(function () {
    typing = false;
    $('#typing').remove();
  },5000)

});
