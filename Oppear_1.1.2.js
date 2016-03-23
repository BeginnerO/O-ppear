/*O-ppear 1.1.2
 *
 *
 *Copyright (C) 2015 BeginnerO
 *O-ppear is released under MIT license.
 *http://opensource.org/licenses/MIT
 */


(function($){
    var OppearReady = false;

    $.fn.OppearLoader = function(parms){
        var options = $.extend({}, $.fn.OppearLoader.defaults,parms);
        $this = $(this);
        setCheck = setInterval(function(){
            if(OppearReady){
                options.disAppear($this);
                clearInterval(setCheck);
            }
        },200);
    };

    $.fn.OppearLoader.defaults = {
        disAppear : function($this){
            $this.fadeOut();
        },
    };
    $.fn.Oppear = function(parms,otherCSS){
        function Appear(options,$Opp,preTranCss){
            appearance = true;
            $Opp
                .css('transition',options.transition)
                .css('-webkit-transition',options.transition);
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
                        .css('transition',preTranCss)
                        .css('-webkit-transition',preTranCss);
                },1);
            }
        }
        function Disppear(options,$Opp,defCSS){
            $Opp.css('transition',options.transition)
            .css('-webkit-transition',options.transition);
            setTimeout(function(){
                for(var property in defCSS){
                    $Opp.css(property,defCSS[property]);
                }
            },2);
            appearance = false;
        }

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
            $Opp.css('transition','all 0s')
                .css('-webkit-transition','all 0s');//For deleting initial transition.

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
                        for(var property in defCSS){
                            defCSS[property] = $Opp.css(property);
                        }
                        defCSS['transition'] = options.transition;
                    }
                    OppearReady = true;
                },1);

                setTimeout(function(){
                    var OppPosition = $Opp.offset().top;
                    var appearance = false;
                    $(document).scroll(function(){

                        if(options.appearCondition(OppPosition,options)
                            && !appearance
                            && OppearReady){
                            appearance = true;
                            Appear(options,$Opp,preTranCss);

                        }else if(!options.appearCondition(OppPosition,options)
                            && appearance
                            && options.disappear
                            && OppearReady){
                            appearance = false;
                            Disppear(options,$Opp,defCSS);

                        }
                    });
                    if(options.firstAppear
                        && !appearance
                        && OppearReady
                        && options.appearCondition(OppPosition,options)){
                        appearance = true;
                        Appear(options,$Opp,preTranCss);
                    }
                },options.delay+1);
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
        firstAppear : false,
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