function submitBannerCredentials() {
    var data = $('#loginForm').serializeArray();
    $('.loader').css('display', 'block');
    $('.disclaimer').css('display', 'block');
    $.ajax({
        url: "/submit",
        type: "post",
        data: data,
        success: function(result) {
            window.classes = result;
            if (result.length === 1) {
                $('.resultMeta').html(`${result.length} class was found for ${document.getElementById("username").value}`);
            } else {
                $('.resultMeta').html(`${result.length} classes were found for ${document.getElementById("username").value}`);
            }
            $('.results').html(`${JSON.stringify(result, undefined, 2)}`);
            $('#loginForm')[0].reset();
            $('.readout').css('display', 'initial');
            $('.google').css('display', 'block');
            $('.loader').css('display', 'none');
            $('.disclaimer').css('display', 'none');
        },
        error: function(result) {
            $('.results').html(`Something went wrong.. sorry 😭:${JSON.stringify(result, undefined, 2)}`);
            $('.loader').css('display', 'none');
            $('.disclaimer').css('display', 'none');
        }
    });
    return false;
}
