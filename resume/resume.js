// 设置高度自适应
$(document).ready(function(){
    $(".left").height($(window).innerHeight());
    $(".right").height($(window).innerHeight());
    if($(window).innerWidth()<769){
        $(".left").hide();
        $('.top_header').show();
    
    }else{
        $('.top_header').hide();
        $(".left").show()
    }
})


$(window).resize(function(){
    $(".left").height($(window).innerHeight());
    $(".right").height($(window).innerHeight());
    if($(window).innerWidth()<769){
        $(".left").hide();
        $('.top_header').show();
    
    }else{
        $('.top_header').hide();
        $(".left").show()
    }
})

function openWx(){

      var locatUrl = "weixin://";
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
            var ifr = document.createElement("iframe");
            ifr.src = locatUrl;
            ifr.style.display = "none";
            document.body.appendChild(ifr);
        }else{
              window.location.href = locatUrl;
        }

}

console.log($("#v-pills-about").height(),$("#v-pills-skill").height())
