// Mobile nav
document.addEventListener('click',e=>{const t=e.target.closest('.nav-toggle');if(t)t.closest('.nav').classList.toggle('open')});

// Quick Exit
function quickExit(){location.replace('https://www.bom.gov.au/')}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.quick-exit'))quickExit()});

// Build the hero ring of people
(function(){
  const g=document.getElementById('ring-people');if(!g)return;
  const ns="http://www.w3.org/2000/svg";
  const colors=["#e8583c","#d4622a","#e0a93f","#5a9152","#2a98a1","#7a4886","#2b4a73","#9e2b25"];
  const R=148,cx=210,cy=210,N=8;
  for(let i=0;i<N;i++){
    const a=(i/N)*Math.PI*2-Math.PI/2;
    const x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
    const grp=document.createElementNS(ns,'g');
    grp.setAttribute('class','ring-fig');grp.style.animationDelay=(i*0.35)+'s';
    const head=document.createElementNS(ns,'circle');
    head.setAttribute('cx',x);head.setAttribute('cy',y-15);head.setAttribute('r',11);head.setAttribute('fill',colors[i]);
    const body=document.createElementNS(ns,'path');
    body.setAttribute('d',`M${x-15},${y+22} Q${x},${y-10} ${x+15},${y+22} Z`);body.setAttribute('fill',colors[i]);
    grp.appendChild(body);grp.appendChild(head);g.appendChild(grp);
  }
})();

// Scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Count-up stats
const cuo=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;const el=e.target;const end=+el.dataset.count;const suf=el.dataset.suffix||'';
  let s=0;const dur=1400,t0=performance.now();
  function tick(now){const p=Math.min((now-t0)/dur,1);const v=Math.floor((1-Math.pow(1-p,3))*end);el.textContent=v+suf;if(p<1)requestAnimationFrame(tick)}
  requestAnimationFrame(tick);cuo.unobserve(el);
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cuo.observe(el));
