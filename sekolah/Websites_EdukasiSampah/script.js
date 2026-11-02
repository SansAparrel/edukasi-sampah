var L=[
    {n:"Organik",i:"🍌",bin:"Umumnya wadah hijau",d:"Sampah yang berasal dari makhluk hidup dan mudah terurai. Bisa diolah menjadi kompos.",l:["Sisa makanan","Daun kering","Kulit buah","Ranting"]},
    {n:"Anorganik",i:"🥤",bin:"Umumnya wadah kuning",d:"Sampah yang sulit terurai tetapi banyak yang bisa didaur ulang. Bersihkan dahulu sebelum disetor.",l:["Botol plastik","Kaleng","Kaca","Kemasan"]},
    {n:"B3 (Berbahaya)",i:"🔋",bin:"Umumnya wadah merah",d:"Bahan berbahaya dan beracun. Jangan dicampur dengan sampah biasa; serahkan ke tempat pengumpulan khusus.",l:["Baterai","Lampu neon","Obat kedaluwarsa","Elektronik bekas"]}];
    var tabs=document.getElementById('tabs'),panel=document.getElementById('panel');
    function show(k){panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');[].forEach.call(tabs.children,function(b,i){b.classList.toggle('on',i===k)});var v=L[k];
    panel.innerHTML='<h3>'+v.i+' '+v.n+'</h3><p>'+v.d+'</p><p><b>'+v.bin+'</b></p><p>'+v.l.map(function(x){return '<span class="tag">'+x+'</span>'}).join('')+'</p>'}
    L.forEach(function(v,i){var b=document.createElement('button');b.className='tab';b.textContent=v.i+' '+v.n;b.onclick=function(){show(i)};tabs.appendChild(b)});show(0);
    
    var T=[["Kulit pisang","beberapa minggu",6],["Kertas","beberapa bulan",15],["Kaleng","puluhan tahun",55],["Botol plastik","ratusan tahun",80],["Styrofoam","sangat lama, nyaris tak terurai",98]],bars=document.getElementById('bars');
    T.forEach(function(t){var r=document.createElement('div');r.className='row';r.innerHTML='<span><b>'+t[0]+'</b><em>'+t[1]+'</em></span><div class="bar"><i data-w="'+t[2]+'"></i></div>';bars.appendChild(r)});
    
    var G=[["🍌","Kulit pisang",0],["🥤","Botol plastik",1],["🔋","Baterai bekas",2],["🍂","Daun kering",0],["🥫","Kaleng",1],["💡","Lampu neon",2],["🍚","Sisa nasi",0],["🧴","Botol sampo kosong",1]],gi=0,gs=0,gb=document.getElementById('game-box'),names=["Organik","Anorganik","B3"],cls=["o","a","b"];
    function gr(){gb.classList.remove('swap');void gb.offsetWidth;gb.classList.add('swap');
    if(gi>=G.length){gb.innerHTML='<div class="item">'+(gs>=7?'🏆':'💪')+'</div><h3>Skor: '+gs+'/'+G.length+'</h3><button class="btn" style="background:var(--p);color:#fff;animation:none" id="gre">Main Lagi</button>';document.getElementById('gre').onclick=function(){gi=0;gs=0;gr()};return}
    var g=G[gi];gb.innerHTML='<div class="score">Barang '+(gi+1)+'/'+G.length+' · Skor '+gs+'</div><div class="item">'+g[0]+'</div><div class="gname">'+g[1]+'</div><div class="bins"></div><div class="fb" id="fb"></div>';
    var bn=gb.querySelector('.bins');names.forEach(function(n,i){var b=document.createElement('button');b.className='bin '+cls[i];b.textContent=n;b.onclick=function(){[].forEach.call(bn.children,function(x){x.disabled=true});
    var ok=i===g[2];if(ok)gs++;document.getElementById('fb').textContent=ok?'✅ Tepat sekali!':'❌ Seharusnya '+names[g[2]]+'.';setTimeout(function(){gi++;gr()},1100)};bn.appendChild(b)})}
    gr();
    
    var qs=[
    {q:"Sampah yang paling cocok dijadikan kompos adalah…",o:["Sisa sayur","Plastik","Baterai"],a:0},
    {q:"Sampah yang menyumbat selokan dapat memicu…",o:["Kemarau","Banjir","Gempa"],a:1},
    {q:"Baterai bekas termasuk sampah…",o:["Organik","Anorganik biasa","B3"],a:2},
    {q:"Arti dari “Reduce” adalah…",o:["Mengurangi","Membakar","Membuang"],a:0},
    {q:"Tindakan terbaik terhadap sampah plastik adalah…",o:["Dibuang ke sungai","Dipilah dan didaur ulang","Dibakar di halaman"],a:1}],qi=0,sc=0,qe=document.getElementById('quiz');
    function render(){qe.classList.remove('swap');void qe.offsetWidth;qe.classList.add('swap');
    if(qi>=qs.length){qe.innerHTML='<h3>Skor kamu: '+sc+'/'+qs.length+' '+(sc>=4?'🏆':'💪')+'</h3><button class="btn" style="background:var(--p);color:#fff;animation:none" id="re">Ulangi</button>';document.getElementById('re').onclick=function(){qi=0;sc=0;render()};return}
    var s=qs[qi];qe.innerHTML='<p><b>Soal '+(qi+1)+'/'+qs.length+'</b></p><h3>'+s.q+'</h3>';
    s.o.forEach(function(t,i){var b=document.createElement('button');b.className='opt';b.textContent=t;b.onclick=function(){var all=qe.querySelectorAll('.opt');[].forEach.call(all,function(x){x.disabled=true});
    if(i===s.a){b.classList.add('ok');sc++}else{b.classList.add('no');all[s.a].classList.add('ok')}setTimeout(function(){qi++;render()},900)};qe.appendChild(b)})}
    render();
    
    document.getElementById('pledge').onclick=function(){var m=document.getElementById('pmsg');m.textContent='🎉 Terima kasih! Bumi berterima kasih padamu.';var f=['🍃','♻️','🌱','💚'];
    for(var i=0;i<14;i++){var s=document.createElement('span');s.textContent=f[i%4];s.style.cssText='position:fixed;z-index:60;font-size:1.8rem;pointer-events:none;left:'+(10+Math.random()*80)+'vw;top:100vh;transition:transform 1.8s ease-out,opacity 1.8s';document.body.appendChild(s);
    (function(s){setTimeout(function(){s.style.transform='translateY(-'+(40+Math.random()*50)+'vh) rotate(360deg)';s.style.opacity='0'},30);setTimeout(function(){s.remove()},2000)})(s)}};
    
    document.querySelectorAll('.grid').forEach(function(g){[].forEach.call(g.children,function(c,i){c.style.setProperty('--d',(i*.1)+'s')})});
    [].forEach.call(bars.children,function(c,i){c.style.setProperty('--d',(i*.12)+'s')});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');e.target.querySelectorAll('.bar i').forEach(function(b){b.style.width=b.dataset.w+'%'})}})},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(e){io.observe(e)});
    var links=document.querySelectorAll('nav a'),so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)[].forEach.call(links,function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -50% 0px'});
    document.querySelectorAll('section').forEach(function(s){so.observe(s)});
    var pr=document.getElementById('prog'),tp=document.getElementById('top');
    addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;pr.style.width=(h>0?scrollY/h*100:0)+'%';tp.classList.toggle('on',scrollY>500)},{passive:true});
    tp.onclick=function(){scrollTo({top:0,behavior:'smooth'})};
    if(matchMedia('(hover:hover)').matches){document.querySelectorAll('.card').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(600px) rotateY('+x*10+'deg) rotateX('+(-y*10)+'deg) translateY(-6px)'});c.addEventListener('mouseleave',function(){c.style.transform=''})})}
    (function(){var ld=document.getElementById('loader'),t=document.getElementById('ttl'),fg=document.getElementById('fg'),pc=document.getElementById('pct'),done=false,st=Date.now(),D=3200;
    'Buang Sampah'.split('').forEach(function(ch,i){var s=document.createElement('span');s.textContent=ch===' '?'\u00a0':ch;s.style.setProperty('--i',i);t.appendChild(s)});
    for(var i=0;i<14;i++){var l=document.createElement('span');l.className='lf';l.textContent=['🍃','🌱','♻️'][i%3];l.style.left=(Math.random()*96)+'%';l.style.animationDuration=(4+Math.random()*4)+'s';l.style.animationDelay=(-Math.random()*6)+'s';ld.appendChild(l)}
    function finish(){if(done)return;done=true;fg.style.strokeDashoffset=0;pc.textContent='100%';for(var j=0;j<14;j++){var b=document.createElement('span'),a=j/14*6.283,r=140+Math.random()*160;b.className='bs';b.textContent=['🍃','🌱','♻️','✨'][j%4];b.style.setProperty('--dx',Math.cos(a)*r+'px');b.style.setProperty('--dy',Math.sin(a)*r+'px');ld.appendChild(b)}ld.classList.add('out');document.body.classList.remove('lock');if(window.startTyping)setTimeout(window.startTyping,900);setTimeout(function(){ld.classList.add('gone')},1600)}
    function tick(){if(done)return;var p=Math.min(1,(Date.now()-st)/D),e=1-Math.pow(1-p,2),k=p<.34?0:p<.67?1:2;if(k!==window._tk){window._tk=k;var tg=document.getElementById('tag');tg.textContent=['Memilah sampah…','Mendaur ulang…','Menjaga bumi…'][k];tg.classList.remove('swap');void tg.offsetWidth;tg.classList.add('swap')}fg.style.strokeDashoffset=314*(1-e);pc.textContent=Math.round(e*100)+'%';if(p<1)requestAnimationFrame(tick);else finish()}
    document.getElementById('skip').onclick=finish;setTimeout(finish,D+800);requestAnimationFrame(tick)})();
    (function(){var el=document.getElementById('typed'),P=['Memilah sampah dari rumah 🏠','Menjaga sungai tetap bersih 🌊','Mendaur ulang untuk masa depan ♻️','Membuang sampah pada tempatnya 💚'],pi=0,ci=0,del=false,go=false;
    function step(){var ch=Array.from(P[pi]),d=del?35:75;el.textContent=ch.slice(0,ci).join('');
    if(!del&&ci===ch.length){d=1600;del=true}else if(del&&ci===0){del=false;pi=(pi+1)%P.length;d=400}else{ci+=del?-1:1}setTimeout(step,d)}
    window.startTyping=function(){if(go)return;go=true;if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=P[0];return}step()}})();
    (function(){
    [].forEach.call(document.querySelectorAll('.fc'),function(c){c.onclick=function(){c.classList.toggle('flip')}});
    var CH=[{n:[['🗑️','Dibuang sembarangan'],['🌧️','Hujan membawa ke selokan'],['🚧','Selokan tersumbat'],['🌊','Banjir & sungai tercemar'],['🐟','Mikroplastik di rantai makanan']],cap:'Satu sampah yang dibuang sembarangan bisa memulai rantai masalah panjang yang akhirnya merugikan banyak orang.'},{n:[['🏠','Dipilah di rumah'],['🚛','Diangkut sesuai jenis'],['🏭','Bank sampah / TPS3R'],['♻️','Daur ulang & kompos'],['🌱','Sisa ke TPA berkurang']],cap:'Sampah yang dipilah punya kesempatan kedua: didaur ulang, dikomposkan, dan mengurangi beban TPA.'}],ch=document.getElementById('chain'),sw=document.getElementById('sw'),pill=document.getElementById('pill'),cap=document.getElementById('cap'),sb=sw.querySelectorAll('button'),cur=0;
    function build(k){cur=k;ch.className='chain '+(k?'good':'bad');ch.innerHTML='';CH[k].n.forEach(function(x,i){if(i){var a=document.createElement('span');a.className='ar';a.textContent='➜';a.style.setProperty('--i',i*2-1);ch.appendChild(a)}var n=document.createElement('div');n.className='nd';n.style.setProperty('--i',i*2);n.innerHTML=`<span class='ic'>${x[0]}</span>${x[1]}`;ch.appendChild(n)});cap.textContent=CH[k].cap;[].forEach.call(sb,function(b,j){b.classList.toggle('on',j===k)});pill.style.left=sb[k].offsetLeft+'px';pill.style.width=sb[k].offsetWidth+'px';pill.style.background=k?'':'#dc2626'}
    [].forEach.call(sb,function(b,j){b.onclick=function(){build(j)}});build(0);
    var seen=false;new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!seen){seen=true;build(cur)}},{threshold:.3}).observe(document.getElementById('alur'));
    function count(el,to){var from=el._d||0,st=performance.now(),tk=el._k=(el._k||0)+1;(function f(now){if(el._k!==tk)return;var p=Math.min(1,(now-st)/700),e=1-Math.pow(1-p,3);el._d=Math.round(from+(to-from)*e);el.textContent=el._d.toLocaleString('id-ID');if(p<1)requestAnimationFrame(f)})(st)}
    var s=[1,2,3].map(function(i){return document.getElementById('s'+i)});
    function calc(){var a=+s[0].value,b=+s[1].value,p=+s[2].value,t=(a+b)*365*p;document.getElementById('v1').textContent=a;document.getElementById('v2').textContent=b;document.getElementById('v3').textContent=p;count(document.getElementById('r1'),t);count(document.getElementById('r2'),Math.round(t/2))}
    s.forEach(function(x){x.oninput=calc});calc();
    var ST=[['Siapkan wadah','Gunakan ember atau komposter yang diberi lubang kecil agar udara bisa masuk.'],['Campur bahan','Padukan bahan basah (sisa sayur, kulit buah) dengan bahan kering (daun kering) secara seimbang.'],['Jaga kelembapan','Isinya harus lembap seperti spons yang diperas, tidak terlalu basah dan tidak kering.'],['Aduk berkala','Aduk beberapa hari sekali supaya mendapat udara dan tidak berbau.'],['Tunggu & panen','Setelah beberapa minggu, kompos matang berwarna gelap, gembur, dan berbau tanah. Hindari memasukkan daging dan minyak karena menimbulkan bau dan hama.']];
    var se=document.getElementById('steps');ST.forEach(function(x,i){var d=document.createElement('div');d.className='stp';d.style.setProperty('--d',(i*.15)+'s');d.innerHTML=`<div class='n'>${i+1}</div><div><b>${x[0]}</b><br>${x[1]}</div>`;se.appendChild(d)});
    })();
    (function(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;var E=['🍃','🍂','🌿','♻️'];
    for(var i=0;i<12;i++){var l=document.createElement('span');l.className='pl';l.textContent=E[i%4];l.style.left=(Math.random()*96)+'vw';l.style.fontSize=(1+Math.random()*1.2)+'rem';l.style.animationDuration=(14+Math.random()*14)+'s';l.style.animationDelay=(-Math.random()*20)+'s';l.style.setProperty('--s',(Math.random()*80-40)+'px');document.body.appendChild(l)}
    document.addEventListener('click',function(e){var F=['🍃','♻️','✨','🌱'];for(var i=0;i<7;i++){var s=document.createElement('span'),a=Math.random()*6.283,r=40+Math.random()*50;s.className='sp';s.textContent=F[i%4];s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');s.onanimationend=function(){this.remove()};document.body.appendChild(s)}})})();
    document.getElementById('theme').onclick=function(){var r=document.documentElement,d=getComputedStyle(r).colorScheme==='dark';r.setAttribute('data-theme',d?'light':'dark')};