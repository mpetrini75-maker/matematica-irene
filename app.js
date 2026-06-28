/* Matematica di Irene — utilità condivise */
function toggleSol(id, btn){
  var el = document.getElementById(id);
  if(!el) return;
  var open = el.classList.toggle("open");
  if(btn) btn.textContent = open ? "🙈 Nascondi soluzioni" : "🔑 Mostra soluzioni";
}

/* =====================================================================
   Esercizi interattivi "prova tu" dentro la LEZIONE (svolgibili in pagina).
   Due tipi: Vero/Falso (esVF) e risposta numerica (esFill).
   La pagina fornisce un <div id="..."></div> e chiama esVF/esFill con i dati.
   ===================================================================== */
var _ESX = {};
function esVF(elId, items){
  _ESX[elId] = items;
  var el = document.getElementById(elId); if(!el) return;
  el.innerHTML = items.map(function(it,i){
    return '<div class="qit"><p class="qtxt">'+(i+1)+'. '+it.t+'</p>'+
      '<div class="vfrow">'+
        '<button class="vfbtn" onclick="ansVF(\''+elId+'\','+i+',true,this)">Vero</button>'+
        '<button class="vfbtn" onclick="ansVF(\''+elId+'\','+i+',false,this)">Falso</button>'+
      '</div><div class="efb" id="'+elId+'_fb'+i+'"></div></div>';
  }).join("");
}
function ansVF(elId,i,choice,btn){
  var it = _ESX[elId][i];
  var fb = document.getElementById(elId+"_fb"+i);
  if(choice === it.a){
    btn.classList.add("ok");
    fb.innerHTML = "✅ Giusto! " + (it.sol||"");
    fb.className = "efb ok";
    var sib = btn.parentElement.children;
    for(var k=0;k<sib.length;k++) sib[k].disabled = true;
  } else {
    btn.classList.add("no");
    fb.innerHTML = "❌ Riprova, ragionaci 🙂";
    fb.className = "efb no";
    btn.disabled = true;
  }
}
function _numEs(s){ return parseFloat(String(s).trim().replace("−","-").replace(",", ".").replace(/\s+/g,"")); }
function esFill(elId, items){
  _ESX[elId] = items;
  var el = document.getElementById(elId); if(!el) return;
  el.innerHTML = items.map(function(it,i){
    return '<div class="qit"><p class="qtxt">'+(i+1)+'. '+it.q+'</p>'+
      '<div class="fillrow">'+
        '<input class="fillin" id="'+elId+'_in'+i+'" type="text" inputmode="text" autocomplete="off" placeholder="…">'+
        '<button class="ckbtn" onclick="ansFill(\''+elId+'\','+i+')">Controlla</button>'+
      '</div><div class="efb" id="'+elId+'_fb'+i+'"></div></div>';
  }).join("");
}
function ansFill(elId,i){
  var it = _ESX[elId][i];
  var inp = document.getElementById(elId+"_in"+i);
  var fb = document.getElementById(elId+"_fb"+i);
  var val = _numEs(inp.value);
  if(!isNaN(val) && Math.abs(val - it.a) < 0.01){
    inp.classList.add("ok"); inp.classList.remove("no");
    fb.innerHTML = "✅ Perfetto! " + (it.sol||"");
    fb.className = "efb ok";
  } else {
    inp.classList.add("no");
    fb.innerHTML = "💜 Quasi! " + (it.sol||"") + " Risposta: <b>" +
      String(it.a).replace("-","−").replace(".",",") + "</b>";
    fb.className = "efb no";
  }
}

/* Video esplicativi: carica l'iframe YouTube solo al click (pagina più leggera). */
function playVideo(box){
  if(!box || box.classList.contains("playing")) return;
  var id = box.getAttribute("data-id");
  if(!id) return;
  var ifr = document.createElement("iframe");
  ifr.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
  ifr.title = "Video esplicativo";
  ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  ifr.allowFullscreen = true;
  ifr.setAttribute("frameborder", "0");
  box.innerHTML = "";
  box.appendChild(ifr);
  box.classList.add("playing");
}
