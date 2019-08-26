function submitBannerCredentials() {
    var data = $('#loginForm').serializeArray();
    $('.loading').css('display', 'block');
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
            $('.resultMeta').css('display', 'block');
            $('.google').css('display', 'block');
            $('.loading').css('display', 'none');
            $('.submit-btn').attr('disabled', false);
        },
        error: function(result) {
            $('.results').html(`Something went wrong.. sorry 😭:${JSON.stringify(result, undefined, 2)}`);
            $('.readout').css('display', 'initial');
            $('.loading').css('display', 'none');
            $('.submit-btn').attr('disabled', false);
        }
    });
    return false;
}
