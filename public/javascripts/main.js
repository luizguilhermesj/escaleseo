$(document).ready(function(){
    $('#starred-cards').starred();

    $('#order-by').on('change', function(e){
        $('#starred-cards').starred('reorder', this.value);
    });

    $('#filter-by').on('keyup', function(e){
        $('#starred-cards').starred('filter', this.value);
    });

    $('[data-starred-user]').on('blur', function(e){
        $('#starred-cards').starred('updateUser', this.value);
    });

    $('[data-starred-user]').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $(this).blur();
            return false;
        }
    });

    var initialWidth;
    $('[data-starred-user]').on('keyup', function (e) {
        var actual = $(this).width(), newWidth;
        if (!initialWidth) {
            initialWidth = actual;
        }

        if (this.scrollWidth > initialWidth && this.scrollWidth > actual) {
            newWidth = this.scrollWidth + 20;
            $(this).css("width", newWidth);
        } else if (actual == this.scrollWidth && this.scrollWidth > initialWidth) {
            newWidth = actual - 20;
            $(this).css("width", newWidth);
        }

    });

    $('select').material_select();

    $('.tooltipped').tooltip('show');

    $('[data-starred-user]').focus();
})

function loadUser() {
}