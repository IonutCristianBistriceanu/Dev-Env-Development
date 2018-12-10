//Page main script
var url = 'http://localhost:3000'

//----------------------AJAX Api calls-----------------------------------//


$('#register-user-form').submit((e) => {
    e.preventDefault();
    var data = ConvertFormToJSON($("#register-user-form"))

    $.ajax({
        url: url + "/register",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            if (data) {
                swal("You have succesfully registered!", "You will be redirected to the login page!", "success").then(() => {
                    window.location.replace(url);
                });
            }
        },
        error: function (e) {
            if (e.responseJSON.code == 11000) {
                swal("Email is already in use", "Please try again with a different email.", "error");
            } else {
                swal("Something went wrong!", "Please try again.", "error");
            }
        }
    });
});


$('#login-form').submit((e) => {

    e.preventDefault();
    var data = ConvertFormToJSON($("#login-form"));

    $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            window.location.replace(url + '/main');
        },
        error: function (e) {
            if (e.status == 400) {
                $.notify("Wrong username/password combination", "error");
            }
        }
    });
})

$('#logout-btn').on('click', (e) => {

    $.ajax({
        url: url + '/main/logout',
        type: "DELETE",
        success: function () {
            window.location.replace(url);
        },
        error: function (e) {
            //Do something
        }
    });
});



//----------------------AJAX Api calls end-----------------------------------//