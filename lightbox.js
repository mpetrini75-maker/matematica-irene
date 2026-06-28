/* =======================================================================
   lightbox.js — Apre le infografiche DENTRO la pagina (overlay) invece che
   in una scheda separata, così c'è sempre un tasto "✕ Chiudi" per tornare
   indietro (importante nell'app installata / standalone, dove un PNG aperto
   da solo non ha la barra di navigazione).

   Intercetta tutti i link a "*-infografica.png": al clic mostra l'immagine
   in un overlay a tutto schermo. Si chiude con il bottone ✕, col tasto ESC
   o toccando lo sfondo. Tap sull'immagine = ingrandisci/riduci per leggere.
   ======================================================================= */
(function () {
  "use strict";

  function apri(src, testo, audioSrc) {
    var ov = document.createElement("div");
    ov.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.9);" +
      "display:flex;flex-direction:column;align-items:center;overflow:auto;padding:12px;";

    var bar = document.createElement("div");
    bar.style.cssText =
      "position:sticky;top:0;width:100%;display:flex;justify-content:flex-end;margin-bottom:8px;";

    var btn = document.createElement("button");
    btn.textContent = "✕ Chiudi";
    btn.setAttribute("aria-label", "Chiudi");
    btn.style.cssText =
      "background:#fff;color:#333;border:none;border-radius:12px;padding:10px 18px;" +
      "font-size:1rem;font-weight:bold;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4);";

    // Player audio (overview) dentro l'overlay: ascolta mentre guardi l'infografica
    var audioWrap = null;
    if (audioSrc) {
      audioWrap = document.createElement("div");
      audioWrap.style.cssText =
        "position:sticky;top:48px;width:100%;max-width:520px;background:rgba(255,255,255,.95);" +
        "border-radius:12px;padding:10px 12px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.3);";
      var lbl = document.createElement("div");
      lbl.textContent = "🎧 Ascolta la spiegazione mentre guardi";
      lbl.style.cssText = "font-size:.9rem;font-weight:bold;color:#333;margin-bottom:6px;";
      var audio = document.createElement("audio");
      audio.controls = true;
      audio.src = audioSrc;
      audio.style.cssText = "width:100%;";
      audioWrap.appendChild(lbl);
      audioWrap.appendChild(audio);
    }

    var img = document.createElement("img");
    img.src = src;
    img.alt = testo || "Infografica";
    var fit = true; // true = adattata allo schermo, false = dimensione piena (zoom)
    function applica() {
      img.style.cssText = fit
        ? "max-width:100%;height:auto;margin:auto;border-radius:10px;cursor:zoom-in;"
        : "max-width:none;width:auto;height:auto;margin:auto;border-radius:10px;cursor:zoom-out;";
    }
    applica();

    var hint = document.createElement("div");
    hint.textContent = "Tocca l'immagine per ingrandire · ✕ per chiudere";
    hint.style.cssText = "color:#fff;opacity:.7;font-size:.85rem;text-align:center;margin:10px 0;";

    bar.appendChild(btn);
    ov.appendChild(bar);
    if (audioWrap) ov.appendChild(audioWrap);
    ov.appendChild(img);
    ov.appendChild(hint);

    function chiudi() {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") chiudi(); }

    btn.addEventListener("click", chiudi);
    ov.addEventListener("click", function (e) { if (e.target === ov) chiudi(); });
    img.addEventListener("click", function (e) { e.stopPropagation(); fit = !fit; applica(); });
    document.addEventListener("keydown", onKey);

    document.body.appendChild(ov);
  }

  function init() {
    var links = document.querySelectorAll('a[href$="-infografica.png"]');
    Array.prototype.forEach.call(links, function (a) {
      a.removeAttribute("target");
      a.removeAttribute("rel");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        apri(a.getAttribute("href"), a.textContent, a.getAttribute("data-audio"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
