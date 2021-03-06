(function(){
    var Starred = function(element, options){
        this.$element = $(element);
        this.options  = options;

        this.repos = [];
        this.template = null;

        this.$element.on('starred.repos-updated', $.proxy(this, 'render'));
        this.init();
    };

    Starred.DEFAULTS = {
        user: 'rhiros',
        template: null
    };

    Starred.prototype.init = function() {
        if (!this.options.template) {
            throw new Error("data-template must be defined as an attribute with the css selector for the template");
        }
        this.template = $(this.options.template).html();
        Mustache.parse(this.template);   // optional, speeds up future uses
        this.fetch();
    };

    Starred.prototype.updateUser = function(newUser) {
        if (this.options.user == newUser) return;
        this.options.user = newUser;
        this.fetch();
    };

    Starred.prototype.fetch = function() {
        var access_token = Cookies.get('access_token') || '';
        if (access_token) {
            access_token = '?access_token='+access_token;
        }

        $.get('https://api.github.com/users/'+this.options.user+'/starred'+access_token, $.proxy(this, 'fetchEnded'))
            .fail($.proxy(this, 'fetchFailed'));
    };

    Starred.prototype.fetchFailed = function(data, status){
        if (data.status == 403 || data.status == 401) {
            Cookies.remove('access_token');
            $('#login-modal').openModal();
        }
        if (data.status == 404) {
            Materialize.toast('Username '+this.options.user+' does not exist.', 4000, 'red');
        }
    };

    Starred.prototype.fetchEnded = function(data, status){
        for (var i=0; i<data.length; i++) {
            if (data[i].language) {
                data[i].languageIcon = data[i].language.toLowerCase().replace(/\+/g,'plus');
                data[i].languageIcon = data[i].languageIcon.replace(/\#/g,'sharp');
                data[i].languageIcon = (data[i].languageIcon == 'html') ? 'html5' : data[i].languageIcon;
            }

            data[i].created_at = $.format.date(data[i].created_at, "dd/MM/yyyy HH:mm");
            data[i].pushed_at = $.format.date(data[i].pushed_at, "dd/MM/yyyy HH:mm");

        }
        this.repos = data;
        this.$element.trigger('starred.repos-updated');
        Materialize.toast('Starred repos loaded!', 4000, 'green');
    };

    Starred.prototype.render = function() {
        var rendered ="";

        for (var i=0; i<this.repos.length; i++) {
            rendered += Mustache.render(this.template, this.repos[i]);
        }

        this.$element.html(rendered);
    };

    Starred.prototype.reorder = function(orderCriteria) {
        this.repos.sort(function(a, b){
            if (typeof a[orderCriteria] == 'string') {
                return a[orderCriteria].toLowerCase().localeCompare(b[orderCriteria].toLowerCase());
            }
            if (a[orderCriteria] < b[orderCriteria]) return -1;
            if (a[orderCriteria] > b[orderCriteria]) return 1;
            return 0;
        })

        this.$element.trigger('starred.repos-updated');
    };

    Starred.prototype.filter = function(filterCriteria) {
        this.repos = this.repos.map(function(obj){
            obj.filtered = (!obj.language || obj.language.toLowerCase().indexOf(filterCriteria.toLowerCase()) < 0);
            return obj;
        })

        this.$element.trigger('starred.repos-updated');
    };

    $.fn.starred = function(option, args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('starred');
            var options = $.extend({}, Starred.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('starred', (data = new Starred(this, options)));

            if (typeof option == 'string') data[option](args);
        });
    };
})()
