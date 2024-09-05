(function ($) {
    

    $(window).on('load', function(){
        setTimeout(function(){ 
            $('#loader-component').hide();
            $('main').show();
         }, 2500);
        
    });
})(jQuery);