$(document).ready(function(){
    $.get('https://api.github.com/users/rhiros/starred', function(data){
        var template = $('#card-template').html();
        Mustache.parse(template);   // optional, speeds up future uses

        var rendered ="";
        for (var i=0; i<data.length; i++) {
            data[i].language = data[i].language.toLowerCase().replace(/\+/g,'plus');
            data[i].language = data[i].language.replace(/\#/g,'sharp');
            data[i].language = (data[i].language == 'html') ? 'html5' : data[i].language;
            rendered += Mustache.render(template, data[i]);
        }
        $('#starred-repos').html(rendered);
    });
})

function loadUser() {
}