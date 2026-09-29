(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=document.querySelector('.scene');if(!scene)return;
 const canvas=document.createElement('canvas');canvas.className='atmosphere';canvas.setAttribute('aria-hidden','true');scene.append(canvas);
 const light=document.createElement('div');light.className='scene-light';light.setAttribute('aria-hidden','true');scene.prepend(light);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const toggle=document.createElement('button');toggle.type='button';toggle.className='motion-toggle';toggle.textContent='Ⅱ Pausar efeitos';toggle.setAttribute('aria-pressed','false');document.querySelector('.hero').append(toggle);
 let paused=false,visible=true,frame=0,last=0,time=0,w=0,h=0,cup={x:0,y:0},touch=0,drift=0,lastScroll=scrollY;
 const sprite=document.createElement('canvas');sprite.width=sprite.height=64;const brush=sprite.getContext('2d');const haze=brush.createRadialGradient(32,32,0,32,32,32);haze.addColorStop(0,'rgba(225,213,187,.36)');haze.addColorStop(.35,'rgba(215,210,193,.19)');haze.addColorStop(1,'rgba(210,202,189,0)');brush.fillStyle=haze;brush.fillRect(0,0,64,64);
 function resize(){const r=scene.getBoundingClientRect();w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const s=getComputedStyle(scene);const parts=s.backgroundSize.split(' ');let iw,ih;if(parts[0]==='auto'&&parts[1]?.endsWith('px')){ih=parseFloat(parts[1]);iw=ih*1672/940}else{const scale=Math.max(w/1672,h/940);iw=1672*scale;ih=940*scale}const p=s.backgroundPosition.split(' ');const pos=(v)=>v==='top'||v==='left'?0:v==='right'||v==='bottom'?1:v?.endsWith('%')?parseFloat(v)/100:.5;cup={x:(w-iw)*pos(p[0])+iw*.48,y:(h-ih)*pos(p[1])+ih*.384};}
 function allowed(){return !reduced.matches&&!paused&&visible&&!document.hidden&&!document.body.classList.contains('modal-open')}
 function sync(){if(allowed()&&!frame){last=0;frame=requestAnimationFrame(draw)}else if(!allowed()){cancelAnimationFrame(frame);frame=0;if(reduced.matches)ctx.clearRect(0,0,w,h)}}
 function draw(stamp){frame=0;if(!allowed())return;if(last&&stamp-last<32){frame=requestAnimationFrame(draw);return}const dt=last?Math.min((stamp-last)/1000,.06):.033;last=stamp;time+=dt;touch*=.94;drift*=.94;ctx.clearRect(0,0,w,h);
  const rise=innerWidth<601?145:190;
  // Overlapping low-opacity vapor puffs form continuous, gently curling strands.
  for(let i=0;i<34;i++){const phase=(time*.13+i/34)%1;const spread=7+phase*28;const x=cup.x+Math.sin(phase*7+time*.65)*spread+Math.sin(phase*13+time*.3)*7+drift*phase+touch*Math.sin(phase*9)*phase;const y=cup.y-phase*rise;const radius=12+phase*39;ctx.globalAlpha=Math.sin(phase*Math.PI)*.5;ctx.drawImage(sprite,x-radius,y-radius,radius*2,radius*2)}
  const count=innerWidth<601?12:24;for(let i=0;i<count;i++){const x=((i*137.29+Math.sin(time*.12+i)*16)%w+w)%w;const y=((i*73.13-time*(2+i%3))%h+h)%h;const alpha=(.12+.11*Math.sin(time*.6+i))*(1-Math.abs(x/w-.6)*.65);ctx.globalAlpha=Math.max(0,alpha);ctx.fillStyle='#ddbb85';ctx.beginPath();ctx.arc(x,y,i%3===0?1.25:.7,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;frame=requestAnimationFrame(draw);
 }
 toggle.addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('motion-paused',paused);toggle.textContent=paused?'▶ Ativar efeitos':'Ⅱ Pausar efeitos';toggle.setAttribute('aria-pressed',String(paused));sync()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(scene);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',resize,{passive:true});addEventListener('scroll',()=>{drift=Math.max(-16,Math.min(16,(scrollY-lastScroll)*.3));lastScroll=scrollY},{passive:true});
 document.querySelector('.hero').addEventListener('pointerdown',e=>{const r=scene.getBoundingClientRect();if(Math.hypot(e.clientX-r.left-cup.x,e.clientY-r.top-cup.y)<180)touch=24},{passive:true});
 reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 for(const section of document.querySelectorAll('.detail')){const dialog=section.closest('dialog');if(dialog)dialog.dataset.chapter=section.id;const fx=document.createElement('div');fx.className='section-fx';fx.setAttribute('aria-hidden','true');section.prepend(fx);if(section.id==='musica'){const bars=document.createElement('div');bars.className='music-motion';bars.setAttribute('aria-hidden','true');for(let i=0;i<20;i++){const bar=document.createElement('span');bar.style.setProperty('--bar',i);bars.append(bar)}section.querySelector('h2').after(bars)}}
 const cardObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');cardObserver.unobserve(e.target)}},{threshold:.12});document.querySelectorAll('.chapter-card').forEach((card,i)=>{card.style.setProperty('--chapter-index',i);cardObserver.observe(card)});
 resize();sync();
})();
