$(function(){
    $('#sidebarMenu li a').each(function(){
        var $this = $(this);
        if($this.attr('href') === location.pathname){
            $this.addClass('active');
        }
    })
})