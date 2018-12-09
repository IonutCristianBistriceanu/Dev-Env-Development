//Page main script
//----------------------AJAX Api calls-----------------------------------//


$('#register-user-form').submit((e) => {
    e.preventDefault();
    var data = ConvertFormToJSON($("#register-user-form"))

    $.ajax({
        url: "http://localhost:3000/register",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            if (data) {
                swal("You have succesfully registered!", "You will be redirected to the login page!", "success").then(() => {
                    window.location.replace("http://localhost:3000/");
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
    var url = "http://localhost:3000";
    $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, textStatus, request) {
            window.location.replace(url + '/me');
        },
        error: function (e) {
            console.log(e);
        }
    });
})





//----------------------AJAX Api calls end-----------------------------------//