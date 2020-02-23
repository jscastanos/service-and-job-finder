app.controller('navbar', ['$scope', '$http', '$interval', '$timeout', '$rootScope', function (s, h, _i, _t, _r) {
    s.loadingMessages = false;
    s.messages = [];
    s.openedMessages = {};

    $('.open-small-chat').click(function () {
        $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
        $('.small-chat-box').toggleClass('active');
    });

    //s.messages = [
    //    { id: 1, name: 'Jec Castanos', msg: 'This is a sample message from Jec' },
    //    { id: 2, name: 'Jay Pagal', msg: 'This is a sample message from Jec' },
    //    { id: 3, name: 'Joe Durban', msg: 'This is a sample message from Jec' },
    //    { id: 4, name: 'Derk Aguilar', msg: 'This is a sample message from Jec' },
    //    { id: 5, name: 'Rey Pineda', msg: 'This is a sample message from Jec' },
    //    { id: 6, name: 'Z Guisehan', msg: 'This is a sample message from Jec' },
    //    { id: 7, name: 'Chan Penalosa', msg: 'This is a sample message from Jec' },
    //    { id: 8, name: 'Tanz Techcare', msg: 'This is a sample message from Jec' },
    //];
    
    myHub.client.newMessage = function(message){
        s.loadUserMessages();
        if (!s.openedMessages.hasOwnProperty(message.SenderId)){
            return;
        }
        s.openedMessages[message.SenderId].messages.push(message);
        s.$apply();
    }
    myHub.client.newOwnMessage = function(message){
        if (!s.openedMessages.hasOwnProperty(message.RecipientId)){
            return;
        }
        s.openedMessages[message.RecipientId].messages.push(message);
        s.$apply();
    }

    s.messageTimeElapsed = function(datetime){
        return (moment(datetime).fromNow()).toString().replace('a few seconds ago','Just now').replace(' ago','').replace('a ','1 ').replace('an ','1 ');
    }
   
    s.getMessageBadge = function () {
        var unSeen = s.messages.filter(f => !f.Seen && f.SenderId != $('#userID').val());
        console.log('--------')
        console.log(s.messages)
        console.log(unSeen)
        console.log('--------')
        return unSeen.length;
    }
    _r.sendMessage = function (obj) {
        var newObj = {
            friendID: obj.UserId,
            friendName: obj.Name
        }
        s.openMessage(newObj)
    }
    s.openMessage = function (obj) {
        console.log(obj)
        obj.Seen = true;
        s.activeChatObj = obj;
        s.messageSeen()
        if (!s.openedMessages.hasOwnProperty(obj.friendID)) {
            s.openedMessages[obj.friendID] = {};
            s.openedMessages[obj.friendID].info = obj
            s.openedMessages[obj.friendID].messages = []
            loadPersonalMessage(obj)
        }
        scrollToBottom()
    }
    s.messageSeen = function(){
        h.post('../api/message/messageseen/'+$('#userID').val()+'/'+s.activeChatObj.friendID).then(function(d){
            s.loadUserMessages()
        })
    }
    s.sendMessage = function(){
        var newMessage = {
            SenderId: $('#userID').val(),
            RecipientId: s.activeChatObj.friendID,
            Message: s.newMessage
        }
        h.post('../api/message/savemessage', newMessage).then(function(d){
            if(d.data.stat == 1){
                s.newMessage = null
                myHub.server.newMessage(d.data.message);
            }
        })
    }
    s.keypress = function (e) {
        if (e.keyCode == 13 && !event.shiftKey) {
            e.preventDefault();
            if (!s.newMessage || s.newMessage == "") {
                return;
            }
            s.sendMessage();
            return false;
        }
    }


    function loadPersonalMessage(obj){
        h.post('../api/message/personalMessages/'+ $('#userID').val() +'/' + obj.friendID).then(function(d){
            if (s.openedMessages.hasOwnProperty(obj.friendID)) {
                s.openedMessages[obj.friendID].messages = s.openedMessages[obj.friendID].messages.concat(d.data);
            }
            
        })
    }
    s.chatBoxFocused = function(){
        s.messageSeen()
    }
    s.openChatBox = function (obj) {
        if (s.activeChatObj.friendID == obj.friendID) {
            $('.small-chat-box').toggleClass('active')
            return
        }
        s.activeChatObj = obj;
        scrollToBottom()
    }

    s.closeMessageAvatar = function (id) {
        if (s.activeChatObj && s.activeChatObj.friendID == id) {
            $('.small-chat-box').removeClass('active')
        }
        if (s.openedMessages.hasOwnProperty(id)) {
            delete s.openedMessages[id]
        }
    }
    s.hideChatBox = function(){
        $('.small-chat-box').removeClass('active')
    }

    s.loadUserMessages = function(){
        s.loadingMessages = true;
        h.post('../api/message/usermessage/'+ $('#userID').val()).then(function(d){
            s.messages = d.data;
            s.loadingMessages = false;
            
        })
    }
    function scrollToBottom() {
        $('.small-chat-box').removeClass('active')
        $('.small-chat-box').addClass('active')
        $('#chat-input').focus()
    }
    s.loadUserMessages();
}]);

app.directive('scrollToBottom', function($timeout, $window) {
    return {
        scope: {
            scrollToBottom: "="
        },
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.$watchCollection('scrollToBottom', function(newVal) {
                if (newVal) {
                    $timeout(function() {
                        element[0].scrollTop =  element[0].scrollHeight;
                    }, 0);
                }

            });
        }
    };
});