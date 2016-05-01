$(document).ready(function(){
    $('#starred-cards').starred();
    $('#order-by').on('change', function(e){
        $('#starred-cards').starred('reorder', this.value);
    })
    $('select').material_select();
})

function loadUser() {
}