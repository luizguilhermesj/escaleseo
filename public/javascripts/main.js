$(document).ready(function(){
    $('#starred-cards').starred();
    $('#order-by').on('change', function(e){
        $('#starred-cards').starred('reorder', this.value);
    })
    $('#filter-by').on('keyup', function(e){
        console.log(this.value);
        $('#starred-cards').starred('filter', this.value);
    })
    $('select').material_select();
})

function loadUser() {
}