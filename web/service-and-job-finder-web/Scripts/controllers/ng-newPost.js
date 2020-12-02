app.controller('newPost', ['$scope', '$http', function (s, h) {
    loadJobTitles();



    function loadJobTitles() {
        h.post('../api/feed/jobtitle/' + $('#entityID').val()).then(function (d) {
            s.jobTitles = d.data;
        })
    }

    s.getFiles = function (files) {
        s.file = files[0]
        if (!s.file.type.includes('image')) {
            swal({
                title: "File type not allowed.",
                text: "Please select an image file.",
                type: 'warning'
            });
            return
        } else if ((s.file.size / 1048576) >= 2) {
            swal({
                title: "File too large.",
                text: "Please an image with file size that is less than 2Mb.",
                type: 'warning'
            });
            return
        }
        var reader = new FileReader();

        reader.onload = function (e) {
            s.imgSrc = e.target.result
            s.$apply()
        }
        reader.readAsDataURL(s.file);
    }
    s.removeAttachment = function () {
        $('input[type=file]').val('')
        s.file = null;
        s.imgSrc = null;
    }
    s.savePost = function () {
        s.post.UserId = $('#userID').val();
        var formdata = new FormData();


        if (s.file) {
            formdata.append('file', s.file);
        }

        angular.forEach(s.post, function (v, k) {
            formdata.append(k, v);
        })

        var request = {
            method: 'POST',
            url: '../jobs/newPost',
            data: formdata,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }
        h(request).then(function (d) {
            if (d.data == 1) {
                $('input[type=file]').val('')
                s.file = null;
                s.post.Title = null;
                s.post.Description = null;
                s.post.JobId = null;
                s.imgSrc = null
                $('#newPostModal').modal('hide');
            } else {
                alert('Something went wrong please try refreshing the page.')
            }
        })

    }
}])