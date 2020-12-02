app.controller('post', ['$scope', '$http','$filter', '$interval', '$rootScope', function (s, h, _f, _i, _r) {

    loadJobPost();

    
    myHub.client.newComment = function (message) {
        angular.forEach(s.jobPostFeed, function (v, k) {
            if (v.PostId == message.PostId) {
                v.Comments.push(message);
                s.$apply()
            }
        });

    }
    myHub.client.newPost = function (message) {
        s.jobPostFeed.push(message)
        s.$apply()
    }


    s.saveComment = function (commentObj, data) {
        h.post('../api/feed/newcomment', commentObj).then(function (d) {
            data.newComment = null
        })
    }
    s.keypress = function (e, data) {
        var newComment = {
            PostId: data.PostId,
            Comment: data.newComment,
            UserId: $('#userID').val()
        }
        if (e.keyCode == 13 && !event.shiftKey) {
            e.preventDefault();
            if (!data.newComment || data.newComment == "") {
                return;
            }
            s.saveComment(newComment, data);
            return false;
        }
    }

    s.isApplicationSent = function (applicants) {
        return applicants.includes($('#userID').val())
    }
    s.sendApplication = function (obj) {
        console.log(obj)
        var newApplication = {
            PersonId: $("#userID").val(),
            EntityID: obj.UserId,
            PostId: obj.PostId,
            JobId: obj.JobId
        }
        h.post('../api/feed/sendapplication', newApplication).then(function (d) {
            if (d.data == 1) {
                obj.Applicants.push($("#userID").val())
            }
        })
    }
    
    s.getTimeElapsed = function (datetime) {
        var eventTime = new Date(datetime).getTime();
        var currentTime = new Date().getTime();
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime, 'milliseconds');
        var timeData = duration._data;
        if (timeData.days < -6) {
            return _f('date')(datetime, 'MMM dd, yyyy at hh:mm a')
        } else if (timeData.days < 0) {
            return moment(datetime).calendar()
        } else if (timeData.hours < -12) {
            return moment(datetime).calendar()
        }
        else {
            return (moment(datetime).fromNow()).toString().replace('an', '1').replace('hour', 'hr').replace('a few seconds ago', 'Just now').replace('a minute', '1 min').replace('minute', 'min').replace('ago', '');
        }
       
    }

    function loadJobPost() {
        h.post('../api/feed/jobpost').then(function (d) {
            s.jobPostFeed = d.data;
        })
    }
    _i(function () {
        if (s.jobPostFeed.length > 0) {
            s.jobPostFeed[0].ref = new Date().getTime();
        }
    }, 30000)

    $('.demo1').click(function () {
       
    });
}])