function submitBannerCredentials() {
    var data = $('#login').serializeArray();
    $('.loader').css('display', 'block');
    $('.disclaimer').css('display', 'block');
    $.ajax({
        url: "/submit",
        type: "post",
        data: data,
        success: function(result) {
            window.classes = result;
            $('.results').html(`${JSON.stringify(result, undefined, 2)}`);
            $('.loader').css('display', 'none');
            $('.disclaimer').css('display', 'none');
        },
        error: function(result) {
            $('.results').html(`<p>Something went wrong.. sorry 😭:</p><p>${JSON.stringify(result)}</p>`);
            $('.loader').css('display', 'none');
            $('.disclaimer').css('display', 'none');
        }
    });
    return false;
}
