!function(){"use strict";const e="active",t="fly",n=(e,t,...n)=>{for(const c of n)c.classList[e](t)};new Swiper(".swiper",{speed:800,loop:!0,breakpoints:{0:{slidesPerView:1.4,spaceBetween:8},480:{slidesPerView:2.2,spaceBetween:16},768:{slidesPerView:3.2,spaceBetween:16},992:{slidesPerView:4.3,spaceBetween:32}}}),document.querySelector(".burger-btn").addEventListener("click",(()=>{n("toggle","no-scroll",document.body)})),document.addEventListener("click",(function(c){const o=c.target;if(o.classList.contains("product__favorite-btn")){const c=o.closest(".product").dataset.pid;!function(c,o){if(!c.classList.contains(e)){n("add",e,c),n("add",t,c);const s=document.querySelector(".cart__icon"),i=document.querySelector(`[data-pid="${o}"]`).querySelector(".product__image"),r=i.cloneNode(!0),d=i.offsetWidth,a=i.offsetHeight,l=i.getBoundingClientRect().top,u=i.getBoundingClientRect().left;r.setAttribute("class","flyImage"),r.style.cssText=`\n            left: ${u}px;\n            top: ${l}px;\n            width: ${d}px;\n            height: ${a}px;\n        `,document.body.append(r);const p=s.getBoundingClientRect().left,f=s.getBoundingClientRect().top;r.style.cssText=`\n            left: ${p}px;\n            top: ${f}px;\n            width: 0px;\n            height: 0px;\n            opacity: 0;\n        `,r.addEventListener("transitionend",(()=>{c.classList.contains(t)&&(r.remove(),function(e,t,n=!0){const c=document.querySelector(".cart").querySelector(".cart__icon"),o=c.querySelector("span"),s=document.querySelector(`[data-cart-pid="${t}"]`);document.querySelector(".cart__list"),n&&(o?o.innerHTML=++o.innerHTML:c.insertAdjacentHTML("beforeend","<span>1</span>"),!s)&&document.querySelector(`[data-pid="${t}"]`).querySelector(".product__image")}(0,o),n("remove",t,c))}))}}(o,c)}}))}();