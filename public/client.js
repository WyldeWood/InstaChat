var socket = io.connect();
window.addEventListener('load', function(){//when window loads run this
    $("#ChatPage").hide();//hide chat page initially
    $("#NamePage").show();
    document.getElementById("NameButton").addEventListener("click",function(){//when next button is clicked
        var nickname = $('#messageField').val(); //gets nickname from box and gives it to nickname
        var roomName = metaSelector("roomName");
        socket.emit('join', roomName, nickname, function(Messages){
            for (i in Messages){
                $("#MessageBox").append("<li> " + Messages[i].nickname + ": " + Messages[i].body + "</li>");
            }
        });//submit join event with nickname roomname and message return function  
    });
    $('#NameButton').click(function(){
        changeNickName();
        $("#NamePage").hide();
        $("#ChatPage").show();// flips chat and name page visibility
    });
    $('#ChangeNameButton').click(function(){
        $("#NamePage").show();
        $("#ChatPage").hide();// flips chat and name page visibility
    });    
    //waiting for events
    socket.on("ChangeMembership", function(members){ //updates members list on page with new list
        $( ".members" ).remove();
        for (var i = 0; i < members.length; i++){//goes through and gets each member
            $("#MembersList").append("<li class=members> " + members[i] + "</li>");//puts members into member list
        }
    });
    socket.on("server message update", function(nickname, Message){ // puts a
            $("#MessageBox").append("<li> " + nickname + ": " + Message+ "</li>");
    });
    socket.on('getRoomName',function(){
        var roomName = metaSelector("roomName");
        socket.emit('returnRoomName', roomName);
        
        
        
    });
});


function callback(Messages){
    socket.emit('server message update', Messages);//get messages from server and send them back to client
}
function changeNickName(){//change nickname
    var nickname = $('#messageField').val(); //gets nickname from box and gives it to nickname
    var roomName = metaSelector("roomName");
    socket.emit('nicknameChange', roomName, nickname);//submit join event with nickname roomname and message return function  
}
function metaSelector(thingID){
    var tag = document.querySelector('meta[name='+ thingID +']');
    if (tag != null)
        return tag.content;
    return '';//get meta tags
}
function sendMessage(){
    var message = $('#messagefield').val();
    var nickname = $('#messageField').val();
    socket.emit('chat message', nickname, message);
    $('#messagefield').val("");//send messages
};
