'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let lang='ar',category='thumbnails',projects=[],activeIndex=0;
try{lang=localStorage.getItem('tamam-language')==='en'?'en':'ar'}catch{}
const text=(ar,en)=>lang==='ar'?ar:en;
const whatsapp=(message)=>'https://wa.me/201125760734?text='+encodeURIComponent(message);
const services=[['بوستر سوشيال ميديا','Social media poster',200],['تصميم صورة مصغرة','YouTube thumbnail',250],['غلاف وبروفايل فيسبوك','Facebook cover & profile',300],['غلاف كتاب كامل','Full book cover',300],['شهادة تقدير تكسير','Die-cut appreciation certificate',500],['شهادة تقدير عادية','Standard appreciation certificate',350]];
function translate(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 $$('[data-ar][data-en]').forEach(el=>el.textContent=el.dataset[lang].replaceAll('\\n','\n'));
 $('#language-label').textContent=lang==='ar'?'EN':'عربي';
 $('#language').setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل إلى العربية');
 $('#menu-toggle').setAttribute('aria-label',text('فتح القائمة','Open menu'));
 document.title=text('تمّام إسماعيل — تصميمك في التمام','Tamam Ismail — Graphic Designer');
 updateThemeLabel();renderGallery();renderPricing();if($('#lightbox').open)showImage();
}
function renderPricing(){
 $('#individual-prices').replaceChildren(...services.map(([ar,en,price])=>{
 const card=document.createElement('article');card.className='price-item';
 const title=document.createElement('h3');title.textContent=text(ar,en);
 const bottom=document.createElement('div');bottom.className='price-bottom';
 const amount=document.createElement('span');amount.className='price-amount';amount.append(String(price));
 const unit=document.createElement('small');unit.textContent=text('ج.م','EGP');amount.append(unit);
 const link=document.createElement('a');link.href=whatsapp(text('أهلًا تمّام، مهتم بخدمة '+ar+' بسعر '+price+' جنيه. حابب أعرف التفاصيل.','Hi Tamam, I’m interested in '+en+' for EGP '+price+'. Let’s discuss the details.'));link.target='_blank';link.rel='noopener noreferrer';link.textContent=text('اطلب الآن ↗','Order now ↗');link.setAttribute('aria-label',text('اطلب '+ar,'Request '+en));bottom.append(amount,link);card.append(title,bottom);return card;
 }));
 $('#packages').replaceChildren(...[10,20,30].map((count,i)=>{
 const card=document.createElement('article');card.className='package'+(i===1?' featured':'');
 const label=document.createElement('div');label.className='package-label';label.innerHTML='<span></span><span aria-hidden="true">✳</span>';label.firstElementChild.textContent=text('باقة المدرسين','TEACHER PACKAGE');
 const number=document.createElement('div');number.className='package-count';number.append(String(count));const unit=document.createElement('small');unit.textContent=text('تصميم','designs');number.append(unit);
 const amount=document.createElement('div');amount.className='package-price';amount.append((count*150).toLocaleString('en-US'));const currency=document.createElement('small');currency.textContent=text('جنيه مصري','EGP');amount.append(currency);
 const link=document.createElement('a');link.className='button';link.textContent=text('اشترك الآن ↗','Subscribe now ↗');link.href=whatsapp(text('أهلًا تمّام، مهتم بباقة '+count+' تصميم بسعر '+count*150+' جنيه. حابب نتفق على نوع التصميمات والتفاصيل.','Hi Tamam, I’m interested in the '+count+'-design package for EGP '+count*150+'. Let’s discuss design types and details.'));link.target='_blank';link.rel='noopener noreferrer';card.append(label,number,amount,link);return card;
 }));
}
function filtered(){return projects.filter(p=>p.category===category)}
function imagePath(p,small=false){return 'assets/work-'+String(p.id).padStart(2,'0')+(small?'-small':'')+'.webp'}
function renderGallery(){
 const gallery=$('#gallery');gallery.className='gallery'+(category==='social'?' social':'');gallery.setAttribute('aria-labelledby','tab-'+category);
 gallery.replaceChildren(...filtered().map((p,i)=>{
 const card=document.createElement('button');card.className='project';card.style.setProperty('--delay',Math.min(i,5)*45+'ms');card.setAttribute('aria-label',text('تكبير: ','View: ')+p[lang]+' — '+p['client_'+lang]);
 const frame=document.createElement('div');frame.className='project-image';const img=document.createElement('img');img.src=imagePath(p,true);img.srcset=imagePath(p,true)+' 900w, '+imagePath(p)+' 1800w';img.sizes=category==='social'?'(max-width:760px) 45vw, 30vw':'(max-width:440px) 90vw, 45vw';img.alt=p[lang]+' — '+p['client_'+lang];img.width=p.width;img.height=p.height;img.loading='lazy';img.decoding='async';const arrow=document.createElement('span');arrow.className='project-open';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');frame.append(img,arrow);
 const meta=document.createElement('div');meta.className='project-meta';const info=document.createElement('div');const title=document.createElement('h3');title.textContent=p[lang];const client=document.createElement('p');client.textContent=p['client_'+lang];info.append(title,client);const index=document.createElement('span');index.textContent=String(i+1).padStart(2,'0')+' / '+text(category==='social'?'سوشيال':'صورة مصغرة',category==='social'?'SOCIAL':'THUMBNAIL');meta.append(info,index);card.append(frame,meta);card.addEventListener('click',()=>{activeIndex=i;showImage();$('#lightbox').showModal()});return card;
 }));
 $('#gallery-status').textContent=text('عدد الأعمال: ','Works displayed: ')+filtered().length;
}
function setCategory(value){category=value;$$('[data-category]').forEach(button=>{const selected=button.dataset.category===category;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});renderGallery()}
$$('[data-category]').forEach(button=>{button.addEventListener('click',()=>setCategory(button.dataset.category));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'thumbnails':event.key==='End'?'social':category==='social'?'thumbnails':'social';setCategory(next);$('#tab-'+next).focus()}})});
function showImage(){const list=filtered(),p=list[activeIndex];if(!p)return;$('#lightbox-image').src=imagePath(p);$('#lightbox-image').alt=p[lang]+' — '+p['client_'+lang];$('#lightbox-title').textContent=p[lang];$('#lightbox-client').textContent=p['client_'+lang];$('#lightbox-count').textContent=String(activeIndex+1).padStart(2,'0')+' / '+list.length}
function advance(delta){activeIndex=(activeIndex+delta+filtered().length)%filtered().length;showImage()}
$('#next').addEventListener('click',()=>advance(1));$('#previous').addEventListener('click',()=>advance(-1));$('#close-lightbox').addEventListener('click',()=>$('#lightbox').close());
$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
$('#lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();advance(1)}else if(e.key==='ArrowLeft'){e.preventDefault();advance(-1)}});
$('#language').addEventListener('click',()=>{lang=lang==='ar'?'en':'ar';try{localStorage.setItem('tamam-language',lang)}catch{}translate()});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#mobile-nav').hidden;$('#mobile-nav').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').textContent=open?'×':'☰'});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').textContent='☰'}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-nav').hidden){$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').textContent='☰';$('#menu-toggle').focus()}});
let queued=false;window.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(max>0?scrollY/max*100:0)+'%';queued=false})},{passive:true});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el))}
translate();
projects=window.PORTFOLIO_PROJECTS || [];renderGallery();

function updateThemeLabel(){const light=document.documentElement.dataset.theme==='light';const label=text(light?'تفعيل الوضع الداكن':'تفعيل الوضع الفاتح',light?'Switch to dark mode':'Switch to light mode');const button=$('#theme-toggle');button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(light));button.firstElementChild.textContent=light?'☾':'☀'}
$('#theme-toggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=theme;try{localStorage.setItem('tamam-theme',theme)}catch{}updateThemeLabel()});
const navTargets=['home','work','pricing','about'].map(id=>document.getElementById(id));
function updateNavigation(){let current='home';for(const section of navTargets.slice().sort((a,b)=>a.offsetTop-b.offsetTop)){if(section.getBoundingClientRect().top<=160)current=section.id}$$('nav a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});$('.site-header').classList.toggle('scrolled',scrollY>25)}
window.addEventListener('scroll',updateNavigation,{passive:true});updateNavigation();
