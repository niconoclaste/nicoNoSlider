/*
 * nicoNoSlider.js v2.6.3
 * http://www.niconoclaste.com/codes/nicoNoSlider/ -> coming soon !
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 * 
 * Copyright 2014~, Nicolas BERNARD (NicoNoClaste)
 * http://www.niconoclaste.com
*/

(function($){
	$.fn.nicoNoSlider = function(op, callback){
		var target = this.selector;
		
		if(!target || target == ''){
			var randomId = 'slideId'+Math.floor((Math.random() * 100000000) + 1);
			$(this).attr('id',randomId);
			target = '#'+randomId;
		}
		
		var slidesId = $(target).attr('id')+'_';
		op = $.extend({    // Default values to options
			speed:500,                    // Alide transition speed (milliseconds)
			auto:false,                   // Auto slide : false or speed (milliseconds)
			autoDirection:'next',         // Direction of the auto Slide 'next', 'prev'
			minSlides:0,
			adaptSize:false,              // Adapt height and width of slider container within current side's height and width
			infinite:true,                // Infinite loop
			transition:'slide',           // Type of transition : 'slide', 'fade'
			hoverStop:true,               // Stop Auto slide on mouseenter
			responsive:true,              // Responsive slider
			overflow:false,               // Let elements overflow outside Slider container
			decal:0,                      // Decal elements on the left (dont center slides)
			mouseDrag:false,
			controls:{                    // Prev / Next buttons : false or array()
				prevInner:'',             // Prev button inside html
				nextInner:'',             // Next button inside html
				out:false,                // Put Prev / Next buttons outside slider container         
				setHeight:''                 // Set height of prev / next buttons within slider's element
			},
			pagination:{                  // Slider pagination : false or array()
				pagInner:'',              // pagination inside html : 'number', 'image', 'imageBg' or html
				pagInnerImg:'',
				external:false,
			},
			callback:function(){}         // Callback function to launch after slider is ready
		}, op);
		
		var Width = $(target).children().outerWidth();
		var Height = $(target).children().outerHeight();
		
		var Speed = op.speed;
		var ClickDelay = Speed+50;
		var Auto = op.auto;
		var AutoDir = op.autoDirection;
		var Inf = op.infinite;
		var Trans = op.transition;
		var Overflow = op.overflow;
		var MinSlides = op.minSlides;
		if(Trans === 'fade'){
			Overflow = false;
			MinSlides = 0;
		}
		var Hover = op.hoverStop;
		var Resp = op.responsive;
		
		var AdaptSize = op.adaptSize;
		
		var Decal = op.decal;
		var MouseDrag = op.mouseDrag;
		var Contr = op.controls;
		if(Contr){Contr = true;}
		var Prev = 'prev';
		var PrevIn = '';
		if(op.controls.prevInner){
			PrevIn = op.controls.prevInner;
		}
		var Next = 'next';
		var NextIn = '';
		if(op.controls.nextInner){
			NextIn = op.controls.nextInner;
		}
		var ContrOut = op.controls.out;
		var ContrSetHeight = op.controls.setHeight;
		var Pag = op.pagination;
		if(Pag){Pag = true;}
		var PagName = 'pagination';
		var Pagination = target+' .'+PagName;
		var ExternalPag = false;
		if(op.pagination.external){
			Pagination = op.pagination.external;
			ExternalPag = true;
		}
		var PagInner = op.pagination.pagInner;
		var PagInnerImg = op.pagination.pagInnerImg;

		var slidesNb = $(target).children().length;
		var totalWidth = Width*slidesNb;

		if(slidesNb == 1){
			Pag = false;
			Contr = false;
			Auto = false;
			Decal = 0;
		}
		
		var widthDecal = Width;
		if(Decal > 0){
			widthDecal = Width-Decal;
		}
		var i;
		
		// Check if device is mobile
		var isMobile = function(){return /(iphone|ipod|ipad|android|blackberry|windows ce|palm|symbian)/i.test(navigator.userAgent);};
		var containerWidth;
		var containerDoubleWidth;
		
		var _init = function(){
			// Create the structure of the slider
			if(Overflow){
				if(MinSlides > 0){
					var startContents = $(target).html();
					slidesNb = $(target).children().length;
					while($(target).children().length < MinSlides){
						slidesNb = $(target).children().length;
						$(target).prepend(startContents);
					}
				}
				slidesNb = $(target).children().length;
				totalWidth = Width*slidesNb;
				widthDecal = Width;
				if(Decal > 0){
					widthDecal = Width-Decal;
				}
			}
			
			var firstChild = $(target).children().eq(0);

			firstChild = firstChild[0]['outerHTML'];
			$(target).children().each(function(e){
				$(this).css({opacity:0}); // Hide elements until they are ready
				if(Overflow){
					if(Overflow === 'straight'){
						if(e+1 == 1){
							$(this).wrap('<div class="sliderElement currentSlide" id="'+slidesId+(e+1)+'"></div>');
						}else{
							$(this).wrap('<div class="sliderElement" id="'+slidesId+(e+1)+'"></div>');
						}
					}else{
						if(e+1 == 1){
							$(this).wrap('<div class="sliderElement currentSlide" id="'+slidesId+(e+1)+'"></div>');
						}else if(e+1 == slidesNb){
							$(this).wrap('<div class="sliderElement last" id="'+slidesId+(e+1)+'"></div>');
						}else if(e+1 == slidesNb - 1){
							$(this).wrap('<div class="sliderElement last" id="'+slidesId+(e+1)+'"></div>');
						}else{
							$(this).wrap('<div class="sliderElement" id="'+slidesId+(e+1)+'"></div>');
						}
					}
				}else{
					if(AdaptSize === false){
						if(e+1 == 1){
							$(this).wrap('<div class="sliderElement currentSlide" id="'+slidesId+(e+1)+'"></div>');
						}else if(e+1 == slidesNb){
							$(this).wrap('<div class="sliderElement last" id="'+slidesId+(e+1)+'"></div>');
						}else{
							$(this).wrap('<div class="sliderElement" id="'+slidesId+(e+1)+'"></div>');
						}
					}else{
						if($(this).width() < $(this).height()){
							$(this).addClass('tate');
						}else{
							$(this).addClass('yoko');
						}
						$(this).attr('id', slidesId+(e+1)).addClass('sliderElement');
						if(e+1 == 1){
							$(this).addClass('currentSlide').css({opacity:1});
						}
					}
				}
			});

			if(Trans == 'fade'){ // Reverse order of elements if transition is 'fade'
				var reverse = $(target).children();
				$(target).append(reverse.get().reverse());
				if(AdaptSize == false){
					$(target).append(firstChild);
				}
			}
			var contents = $(target).html();
			if(Overflow){
				$(target).html('').prepend('<div class="sliderInner"><div class="sliderPositionner"><div class="sliderContainer">'+contents+'</div></div></div>');
			}else{
				if(AdaptSize == true){
					$(target).html('').prepend('<div class="sliderInner">'+contents+'</div>');
				}else{
					$(target).html('').prepend('<div class="sliderInner"><div class="sliderContainer">'+contents+'</div></div>');
				}
			}

			// Basic styling of the slider
			if(Trans == 'fade'){
				if(AdaptSize == true){
					$(target).find('.sliderInner').width('100%').height('100%').css({'overflow':'hidden','position':'relative'}).find('.sliderElement').css({'position':'absolute','left':0,'top':0});
					startWidth = $(target).find('.currentSlide').width();
					startHeight = $(target).find('.currentSlide').height();
					$(target).width(startWidth).height(startHeight);
					
				}else{
					$(target).width('100%').find('.sliderInner').width('100%').height('auto').css({'overflow':'hidden','position':'relative'}).find('.sliderContainer').width('100%').height('auto').find('.sliderElement').width('100%').height('auto').css({'position':'absolute','left':0,'top':0});
				}
				
			}else{
				if(Overflow){
					var overflow_totalWidth = Width*(slidesNb + 1);
					$(target).width(Width).find('.sliderInner').width(Width).height('auto').css({'position':'relative'}).find('.sliderContainer').width(overflow_totalWidth).height('100%').css({'overflow':'hidden'}).find('.sliderElement').width(Width).height('auto').css({'float':'left'});
					var movedSlides = $(target).find('.last').length;
					$(target+' .sliderContainer').prepend($(target).find('.last'));
					$(target+' .sliderPositionner').css({'margin-left':'-'+(Width*movedSlides)+'px'});
				}else{

					var slideWidth = 100 / slidesNb +'%';
					var containerWidth = 100 * slidesNb +'%';

					if(Decal > 0){
						$(target).width('100%').find('.sliderInner').width('100%').height('auto').css({'overflow':'hidden','position':'relative'}).find('.sliderContainer').width(containerWidth).height('auto').find('.sliderElement').width(slideWidth).height('auto').css({'float':'left'});
					}else{
						if(Inf){
							$(target).width('100%').find('.sliderInner').width('100%').height('auto').css({'overflow':'hidden','position':'relative'}).find('.sliderContainer').width(containerWidth).height('auto').find('.sliderElement').width(slideWidth).height('auto').css({'float':'left'});
						}else{
							$(target).width('100%').css({'overflow':'hidden','position':'relative'}).find('.sliderInner').width(containerWidth).height('auto').css({'overflow':'hidden','position':'relative'}).find('.sliderContainer').width('100%').height('auto').find('.sliderElement').width(slideWidth).height('auto').css({'float':'left'});
						}
					}
				}
			}
			$(target+' .sliderElement').children().css({opacity:''}); // Remove opacity

			// Add controls
			if(Contr){
				var prevNextHeight = '';
				if(ContrSetHeight === 'image'){
					var prevNextHeight = 'height:'+$(target+' .sliderElement').find('img').height()+'px';
				}
				if(ContrOut){
					$(target).append('<div class="controls"><a href="#prev" class="'+Prev+'" style="'+prevNextHeight+'">'+PrevIn+'</a><a href="#next" class="'+Next+'" style="'+prevNextHeight+'">'+NextIn+'</a></div>');
					if(!Inf){
						$(target).find($('.'+Prev)).hide();
					}
				}else{
					$(target+' .sliderInner').append('<div class="controls"><a href="#prev" class="'+Prev+'" style="'+prevNextHeight+'">'+PrevIn+'</a><a href="#next" class="'+Next+'" style="'+prevNextHeight+'">'+NextIn+'</a></div>');
					if(!Inf){
						$(target).find($('.'+Prev)).hide();
					}
				}
			}
			// Add pagination
			if(ExternalPag === false){
				$(target).append('<ul class="'+PagName+'"></ul>');
				for(i=1; i <= slidesNb; i++){
					if(PagInner == 'number'){
						if(i == 1){
							$(target+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'">'+i+'</a></li>');
						}else{
							$(target+' .'+PagName).append('<li><a href="#'+slidesId+i+'">'+i+'</a></li>');
						}
					}else if(PagInner == 'image'){
						if(AdaptSize == false){
							var imgScr = $('#'+slidesId+i+' img').attr('src');
						}else{
							var imgScr = $('#'+slidesId+i).attr('src');
						}
						if(i == 1){
							$(target+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}else{
							$(target+' .'+PagName).append('<li><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}
					}else if(PagInner == 'imageBg'){
						if(AdaptSize == false){
							var imgScr = $('#'+slidesId+i+' img').attr('src');
						}else{
							var imgScr = $('#'+slidesId+i).attr('src');
						}
						
						if(i == 1){
							$(target+' .'+PagName).append('<li class="current" style="background-image:url('+imgScr+')"><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}else{
							$(target+' .'+PagName).append('<li style="background-image:url('+imgScr+')"><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}
					}else{
						if(i == 1){
							$(target+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'">'+PagInner+'</a></li>');
						}else{
							$(target+' .'+PagName).append('<li><a href="#'+slidesId+i+'">'+PagInner+'</a></li>');
						}
					}
				}
			}else{
				$(Pagination).append('<ul class="'+PagName+'"></ul>');
				for(i=1; i <= slidesNb; i++){
					if(PagInner == 'number'){
						if(i == 1){
							$(Pagination+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'">'+i+'</a></li>');
						}else{
							$(Pagination+' .'+PagName).append('<li><a href="#'+slidesId+i+'">'+i+'</a></li>');
						}
					}else if(PagInner == 'image'){
						if(AdaptSize == false){
							var imgScr = $('#'+slidesId+i+' img').attr('src');
						}else{
							var imgScr = $('#'+slidesId+i).attr('src');
						}
						if(i == 1){
							$(Pagination+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}else{
							$(Pagination+' .'+PagName).append('<li><a href="#'+slidesId+i+'"><img src="'+imgScr+'" alt="" /></a></li>');
						}
					}else if(PagInner == 'imageBg'){
						if(AdaptSize == false){
							var imgScr = $('#'+slidesId+i+' img').attr('src');
							var imgHeight = $('#'+slidesId+i+' img').height();
							var imgWidth = $('#'+slidesId+i+' img').width();
						}else{
							var imgScr = $('#'+slidesId+i).attr('src');
							var imgHeight = $('#'+slidesId+i).height();
							var imgWidth = $('#'+slidesId+i).width();
						}
						var imgInsideSrc = imgScr;
						if(PagInnerImg != ''){
							imgInsideSrc = PagInnerImg;
						}
						var orientation = 'yoko';
						if(imgWidth < imgHeight){
							orientation = 'tate';
						}
						
						if(i == 1){
							$(Pagination+' .'+PagName).append('<li class="current '+orientation+'"><a href="#'+slidesId+i+'" style="background-image:url('+imgScr+')"><img src="'+imgInsideSrc+'"></a></li>');
						}else{
							$(Pagination+' .'+PagName).append('<li class="'+orientation+'"><a href="#'+slidesId+i+'" style="background-image:url('+imgScr+')"><img src="'+imgInsideSrc+'" ></a></li>');
						}
					}else{
						if(i == 1){
							$(Pagination+' .'+PagName).append('<li class="current"><a href="#'+slidesId+i+'">'+PagInner+'</a></li>');
						}else{
							$(Pagination+' .'+PagName).append('<li><a href="#'+slidesId+i+'">'+PagInner+'</a></li>');
						}
					}
				}
			}
			if(!Pag){
				$(target+' .'+PagName).hide();
			}
			// Callback function launch
			op.callback.call(this);
		};
		_init();
		var click = true;
		var slidesIdLength = slidesId.length+1;
		var firstChild = 0;
		var firstChild2 = firstChild+1;
		var lastChild = slidesNb-1;
		var lastChild2 = slidesNb-2;
		
		
		// Next button function
		var nextSlide = function(noSpeed){
			if(click){
				if(AdaptSize == false){
					$(target).stop().css({width:'100%',height:'auto'});
					var Width = $(target).outerWidth();
					var widthDecal = Width;
					if(Decal > 0){
						widthDecal = Width-Decal;
					}
					var nextSlideMoove = function(){
						if($(target).find('.mouseenter').length){
							Speed = op.speed/3;
							ClickDelay = (op.speed/3)+50;
						}else{
							Speed = op.speed;
							ClickDelay = op.speed+50;
						}
						if(noSpeed === true){
							if(ExternalPag){
								Speed = 0;
							}
						}
						click = false;
						if(Trans == 'fade'){
							$(target+' .sliderElement').removeClass('currentSlide');
							$(target+' .sliderContainer .sliderElement').eq(lastChild).animate({opacity:0}, Speed, function(){
								$(this).prependTo($(target+' .sliderContainer')).css({opacity:''});
								$(target+' .sliderElement').eq(lastChild).addClass('currentSlide');
								var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
								$(Pagination+' li').removeClass('current');
								$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
							});
						}else{
							if(Overflow){
								if(!Inf){
									var currentSlide = $(target+' .sliderContainer .currentSlide').index()+1;
									var currMargLeft = parseInt($(target+' .sliderContainer').css('margin-left'));
									widthDecal = widthDecal - currMargLeft;
									$(target+' .sliderContainer').stop().animate({'margin-left':'-'+widthDecal+'px'}, Speed, function(){
										var currentSlide = $(target+' .sliderContainer .currentSlide').index()+1;
										var slideWidthDecal = (100 / slidesNb) * currentSlide +'%';
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer .sliderElement').eq(currentSlide).addClass('currentSlide');
										
										$(target+' .sliderContainer').stop().css({'margin-left':'-'+widthDecal});
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(target+' .'+PagName+' li').removeClass('current');
										$(target+' .'+PagName+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}else{
									if(slidesNb <= 3){
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer .sliderElement').eq(firstChild).clone().addClass('cloned').appendTo($(target+' .sliderContainer'));
										$(target+' .sliderContainer').stop().animate({'margin-left':'-'+widthDecal+'px'}, Speed, function(){
											$(target+' .sliderContainer .sliderElement').eq(firstChild).appendTo($(target+' .sliderContainer'));
											$(target+' .sliderContainer .cloned').remove();
											$(target+' .sliderContainer').css({'margin-left':0});
											$(target+' .sliderContainer').stop().css({'margin-left':0});
											$(target+' .sliderElement').eq(firstChild).next().addClass('currentSlide');
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
										});
									}else{
										var addedSlides = $(target+' .sliderElement.last').length - 1;
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer').stop().animate({'margin-left':'-'+widthDecal+'px'}, Speed, function(){
											$(target+' .sliderContainer .sliderElement').eq(firstChild).appendTo($(target+' .sliderContainer'));
											$(target+' .sliderContainer').css({'margin-left':0});
											$(target+' .sliderContainer').stop().css({'margin-left':0});
											$(target+' .sliderElement').eq(addedSlides).next().addClass('currentSlide');
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
										});
									}
								}
							}else{
								if(Inf){
									$(target+' .sliderElement').removeClass('currentSlide');
									$(target+' .sliderContainer').stop().animate({'margin-left':'-'+widthDecal+'px'}, Speed, function(){
										$(target+' .sliderContainer .sliderElement').eq(firstChild).appendTo($(target+' .sliderContainer'));
										$(target+' .sliderContainer').css({'margin-left':0});
										$(target+' .sliderContainer').stop().css({'margin-left':0});
										$(target+' .sliderElement').eq(firstChild).addClass('currentSlide');
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(Pagination+' li').removeClass('current');
										$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}else{
									var currentSlide = $(target+' .sliderContainer .currentSlide').index()+1;
									var currMargLeft = parseInt($(target+' .sliderContainer').css('margin-left'));
									widthDecal = widthDecal - currMargLeft;
									$(target+' .sliderContainer').stop().animate({'margin-left':'-'+widthDecal+'px'}, Speed, function(){
										var currentSlide = $(target+' .sliderContainer .currentSlide').index()+1;
										var slideWidthDecal = (100 / slidesNb) * currentSlide +'%';
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer .sliderElement').eq(currentSlide).addClass('currentSlide');
										
										$(target+' .sliderContainer').stop().css({'margin-left':'-'+slideWidthDecal});
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(target+' .'+PagName+' li').removeClass('current');
										$(target+' .'+PagName+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}

							}
						}
						setTimeout(function(){click = true;},ClickDelay);
					};

					if(!Inf){
						$(target).find('.'+Prev).delay(Speed).show();
						var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
						var beforeLast = slidesNb-1;
						if(currentSlide == slidesId+beforeLast){
							nextSlideMoove();
							if(Decal > 0){
								if(slidesNb>2){
									$(target+' .sliderElement').eq(firstChild2+1).css({opacity:0});
								}
							}
							setTimeout(function(){
								if(Decal > 0){
									if(slidesNb<=2){
										$(target+' .sliderElement').eq(firstChild).css({opacity:0});
									}
								}
								$(target).find('.'+Next).hide();
							},Speed);
						}else if(currentSlide != slidesId+slidesNb){
							nextSlideMoove();
							if(Decal > 0){
								$(target+' .sliderElement').css({opacity:''});
							}
						}
					}else if(Inf){
						nextSlideMoove();
					}
				
				}else{
					$(target).animate({opacity:0},op.speed, function(){
						var currentSlide = '#'+$(target+' .currentSlide').attr('id');
						var nextSlide = $(target).find(currentSlide).index()-1;
						if(nextSlide > slidesNb){
							nextSlide = 0;
						}
						var newCurrentSlide = '#'+$(target+' .sliderElement').eq(nextSlide).attr('id');

						$(target).find(currentSlide).css({opacity:0});
						$(target).find(newCurrentSlide).css({opacity:1});
						$(target).width('100%').height('100%');
						$(target).find(currentSlide).removeClass('currentSlide');
						$(target).find(newCurrentSlide).addClass('currentSlide');
						$(Pagination+' li').removeClass('current');
						$(Pagination+' li a[href="'+currentSlide+'"]').parent().addClass('current');
						
						setTimeout(function(){
							var newWidth = $(document).find(newCurrentSlide).width();
							var newHeight = $(target).find(newCurrentSlide).height();
							$(target).width(newWidth).height(newHeight);
							$(target).animate({opacity:1},op.speed);
						},10);
					});
				}
			}
		};

		var from;
		var to;
		var moove;
		var moovement;
		
		// Prev button function
		var prevSlide = function(noSpeed){
			if(click){
				if(AdaptSize == false){
					$(target).stop().css({width:'100%',height:'auto'});
					var Width = $(target).outerWidth();
					var widthDecal = Width;
					if(Decal > 0){
						widthDecal = Width-Decal;
					}
					var prevSlideMoove = function(){
						if($(target).find('.mouseenter').length){
							Speed = op.speed/2;
							ClickDelay = (op.speed/2)+50;
						}else{
							Speed = op.speed;
							ClickDelay = op.speed+50;
						}
						if(noSpeed === true){
							if(ExternalPag){
								Speed = 0;
							}
						}
						click = false;
						if(Trans == 'fade'){
							$(target+' .sliderElement').removeClass('currentSlide');
							from = parseInt($(Pagination+' li.current a').attr('href').slice(slidesIdLength));
							to = from-1;
							$(target+' .sliderContainer .sliderElement').eq(firstChild).insertBefore($(target+' .sliderContainer .sliderElement').eq(lastChild));
							$(target+' .sliderContainer .sliderElement').eq(lastChild).animate({opacity:0}, Speed, function(){
								$(this).insertBefore($(target+' .sliderElement').eq(lastChild2)).css({opacity:''});
								$(target+' .sliderElement').eq(lastChild).addClass('currentSlide');
								var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
								$(Pagination+' li').removeClass('current');
								$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
							});
						}else if(Trans != 'fade'){
							if(Overflow){
								if(Inf){
									if(slidesNb <= 3){
										$(target+' .sliderElement').removeClass('currentSlide');
										from = parseInt($(Pagination+' li.current a').attr('href').slice(slidesIdLength));
										to = from-1;
										$(target+' .sliderContainer .sliderElement').eq(lastChild).addClass('cloned').clone().removeClass('cloned').prependTo($(target+' .sliderContainer'));
										$(target+' .sliderContainer').css({'margin-left':'-'+widthDecal+'px'}).animate({'margin-left':0}, Speed, function(){
											$(target+' .sliderElement').eq(firstChild).next().addClass('currentSlide');
											$(target+' .sliderContainer .cloned').remove();
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
										});
									}else{
										$(target+' .sliderElement').removeClass('currentSlide');
										from = parseInt($(Pagination+' li.current a').attr('href').slice(slidesIdLength));
										to = from-1;
										var addedSlides = $(target+' .sliderElement.last').length - 1;
										$(target+' .sliderContainer .sliderElement').eq(lastChild).prependTo($(target+' .sliderContainer'));
										$(target+' .sliderContainer').css({'margin-left':'-'+widthDecal+'px'}).animate({'margin-left':0}, Speed, function(){
											$(target+' .sliderElement').eq(addedSlides).next().addClass('currentSlide');
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
										});
									}
								}else{
									from = parseInt($(target+' .'+PagName+' li.current a').attr('href').slice(slidesIdLength));
									to = from-1;
									var currMargLeft = parseInt($(target+' .sliderContainer').css('margin-left'));
									widthDecal = widthDecal + currMargLeft;
									if(widthDecal > 0){
										widthDecal = '-'+widthDecal;
									}
									$(target+' .sliderContainer').stop().animate({'margin-left':widthDecal+'px'}, Speed, function(){
										var currentSlide = $(target+' .sliderContainer .currentSlide').index()-1;
										console.log(currentSlide);
										var slideWidthDecal = (100 / slidesNb) * currentSlide +'%';
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer .sliderElement').eq(currentSlide).addClass('currentSlide');
										$(target+' .sliderContainer').stop().css({'margin-left':'-'+widthDecal});
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(target+' .'+PagName+' li').removeClass('current');
										$(target+' .'+PagName+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}
							}else{
								if(Inf){
									$(target+' .sliderElement').removeClass('currentSlide');
									from = parseInt($(Pagination+' li.current a').attr('href').slice(slidesIdLength));
									to = from-1;
									$(target+' .sliderContainer .sliderElement').eq(lastChild).prependTo($(target+' .sliderContainer'));
									$(target+' .sliderContainer').css({'margin-left':'-'+widthDecal+'px'}).animate({'margin-left':0}, Speed, function(){
										$(target+' .sliderElement').eq(firstChild).addClass('currentSlide');
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(Pagination+' li').removeClass('current');
										$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}else{
									from = parseInt($(target+' .'+PagName+' li.current a').attr('href').slice(slidesIdLength));
									to = from-1;
									var currMargLeft = parseInt($(target+' .sliderContainer').css('margin-left'));
									widthDecal = widthDecal + currMargLeft;
									if(widthDecal > 0){
										widthDecal = '-'+widthDecal;
									}
									$(target+' .sliderContainer').stop().animate({'margin-left':widthDecal+'px'}, Speed, function(){
										var currentSlide = $(target+' .sliderContainer .currentSlide').index()-1;
										console.log(currentSlide);
										var slideWidthDecal = (100 / slidesNb) * currentSlide +'%';
										$(target+' .sliderElement').removeClass('currentSlide');
										$(target+' .sliderContainer .sliderElement').eq(currentSlide).addClass('currentSlide');
										$(target+' .sliderContainer').stop().css({'margin-left':'-'+slideWidthDecal});
										var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
										$(target+' .'+PagName+' li').removeClass('current');
										$(target+' .'+PagName+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
									});
								}
							}
						}
					};
					
					setTimeout(function(){click = true;},ClickDelay);	
					if(!Inf){
						$(target).find('.'+Next).delay(Speed).show();
						if(Decal > 0){
							if(slidesNb<=2){
								$(target+' .sliderElement').css({opacity:''});
							}else{
								setTimeout(function(){
									$(target+' .sliderElement').css({opacity:''});
								},Speed);
							}
						}
						var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
						if(currentSlide == slidesId+'2'){
							prevSlideMoove();
							setTimeout(function(){
								$(target).find('.'+Prev).hide();
							},Speed);
						}else if(currentSlide != slidesId+'1'){
							prevSlideMoove();
						}
					}else if(Inf){
						prevSlideMoove();
					}
				}else{
					$(target).animate({opacity:0},op.speed, function(){
						var currentSlide = '#'+$(target+' .currentSlide').attr('id');
						var nextSlide = $(target).find(currentSlide).index()+1;
						if(nextSlide > slidesNb-1){
							nextSlide = 0;
						}
						var newCurrentSlide = '#'+$(target+' .sliderElement').eq(nextSlide).attr('id');
						$(target).find(currentSlide).css({opacity:0});
						$(target).find(newCurrentSlide).css({opacity:1});
						$(target).width('100%').height('100%');
						$(target).find(currentSlide).removeClass('currentSlide');
						$(target).find(newCurrentSlide).addClass('currentSlide');
						$(Pagination+' li').removeClass('current');
						$(Pagination+' li a[href="'+currentSlide+'"]').parent().addClass('current');
						
						setTimeout(function(){
							var newWidth = $(document).find(newCurrentSlide).width();
							var newHeight = $(target).find(newCurrentSlide).height();
							$(target).width(newWidth).height(newHeight);
							$(target).animate({opacity:1},op.speed);
						},10);
					});
				}
			}
		};
		
		var click = true;
		// Pagination links function
		var pagClick = function(e){
			if(click){
				if(ExternalPag){
					Speed = 0;
				}
				if(AdaptSize == false){
					$(target).stop().css({width:'100%',height:'auto'});
					var Width = $(target).outerWidth();
					var widthDecal = Width;
					if(Decal > 0){
						widthDecal = Width-Decal;
					}
					var from = parseInt($(Pagination+' li.current a').attr('href').slice(slidesIdLength));
					var to = parseInt($(e.currentTarget).attr('href').slice(slidesIdLength));
					var currTarget = $(e.currentTarget);
				
					if(from != to){
						if(from < to){ // Multiple Next
							if(to-from > 1){
								if(slidesNb>2){
									click = false;
									$(target+' .sliderElement').removeClass('currentSlide');
									if(Trans == 'fade'){
										var moovement = to-from-1;
										$(target+' .sliderContainer .sliderElement').eq(lastChild).clone().prependTo($(target+' .sliderContainer'));
										for(i=0; i<moovement; i++){
											$(target+' .sliderContainer .sliderElement').eq(lastChild2+1).insertBefore($(target+' .sliderContainer .sliderElement').eq(firstChild));
										}
										$(target+' .sliderContainer .sliderElement').eq(lastChild+1).animate({opacity:0}, Speed, function(){
											$(target+' .sliderElement').eq(lastChild2+1).addClass('currentSlide');
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
											$(target+' .sliderElement').eq(lastChild+1).remove();
										});
									}else if(Trans != 'fade'){
										moove = (to-from)*widthDecal;
										if(Overflow){
											$(target+' .sliderContainer .sliderElement').clone().addClass('toHide').appendTo($(target+' .sliderContainer'));
											containerWidth = $(target+' .sliderContainer').width();
											containerDoubleWidth = $(target+' .sliderContainer').width()*2;
											$(target+' .sliderContainer').stop().width(containerDoubleWidth).animate({'margin-left':'-'+moove+'px'}, Speed, function(){
												for(i=0; i<(to-from); i++){
													$(target+' .sliderContainer .sliderElement').eq(firstChild).appendTo($(target+' .sliderContainer'));
													$(target+' .sliderContainer').width(containerWidth).css({'margin-left':0});
												}
												$(target+' .sliderContainer .sliderElement.toHide').remove();
												$(Pagination+' li').removeClass('current');
												currTarget.parent().addClass('current');
												$(target+' .sliderElement').eq(firstChild2).next().addClass('currentSlide');
											});
										}else{
											if(Inf){
												$(target+' .sliderContainer').stop().animate({'margin-left':'-'+moove+'px'}, Speed, function(){
													for(i=0; i<(to-from); i++){
														$(target+' .sliderContainer .sliderElement').eq(firstChild).appendTo($(target+' .sliderContainer'));
														$(target+' .sliderContainer').css({'margin-left':0});
													}
													$(Pagination+' li').removeClass('current');
													currTarget.parent().addClass('current');
													$(target+' .sliderElement').eq(firstChild).addClass('currentSlide');
												});
											}else{
												var currMargin = parseInt($(target+' .sliderContainer').css('margin-left'));
												var mooveSlide = currMargin - moove;
												$(target+' .sliderContainer').stop().animate({'margin-left':mooveSlide+'px'}, Speed, function(){
													$(target+' .sliderContainer .sliderElement.currentSlide').removeClass('currentSlide');
													$(target+' .sliderContainer .sliderElement').eq(to-1).addClass('currentSlide');
													var slideWidthDecal = (100 / slidesNb) * (to-1) +'%';
													$(target+' .sliderContainer').css('margin-left','-'+slideWidthDecal);
													$(target+' .'+PagName+' li').removeClass('current');
													currTarget.parent().addClass('current');
												});
											}
										}
									}
									setTimeout(function(){click = true;},ClickDelay);	
									if(!Inf){
										$(target+' .'+Prev).show();
										if(to == slidesNb){
											$(target).find('.'+Next).hide();
										}
									}
								}
							}else{
								nextSlide(true);
							}
						}
						
						if(from>to){ // Multiple Prev
							if(from - to > 1){
								if(slidesNb>2){
									click = false;
									
									if(Trans == 'fade'){
										$(target+' .sliderElement').removeClass('currentSlide');
										moovement = (from-to)+1;
										$(target+' .sliderContainer .sliderElement').eq(lastChild).clone().prependTo($(target+' .sliderContainer'));
										for(i=0; i<moovement; i++){
											$(target+' .sliderContainer .sliderElement').eq(firstChild).insertBefore($(target+' .sliderContainer .sliderElement').eq(lastChild+1));
										}
										$(target+' .sliderContainer .sliderElement').eq(lastChild+1).animate({opacity:0}, Speed, function(){
											$(target+' .sliderElement').eq(lastChild2+1).addClass('currentSlide');
											var currentSlide = $(target+' .sliderElement.currentSlide').attr('id');
											$(Pagination+' li').removeClass('current');
											$(Pagination+' li a[href="#'+currentSlide+'"]').parent().addClass('current');
											$(target+' .sliderContainer .sliderElement').eq(lastChild+1).remove();
										});

									}else if(Trans != 'fade'){
										moove = (from-to)*widthDecal;
										if(Overflow){
											$(target+' .sliderElement').removeClass('currentSlide');
											moove = (from-to)*widthDecal;
											for(i=0; i<(from-to); i++){
												$(target+' .sliderContainer .sliderElement').eq(lastChild).clone().addClass('toHide').prependTo($(target+' .sliderContainer'));
											}
											containerWidth = $(target+' .sliderContainer').width();
											containerDoubleWidth = $(target+' .sliderContainer').width()*2;
											$(target+' .sliderContainer').width(containerDoubleWidth);
											$(target+' .sliderContainer').css({'margin-left':'-'+moove+'px'}).animate({'margin-left':0}, Speed, function(){
												$(target+' .sliderContainer .sliderElement.toHide').remove();
												for(i=0; i<(from-to); i++){
													$(target+' .sliderContainer .sliderElement').eq(lastChild).prependTo($(target+' .sliderContainer'));
												}
												$(target+' .sliderContainer').width(containerWidth);
												$(Pagination+' li').removeClass('current');
												currTarget.parent().addClass('current');
												$(target+' .sliderElement').eq(firstChild2).next().addClass('currentSlide');
											});
										}else{
											$(target+' .sliderElement').removeClass('currentSlide');
											if(Inf){
												for(i=0; i<(from-to); i++){
													$(target+' .sliderContainer .sliderElement').eq(lastChild).prependTo($(target+' .sliderContainer'));
												}
												$(target+' .sliderContainer').css({'margin-left':'-'+moove+'px'}).animate({'margin-left':0}, Speed, function(){
													$(Pagination+' li').removeClass('current');
													currTarget.parent().addClass('current');
													$(target+' .sliderElement').eq(firstChild).addClass('currentSlide');
												});	
											}else{
												var currMargin = parseInt($(target+' .sliderContainer').css('margin-left'));
												var mooveSlide = currMargin + moove;
												$(target+' .sliderContainer').stop().animate({'margin-left':mooveSlide+'px'}, Speed, function(){
													$(target+' .sliderContainer .sliderElement.currentSlide').removeClass('currentSlide');
													$(target+' .sliderContainer .sliderElement').eq(to-1).addClass('currentSlide');
													var slideWidthDecal = (100 / slidesNb) * (to-1) +'%';
													$(target+' .sliderContainer').css('margin-left','-'+slideWidthDecal);
													$(target+' .'+PagName+' li').removeClass('current');
													currTarget.parent().addClass('current');
												});
											}
										}
										
									}
									setTimeout(function(){click = true;},ClickDelay);	
									if(!Inf){
										$(target+' .'+Next).show();
										if(to == 1){
											$(target+' .'+Prev).hide();
										}
									}
								}
							}else{
								prevSlide(true);
							}
						}
						if(isMobile()){
							if(Hover && Auto){
								clearInterval(autoInterval);
								autoInterval = setInterval(function(){
									if(AutoDir == 'next'){
										nextSlide(false);
									}else{
										prevSlide(false)
									}
								},Auto);
							}
						}

					}else{
						return false;
					}
				}else{
					$(target).width('100%').height('100%');
					var currentSlide = '#'+$(target+' .currentSlide').attr('id');
					var newCurrentSlide = $(e.currentTarget).attr('href');
					$(target).find(currentSlide).animate({opacity:0}, Speed);
					$(target).width('100%').height('100%');
					$(target).find(currentSlide).removeClass('currentSlide');
					$(Pagination+' li').removeClass('current');
					$(Pagination+' li a[href="'+currentSlide+'"]').parent().addClass('current');
					setTimeout(function(){
						$(target).find(newCurrentSlide).animate({opacity:1}, Speed).addClass('currentSlide');
						var newWidth = $(document).find(newCurrentSlide).width();
						var newHeight = $(target).find(newCurrentSlide).height();
						$(target).width(newWidth).height(newHeight);
					},100);
				}
			}
		};
		
		// Auto slide launch
		if(Auto){
			var autoInterval = setInterval(function(){
				if(AutoDir == 'next'){
					nextSlide(false);
				}else{
					prevSlide(false)
				}
			},Auto);
		}
		
		// Next button click event
		$(target+' .'+Next).on('click', function(){
			nextSlide();
			if(!Hover && Auto){
				clearInterval(autoInterval);
				autoInterval = setInterval(function(){
					if(AutoDir == 'next'){
						nextSlide(false);
					}else{
						prevSlide(false)
					}
				},Auto);
			}
			return false;
		});
		
		// Prev button click event
		$(target+' .'+Prev).on('click', function(){
			prevSlide(false);
			if(!Hover && Auto){
				clearInterval(autoInterval);
				autoInterval = setInterval(function(){
					if(AutoDir == 'next'){
						nextSlide(false);
					}else{
						prevSlide(false)
					}
				},Auto);
			}
			return false;
		});
		
		// Pagination link button click event
		$(Pagination+' li a').on('click', function(e){
			pagClick(e);
			if(!Hover && Auto){
				clearInterval(autoInterval);
				autoInterval = setInterval(function(){
					if(AutoDir == 'next'){
						nextSlide(false);
					}else{
						prevSlide(false)
					}
				},Auto);
			}
			return false;
		});

		var responsiveAdjust = function(){

			$(target).stop().css({width:'100%',height:'auto'});
			Width = $(target).outerWidth();
			Height = 'auto';
			totalWidth = ((slidesNb*2)*Width)+'px';
			widthDecal = Width;
			if(Decal > 0){
				widthDecal = Width-Decal;
			}
				$(target).width(Width).find('.sliderInner').width(Width).height('auto').css({'position':'relative'}).find('.sliderContainer').width(totalWidth).height(Height).css({'overflow':'hidden'}).find('.sliderElement').width(Width).height(Height).css({'float':'left'});
			if(Inf){
				var movedSlides = $(target).find('.last').length;
				$(target+' .sliderPositionner').css({'margin-left':'-'+(Width*movedSlides)+'px'});
			}else{
				var checkWidth = $(target).width();
				var currSlide = $(target+' .sliderElement.currentSlide').index();
				var margDecal = checkWidth * currSlide;
				$(target+' .sliderContainer').css({'margin-left':'-'+(margDecal)+'px'});	
			}
			if(ContrSetHeight === 'image'){
				var prevNextHeight = $(target+' .sliderElement').find('img').height();
				$(target+' .'+Prev).height(prevNextHeight);
				$(target+' .'+Next).height(prevNextHeight);
			}
		};
		
		if(Overflow){
			$(window).resize(function(){
				responsiveAdjust();
			});
			if(navigator.userAgent.indexOf('MSIE 8.') == -1){
				var previousOrientation = window.orientation;
				var checkOrientation = function(){
					if(window.orientation !== previousOrientation){
						previousOrientation = window.orientation;
						responsiveAdjust();
					}
				};
				window.addEventListener("resize", checkOrientation, false);
				window.addEventListener("orientationchange", checkOrientation, false);
			}
		}
		
		/*
		// Stop auto slide on windows resize and re-lunch after
		if(Auto){
			var resizeCheck;
			$(window).resize(function(){
				clearInterval(autoInterval);
				clearTimeout(resizeCheck);
				resizeCheck = setTimeout(function(){
					autoInterval = setInterval(function(){
						if(AutoDir == 'next'){
							nextSlide(false);
						}else{
							prevSlide(false)
						}
					},Auto);
				}, 100);
			});
		}
		*/
		
		// Mouse grab and moove right or left event
		if(MouseDrag === true){
			if(slidesNb > 1){
				if(!isMobile()){
					if(navigator.userAgent.indexOf('MSIE 8.') == -1){
						downX = '';
						moveAmount = 60;
						moveOk = false;
						$(document).on('mouseenter', target+' .sliderContainer', function(e){
							$(target+' .sliderContainer').addClass('mouseenter');
							downX = '';
						});
						$(document).find(target).on('mousedown', '.mouseenter', function(e){
							if(e.which != 3){
								$(target+' .sliderContainer').addClass('mousedown');
								downX = e.pageX;
								moveOk = true;
								e.preventDefault();
								return false;
							}
						});
						$(document).find(target).on('mousemove', '.mousedown', function(evnt){
							if(moveOk === true){
								$(target+' .sliderContainer').addClass('mousemove');
								if(evnt.pageX != downX){
									if(downX != ''){
										if(evnt.pageX < downX - moveAmount){
											moveOk = false;
											downX = '';
											nextSlide(false);
										}else if(evnt.pageX > downX + moveAmount){
											moveOk = false;
											downX = '';
											prevSlide(false);
										}
									}
								}
							}
							evnt.preventDefault();
						});
						$(document).on('mouseup', target+' .sliderContainer', function(e){
							downX = '';
							if($(document).find('.mousemove').length){
								setTimeout(function(){
									$(target+' .sliderContainer').removeClass('mousedown').removeClass('mousemove');
								},50);
								e.preventDefault();
								return false;
							}
						});
						$(document).find(target+' .sliderContainer').on('click', function(e){
							if($(document).find('.mousemove').length){
								e.preventDefault();
								return false;
							}
						});
						$(document).on('mouseleave', target+' .sliderContainer', function(e){
							$(target+' .sliderContainer').removeClass('mouseenter').removeClass('mousemove').removeClass('mousedown');
						});
					}
				}
			}
		}
		
		// Stop auto slide on mouseenter and relaunch it on mouseleave
		if(!isMobile()){
			if(Hover && Auto){
				$(target).on('mouseenter', function(){
					clearInterval(autoInterval);
				}).on('mouseleave', function(){
					autoInterval = setInterval(function(){
						if(AutoDir == 'next'){
							nextSlide(false);
						}else{
							prevSlide(false)
						}
					},Auto);
				});
			}
		}

		
		/*
		 * Smartphones swipe events trigger by Sam Vloeberghs
		 * http://www.samvloeberghs.be/
		*/
		if(slidesNb > 1){
			if(navigator.userAgent.indexOf('MSIE 8.') == -1){
				var xDown = null;                                                        
				var yDown = null;                                                        

				var handleTouchStart = function(evt){                                         
					xDown = evt.touches[0].clientX;                                      
					yDown = evt.touches[0].clientY;                                      
				};                                              

				var handleTouchMove = function(evt){
					if(!xDown || !yDown){return;}
					var xUp = evt.touches[0].clientX;                                    
					var yUp = evt.touches[0].clientY;
					var xDiff = xDown - xUp;
					var yDiff = yDown - yUp;
					if(Math.abs(xDiff) > Math.abs(yDiff)){
						evt.preventDefault();
						if(xDiff > 0){
							nextSlide(false);
							if(Hover && Auto){
								clearInterval(autoInterval);
								autoInterval = setInterval(function(){
									if(AutoDir == 'next'){
										nextSlide(false);
									}else{
										prevSlide(false)
									}
								},Auto);
							}
						}else{
							prevSlide();
							if(Hover && Auto){
								clearInterval(autoInterval);
								autoInterval = setInterval(function(){
									if(AutoDir == 'next'){
										nextSlide(false);
									}else{
										prevSlide(false)
									}
								},Auto);
							}
						}               
					}
					// reset values 
					xDown = null;
					yDown = null;                                             
				};
				var targetElementId = $(target).attr('id');
				var targetElement = document.getElementById(targetElementId);
				targetElement.addEventListener('touchstart', handleTouchStart, false);        
				targetElement.addEventListener('touchmove', handleTouchMove, false);
			}
		}
		setTimeout(function(){
			op.callback.call(this);
		},200);
	};
})(jQuery);