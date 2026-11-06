const stories = [...document.querySelectorAll('.story')];
const owls = [...document.querySelectorAll('.owl')];
const sprites = [...document.querySelectorAll('.sprite')];
const camp = document.querySelector('.camp');
const progress = document.querySelector('.progress');
const sky = document.querySelector('.sky-art');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v, min=0, max=1) => Math.max(min, Math.min(max,v));
const ease = v => v*v*(3-2*v);
let lastFrame = -1, geometry = [], campTop = 0, height = innerHeight, end = 1;
function measure(){height=innerHeight;geometry=stories.map(el=>({el,top:el.parentElement.offsetTop,size:el.parentElement.offsetHeight}));campTop=camp.offsetTop;end=document.documentElement.scrollHeight-height;}
function render(time){
 const y=scrollY;
 const travel = Math.max(0, document.documentElement.clientWidth * 3 - height);
 sky.style.transform = `translate3d(0,${-clamp(y/end)*travel}px,0)`;
 const landing=ease(clamp((y+height*.8-campTop)/(height*.5)));
 geometry.forEach(({el,top,size},i)=>{
  const offset=(top+size*.5-y-height*.5)/height;
  const visible=clamp((1.05-Math.abs(offset))/.55);
  el.style.opacity=reduced.matches?'1':visible;
  el.style.transform=reduced.matches?'none':`translate3d(0,${offset*55}px,0) scale(${.96+.04*visible})`;
 });
 owls.forEach((owl,i)=>{
  const bob=reduced.matches?0:Math.sin(time/750+i*2)*10;
  const drift=reduced.matches?0:Math.sin(y/680+i)*14;
  owl.style.opacity=1-landing;
  owl.style.visibility=landing>=1?'hidden':'visible';
  owl.style.transform=`translate3d(${drift+(i?-1:1)*landing*innerWidth*.18}px,${bob+landing*height*.22}px,0) rotate(${reduced.matches?0:Math.sin(time/1200+i)*3}deg) scale(${1-landing*.22})`;
 });
 const frame=reduced.matches?0:Math.floor(time/75)%36;
 if(frame!==lastFrame){sprites.forEach(s=>s.style.backgroundPosition=`${(frame%6)*20}% ${Math.floor(frame/6)*20}%`);lastFrame=frame;}
 progress.style.transform=`scaleX(${clamp(y/end)})`;
 requestAnimationFrame(render);
}
addEventListener('resize',measure,{passive:true});
addEventListener('load',measure);document.fonts.ready.then(measure);measure();requestAnimationFrame(render);
