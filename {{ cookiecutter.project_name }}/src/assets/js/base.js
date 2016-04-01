if(!window.App) {
    window.App = {}
}
// holds object instances
window.App.Ins = {}
window.App.PubSub = {}
window.App.Helpers = {}
window.App.Views = {}
window.App.Models = {}


_.extend(window.App.PubSub, Backbone.Events)

App.Helpers = {
        
    ID: 0,
    
    GetID: function() {
        App.Helpers.ID++
        return App.Helpers.ID
    },

    FlashMessage: function(message, alert, selector, autoclose, replace_msg) {
        if(alert == "error") {
            alert = "danger"
        }

        if(replace_msg!==false)
            replace_msg = true

        if(!selector)
            selector = "#Flash_message"

        if( $(selector + ' ul').length === 0 ) {
            $ul = $('<ul/>')
                .attr('class', 'messagelist')
            $(selector)
                .append($ul)
        } else if(replace_msg==true) {
            // Si hi ha un flash message, mel pelo...
            $(selector + ' ul').html("")
        } 
        var id = App.Helpers.GetID()

        $u = $(selector + ' ul')
        $li = $('<li/>')
            .attr('class', 'alert alert-' + alert)
            .attr('id', 'alert'+id)
        
        $span = $('<span/>').html(message)
        $icon = $('<i/>')
            .addClass('ion-close-circled close')
            .on("click", function(){
                $('#alert'+id).remove()
            })
        $li.append($span, $icon)
        $u.append($li)

        if(selector === "#Flash_message")
            window.scrollTo(0,0)

        if(autoclose) {
            setTimeout(function(){
                $(selector + " i").trigger('click') 
            }, autoclose)
        }


    },

    CommError: function() {
        alert("Ha habido un problema cargando datos... inténtalo mas tarde")
    },

    AjaxRequest: function(type, url, data, success, error) {
        var csrf = App.Helpers.GetCookie('csrftoken')
        if(!error) {
            error = App.Helpers.CommError
        }
        App.log("ajax: "+type, data, url)
        return $.ajax({
            data: data,
            url: url,
            type: type,
            headers: {
                "X-CSRFToken": csrf
            },
            success: success,
            error: error
        })
    },

    AjaxPost: function(url, data, success, error) {
        return this.AjaxRequest("POST", url, data, success, error)
    },

    AjaxGet: function(url, data, success, error) {
        return this.AjaxRequest("GET", url, data, success, error)
    },

    AjaxJsonPost: function(url, data, success, error) {
        var csrf = App.Helpers.GetCookie('csrftoken')
        if(!error) {
            error = App.Helpers.CommError
        }
        App.log("ajaxjsonpost", data, url)
        return $.ajax({
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            url: url,
            type: "POST",
            headers: {
                "X-CSRFToken": csrf
            },
            success: success,
            error: error
        })
    },

    ScrollTo: function(selector, inc) {
        if(!inc)
            inc = 0
        $('html, body').animate({
            scrollTop: $(selector).offset().top + inc
        })
    },

    GetAttr: function(el) {
        var d = {}
        $.each(el.data(), function(k,v) {
            d[k]=v
        })
        return d
    },
};

window.App.logs = []
window.App.log = function() {
    try {
        var color = ""
        switch(arguments[0]) {
            case "error":
                color = 'background: #ff0000; color:#fff';
                break;
            case "info":
                color = 'background: #666; color:#fff'
                break;
        }
        if(color !== "") {
            console.log('%c ' + arguments[1] + ' ', color)
            if(arguments.length>2)
                console.log.apply(console, arguments)  
        } else {
            console.log.apply(console, arguments)
        }
    } catch(err) {
        
    }
    App.logs.push(arguments)
}

// Should be called after all backbone items had been
// created..
window.App.init_directives = function() {
    $('[data-bview]').each(function(i, el){
        var view = $(el).data('bview'),
            opts = App.Helpers.GetAttr($(el));

        if(!App.Views[view]) {
            App.log("error", "[data-bview] not found: " + view, opts)
            return
        }
        // if no el element is defined.. try to guess it from id
        if(!opts.el) {
            if(el.id !== "") {
                opts.el = '#'+el.id
            } else {
                // if not, generate one..
                var tid = view + "_" + App.Helpers.GetID();
                $(el).attr('id', tid)
                opts.el = '#'+tid
            }
        }
        App.Ins[opts.el] = new App.Views[view](opts) 
        App.log("info",  "Loaded: " + view + " id: " + opts.el)
    })
}


App.Views.Base = Backbone.View.extend({
    // Prepopulates this, with given opts..
    initialize: function(opts) {
        _.extend(this, opts)       
    },
    
});