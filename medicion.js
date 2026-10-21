/* Tucupón · Medición (Google Analytics 4 + píxel de Meta)
   ─────────────────────────────────────────────────────────
   Pegá los IDs acá abajo. Mientras estén vacíos no se carga nada ni aparece el aviso de cookies.
     GA4:  Analytics > Administrar > Flujos de datos > tu sitio > "ID de medición" (empieza con G-)
     Meta: Administrador de eventos > Orígenes de datos > tu píxel > "Identificador" (solo números)  */
const TC_GA4 = '';          // ej.: 'G-ABC123XYZ9'
const TC_META_PIXEL = '1649164420244756';   // Píxel "Tucupon Web" del porfolio tucupon

(function(){
  const ga = /^G-[A-Z0-9]{4,}$/.test(TC_GA4) ? TC_GA4 : '';
  const px = /^\d{10,20}$/.test(TC_META_PIXEL) ? TC_META_PIXEL : '';
  const activo = !!(ga || px);

  // Google Analytics 4
  if(ga){
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ga; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ga);
  }
  // Píxel de Meta
  if(px){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', px); fbq('track', 'PageView');
  }

  // Eventos: tcMedir('contacto', {canal: 'whatsapp'}) — se puede llamar aunque no haya IDs
  const META = {contacto: ['track', 'Contact'], ver_descuentos: ['trackCustom', 'VerDescuentos'], registro: ['track', 'CompleteRegistration']};
  window.tcMedir = function(evento, datos){
    datos = datos || {};
    try{ if(ga && window.gtag) gtag('event', evento === 'registro' ? 'sign_up' : evento, datos); }catch(e){}
    try{ if(px && window.fbq && META[evento]) fbq(META[evento][0], META[evento][1], datos); }catch(e){}
  };

  // Clics en botones de contacto y en "Ver descuentos"
  document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a[href], [data-ir-app]'); if(!a) return;
    const h = a.getAttribute('href') || '';
    const donde = location.pathname.replace(/\.html$/, '').replace(/^\/$/, '/inicio') || '/inicio';
    if(/wa\.me|whatsapp\.com/.test(h)) tcMedir('contacto', {canal: 'whatsapp', pagina: donde});
    else if(/instagram\.com/.test(h)) tcMedir('contacto', {canal: 'instagram', pagina: donde});
    else if(/^mailto:/.test(h)) tcMedir('contacto', {canal: 'email', pagina: donde});
    else if(a.hasAttribute('data-ir-app')) tcMedir('ver_descuentos', {pagina: donde, rubro: a.getAttribute('data-ir-app') || ''});
  }, true);

  // Aviso de cookies (solo si se está midiendo)
  if(!activo) return;
  let visto = false; try{ visto = localStorage.getItem('tucupon.cookies') === 'ok'; }catch(e){}
  if(visto) return;
  function aviso(){
    const d = document.createElement('div');
    d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:34rem;margin:0 auto;display:flex;gap:12px;align-items:center;'
      + 'background:#1E0B45;color:#fff;border-radius:16px;padding:12px 14px;font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 18px 40px -16px rgba(0,0,0,.5)';
    d.innerHTML = '<span style="flex:1">Usamos cookies para medir las visitas y mejorar Tucupón. <a href="/privacidad" style="color:#C4F04A">Más info</a></span>'
      + '<button type="button" style="flex:none;border:0;border-radius:12px;padding:9px 16px;font:800 14px system-ui,sans-serif;background:#C4F04A;color:#1E0B45;cursor:pointer">OK</button>';
    d.querySelector('button').onclick = function(){ try{ localStorage.setItem('tucupon.cookies', 'ok'); }catch(e){} d.remove(); };
    document.body.appendChild(d);
  }
  if(document.body) aviso(); else document.addEventListener('DOMContentLoaded', aviso);
})();
