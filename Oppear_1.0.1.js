/*O-ppear 1.0.1
 *
 *
 *Copyright (C) 2015 BeginnerO
 *O-ppear is released under MIT license.
 *http://opensource.org/licenses/MIT
 */


(function($){

    $.fn.getAllCSS = function(){
        var str = $(this).css("cssText");
        var iniStr = str.split(';');
        var result = {};
        for(var i = 0;i < iniStr.length;i++){
            var eachStr = iniStr[i].split(':');
            if(typeof(eachStr[1]) == 'string') result[eachStr[0].replace(" ","")] = eachStr[1].replace(" ","");
            else result[eachStr[0].replace(" ","")] = eachStr[1];
        }
        return result;
    }

    getOriginalCSS = function(defCSS){
        var result = {};
        $('body').append('<div class="thisShouldntBe"></div>');
        testCSS = $('.thisShouldntBe').getAllCSS();
        for(var property in defCSS){
            if(defCSS[property] != testCSS[property]){ result[property] = defCSS[property];}
        }
        $('.thisShouldntBe').remove();
        return result;
    }


    $.fn.Oppear = function(parms,otherCSS){
        var aBitSlide = false;
        return this.each(function(){

            var options = $.extend({}, $.fn.Oppear.defaults,parms);
            var defCSS = $.extend({},otherCSS);
            var direction = {
                    up : 'translateY('+options.distance+')',
                    right : 'translateX(-'+options.distance+')',
                    down : 'translateY(-'+options.distance+')',
                    left : 'translateX('+options.distance+')'};
            var $Opp = $(this);
            var preTranCss = $Opp.css('transition');
            $Opp.css('transition','all 0s');//For deleting initial transition.

            $(document).on('ready',function(){
                setTimeout(function(){
                    if(options.defaultCSS){
                        $Opp
                            .css('opacity','0')
                            .css('transform',direction[options.direction]);
                        defCSS['opacity'] = '0';
                        defCSS['transform'] = direction[options.direction];
                    }
                    if(options.disappear){
                        /*defCSS = $Opp.getAllCSS();
                        defCSS = getOriginalCSS(defCSS);*/
                        for(var property in defCSS){
                            defCSS[property] = $Opp.css(property);
                        }
                        defCSS['transition'] = options.transition;
                    }
                },1);

                setTimeout(function(){
                    var OppPosition = $Opp.offset().top;
                    var appearance = false;
                    $(document).scroll(function(){

                        if(options.appearCondition(OppPosition,options)
                            && !appearance){

                            appearance = true;
                            $Opp
                                .css('transition',options.transition);
                            if(options.defaultCSS){
                                $Opp
                                    .css('opacity','1')
                                    .css('transform','translateY(0px)');
                            }

                            for(var property in otherCSS){
                                $Opp.css(property, otherCSS[property]);
                            }

                            if(!options.disappear){
                                setTimeout(function(){
                                    $Opp
                                        .css('transition',preTranCss);
                                },1);
                            }

                        }else if(!options.appearCondition(OppPosition,options)
                            && appearance
                            && options.disappear){
                            $Opp.css('transition',options.transition);
                            setTimeout(function(){
                                for(var property in defCSS){
                                    $Opp.css(property,defCSS[property]);
                                }
                            },2);
                            appearance = false;
                        }

                    });
                    if(!aBitSlide) {
                        $('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 1);
                        $('html,body').animate({scrollTop: $(document).scrollTop()}, 1);
                        aBitSlide = true;
                    }
                },options.delay);
            });
        });
    }

    $.fn.Oppear.defaults = {

        offset : 0,
        transition : '2s',
        delay : 0,
        direction : 'up',
        distance : '50px',
        disappear : false,
        defaultCSS : true,
        appearCondition : function(OppPosition,options){
            if($(document).scrollTop() + $(window).height() + options.offset >= OppPosition
                && $(document).scrollTop() + options.offset <= OppPosition){
                return true;
            }else{
                return false;
            }
        }
    }
})(jQuery);