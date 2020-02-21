app.controller('navbar', ['$scope', '$http', function (s, h) {
    $('.open-small-chat').click(function () {
        $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
        $('.small-chat-box').toggleClass('active');
    });

    s.messages = [
        { id: 1, name: 'Jec Castanos', msg: 'This is a sample message from Jec' },
        { id: 2, name: 'Jay Pagal', msg: 'This is a sample message from Jec' },
        { id: 3, name: 'Joe Durban', msg: 'This is a sample message from Jec' },
        { id: 4, name: 'Derk Aguilar', msg: 'This is a sample message from Jec' },
        { id: 5, name: 'Rey Pineda', msg: 'This is a sample message from Jec' },
        { id: 6, name: 'Z Guisehan', msg: 'This is a sample message from Jec' },
        { id: 7, name: 'Chan Penalosa', msg: 'This is a sample message from Jec' },
        { id: 8, name: 'Tanz Techcare', msg: 'This is a sample message from Jec' },
    ]
}]);