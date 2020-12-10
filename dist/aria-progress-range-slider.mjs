function e(e){var t=0,i=e;do{t+=i.offsetLeft||0,i=i.offsetParent}while(i);return t}var t={ariaLabel:"Seek slider",arrowMoveStep:1,pageMoveStep:5,className:"AriaProgressBar",disabled:!1,float:!1,getTooltipText:function(e,t){return t.float?e.toString():Math.round(e).toString()},getValueText:function(e,t){return e+" ranging from "+t.min+" to "+t.max},initialValue:0,max:100,min:0,snap:!0,step:1},i=function(i,s){var o=this;if(this.isDragging=!1,this.isMouseOver=!1,this.isDestroyed=!1,this.previousTouch=null,this.handleMouseEnter=function(){o.options.disabled||(o.isMouseOver=!0,o.elementLeft=e(o.element),o.element.classList.add(o.options.className+"--hover"))},this.handleMouseLeave=function(){o.isMouseOver=!1,o.setHoverScale(0),o.element.classList.remove(o.options.className+"--hover")},this.handleDragStart=function(t){if(!o.options.disabled){o.isDragging=!0,o.element.classList.add(o.options.className+"--dragging"),o.elementLeft=e(o.element);var i=o.getValueFromEvent(t);o.updateValue(i),o.options.onDragStart&&o.options.onDragStart(o.realValue,o.options)}},this.handleDragEnd=function(){o.firstTouch=null,o.hasTouchStarted=!1,o.isDragging&&(o.options.onDragEnd&&o.options.onDragEnd(o.realValue,o.options),o.options.onChange&&o.options.onChange(o.realValue,o.options)),o.isDragging=!1,o.element.classList.remove(o.options.className+"--dragging")},this.handleMouseMove=function(e){if((o.isDragging||o.isMouseOver)&&!o.options.disabled){var t=o.getValueFromEvent(e);o.updateHoverTooltip(t),o.isDragging?o.handleDragMove(t):o.isMouseOver&&o.setHoverScale(t)}},this.hasTouchStarted=!1,this.firstTouch=null,this.handleTouchStart=function(e){o.hasTouchStarted=!0,o.firstTouch=e.touches[0]},this.handleTouchMove=function(e){if(o.hasTouchStarted&&!o.options.disabled){var t=function(e,t){return Math.abs(e.clientX-t.clientX)};if(t(e.touches[0],o.firstTouch)>100&&!o.isDragging&&o.handleDragStart(e),o.isDragging){if(o.previousTouch){if(!(t(e.touches[0],o.previousTouch)>Math.abs(e.touches[0].clientY-o.previousTouch.clientY)))return;e.preventDefault()}o.previousTouch=e.touches[0];var i=o.getValueFromEvent(e);o.handleDragMove(i)}}},this.handleKeyDown=function(e){if(!o.options.disabled){var t=o.options.arrowMoveStep/o.range,i=o.options.pageMoveStep/o.range,s={36:-1,35:1};s[34]=-i,s[33]=i,s[40]=-t,s[37]=-t,s[38]=t,s[39]=t;var n=s[e.keyCode];if("number"==typeof n){var a=o.getRealValue();o.updateValue(o.includeStep(o.value+n)),a!==o.realValue&&o.options.onChange&&o.options.onChange(o.realValue,o.options)}}},this.element="string"==typeof i?document.querySelector(i):i,!(this.element instanceof HTMLElement))throw"Given HTML element is not valid or doesn't exist.";this.options=Object.assign({},t,s),this.range=this.options.max-this.options.min,this.createElements(),this.options.disabled&&this.disable();var n=0;this.options.initialValue&&(n=(this.options.initialValue-this.options.min)/this.range),this.updateValue(n),this.setAriaProps(),this.updateHoverTooltip(n)};i.prototype.createElement=function(e,t){var i=document.createElement("div");return i.className=this.getClassName(e),t.appendChild(i),i},i.prototype.createElements=function(){this.trackElement=this.createElement("track",this.element),this.progressElement=this.createElement("progress",this.trackElement),this.hoverElement=this.createElement("hover",this.trackElement),this.bufferElement=this.createElement("buffer",this.trackElement),this.handleElement=this.createElement("handle",this.element),this.options.getTooltipText&&(this.valueTooltipElement=this.createElement("mainTooltip",this.element),this.hoverTooltipElement=this.createElement("hoverTooltip",this.element)),this.element.classList.add(this.options.className),this.element.setAttribute("tabindex","0"),this.element.setAttribute("role","slider"),this.element.setAttribute("aria-valuemin","0"),this.setOptions(),this.element.addEventListener("touchstart",this.handleTouchStart),window.addEventListener("touchmove",this.handleTouchMove,{capture:!1,passive:!1}),window.addEventListener("touchend",this.handleDragEnd),this.element.addEventListener("mouseenter",this.handleMouseEnter),this.element.addEventListener("mouseleave",this.handleMouseLeave),this.element.addEventListener("mousedown",this.handleDragStart),window.addEventListener("mouseup",this.handleDragEnd),window.addEventListener("mousemove",this.handleMouseMove,!1),this.element.addEventListener("keydown",this.handleKeyDown)},i.prototype.getClassName=function(e,t){return void 0===t&&(t=null),t?this.options.className+"-"+e+"--"+t:this.options.className+"-"+e},i.prototype.handleDragMove=function(e){var t=this.realValue;this.updateValue(e),t!==this.realValue&&this.options.onDragMove&&this.options.onDragMove(this.realValue,this.options)},i.prototype.getValueFromEvent=function(e){var t,i=this.element.offsetWidth;if(e.touches&&1===e.touches.length)t=e.touches[0].pageX-this.elementLeft;else{if(!e.pageX)return 0;t=e.pageX-this.elementLeft}return t<0?t=0:t>i&&(t=i),this.includeStep(t/i)},i.prototype.setOptions=function(){this.element.setAttribute("aria-valuemax",this.options.max.toString()),this.element.setAttribute("aria-label",this.options.ariaLabel),this.options.ariaLabeledBy&&this.element.setAttribute("aria-labeledby",this.options.ariaLabeledBy)},i.prototype.setAriaProps=function(){this.element.setAttribute("aria-valuenow",this.realValue.toString()),this.element.setAttribute("aria-valuetext",this.options.getValueText(this.realValue,this.options))},i.prototype.limitValue=function(e){return e<0?0:e>1?1:e},i.prototype.includeStep=function(e){var t=this.options.step/this.range;return this.options.snap&&(e=(e=Math.round(e/t)*t)*this.range/this.range),this.limitValue(e)},i.prototype.updateTooltip=function(e,t,i){this.options.getTooltipText&&(i.style.left=100*e+"%",i.innerHTML=this.options.getTooltipText(t,this.options))},i.prototype.updateValueTooltip=function(e){this.updateTooltip(e,this.realValue,this.valueTooltipElement)},i.prototype.updateHoverTooltip=function(e){this.updateTooltip(e,parseFloat((e*this.range+this.options.min).toFixed(4)),this.hoverTooltipElement)},i.prototype.updateValue=function(e){if(this.handleElement.style.left=100*e+"%",this.progressElement.style.width=100*e+"%",this.value!==e||void 0===e){var t=this.getRealValue();this.value=e,this.realValue=this.getRealValue(),this.realValue!==t&&(this.setAriaProps(),this.updateValueTooltip(e)),this.isDragging&&this.setHoverScale(0)}},i.prototype.setHoverScale=function(e){this.hoverElement.style.width=100*e+"%"},i.prototype.getRealValue=function(){return parseFloat((this.value*this.range+this.options.min).toFixed(4))},i.prototype.unbind=function(){this.element.removeEventListener("touchstart",this.handleTouchStart),window.removeEventListener("touchmove",this.handleTouchMove),window.removeEventListener("touchend",this.handleDragEnd),this.element.removeEventListener("mouseenter",this.handleMouseEnter),this.element.removeEventListener("mouseleave",this.handleMouseLeave),this.element.removeEventListener("mousedown",this.handleDragStart),window.removeEventListener("mouseup",this.handleDragEnd),window.removeEventListener("mousemove",this.handleMouseMove),this.element.removeEventListener("keydown",this.handleKeyDown)},i.prototype.getValue=function(){if(!this.isDestroyed)return this.realValue;console.warn("ProgressBar instance is destroyed, options: ",this.options)},i.prototype.setValue=function(e){this.isDestroyed?console.warn("ProgressBar instance is destroyed, options: ",this.options):this.isDragging||this.updateValue(this.includeStep(e/this.range))},i.prototype.setBufferValue=function(e){this.isDestroyed?console.warn("ProgressBar instance is destroyed, options: ",this.options):this.bufferElement.style.width=e/this.range+"%"},i.prototype.disable=function(){this.isDestroyed?console.warn("ProgressBar instance is destroyed, options: ",this.options):(this.options.disabled=!0,this.element.classList.add(this.options.className+"--disabled"),this.element.setAttribute("aria-disabled","true"),this.element.setAttribute("disabled","true"),this.element.setAttribute("tabindex","-1"))},i.prototype.enable=function(){this.isDestroyed?console.warn("ProgressBar instance is destroyed, options: ",this.options):(this.options.disabled=!1,this.element.classList.remove(this.options.className+"--disabled"),this.element.setAttribute("tabindex","0"))},i.prototype.destroy=function(){this.isDestroyed?console.warn("ProgressBar instance is already destroyed"):(this.unbind(),this.element.innerHTML="",this.isDestroyed=!0,this.element.classList.remove(this.options.className),this.element.removeAttribute("tabindex"),this.element.removeAttribute("role"),this.element.removeAttribute("aria-valuemin"),this.element.removeAttribute("aria-valuemax"),this.element.removeAttribute("aria-label"),this.element.removeAttribute("aria-valuenow"),this.element.removeAttribute("aria-valuetext"),this.options.ariaLabeledBy&&this.element.removeAttribute("aria-labeledby"))};export default i;
//# sourceMappingURL=aria-progress-range-slider.mjs.map
