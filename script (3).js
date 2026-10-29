const IMG="https://image.tmdb.org/t/p/w342";
const DEMO=[
{id:1,title:"Inception",release_date:"2010-07-16",vote_average:8.4,overview:"A thief who steals secrets from people’s dreams is offered a chance to plant an idea instead."},
{id:2,title:"The Dark Knight",release_date:"2008-07-18",vote_average:8.5,overview:"Batman faces the Joker, a criminal mastermind who pushes Gotham into chaos."},
{id:3,title:"Interstellar",release_date:"2014-11-07",vote_average:8.4,overview:"A team of explorers travels through a wormhole to find a new home for humanity."},
{id:4,title:"Parasite",release_date:"2019-05-30",vote_average:8.5,overview:"A poor family slowly works its way into the life of a wealthy household."},
{id:5,title:"The Matrix",release_date:"1999-03-31",vote_average:8.2,overview:"A hacker discovers that his reality is a simulation controlled by machines."},
{id:6,title:"Gladiator",release_date:"2000-05-05",vote_average:8.2,overview:"A betrayed Roman general returns as a gladiator to take revenge on the emperor."},
{id:7,title:"Coco",release_date:"2017-11-22",vote_average:8.2,overview:"A boy who loves music travels to the Land of the Dead to uncover his family’s past."},
{id:8,title:"Spirited Away",release_date:"2001-07-20",vote_average:8.5,overview:"A girl enters a world of spirits and must work to free her parents."}
];
const $=id=>document.getElementById(id);
const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let key=get("cine-key")||"";
let favs=[];try{favs=JSON.parse(get("cine-favs")||"[]")}catch(e){}
let tab="disc",q="",timer,list=[];
const isFav=id=>favs.some(f=>f.id===id);
const year=m=>(m.release_date||"").slice(0,4)||"N/A";
const colors=["#7a3b8f","#2f6f8f","#8f4a2f","#3b7a5a","#8f2f55","#4a4f9a"];

function banner(){
  const b=$("banner");b.innerHTML="";
  if(key){
    b.className="";return;
  }
  b.className="banner";
  b.innerHTML='<span>Demo mode: showing sample movies. Add your free <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener">TMDB API key</a> for real search.</span><input id="k" placeholder="Paste API key (v3)" aria-label="TMDB API key"><button id="ks">Save</button>';
  $("ks").onclick=()=>{
    const v=$("k").value.trim();if(!v)return;
    key=v;set("cine-key",v);banner();load();
  };
}
function poster(m){
  if(m.poster_path){const i=document.createElement("img");i.className="poster";i.loading="lazy";i.alt=m.title;i.src=IMG+m.poster_path;return i}
  const d=document.createElement("div");d.className="ph";d.textContent=m.title;
  d.style.background=colors[m.id%colors.length];return d;
}
function toggleFav(m){
  if(isFav(m.id))favs=favs.filter(f=>f.id!==m.id);
  else favs.push({id:m.id,title:m.title,release_date:m.release_date,vote_average:m.vote_average,overview:m.overview,poster_path:m.poster_path});
  set("cine-favs",JSON.stringify(favs));
  $("tFav").textContent="Favorites ("+favs.length+")";
}
function render(){
  const g=$("grid");g.innerHTML="";
  $("status").textContent=list.length?"":(tab==="fav"?"No favorites yet. Tap the heart on a movie.":"No movies found.");
  list.forEach(m=>{
    const c=document.createElement("article");c.className="card";c.tabIndex=0;
    c.appendChild(poster(m));
    const r=document.createElement("span");r.className="rate";r.textContent="★ "+(m.vote_average||0).toFixed(1);
    const h=document.createElement("button");h.className="heart"+(isFav(m.id)?" on":"");h.textContent="♥";h.setAttribute("aria-label","Toggle favorite");
    h.onclick=e=>{e.stopPropagation();toggleFav(m);h.classList.toggle("on",isFav(m.id));if(tab==="fav")load()};
    const i=document.createElement("div");i.className="info";
    i.innerHTML='<div class="t"></div><div class="s"><span>'+year(m)+'</span></div>';
    i.querySelector(".t").textContent=m.title;
    c.append(r,h,i);
    c.onclick=()=>openModal(m);
    c.onkeydown=e=>{if(e.key==="Enter")openModal(m)};
    g.appendChild(c);
  });
}
async function load(){
  $("head").textContent=tab==="fav"?"Your favorites":(q?"Results for “"+q+"”":"Popular movies");
  const low=q.toLowerCase();
  if(tab==="fav"){list=favs.filter(m=>m.title.toLowerCase().includes(low));render();return}
  if(!key){list=DEMO.filter(m=>m.title.toLowerCase().includes(low));render();return}
  $("status").textContent="Loading…";$("grid").innerHTML="";
  try{
    const path=q?"search/movie?query="+encodeURIComponent(q)+"&":"movie/popular?";
    const r=await fetch("https://api.themoviedb.org/3/"+path+"api_key="+encodeURIComponent(key));
    if(!r.ok)throw new Error(r.status);
    list=(await r.json()).results;render();
  }catch(e){
    list=[];render();
    $("status").textContent="Could not load movies. Check your API key and internet connection.";
  }
}
async function openModal(m){
  const d=$("dlg");let det=m;
  const draw=()=>{
    d.innerHTML='<div class="m"><div id="pp"></div><div><h3></h3><div class="meta"></div><p></p><div class="btns"><button class="fav"></button><button id="cl">Close</button></div></div></div>';
    d.querySelector("#pp").appendChild(poster(det));
    d.querySelector("h3").textContent=det.title;
    const genres=(det.genres||[]).map(g=>g.name).join(", ");
    d.querySelector(".meta").textContent=[year(det),det.runtime?det.runtime+" min":"","★ "+(det.vote_average||0).toFixed(1),genres].filter(Boolean).join(" · ");
    d.querySelector("p").textContent=det.overview||"No description available.";
    const f=d.querySelector(".fav");f.textContent=isFav(m.id)?"♥ Remove from favorites":"♡ Add to favorites";
    f.onclick=()=>{toggleFav(m);draw();if(tab==="fav")load();else render()};
    d.querySelector("#cl").onclick=()=>d.close();
  };
  draw();d.showModal();
  if(key){
    try{
      const r=await fetch("https://api.themoviedb.org/3/movie/"+m.id+"?api_key="+encodeURIComponent(key));
      if(r.ok&&d.open){det=await r.json();draw()}
    }catch(e){}
  }
}
$("dlg").addEventListener("click",e=>{if(e.target===$("dlg"))$("dlg").close()});
$("q").addEventListener("input",e=>{q=e.target.value.trim();clearTimeout(timer);timer=setTimeout(load,400)});
$("tDisc").onclick=()=>{tab="disc";$("tDisc").classList.add("on");$("tFav").classList.remove("on");load()};
$("tFav").onclick=()=>{tab="fav";$("tFav").classList.add("on");$("tDisc").classList.remove("on");load()};
$("tFav").textContent="Favorites ("+favs.length+")";
banner();load();
