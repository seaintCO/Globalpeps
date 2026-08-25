const PRODUCTS = [
  {slug:'wolverine',name:'“WOLVERINE” – BPC-157/TB-500',short:'BPC-157 / TB-500',price:'$90.00 – $150.00',min:90,max:150,category:'Stacks',size:'10MG',image:'assets/wolverine-vial.png'},
  {slug:'cjc-ipamorelin',name:'CJC-1295/Ipamorelin',short:'CJC-1295 / Ipamorelin',price:'$90.00 – $150.00',min:90,max:150,category:'Stacks',size:'5MG',image:'assets/cjc-ipamorelin-vial.png'},
  {slug:'bpc-157',name:'BPC-157',short:'BPC-157',price:'$55.00 – $120.00',min:55,max:120,category:'Peptides',size:'5MG',image:'assets/bpc-157-vial.png'},
  {slug:'ghk-cu',name:'GHK-Cu',short:'GHK-CU',price:'$50.00 – $90.00',min:50,max:90,category:'Peptides',size:'5MG',image:'assets/ghk-cu-vial.png'},
  {slug:'glow',name:'“GLOW” – BPC-157/TB-500/GHK-Cu',short:'BPC-157 / TB-500 / GHK-Cu',price:'$135.00 – $175.00',min:135,max:175,category:'Stacks',size:'10MG',image:'assets/glow-vial.png'},
  {slug:'mots-c',name:'MOTS-c',short:'MOTS-c',price:'$60.00 – $190.00',min:60,max:190,category:'Peptides',size:'10MG',image:'assets/mots-c-vial.png'},
  {slug:'enclomiphene',name:'Enclomiphene',short:'Enclomiphene',price:'$45.00 – $85.00',min:45,max:85,category:'Other',size:'12.5MG',image:'assets/enclomiphene-vial.png'},
  {slug:'mk-677',name:'MK-677',short:'MK-677',price:'$45.00 – $100.00',min:45,max:100,category:'Other',size:'25MG',image:'assets/mk-677-vial.png'}
];
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const LANG={en:{home:'Home',catalog:'Catalog',coa:'COA Lookup',quality:'Quality',shipping:'Shipping',wholesale:'Wholesale',about:'About',contact:'Contact',account:'My account',research:'RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE',empty:'No products match these filters.',showing:'Showing {{n}} products',drawer:'Your quote list',remove:'Remove',emptyCart:'Your quote list is empty.',quote:'Request wholesale quote',textItems:'TEXT SELECTED ITEMS'},es:{home:'Inicio',catalog:'Catálogo',coa:'Búsqueda COA',quality:'Calidad',shipping:'Envíos',wholesale:'Mayoreo',about:'Nosotros',contact:'Contacto',account:'Mi cuenta',research:'SOLO PARA USO DE INVESTIGACIÓN — NO PARA USO HUMANO NI VETERINARIO',empty:'Ningún producto coincide con estos filtros.',showing:'Mostrando {{n}} productos',drawer:'Tu lista de cotización',remove:'Eliminar',emptyCart:'Tu lista de cotización está vacía.',quote:'Solicitar cotización mayorista',textItems:'ENVIAR SELECCIÓN POR TEXTO'}};
const currentLang=()=>localStorage.getItem('peps_lang')||'en';
const tr=()=>LANG[currentLang()]||LANG.en;
function token(s,n){return s.replace('{{n}}',String(n));}

function productCard(p){return `<article class="product-card v8-product-card"><a href="product.html?item=${p.slug}" class="product-image real"><img loading="lazy" src="${p.image}" alt="${p.name}"></a><div class="product-meta"><a href="product.html?item=${p.slug}" class="product-name">${p.name}</a><button class="heart" type="button" data-favorite="${p.slug}" aria-label="Save ${p.name}">♡</button><div class="product-price">${p.price}</div></div></article>`;}
let catalogState={category:'All',maxPrice:null,sort:'featured'};
function renderCatalog(){const grid=$('[data-product-grid]'); if(!grid)return; let list=[...PRODUCTS]; if(catalogState.category!=='All')list=list.filter(p=>p.category===catalogState.category); if(catalogState.maxPrice)list=list.filter(p=>p.min<=catalogState.maxPrice); if(catalogState.sort==='low')list.sort((a,b)=>a.min-b.min); if(catalogState.sort==='high')list.sort((a,b)=>b.min-a.min); grid.innerHTML=list.length?list.map(productCard).join(''):`<div class="catalog-empty">${tr().empty}</div>`; const s=$('[data-catalog-status]');if(s)s.textContent=token(tr().showing,list.length); bindFavorites();}
function renderHome(){const grid=$('[data-home-grid]');if(grid)grid.innerHTML=PRODUCTS.slice(0,4).map(productCard).join('');bindFavorites();}

function getCart(){return JSON.parse(localStorage.getItem('peps_cart')||'[]');} function saveCart(c){localStorage.setItem('peps_cart',JSON.stringify(c));renderCart();}
function smsHref(body){const phone='+13054491784';const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);return `sms:${phone}${isIOS?'&':'?'}body=${encodeURIComponent(body)}`;}
function cartSmsBody(){const c=getCart();const lines=c.map(x=>`- ${x.name} | ${x.size||''} | Qty ${x.qty||1}`);return currentLang()==='es'?`Hola PEPS GLOBAL, me interesan estos productos de investigación:\n${lines.join('\n')}\n\nPor favor envíen disponibilidad, precio mayorista y documentación COA aplicable.\nGlobalPeps.org`:`Hello PEPS GLOBAL, I’m interested in these research products:\n${lines.join('\n')}\n\nPlease send availability, wholesale pricing, and applicable COA documentation.\nGlobalPeps.org`;}
function renderCart(){const c=getCart();$$('.cart-count').forEach(e=>e.textContent=c.reduce((a,b)=>a+(b.qty||1),0));const items=$('[data-cart-items]');if(items)items.innerHTML=c.length?c.map((x,i)=>`<div class="drawer-item"><strong>${x.name}</strong><div>${x.size||''} · Qty ${x.qty||1}</div><button class="link-btn" data-remove-cart="${i}">${tr().remove}</button></div>`).join(''):`<p>${tr().emptyCart}</p>`;text($('.drawer-head strong'),tr().drawer);const q=$('.cart-drawer .btn');if(q)q.textContent=tr().quote;let sms=$('[data-sms-cart]');if(!sms&&$('.cart-drawer')){sms=document.createElement('a');sms.className='btn full v9-sms-cart';sms.setAttribute('data-sms-cart','');$('.cart-drawer').appendChild(sms);}if(sms){sms.textContent=tr().textItems;sms.href=c.length?smsHref(cartSmsBody()):'#';sms.classList.toggle('disabled',!c.length);}$$('[data-remove-cart]').forEach(b=>b.onclick=()=>{const a=getCart();a.splice(Number(b.dataset.removeCart),1);saveCart(a);});}
function text(el,v){if(el)el.textContent=v;}
function bindFavorites(){const fav=JSON.parse(localStorage.getItem('peps_favs')||'[]');$$('[data-favorite]').forEach(b=>{b.textContent=fav.includes(b.dataset.favorite)?'♥':'♡';b.onclick=()=>{let a=JSON.parse(localStorage.getItem('peps_favs')||'[]');const k=b.dataset.favorite;a=a.includes(k)?a.filter(x=>x!==k):[...a,k];localStorage.setItem('peps_favs',JSON.stringify(a));b.textContent=a.includes(k)?'♥':'♡';};});}


const PAGE_TEXT={
 en:{
  homeEyebrow:'LABORATORY RESEARCH SUPPLY',homeTitle:'Research-Grade<br>Compounds.<br>Independently Verified.',homeCopy:'PEPS GLOBAL supplies premium research compounds for in-vitro and laboratory use only, with independent verification and traceable batch records.',shop:'SHOP CATALOG',featured:'Featured Compounds',viewAll:'VIEW ALL',
  catalogTitle:'Catalog',catalogCopy:'Research-use compounds for qualified laboratory applications only.',sort:['Featured','Price: low to high','Price: high to low'],filter:'FILTER',category:'Category',cats:['All','Peptides','Stacks','Other'],maxPrice:'Max Price',apply:'APPLY',reset:'Reset filters',
  aboutTitle:'About PEPS GLOBAL',aboutCopy:'PEPS GLOBAL is focused on a clean, transparent research-supply experience built around traceability, documentation and service.',aboutVals:[['Quality First','Documentation and lot traceability matter.'],['Transparency','Clear product and batch information.'],['Customer Focused','Support for qualified research buyers.']],
  qualityTitle:'Quality You Can Trust',qualityCopy:'We are committed to providing high-quality research compounds through rigorous sourcing and quality-control documentation.',qualityList:[['Third-Party Tested','Independent verification of purity and identity.'],['High Purity Standards','Each lot is reviewed against product specifications.'],['Raw Material Sourcing','Quality-focused supply-chain documentation.'],['GMP-Conscious Handling','Documented processes for research supply.']],
  shippingTitle:'Shipping',shippingCopy:'Fast, discreet and trackable delivery.',shippingNote:'Tracking information is provided once an order has shipped.',
  coaTitle:'Request a COA by Text',coaCopy:'Enter your lot number or tap a recent lot. We’ll open a pre-filled text message to 305-449-1784 so you can request the matching Certificate of Analysis.',lot:'LOT NUMBER',coaSearch:'TEXT REQUEST',recent:'RECENT COAS',viewCoa:'Text to Request',
  contactTitle:'Contact Us',contactCopy:"We're here to help. Reach out with any questions.",sendMsg:'SEND US A MESSAGE',name:'Name',email:'Email',message:'Message',send:'SEND MESSAGE',
  wholesaleTitle:'Wholesale',wholesaleCopy:'Partner with PEPS GLOBAL for bulk pricing, priority support and consistent research-supply fulfillment.',features:[['Volume Discounts','Competitive pricing on bulk research orders.'],['Priority Support','Dedicated account support for qualified organizations.'],['Consistent Supply','Reliable inventory planning and fulfillment.'],['Custom Quotes','Tailored quotes for your research needs.']],inquiry:'WHOLESALE INQUIRY',fullName:'Full Name',business:'Business Name',businessType:'Type of Business',submitInquiry:'SUBMIT INQUIRY',
  accountTitle:'Research Compounds<br>You Can Trust.',accountCopy:'Independent testing, research-use positioning and traceable lot records.',qualified:'Qualified research access.',create:'Create your account',choosePassword:'CHOOSE A PASSWORD',accountCheck:'I confirm that I am a qualified adult researcher or institutional professional and that all products are strictly for lawful research use only.',createBtn:'CREATE ACCOUNT',
  productPill:'RESEARCH USE ONLY',productDesc:'Premium research compound intended exclusively for laboratory and in-vitro research. Not for human or veterinary consumption.',size:'Size',quantity:'Quantity',addCart:'ADD TO CART',addQuote:'ADD TO QUOTE',tabs:['DESCRIPTION','STORAGE','DISCLAIMER'],
  startEyebrow:'PRIVATE LABEL + WHOLESALE',startTitle:'Start Your Own Research Company',startCopy:'Use this guided planner to organize a research-supply brand inquiry. This is a commercial planning tool, not regulatory or legal advice.',step:'Step {{n}} of 4',stepNames:['Brand','Order Size','Support','Contact'],wizardH2:['What are you building?','Choose your starting size','What support do you need?','Tell us where to send the plan'],models:[['Private Label','Build your own research brand.'],['Wholesale Reseller','Purchase volume for your operation.'],['Lab Supply','Institutional research purchasing.']],sizes:[['10–24 units','Starter inquiry.'],['25–49 units','Growth inquiry.'],['50+ units','Volume inquiry.']],supports:['Packaging direction','COA workflow','Catalog planning','Wholesale pricing'],company:'Company',region:'State / Region',back:'BACK',next:'NEXT',submitPlan:'SUBMIT PLAN',success:'Inquiry plan created.',successCopy:'Your selections were captured in this demo. Connect your CRM/email endpoint before launch.',
  ageTitle:'Research access',ageCopy:'This website is intended for qualified adult researchers and institutional professionals. Products are for laboratory research use only.',ageCheck:'I confirm I am 21+ and understand these products are not for human or veterinary use.',ageEnter:'Enter PEPS GLOBAL'
 },
 es:{
  homeEyebrow:'SUMINISTRO PARA INVESTIGACIÓN DE LABORATORIO',homeTitle:'Compuestos de Grado<br>de Investigación.<br>Verificados de Forma Independiente.',homeCopy:'PEPS GLOBAL suministra compuestos premium para uso in-vitro y de laboratorio únicamente, con verificación independiente y registros de lote trazables.',shop:'COMPRAR CATÁLOGO',featured:'Compuestos Destacados',viewAll:'VER TODO',
  catalogTitle:'Catálogo',catalogCopy:'Compuestos para uso de investigación solo para aplicaciones de laboratorio calificadas.',sort:['Destacados','Precio: menor a mayor','Precio: mayor a menor'],filter:'FILTRO',category:'Categoría',cats:['Todo','Péptidos','Stacks','Otros'],maxPrice:'Precio Máximo',apply:'APLICAR',reset:'Restablecer filtros',
  aboutTitle:'Acerca de PEPS GLOBAL',aboutCopy:'PEPS GLOBAL se enfoca en una experiencia limpia y transparente de suministro para investigación, basada en trazabilidad, documentación y servicio.',aboutVals:[['Calidad Primero','La documentación y la trazabilidad por lote importan.'],['Transparencia','Información clara del producto y del lote.'],['Enfoque al Cliente','Soporte para compradores de investigación calificados.']],
  qualityTitle:'Calidad en la que Puedes Confiar',qualityCopy:'Estamos comprometidos a proporcionar compuestos de alta calidad mediante abastecimiento riguroso y documentación de control de calidad.',qualityList:[['Probado por Terceros','Verificación independiente de pureza e identidad.'],['Altos Estándares de Pureza','Cada lote se revisa frente a las especificaciones del producto.'],['Abastecimiento de Materia Prima','Documentación enfocada en la calidad de la cadena de suministro.'],['Manejo Consciente GMP','Procesos documentados para suministro de investigación.']],
  shippingTitle:'Envíos',shippingCopy:'Entrega rápida, discreta y rastreable.',shippingNote:'La información de rastreo se proporciona una vez que el pedido ha sido enviado.',
  coaTitle:'Solicita un COA por Texto',coaCopy:'Ingresa tu número de lote o toca un lote reciente. Abriremos un mensaje de texto prellenado al 305-449-1784 para solicitar el Certificado de Análisis correspondiente.',lot:'NÚMERO DE LOTE',coaSearch:'ENVIAR TEXTO',recent:'COAS RECIENTES',viewCoa:'Solicitar por Texto',
  contactTitle:'Contáctanos',contactCopy:'Estamos aquí para ayudar. Comunícate con cualquier pregunta.',sendMsg:'ENVÍANOS UN MENSAJE',name:'Nombre',email:'Correo',message:'Mensaje',send:'ENVIAR MENSAJE',
  wholesaleTitle:'Mayoreo',wholesaleCopy:'Asóciate con PEPS GLOBAL para precios por volumen, soporte prioritario y cumplimiento consistente de suministros para investigación.',features:[['Descuentos por Volumen','Precios competitivos en pedidos de investigación al mayoreo.'],['Soporte Prioritario','Soporte de cuenta dedicado para organizaciones calificadas.'],['Suministro Consistente','Planificación de inventario y cumplimiento confiables.'],['Cotizaciones Personalizadas','Cotizaciones adaptadas a tus necesidades de investigación.']],inquiry:'CONSULTA MAYORISTA',fullName:'Nombre Completo',business:'Nombre del Negocio',businessType:'Tipo de Negocio',submitInquiry:'ENVIAR CONSULTA',
  accountTitle:'Compuestos de Investigación<br>en los que Puedes Confiar.',accountCopy:'Pruebas independientes, posicionamiento para uso de investigación y registros de lote trazables.',qualified:'Acceso de investigación calificado.',create:'Crea tu cuenta',choosePassword:'ELIGE UNA CONTRASEÑA',accountCheck:'Confirmo que soy un investigador adulto calificado o profesional institucional y que todos los productos son estrictamente para uso legal de investigación.',createBtn:'CREAR CUENTA',
  productPill:'SOLO PARA INVESTIGACIÓN',productDesc:'Compuesto premium destinado exclusivamente para investigación de laboratorio e in-vitro. No para consumo humano ni veterinario.',size:'Tamaño',quantity:'Cantidad',addCart:'AGREGAR AL CARRITO',addQuote:'AGREGAR A COTIZACIÓN',tabs:['DESCRIPCIÓN','ALMACENAMIENTO','AVISO'],
  startEyebrow:'MARCA PRIVADA + MAYOREO',startTitle:'Crea Tu Propia Compañía de Investigación',startCopy:'Usa este planificador guiado para organizar una consulta comercial de suministros de investigación. No constituye asesoría legal ni regulatoria.',step:'Paso {{n}} de 4',stepNames:['Marca','Tamaño del Pedido','Soporte','Contacto'],wizardH2:['¿Qué estás construyendo?','Elige tu tamaño inicial','¿Qué apoyo necesitas?','Dinos a dónde enviar el plan'],models:[['Marca Privada','Construye tu propia marca de investigación.'],['Revendedor Mayorista','Compra volumen para tu operación.'],['Suministro de Laboratorio','Compras institucionales de investigación.']],sizes:[['10–24 unidades','Consulta inicial.'],['25–49 unidades','Consulta de crecimiento.'],['50+ unidades','Consulta por volumen.']],supports:['Dirección de empaque','Flujo de COA','Planificación de catálogo','Precios mayoristas'],company:'Compañía',region:'Estado / Región',back:'ATRÁS',next:'SIGUIENTE',submitPlan:'ENVIAR PLAN',success:'Plan de consulta creado.',successCopy:'Tus selecciones fueron capturadas en esta demo. Conecta tu CRM o correo antes del lanzamiento.',
  ageTitle:'Acceso de investigación',ageCopy:'Este sitio web está destinado a investigadores adultos calificados y profesionales institucionales. Los productos son solo para uso de investigación de laboratorio.',ageCheck:'Confirmo que tengo 21+ años y entiendo que estos productos no son para uso humano ni veterinario.',ageEnter:'Entrar a PEPS GLOBAL'
 }
};
function ptxt(){return PAGE_TEXT[currentLang()]||PAGE_TEXT.en;}
function html(el,v){if(el)el.innerHTML=v;}
function translatePage(){const p=ptxt();
 text($('#t-home-eyebrow'),p.homeEyebrow);html($('#t-home-title'),p.homeTitle);text($('#t-home-copy'),p.homeCopy);text($('#t-home-shop'),p.shop);text($('#t-featured-title'),p.featured);const va=$('.v8-featured .section-head>a');if(va)text(va,p.viewAll);
 text($('#t-catalog-title'),p.catalogTitle);text($('#t-catalog-copy'),p.catalogCopy);text($('#t-filter'),p.filter);const sort=$('[data-sort]');if(sort)$$('option',sort).forEach((o,i)=>text(o,p.sort[i]));const fil=$('.v8-filters');if(fil){const st=$$('strong',fil);if(st[0])text(st[0],p.category);if(st[1])text(st[1],p.maxPrice);$$('[data-category]',fil).forEach((b,i)=>text(b,p.cats[i]));text($('[data-apply-filter]',fil),p.apply);text($('[data-reset-filter]',fil),p.reset);}
 text($('#t-about-title'),p.aboutTitle);text($('#t-about-copy'),p.aboutCopy);$$('.about-values>div').forEach((b,i)=>{if(p.aboutVals[i]){text($('strong',b),p.aboutVals[i][0]);text($('small',b),p.aboutVals[i][1]);}});
 text($('#t-quality-title'),p.qualityTitle);text($('#t-quality-copy'),p.qualityCopy);if($('.feature-page'))$$('.feature-list>div').forEach((b,i)=>{if(p.qualityList[i]){text($('strong',b),p.qualityList[i][0]);text($('small',b),p.qualityList[i][1]);}});
 text($('#t-shipping-title'),p.shippingTitle);text($('#t-shipping-copy'),p.shippingCopy);text($('#t-shipping-note'),p.shippingNote);
 text($('#t-coa-title'),p.coaTitle);text($('#t-coa-copy'),p.coaCopy);text($('.coa-search label'),p.lot);text($('[data-coa-search]'),p.coaSearch);text($('.section.flush h3'),p.recent);$$('.table-wrap .link-btn').forEach(b=>text(b,p.viewCoa));
 text($('#t-contact-title'),p.contactTitle);text($('#t-contact-copy'),p.contactCopy);const cf=$('.contact-page .form-card');if(cf){text($('h3',cf),p.sendMsg);const ls=$$('label',cf);if(ls[0])ls[0].childNodes[0].textContent=p.name;if(ls[1])ls[1].childNodes[0].textContent=p.email;if(ls[2])ls[2].childNodes[0].textContent=p.message;text($('button',cf),p.send);}
 text($('#t-wholesale-title'),p.wholesaleTitle);text($('#t-wholesale-copy'),p.wholesaleCopy);if($('.wholesale-page')){$$('.feature-list>div').forEach((b,i)=>{if(p.features[i]){text($('strong',b),p.features[i][0]);text($('small',b),p.features[i][1]);}});const wf=$('.wholesale-page .form-card');if(wf){text($('h3',wf),p.inquiry);const ls=$$('label',wf);if(ls[0])ls[0].childNodes[0].textContent=p.fullName;if(ls[1])ls[1].childNodes[0].textContent=p.email;if(ls[2])ls[2].childNodes[0].textContent=p.business;if(ls[3])ls[3].childNodes[0].textContent=p.businessType;text($('button',wf),p.submitInquiry);}}
 html($('#t-account-title'),p.accountTitle);text($('#t-account-copy'),p.accountCopy);text($('.account-panel .muted'),p.qualified);text($('#t-account-create'),p.create);const af=$('[data-account-form]');if(af){const ls=$$('label',af);if(ls[0])ls[0].childNodes[0].textContent=p.email.toUpperCase();if(ls[1])ls[1].childNodes[0].textContent=p.choosePassword;if(ls[2])ls[2].lastChild.textContent=' '+p.accountCheck;text($('.btn',af),p.createBtn);}
 if($('.product-detail')){text($('.product-info .pill'),p.productPill);text($('.product-info>p'),p.productDesc);const ls=$$('.product-info label');if(ls[0])text(ls[0],p.size);if(ls[1])text(ls[1],p.quantity);const bs=$$('.product-actions .btn');if(bs[0])text(bs[0],p.addCart);if(bs[1])text(bs[1],p.addQuote);$$('.tabs button').forEach((b,i)=>text(b,p.tabs[i]));}
 const wp=$('.company-wizard-page');if(wp){text($('.wizard-intro .eyebrow'),p.startEyebrow);text($('#t-start-title'),p.startTitle);text($('#t-start-copy'),p.startCopy);$$('.wizard-step h2').forEach((h,i)=>text(h,p.wizardH2[i]));$$('.wizard-step[data-step="1"] .choice-grid label').forEach((l,i)=>{if(p.models[i]){text($('b',l),p.models[i][0]);text($('small',l),p.models[i][1]);}});$$('.wizard-step[data-step="2"] .choice-grid label').forEach((l,i)=>{if(p.sizes[i]){text($('b',l),p.sizes[i][0]);text($('small',l),p.sizes[i][1]);}});$$('.wizard-step[data-step="3"] .check-grid span').forEach((e,i)=>text(e,p.supports[i]));const f4=$$('.wizard-step[data-step="4"] .field-grid label');if(f4[0])f4[0].childNodes[0].textContent=p.name;if(f4[1])f4[1].childNodes[0].textContent=p.email;if(f4[2])f4[2].childNodes[0].textContent=p.company;if(f4[3])f4[3].childNodes[0].textContent=p.region;text($('[data-prev]'),p.back);text($('[data-next]'),p.next);text($('[data-submit-plan]'),p.submitPlan);text($('[data-wizard-success] strong'),p.success);text($('[data-wizard-success] p'),p.successCopy);const active=$('.wizard-step.active');if(active){const n=Number(active.dataset.step);text($('[data-step-label]'),p.step.replace('{{n}}',n));text($('[data-step-name]'),p.stepNames[n-1]);}}
 text($('.age-panel h2'),p.ageTitle);text($('.age-panel p'),p.ageCopy);const ac=$('.age-panel .checkline');if(ac)ac.lastChild.textContent=' '+p.ageCheck;text($('[data-age-enter]'),p.ageEnter);
}
function initWizard(){const w=$('[data-company-wizard]');if(!w)return;let step=1;const steps=$$('.wizard-step',w),prev=$('[data-prev]',w),next=$('[data-next]',w),submit=$('[data-submit-plan]',w),bar=$('[data-progress-bar]');function render(){steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));if(bar)bar.style.width=`${step*25}%`;if(prev)prev.disabled=step===1;if(next)next.hidden=step===4;if(submit)submit.hidden=step!==4;translatePage();}prev?.addEventListener('click',()=>{step=Math.max(1,step-1);render();});next?.addEventListener('click',()=>{step=Math.min(4,step+1);render();});w.addEventListener('submit',e=>{e.preventDefault();const success=$('[data-wizard-success]');if(success)success.hidden=false;steps.forEach(s=>s.style.display='none');const actions=$('.wizard-actions',w);if(actions)actions.style.display='none';translatePage();});render();}

function setLanguage(lang){localStorage.setItem('peps_lang',lang);document.documentElement.lang=lang;const l=tr();text($('.announcement'),l.research);const left=$$('.nav-left a');[l.home,l.catalog,l.coa,l.quality].forEach((v,i)=>text(left[i],v));const right=$$('.nav-right>a:not(.icon-btn)');[l.shipping,l.wholesale,l.about].forEach((v,i)=>text(right[i],v));const mobile=$$('.mobile-menu>a');[l.home,l.catalog,l.coa,l.quality,l.shipping,l.wholesale,'Start a Company',l.about,l.contact,l.account].forEach((v,i)=>text(mobile[i],v));$$('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));renderCart();renderCatalog();translatePage();const tp=$('[data-text-product]');if(tp&&$('[data-product-title]')){const slug=new URLSearchParams(location.search).get('item')||'bpc-157';const p=PRODUCTS.find(x=>x.slug===slug)||PRODUCTS[2];tp.textContent=lang==='es'?'CONSULTAR POR TEXTO':'TEXT PRODUCT INQUIRY';tp.href=smsHref(lang==='es'?`Hola PEPS GLOBAL, me interesa ${p.name} (${p.size}) para investigación. Por favor envíen disponibilidad, precio mayorista y documentación COA aplicable. - GlobalPeps.org`:`Hello PEPS GLOBAL, I’m interested in ${p.name} (${p.size}) for research use. Please send availability, wholesale pricing, and applicable COA documentation. - GlobalPeps.org`);const h=tp.nextElementSibling;if(h&&h.classList.contains('v9-sms-hint'))h.textContent=lang==='es'?'El botón abre tu app de mensajes con el texto preparado.':'The button opens your messaging app with the request pre-filled.';}$$('[data-coa-text]').forEach(b=>text(b,ptxt().viewCoa));}

$$('.lang-btn').forEach(b=>b.onclick=()=>setLanguage(b.dataset.lang));$$('[data-cart]').forEach(b=>b.onclick=()=>$('.cart-drawer')?.classList.add('open'));$('[data-close-cart]')?.addEventListener('click',()=>$('.cart-drawer')?.classList.remove('open'));$('[data-menu]')?.addEventListener('click',()=>$('.mobile-menu')?.classList.toggle('open'));$('[data-search]')?.addEventListener('click',()=>$('.search-overlay')?.classList.add('open'));$('[data-close-search]')?.addEventListener('click',()=>$('.search-overlay')?.classList.remove('open'));
$('[data-search-input]')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();const r=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.short.toLowerCase().includes(q));$('[data-search-results]').innerHTML=r.map(p=>`<a href="product.html?item=${p.slug}">${p.name}<span style="float:right">${p.price}</span></a>`).join('');});

$$('[data-category]').forEach(b=>b.onclick=()=>{catalogState.category=b.dataset.category;$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));renderCatalog();});$('[data-sort]')?.addEventListener('change',e=>{catalogState.sort=e.target.value;renderCatalog();});$('[data-apply-filter]')?.addEventListener('click',()=>{const v=Number($('[data-max-price]')?.value||0);catalogState.maxPrice=v>0?v:null;renderCatalog();});$('[data-reset-filter]')?.addEventListener('click',()=>{catalogState={category:'All',maxPrice:null,sort:'featured'};if($('[data-max-price]'))$('[data-max-price]').value='';if($('[data-sort]'))$('[data-sort]').value='featured';$$('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category==='All'));renderCatalog();});

if($('[data-product-page]')){const slug=new URLSearchParams(location.search).get('item')||'bpc-157';const p=PRODUCTS.find(x=>x.slug===slug)||PRODUCTS[2];text($('[data-product-title]'),p.name);text($('[data-product-price]'),p.price);text($('[data-product-breadcrumb]'),p.name);const im=$('[data-product-image]');if(im)im.innerHTML=`<img src="${p.image}" alt="${p.name}">`;const sizes=$$('.size-row .size');if(sizes[0])sizes[0].textContent=p.size;let qty=1;const q=$('[data-qty]');$('[data-minus]')?.addEventListener('click',()=>{qty=Math.max(1,qty-1);q.value=qty;});$('[data-plus]')?.addEventListener('click',()=>{qty++;q.value=qty;});$$('[data-add-cart],[data-add-quote]').forEach(b=>b.onclick=()=>{const c=getCart();c.push({...p,qty:Number(q.value)||1});saveCart(c);$('.cart-drawer')?.classList.add('open');});const actions=$('.product-actions');if(actions&&!$('[data-text-product]')){const link=document.createElement('a');link.className='btn outline v9-product-text';link.setAttribute('data-text-product','');link.textContent=currentLang()==='es'?'CONSULTAR POR TEXTO':'TEXT PRODUCT INQUIRY';link.href=smsHref(currentLang()==='es'?`Hola PEPS GLOBAL, me interesa ${p.name} (${p.size}) para investigación. Por favor envíen disponibilidad, precio mayorista y documentación COA aplicable. - GlobalPeps.org`:`Hello PEPS GLOBAL, I’m interested in ${p.name} (${p.size}) for research use. Please send availability, wholesale pricing, and applicable COA documentation. - GlobalPeps.org`);actions.insertAdjacentElement('afterend',link);const hint=document.createElement('p');hint.className='v9-sms-hint';hint.textContent=currentLang()==='es'?'El botón abre tu app de mensajes con el texto preparado.':'The button opens your messaging app with the request pre-filled.';link.insertAdjacentElement('afterend',hint);}}

function openCoaText(lot,product=''){const body=currentLang()==='es'?`Hola PEPS GLOBAL, quisiera solicitar el COA${product?' para '+product:''}. Número de lote: ${lot}. Gracias. - GlobalPeps.org`:`Hello PEPS GLOBAL, I’d like to request the COA${product?' for '+product:''}. Lot number: ${lot}. Thank you. - GlobalPeps.org`;location.href=smsHref(body);}
$('[data-coa-search]')?.addEventListener('click',()=>{const v=$('[data-coa-input]')?.value.trim();if(!v){text($('[data-coa-result]'),currentLang()==='es'?'Ingresa un número de lote primero.':'Enter a lot number first.');return;}text($('[data-coa-result]'),currentLang()==='es'?'Abriendo un mensaje de texto para solicitar este COA…':'Opening a text message to request this COA…');openCoaText(v);});
$$('[data-coa-text]').forEach(b=>b.addEventListener('click',()=>openCoaText(b.dataset.lot,b.dataset.product)));
$$('[data-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const s=f.querySelector('[data-form-status]');if(s)s.textContent='Thanks — this demo captured your inquiry locally. Connect your email/CRM endpoint before launch.';f.reset();}));
$('[data-account-form]')?.addEventListener('submit',e=>{e.preventDefault();text($('[data-account-status]'),'Demo account created locally. Connect authentication before launch.');});

// Clear stale service workers/caches from earlier local builds.
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});}if('caches' in window){caches.keys().then(keys=>keys.forEach(k=>caches.delete(k))).catch(()=>{});}

// Keep age gate functional.
if(!localStorage.getItem('peps_age_ok'))$('.age-gate')?.classList.add('show');$('[data-age-enter]')?.addEventListener('click',()=>{if($('[data-age-check]')?.checked){localStorage.setItem('peps_age_ok','1');$('.age-gate')?.classList.remove('show');}else alert('Please confirm the research-use statement.');});

initWizard();renderHome();renderCatalog();renderCart();setLanguage(currentLang());


// ---- V10 wholesaler pricing / SMS ordering ----
const PEPS_BUSINESS_NUMBER = "3054491784";
const PEPS_PAY_LINK = "PASTE_PAYMENT_LINK_HERE";
const PEPS_PRICE_ITEMS = [{"category": "Bacteriostatic Water", "sku": "WA3", "name": "Bac.water 3ml * 10 Vials", "base": 77, "price": 97}, {"category": "Bacteriostatic Water", "sku": "WA10", "name": "Bac.water 10ml * 10 Vials", "base": 83, "price": 103}, {"category": "Tirzepatide", "sku": "TRS", "name": "Tirzepatide 5mg * 10 Vials", "base": 137, "price": 157}, {"category": "Tirzepatide", "sku": "TR10", "name": "Tirzepatide 10mg * 10 Vials", "base": 224, "price": 244}, {"category": "Tirzepatide", "sku": "TR15", "name": "Tirzepatide 15mg * 10 Vials", "base": 296, "price": 316}, {"category": "Tirzepatide", "sku": "TR20", "name": "Tirzepatide 20mg * 10 Vials", "base": 377, "price": 397}, {"category": "Tirzepatide", "sku": "TR30", "name": "Tirzepatide 30mg * 10 Vials", "base": 479, "price": 499}, {"category": "Tirzepatide", "sku": "TR40", "name": "Tirzepatide 40mg * 10 Vials", "base": 599, "price": 619}, {"category": "Tirzepatide", "sku": "TR50", "name": "Tirzepatide 50mg * 10 Vials", "base": 701, "price": 721}, {"category": "Tirzepatide", "sku": "TR60", "name": "Tirzepatide 60mg * 10 Vials", "base": 803, "price": 823}, {"category": "Tirzepatide", "sku": "TR100", "name": "Tirzepatide 100mg * 10 Vials", "base": 1220, "price": 1240}, {"category": "Semaglutide", "sku": "SM10", "name": "Semaglutide 10mg * 10 Vials", "base": 221, "price": 241}, {"category": "Semaglutide", "sku": "SM20", "name": "Semaglutide 20mg * 10 Vials", "base": 308, "price": 328}, {"category": "BPC 157", "sku": "BC5", "name": "BPC 157 5mg * 10 Vials", "base": 146, "price": 166}, {"category": "BPC 157", "sku": "BC10", "name": "BPC 157 10mg * 10 Vials", "base": 194, "price": 214}, {"category": "BPC 157", "sku": "BB10", "name": "BPC 5mg + TB5mg / 10mg * 10 Vials", "base": 365, "price": 385}, {"category": "BPC 157", "sku": "BB20", "name": "BPC 10mg + TB10mg / 20mg * 10 Vials", "base": 650, "price": 670}, {"category": "TB500", "sku": "BT5", "name": "TB500 5mg * 10 Vials", "base": 335, "price": 355}, {"category": "TB500", "sku": "BT10", "name": "TB500 10mg * 10 Vials", "base": 563, "price": 583}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CP10", "name": "CJC 1295 without DAC 5mg + IPA / 10mg * 10 Vials", "base": 353, "price": 373}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CD5", "name": "CJC1295 with DAC / 5mg * 10 Vials", "base": 632, "price": 652}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CD10", "name": "CJC1295 with DAC / 10mg * 10 Vials", "base": 794, "price": 814}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CND5", "name": "CJC 1295 without DAC / 5mg * 10 Vials", "base": 242, "price": 262}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CND10", "name": "CJC 1295 without DAC / 10mg * 10 Vials", "base": 458, "price": 478}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "IP5", "name": "Ipamorelin / 5mg * 10 Vials", "base": 146, "price": 166}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "IP10", "name": "Ipamorelin / 10mg * 10 Vials", "base": 218, "price": 238}, {"category": "Retatrutide", "sku": "RT5", "name": "Retatrutide 5mg * 10 Vials", "base": 170, "price": 190}, {"category": "Retatrutide", "sku": "RT10", "name": "Retatrutide 10mg * 10 Vials", "base": 272, "price": 292}, {"category": "Retatrutide", "sku": "RT15", "name": "Retatrutide 15mg * 10 Vials", "base": 368, "price": 388}, {"category": "Retatrutide", "sku": "RT20", "name": "Retatrutide 20mg * 10 Vials", "base": 464, "price": 484}, {"category": "Retatrutide", "sku": "RT30", "name": "Retatrutide 30mg * 10 Vials", "base": 638, "price": 658}, {"category": "Retatrutide", "sku": "RT40", "name": "Retatrutide 40mg * 10 Vials", "base": 797, "price": 817}, {"category": "Retatrutide", "sku": "RT50", "name": "Retatrutide 50mg * 10 Vials", "base": 938, "price": 958}, {"category": "Retatrutide", "sku": "RT60", "name": "Retatrutide 60mg * 10 Vials", "base": 1082, "price": 1102}, {"category": "GHK-Cu", "sku": "CU50", "name": "GHK-Cu 50mg * 10 Vials", "base": 128, "price": 148}, {"category": "GHK-Cu", "sku": "CU100", "name": "GHK-Cu 100mg * 10 Vials", "base": 161, "price": 181}, {"category": "Sermorelin", "sku": "SMO5", "name": "Sermorelin 5mg * 10 Vials", "base": 272, "price": 292}, {"category": "Sermorelin", "sku": "SMO10", "name": "Sermorelin 10mg * 10 Vials", "base": 488, "price": 508}, {"category": "Tesamorelin", "sku": "TSM5", "name": "Tesamorelin 5mg * 10 Vials", "base": 401, "price": 421}, {"category": "Tesamorelin", "sku": "TSM10", "name": "Tesamorelin 10mg * 10 Vials", "base": 692, "price": 712}, {"category": "Tesamorelin", "sku": "TSM20", "name": "Tesamorelin 20mg * 10 Vials", "base": 1163, "price": 1183}, {"category": "NAD+", "sku": "NJ100", "name": "NAD+ 100mg * 10 Vials", "base": 146, "price": 166}, {"category": "NAD+", "sku": "NJ500", "name": "NAD+ 500mg * 10 Vials", "base": 203, "price": 223}, {"category": "NAD+", "sku": "NJ1000", "name": "NAD+ 1000mg * 10 Vials", "base": 260, "price": 280}, {"category": "KLOW / GLOW", "sku": "GLOW70", "name": "GLOW 70mg * 10 Vials", "base": 692, "price": 712}, {"category": "KLOW / GLOW", "sku": "KLOW80", "name": "KLOW 80mg * 10 Vials", "base": 875, "price": 895}, {"category": "IGF-1 LR3", "sku": "IG1", "name": "IGF-1 LR3 1mg * 10 Vials", "base": 737, "price": 757}, {"category": "MOTS-c", "sku": "MS10", "name": "MOTS-c 10mg * 10 Vials", "base": 263, "price": 283}, {"category": "MOTS-c", "sku": "MS20", "name": "MOTS-c 20mg * 10 Vials", "base": 431, "price": 451}, {"category": "MOTS-c", "sku": "MS40", "name": "MOTS-c 40mg * 10 Vials", "base": 755, "price": 775}, {"category": "Epithalon", "sku": "ET10", "name": "Epithalon 10mg * 10 Vials", "base": 152, "price": 172}, {"category": "Epithalon", "sku": "ET50", "name": "Epithalon 50mg * 10 Vials", "base": 527, "price": 547}, {"category": "Cagrilintide", "sku": "CGL5", "name": "Cagrilintide 5mg * 10 Vials", "base": 479, "price": 499}, {"category": "Cagrilintide", "sku": "CGL10", "name": "Cagrilintide 10mg * 10 Vials", "base": 770, "price": 790}, {"category": "5-AMINO-1MQ", "sku": "5AM", "name": "5-AMINO-1MQ 5mg * 10 Vials", "base": 83, "price": 103}, {"category": "5-AMINO-1MQ", "sku": "10AM", "name": "5-AMINO-1MQ 10mg * 10 Vials", "base": 161, "price": 181}];

function pepsMoney(n) { return "$" + Number(n || 0).toLocaleString(); }
function pepsSmsHref(body) { return "sms:" + PEPS_BUSINESS_NUMBER + "?&body=" + encodeURIComponent(body); }
function pepsBuildPriceMessage(items) {
  const total = items.reduce((sum, x) => sum + Number(x.price || 0), 0);
  const lines = [
    "Hi PEPS GLOBAL, I want to request a research-use-only order.",
    "",
    "Selected items:"
  ];
  items.forEach(x => lines.push("- " + x.sku + " | " + x.name + " | " + pepsMoney(x.price)));
  lines.push("");
  lines.push("Estimated total: " + pepsMoney(total));
  lines.push("");
  lines.push("Please confirm availability, applicable COA documentation, shipping instructions, and send the payment link.");
  lines.push("Research use only. Not for human or veterinary use.");
  if (PEPS_PAY_LINK && !PEPS_PAY_LINK.includes("PASTE_")) lines.push("Payment link: " + PEPS_PAY_LINK);
  return lines.join("\n");
}
(function initV10PricingPage() {
  const table = document.querySelector("[data-price-table]");
  const selectedBox = document.querySelector("[data-selected-prices]");
  const totalEl = document.querySelector("[data-price-total]");
  const textLink = document.querySelector("[data-price-text]");
  if (!table || !selectedBox || !totalEl || !textLink) return;
  let selected = [];
  function renderSelected() {
    if (!selected.length) {
      selectedBox.innerHTML = "<p>No items selected yet.</p>";
      totalEl.textContent = "$0";
      textLink.href = pepsSmsHref("Hi PEPS GLOBAL, I want to place a research-use-only order. Please send instructions and payment link.");
      return;
    }
    selectedBox.innerHTML = selected.map((x, i) => `
      <div class="selected-row">
        <span><strong>${x.sku}</strong><small>${x.name}</small></span>
        <b>${pepsMoney(x.price)}</b>
        <button type="button" data-remove-selected="${i}">×</button>
      </div>
    `).join("");
    const total = selected.reduce((sum, x) => sum + Number(x.price || 0), 0);
    totalEl.textContent = pepsMoney(total);
    textLink.href = pepsSmsHref(pepsBuildPriceMessage(selected));
  }
  table.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-price-add]");
    if (!btn) return;
    const item = PEPS_PRICE_ITEMS.find(x => x.sku === btn.dataset.sku);
    if (item) { selected.push(item); renderSelected(); }
  });
  selectedBox.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-remove-selected]");
    if (!btn) return;
    selected.splice(Number(btn.dataset.removeSelected), 1);
    renderSelected();
  });
  const search = document.querySelector("[data-price-search]");
  const cat = document.querySelector("[data-category-filter]");
  function filterRows() {
    const q = (search?.value || "").toLowerCase().trim();
    const c = cat?.value || "all";
    table.querySelectorAll("tr").forEach(row => {
      const hitQ = !q || row.dataset.name.includes(q);
      const hitC = c === "all" || row.dataset.category === c;
      row.style.display = hitQ && hitC ? "" : "none";
    });
  }
  search?.addEventListener("input", filterRows);
  cat?.addEventListener("change", filterRows);
  renderSelected();
})();

(function patchV10MainCartSms() {
  function updateTextSelectedButton() {
    const drawer = document.querySelector(".cart-drawer");
    if (!drawer) return;
    let btn = drawer.querySelector("[data-text-cart]");
    if (!btn) {
      btn = document.createElement("a");
      btn.className = "btn black full";
      btn.dataset.textCart = "true";
      btn.textContent = "Text Selected Items";
      const firstBtn = drawer.querySelector(".btn");
      if (firstBtn) firstBtn.insertAdjacentElement("beforebegin", btn);
      else drawer.appendChild(btn);
    }
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem("pg_cart") || localStorage.getItem("wop_cart") || "[]"); } catch(e) {}
    if (!Array.isArray(cart) || !cart.length) {
      btn.href = pepsSmsHref("Hi PEPS GLOBAL, I want to place a research-use-only order. Please send product availability, instructions, and payment link.");
      return;
    }
    const lines = [
      "Hi PEPS GLOBAL, I want to request a research-use-only order.",
      "",
      "Selected items:"
    ];
    cart.forEach(x => lines.push("- " + (x.name || x.short || "Product") + " | Size: " + (x.size || "N/A") + " | Qty: " + (x.qty || 1)));
    lines.push("");
    lines.push("Please confirm availability, applicable COA documentation, shipping instructions, and send the payment link.");
    lines.push("Research use only. Not for human or veterinary use.");
    btn.href = pepsSmsHref(lines.join("\n"));
  }
  document.addEventListener("click", () => setTimeout(updateTextSelectedButton, 50));
  setTimeout(updateTextSelectedButton, 400);
})();



// ---- V11 product size selector + clean quote drawer fix ----
(function initV11ProductAndDrawerFix(){
  const PRODUCT_VARIANTS = {
    "wolverine":[{size:"10MG",price:385},{size:"20MG",price:670}],
    "cjc-ipamorelin":[{size:"5MG",price:373},{size:"10MG",price:478}],
    "bpc-157":[{size:"5MG",price:166},{size:"10MG",price:214}],
    "ghk-cu":[{size:"50MG",price:148},{size:"100MG",price:181}],
    "glow":[{size:"70MG",price:712},{size:"80MG",price:895}],
    "mots-c":[{size:"10MG",price:283},{size:"20MG",price:451},{size:"40MG",price:775}],
    "epithalon":[{size:"10MG",price:172},{size:"50MG",price:547}],
    "cjc-1295":[{size:"5MG",price:652},{size:"10MG",price:814}],
    "5-amino-1mq":[{size:"5MG",price:103},{size:"10MG",price:181}],
    "enclomiphene":[{size:"12.5MG",price:null}],
    "mk-677":[{size:"25MG",price:null}],
    "mt-2":[{size:"10MG",price:null}],
    "tesamorelin":[{size:"5MG",price:421},{size:"10MG",price:712},{size:"20MG",price:1183}]
  };

  const pg$ = (s,c=document)=>c.querySelector(s);
  const pg$$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const money = n => "$" + Number(n || 0).toLocaleString();
  const langNow = () => (localStorage.getItem("peps_lang") || "en");
  const businessNumber = "3054491784";
  const smsLink = body => "sms:" + businessNumber + "?&body=" + encodeURIComponent(body);

  function currentProduct(){
    if (!pg$("[data-product-page]") || typeof PRODUCTS === "undefined") return null;
    const slug = new URLSearchParams(location.search).get("item") || "bpc-157";
    return PRODUCTS.find(x => x.slug === slug) || PRODUCTS[2];
  }

  let selectedVariant = null;

  function updateProductTextLink(product){
    const link = pg$("[data-text-product]");
    if (!link || !product) return;
    const lang = langNow();
    const size = selectedVariant?.size || product.size || "N/A";
    const price = selectedVariant?.price ? " | Price: " + money(selectedVariant.price) : "";
    link.textContent = lang === "es" ? "CONSULTAR POR TEXTO" : "TEXT PRODUCT INQUIRY";
    const body = lang === "es"
      ? `Hola PEPS GLOBAL, me interesa ${product.name} (${size})${price} para uso de investigación. Por favor envíen disponibilidad, precio mayorista, COA aplicable, instrucciones de envío y link de pago.`
      : `Hi PEPS GLOBAL, I’m interested in ${product.name} (${size})${price} for research use. Please send availability, wholesale pricing, applicable COA documentation, shipping instructions, and payment link.`;
    link.href = smsLink(body);
  }

  function setSelectedVariant(product, variant){
    selectedVariant = variant;
    pg$$(".size-row .size").forEach(btn => {
      const active = btn.dataset.v11Size === variant.size;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const priceEl = pg$("[data-product-price]");
    if (priceEl) {
      priceEl.textContent = variant.price ? money(variant.price) : (product.price || "Text for pricing");
    }

    let note = pg$(".selected-size-note");
    if (!note) {
      note = document.createElement("p");
      note.className = "selected-size-note";
      pg$(".size-row")?.insertAdjacentElement("afterend", note);
    }
    note.textContent = variant.price
      ? `Selected: ${variant.size} • ${money(variant.price)}`
      : `Selected: ${variant.size} • Text for pricing`;

    updateProductTextLink(product);
  }

  function setupProductSizeSelector(){
    const product = currentProduct();
    if (!product) return;

    const row = pg$(".size-row");
    if (!row) return;

    const variants = PRODUCT_VARIANTS[product.slug] || [{size:product.size || "5MG", price:null}];
    row.innerHTML = variants.map((v, i) =>
      `<button class="size ${i === 0 ? "active" : ""}" type="button" data-v11-size="${v.size}" data-v11-price="${v.price ?? ""}" aria-pressed="${i === 0 ? "true" : "false"}">${v.size}</button>`
    ).join("");

    row.querySelectorAll(".size").forEach((btn, i) => {
      btn.addEventListener("click", () => setSelectedVariant(product, variants[i]));
    });

    setSelectedVariant(product, variants[0]);

    const qtyInput = pg$("[data-qty]");
    const addPayload = () => ({
      ...product,
      size:selectedVariant?.size || product.size || "N/A",
      price:selectedVariant?.price ? money(selectedVariant.price) : product.price,
      selectedPrice:selectedVariant?.price || null,
      qty:Number(qtyInput?.value || 1) || 1
    });

    pg$$("[data-add-cart],[data-add-quote]").forEach(btn => {
      btn.onclick = function(event){
        event.preventDefault();
        const cart = getCart();
        cart.push(addPayload());
        saveCart(cart);
        pg$(".cart-drawer")?.classList.add("open");
        cleanRenderCart();
      };
    });
  }

  function cleanCartSmsBody(cart){
    const lines = [
      "Hi PEPS GLOBAL, I want to request a research-use-only order.",
      "",
      "Selected items:"
    ];
    let total = 0;
    cart.forEach(item => {
      const qty = Number(item.qty || 1);
      const unit = Number(item.selectedPrice || 0);
      if (unit) total += unit * qty;
      const price = unit ? ` | Unit: ${money(unit)} | Line: ${money(unit * qty)}` : "";
      lines.push(`- ${item.name || "Product"} | Size: ${item.size || "N/A"} | Qty: ${qty}${price}`);
    });
    if (total) {
      lines.push("");
      lines.push("Estimated total: " + money(total));
    }
    lines.push("");
    lines.push("Please confirm availability, applicable COA documentation, shipping instructions, and send the payment link.");
    lines.push("Research use only. Not for human or veterinary use.");
    return lines.join("\n");
  }

  function cleanRenderCart(){
    const drawer = pg$(".cart-drawer");
    if (!drawer) return;

    const cart = getCart();
    pg$$(".cart-count").forEach(el => el.textContent = cart.reduce((sum, x) => sum + (Number(x.qty) || 1), 0));

    const title = pg$(".drawer-head strong");
    if (title) title.textContent = langNow() === "es" ? "Tu lista de cotización" : "Your quote list";

    const items = pg$("[data-cart-items]");
    if (items) {
      if (!cart.length) {
        items.innerHTML = `<div class="drawer-empty">${langNow() === "es" ? "Tu lista está vacía." : "Your quote list is empty."}</div>`;
      } else {
        items.innerHTML = cart.map((item, i) => {
          const qty = Number(item.qty || 1);
          const unit = Number(item.selectedPrice || 0);
          const priceLine = unit ? `<span>${money(unit)} each</span><span>${money(unit * qty)} line</span>` : `<span>${item.price || ""}</span>`;
          return `
            <article class="drawer-item-clean">
              <div class="drawer-item-top">
                <strong>${item.name || "Product"}</strong>
                <button type="button" aria-label="Remove item" data-remove-cart="${i}">×</button>
              </div>
              <div class="drawer-meta">
                <span>Size: ${item.size || "N/A"}</span>
                <span>Qty: ${qty}</span>
                ${priceLine}
              </div>
            </article>
          `;
        }).join("");
      }
    }

    // remove messy duplicate direct buttons created by older versions
    Array.from(drawer.children).forEach(child => {
      if (child.classList?.contains("drawer-actions-v11")) child.remove();
      if (child.matches?.("a.btn")) child.remove();
    });

    const actions = document.createElement("div");
    actions.className = "drawer-actions-v11";

    const textBtn = document.createElement("a");
    textBtn.className = "btn black full";
    textBtn.textContent = langNow() === "es" ? "ENVIAR SELECCIÓN POR TEXTO" : "TEXT SELECTED ITEMS";
    textBtn.href = cart.length
      ? smsLink(cleanCartSmsBody(cart))
      : smsLink("Hi PEPS GLOBAL, I want to place a research-use-only order. Please send product availability, instructions, and payment link.");

    const browse = document.createElement("a");
    browse.className = "btn outline full";
    browse.href = "catalog.html";
    browse.textContent = langNow() === "es" ? "SEGUIR COMPRANDO" : "CONTINUE SHOPPING";

    actions.appendChild(textBtn);
    actions.appendChild(browse);
    drawer.appendChild(actions);

    pg$$("[data-remove-cart]").forEach(btn => {
      btn.addEventListener("click", () => {
        const c = getCart();
        c.splice(Number(btn.dataset.removeCart), 1);
        saveCart(c);
        cleanRenderCart();
      });
    });
  }

  // override old renderCart so saveCart() uses the clean drawer
  if (typeof renderCart === "function") {
    renderCart = cleanRenderCart;
    window.renderCart = cleanRenderCart;
  }

  // fix nav labels so Sell Your Own does not become duplicated About
  function fixNavLabels(){
    const es = langNow() === "es";
    const rightLabels = es
      ? ["Envíos","Mayoreo","Vende Tu Marca","Nosotros"]
      : ["Shipping","Wholesale","Sell Your Own","About"];
    pg$$(".nav-right > a:not(.icon-btn)").forEach((a, i) => {
      if (rightLabels[i]) a.textContent = rightLabels[i];
    });
    const mobileLabels = es
      ? ["Inicio","Catálogo","Búsqueda COA","Calidad","Envíos","Mayoreo","Crea una Compañía","Vende Tu Marca","Nosotros","Contacto","Mi cuenta"]
      : ["Home","Catalog","COA Lookup","Quality","Shipping","Wholesale","Start a Company","Sell Your Own","About","Contact","My account"];
    pg$$(".mobile-menu > a").forEach((a, i) => {
      if (mobileLabels[i]) a.textContent = mobileLabels[i];
    });
  }

  if (typeof setLanguage === "function") {
    const oldSetLanguage = setLanguage;
    setLanguage = function(lang){
      oldSetLanguage(lang);
      fixNavLabels();
      setupProductSizeSelector();
      cleanRenderCart();
    };
    window.setLanguage = setLanguage;
  }

  setupProductSizeSelector();
  cleanRenderCart();
  fixNavLabels();
})();



// ---- V12 human order routing + package-first pricing ----
(() => {
  const ORDER_NUMBER = "3054491784";
  const ORDER_DISPLAY = "305-449-1784";
  const HUMAN_NUMBER = "3053157577";
  const HUMAN_DISPLAY = "305-315-7577";
  const GLOBAL_EMAIL = "Globalpepsorg@gmail.com";
  const PRICE_ITEMS = [{"category": "Bacteriostatic Water", "sku": "WA3", "product": "Bac.water", "mg": "3ml", "vials": "10 Vials", "base": 77, "price": 97}, {"category": "Bacteriostatic Water", "sku": "WA10", "product": "Bac.water", "mg": "10ml", "vials": "10 Vials", "base": 83, "price": 103}, {"category": "Tirzepatide", "sku": "TRS", "product": "Tirzepatide", "mg": "5mg", "vials": "10 Vials", "base": 137, "price": 157}, {"category": "Tirzepatide", "sku": "TR10", "product": "Tirzepatide", "mg": "10mg", "vials": "10 Vials", "base": 224, "price": 244}, {"category": "Tirzepatide", "sku": "TR15", "product": "Tirzepatide", "mg": "15mg", "vials": "10 Vials", "base": 296, "price": 316}, {"category": "Tirzepatide", "sku": "TR20", "product": "Tirzepatide", "mg": "20mg", "vials": "10 Vials", "base": 377, "price": 397}, {"category": "Tirzepatide", "sku": "TR30", "product": "Tirzepatide", "mg": "30mg", "vials": "10 Vials", "base": 479, "price": 499}, {"category": "Tirzepatide", "sku": "TR40", "product": "Tirzepatide", "mg": "40mg", "vials": "10 Vials", "base": 599, "price": 619}, {"category": "Tirzepatide", "sku": "TR50", "product": "Tirzepatide", "mg": "50mg", "vials": "10 Vials", "base": 701, "price": 721}, {"category": "Tirzepatide", "sku": "TR60", "product": "Tirzepatide", "mg": "60mg", "vials": "10 Vials", "base": 803, "price": 823}, {"category": "Tirzepatide", "sku": "TR100", "product": "Tirzepatide", "mg": "100mg", "vials": "10 Vials", "base": 1220, "price": 1240}, {"category": "Semaglutide", "sku": "SM10", "product": "Semaglutide", "mg": "10mg", "vials": "10 Vials", "base": 221, "price": 241}, {"category": "Semaglutide", "sku": "SM20", "product": "Semaglutide", "mg": "20mg", "vials": "10 Vials", "base": 308, "price": 328}, {"category": "BPC 157", "sku": "BC5", "product": "BPC 157", "mg": "5mg", "vials": "10 Vials", "base": 146, "price": 166}, {"category": "BPC 157", "sku": "BC10", "product": "BPC 157", "mg": "10mg", "vials": "10 Vials", "base": 194, "price": 214}, {"category": "BPC 157", "sku": "BB10", "product": "BPC 157 + TB500", "mg": "BPC 5mg + TB 5mg / 10mg", "vials": "10 Vials", "base": 365, "price": 385}, {"category": "BPC 157", "sku": "BB20", "product": "BPC 157 + TB500", "mg": "BPC 10mg + TB 10mg / 20mg", "vials": "10 Vials", "base": 650, "price": 670}, {"category": "TB500", "sku": "BT5", "product": "TB500", "mg": "5mg", "vials": "10 Vials", "base": 335, "price": 355}, {"category": "TB500", "sku": "BT10", "product": "TB500", "mg": "10mg", "vials": "10 Vials", "base": 563, "price": 583}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CP10", "product": "CJC 1295 no DAC + Ipamorelin", "mg": "10mg", "vials": "10 Vials", "base": 353, "price": 373}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CD5", "product": "CJC1295 with DAC", "mg": "5mg", "vials": "10 Vials", "base": 632, "price": 652}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CD10", "product": "CJC1295 with DAC", "mg": "10mg", "vials": "10 Vials", "base": 794, "price": 814}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CND5", "product": "CJC 1295 without DAC", "mg": "5mg", "vials": "10 Vials", "base": 242, "price": 262}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "CND10", "product": "CJC 1295 without DAC", "mg": "10mg", "vials": "10 Vials", "base": 458, "price": 478}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "IP5", "product": "Ipamorelin", "mg": "5mg", "vials": "10 Vials", "base": 146, "price": 166}, {"category": "CJC 1295 + Ipamorelin / Blends", "sku": "IP10", "product": "Ipamorelin", "mg": "10mg", "vials": "10 Vials", "base": 218, "price": 238}, {"category": "Retatrutide", "sku": "RT5", "product": "Retatrutide", "mg": "5mg", "vials": "10 Vials", "base": 170, "price": 190}, {"category": "Retatrutide", "sku": "RT10", "product": "Retatrutide", "mg": "10mg", "vials": "10 Vials", "base": 272, "price": 292}, {"category": "Retatrutide", "sku": "RT15", "product": "Retatrutide", "mg": "15mg", "vials": "10 Vials", "base": 368, "price": 388}, {"category": "Retatrutide", "sku": "RT20", "product": "Retatrutide", "mg": "20mg", "vials": "10 Vials", "base": 464, "price": 484}, {"category": "Retatrutide", "sku": "RT30", "product": "Retatrutide", "mg": "30mg", "vials": "10 Vials", "base": 638, "price": 658}, {"category": "Retatrutide", "sku": "RT40", "product": "Retatrutide", "mg": "40mg", "vials": "10 Vials", "base": 797, "price": 817}, {"category": "Retatrutide", "sku": "RT50", "product": "Retatrutide", "mg": "50mg", "vials": "10 Vials", "base": 938, "price": 958}, {"category": "Retatrutide", "sku": "RT60", "product": "Retatrutide", "mg": "60mg", "vials": "10 Vials", "base": 1082, "price": 1102}, {"category": "GHK-Cu", "sku": "CU50", "product": "GHK-Cu", "mg": "50mg", "vials": "10 Vials", "base": 128, "price": 148}, {"category": "GHK-Cu", "sku": "CU100", "product": "GHK-Cu", "mg": "100mg", "vials": "10 Vials", "base": 161, "price": 181}, {"category": "Sermorelin", "sku": "SMO5", "product": "Sermorelin", "mg": "5mg", "vials": "10 Vials", "base": 272, "price": 292}, {"category": "Sermorelin", "sku": "SMO10", "product": "Sermorelin", "mg": "10mg", "vials": "10 Vials", "base": 488, "price": 508}, {"category": "Tesamorelin", "sku": "TSM5", "product": "Tesamorelin", "mg": "5mg", "vials": "10 Vials", "base": 401, "price": 421}, {"category": "Tesamorelin", "sku": "TSM10", "product": "Tesamorelin", "mg": "10mg", "vials": "10 Vials", "base": 692, "price": 712}, {"category": "Tesamorelin", "sku": "TSM20", "product": "Tesamorelin", "mg": "20mg", "vials": "10 Vials", "base": 1163, "price": 1183}, {"category": "NAD+", "sku": "NJ100", "product": "NAD+", "mg": "100mg", "vials": "10 Vials", "base": 146, "price": 166}, {"category": "NAD+", "sku": "NJ500", "product": "NAD+", "mg": "500mg", "vials": "10 Vials", "base": 203, "price": 223}, {"category": "NAD+", "sku": "NJ1000", "product": "NAD+", "mg": "1000mg", "vials": "10 Vials", "base": 260, "price": 280}, {"category": "KLOW / GLOW", "sku": "GLOW70", "product": "GLOW", "mg": "70mg", "vials": "10 Vials", "base": 692, "price": 712}, {"category": "KLOW / GLOW", "sku": "KLOW80", "product": "KLOW", "mg": "80mg", "vials": "10 Vials", "base": 875, "price": 895}, {"category": "IGF-1 LR3", "sku": "IG1", "product": "IGF-1 LR3", "mg": "1mg", "vials": "10 Vials", "base": 737, "price": 757}, {"category": "MOTS-c", "sku": "MS10", "product": "MOTS-c", "mg": "10mg", "vials": "10 Vials", "base": 263, "price": 283}, {"category": "MOTS-c", "sku": "MS20", "product": "MOTS-c", "mg": "20mg", "vials": "10 Vials", "base": 431, "price": 451}, {"category": "MOTS-c", "sku": "MS40", "product": "MOTS-c", "mg": "40mg", "vials": "10 Vials", "base": 755, "price": 775}, {"category": "Epithalon", "sku": "ET10", "product": "Epithalon", "mg": "10mg", "vials": "10 Vials", "base": 152, "price": 172}, {"category": "Epithalon", "sku": "ET50", "product": "Epithalon", "mg": "50mg", "vials": "10 Vials", "base": 527, "price": 547}, {"category": "Cagrilintide", "sku": "CGL5", "product": "Cagrilintide", "mg": "5mg", "vials": "10 Vials", "base": 479, "price": 499}, {"category": "Cagrilintide", "sku": "CGL10", "product": "Cagrilintide", "mg": "10mg", "vials": "10 Vials", "base": 770, "price": 790}, {"category": "5-AMINO-1MQ", "sku": "5AM", "product": "5-AMINO-1MQ", "mg": "5mg", "vials": "10 Vials", "base": 83, "price": 103}, {"category": "5-AMINO-1MQ", "sku": "10AM", "product": "5-AMINO-1MQ", "mg": "10mg", "vials": "10 Vials", "base": 161, "price": 181}];
  const $ = (s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const money = n => "$" + Number(n || 0).toLocaleString();
  const sms = (phone, body) => "sms:" + phone + "?&body=" + encodeURIComponent(body);

  const variants = {
    "wolverine":[{label:"10 Vials", size:"10MG", price:385},{label:"10 Vials", size:"20MG", price:670}],
    "cjc-ipamorelin":[{label:"10 Vials", size:"10MG", price:373}],
    "bpc-157":[{label:"10 Vials", size:"5MG", price:166},{label:"10 Vials", size:"10MG", price:214}],
    "ghk-cu":[{label:"10 Vials", size:"50MG", price:148},{label:"10 Vials", size:"100MG", price:181}],
    "glow":[{label:"10 Vials", size:"70MG", price:712},{label:"10 Vials", size:"80MG", price:895}],
    "mots-c":[{label:"10 Vials", size:"10MG", price:283},{label:"10 Vials", size:"20MG", price:451},{label:"10 Vials", size:"40MG", price:775}],
    "epithalon":[{label:"10 Vials", size:"10MG", price:172},{label:"10 Vials", size:"50MG", price:547}],
    "cjc-1295":[{label:"10 Vials", size:"5MG", price:652},{label:"10 Vials", size:"10MG", price:814}],
    "5-amino-1mq":[{label:"10 Vials", size:"5MG", price:103},{label:"10 Vials", size:"10MG", price:181}],
    "tesamorelin":[{label:"10 Vials", size:"5MG", price:421},{label:"10 Vials", size:"10MG", price:712},{label:"10 Vials", size:"20MG", price:1183}],
    "enclomiphene":[{label:"10 Vials", size:"12.5MG", price:null}],
    "mk-677":[{label:"10 Vials", size:"25MG", price:null}],
    "mt-2":[{label:"10 Vials", size:"10MG", price:null}]
  };

  function getCartSafe() {
    try { return JSON.parse(localStorage.getItem("peps_cart") || localStorage.getItem("wop_cart") || "[]"); }
    catch(e) { return []; }
  }
  function saveCartSafe(cart) {
    localStorage.setItem("peps_cart", JSON.stringify(cart));
    localStorage.setItem("wop_cart", JSON.stringify(cart));
  }

  function buildOrderMessage(items) {
    const lines = [
      "Hi PEPS GLOBAL, I want to request a research-use-only order.",
      "",
      "Please have a HUMAN sales rep review this order. No AI / no chatbot.",
      "",
      "Selected items:"
    ];
    let total = 0;
    items.forEach(x => {
      const qty = Number(x.qty || 1);
      const unit = Number(x.selectedPrice || x.price || 0);
      const label = x.vials || x.label || "10 Vials";
      const mg = x.mg || x.size || "";
      if (unit) total += unit * qty;
      lines.push("- " + (x.sku ? x.sku + " | " : "") + (x.product || x.name || "Product") + " | " + label + " | " + mg + " | Qty " + qty + (unit ? " | " + money(unit * qty) : ""));
    });
    if (total) lines.push("", "Estimated total: " + money(total));
    lines.push("", "Please confirm availability, COA documentation, shipping, and send the payment link.");
    lines.push("Research use only. Not for human or veterinary use.");
    lines.push("Email: " + GLOBAL_EMAIL);
    return lines.join("\n");
  }

  function cleanDrawer() {
    const drawer = $(".cart-drawer");
    if (!drawer) return;
    const cart = getCartSafe();
    $$(".cart-count").forEach(x => x.textContent = cart.reduce((a,b)=>a+(Number(b.qty)||1),0));
    const box = $("[data-cart-items]");
    if (box) {
      box.innerHTML = cart.length ? cart.map((x,i) => {
        const qty = Number(x.qty || 1);
        const unit = Number(x.selectedPrice || x.price || 0);
        const label = x.vials || x.label || "10 Vials";
        const mg = x.mg || x.size || "";
        return `<article class="drawer-item-clean">
          <div class="drawer-item-top"><strong>${x.product || x.name || "Product"}</strong><button type="button" data-v12-remove="${i}">×</button></div>
          <div class="drawer-meta"><span class="drawer-vials">${label}</span><span>${mg}</span><span>Qty: ${qty}</span>${unit ? `<span>${money(unit)} each</span><span>${money(unit*qty)} line</span>` : ""}</div>
        </article>`;
      }).join("") : `<div class="drawer-empty">Your quote list is empty.</div>`;
    }
    Array.from(drawer.children).forEach(el => {
      if (el.classList?.contains("drawer-actions-v11") || el.classList?.contains("drawer-actions-v12")) el.remove();
      if (el.matches?.("a.btn")) el.remove();
    });
    const actions = document.createElement("div");
    actions.className = "drawer-actions-v12";
    actions.innerHTML = `
      <a class="btn black full" href="${sms(ORDER_NUMBER, cart.length ? buildOrderMessage(cart) : "Hi PEPS GLOBAL, I want to place a research-use-only order. Please connect me with a human sales rep and send instructions.")}">TEXT ORDER TO HUMAN SALES REP</a>
      <a class="btn outline full" href="${sms(HUMAN_NUMBER, "Hi PEPS GLOBAL, I want to talk to a human global agent in English or Spanish.")}">TALK TO HUMAN GLOBAL AGENT EN/ES</a>
      <a class="btn outline full" href="mailto:${GLOBAL_EMAIL}?subject=PEPS%20GLOBAL%20Inquiry">EMAIL INQUIRY</a>
    `;
    drawer.appendChild(actions);
    $$("[data-v12-remove]").forEach(btn => btn.onclick = () => {
      const c = getCartSafe();
      c.splice(Number(btn.dataset.v12Remove),1);
      saveCartSafe(c);
      cleanDrawer();
    });
  }

  function setupProductPage() {
    if (!$("[data-product-page]") || typeof PRODUCTS === "undefined") return;
    const slug = new URLSearchParams(location.search).get("item") || "bpc-157";
    const p = PRODUCTS.find(x => x.slug === slug) || PRODUCTS[0];
    const row = $(".size-row");
    if (!row) return;
    const list = variants[p.slug] || [{label:"10 Vials", size:p.size || "5MG", price:null}];
    let chosen = list[0];
    function select(v) {
      chosen = v;
      $$(".size-row .size").forEach(b => {
        const active = b.dataset.size === v.size;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const price = $("[data-product-price]");
      if (price) price.textContent = v.price ? money(v.price) : (p.price || "Text for pricing");
      let note = $(".selected-size-note");
      if (!note) {
        note = document.createElement("p");
        note.className = "selected-size-note";
        row.insertAdjacentElement("afterend", note);
      }
      note.innerHTML = `<strong>${v.label}</strong> package • <strong>${v.size}</strong> strength${v.price ? " • " + money(v.price) : ""}`;
      const productText = $("[data-text-product]");
      if (productText) {
        productText.href = sms(ORDER_NUMBER, `Hi PEPS GLOBAL, I am interested in ${p.name} | ${v.label} | ${v.size}${v.price ? " | " + money(v.price) : ""}. Please have a human sales rep confirm availability, COA documentation, shipping, and payment link. Research use only.`);
      }
    }
    row.innerHTML = list.map((v,i)=>`<button class="size ${i===0?"active":""}" type="button" data-size="${v.size}" aria-pressed="${i===0?"true":"false"}"><span class="size-vials">${v.label}</span><span class="size-mg">${v.size}</span></button>`).join("");
    row.querySelectorAll(".size").forEach((b,i)=>b.onclick = () => select(list[i]));
    select(chosen);
    const q = $("[data-qty]");
    $$("[data-add-cart],[data-add-quote]").forEach(btn => btn.onclick = e => {
      e.preventDefault();
      const cart = getCartSafe();
      cart.push({...p, product:p.name, vials:chosen.label, mg:chosen.size, size:chosen.size, selectedPrice:chosen.price || null, price:chosen.price || p.price, qty:Number(q?.value || 1) || 1});
      saveCartSafe(cart);
      cleanDrawer();
      $(".cart-drawer")?.classList.add("open");
    });
  }

  function setupPriceList() {
    const table = $("[data-price-table]");
    const selectedBox = $("[data-selected-prices]");
    const totalEl = $("[data-price-total]");
    const textLink = $("[data-price-text]");
    if (!table || !selectedBox || !totalEl || !textLink) return;
    let selected = [];
    function render() {
      selectedBox.innerHTML = selected.length ? selected.map((x,i)=>`<div class="selected-row"><span><strong>${x.sku}</strong><small>${x.product} • ${x.vials} • ${x.mg}</small></span><b>${money(x.price)}</b><button type="button" data-v12-price-remove="${i}">×</button></div>`).join("") : "<p>No items selected yet.</p>";
      totalEl.textContent = money(selected.reduce((s,x)=>s+Number(x.price || 0),0));
      textLink.textContent = "Text Selected Order to Human Sales Rep";
      textLink.href = sms(ORDER_NUMBER, selected.length ? buildOrderMessage(selected.map(x=>({...x, qty:1, selectedPrice:x.price}))) : "Hi PEPS GLOBAL, I want to place a research-use-only order. Please send instructions and payment link.");
      $$("[data-v12-price-remove]").forEach(btn => btn.onclick = () => {
        selected.splice(Number(btn.dataset.v12PriceRemove),1);
        render();
      });
    }
    table.addEventListener("click", e => {
      const btn = e.target.closest("[data-price-add]");
      if (!btn) return;
      const item = PRICE_ITEMS.find(x => x.sku === btn.dataset.sku);
      if (item) {
        selected.push(item);
        render();
      }
    });
    const search = $("[data-price-search]");
    const cat = $("[data-category-filter]");
    function filter() {
      const q = (search?.value || "").toLowerCase();
      const c = cat?.value || "all";
      table.querySelectorAll("tr").forEach(row => {
        row.style.display = ((!q || row.dataset.name.includes(q)) && (c === "all" || row.dataset.category === c)) ? "" : "none";
      });
    }
    search?.addEventListener("input", filter);
    cat?.addEventListener("change", filter);
    render();
  }

  function addHumanBadges() {
    const target = $(".product-info");
    if (target && !$(".human-product-note")) {
      const div = document.createElement("div");
      div.className = "human-product-note";
      div.innerHTML = `<strong>Human-reviewed ordering only.</strong><br>Primary orders: <a href="${sms(ORDER_NUMBER, "Hi PEPS GLOBAL, I want to place a research-use-only order. Please connect me with a human sales rep.")}">${ORDER_DISPLAY}</a> · Human Global Agent EN/ES: <a href="${sms(HUMAN_NUMBER, "Hi PEPS GLOBAL, I want to talk to a human global agent in English or Spanish.")}">${HUMAN_DISPLAY}</a> · <a href="mailto:${GLOBAL_EMAIL}">${GLOBAL_EMAIL}</a>`;
      target.appendChild(div);
    }
  }

  setupProductPage();
  setupPriceList();
  cleanDrawer();
  addHumanBadges();
  document.addEventListener("click", () => setTimeout(cleanDrawer, 30));
})();



// ---- V13 REAL 10-VIAL CATALOG PRICING OVERRIDE ----
(() => {
  const REAL_PRODUCTS = [{"slug": "wa3", "sku": "WA3", "category": "Bacteriostatic Water", "product": "Bac.water", "name": "Bac.water — 10 Vials / 3ml", "short": "Bac.water", "vials": "10 Vials", "mg": "3ml", "price": 77, "perVial": 7.7, "min": 77, "max": 77, "image": "assets/group-catalog.png"}, {"slug": "wa10", "sku": "WA10", "category": "Bacteriostatic Water", "product": "Bac.water", "name": "Bac.water — 10 Vials / 10ml", "short": "Bac.water", "vials": "10 Vials", "mg": "10ml", "price": 83, "perVial": 8.3, "min": 83, "max": 83, "image": "assets/group-catalog.png"}, {"slug": "trs", "sku": "TRS", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 5mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "5mg", "price": 137, "perVial": 13.7, "min": 137, "max": 137, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr10", "sku": "TR10", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 10mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "10mg", "price": 224, "perVial": 22.4, "min": 224, "max": 224, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr15", "sku": "TR15", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 15mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "15mg", "price": 296, "perVial": 29.6, "min": 296, "max": 296, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr20", "sku": "TR20", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 20mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "20mg", "price": 377, "perVial": 37.7, "min": 377, "max": 377, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr30", "sku": "TR30", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 30mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "30mg", "price": 479, "perVial": 47.9, "min": 479, "max": 479, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr40", "sku": "TR40", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 40mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "40mg", "price": 599, "perVial": 59.9, "min": 599, "max": 599, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr50", "sku": "TR50", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 50mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "50mg", "price": 701, "perVial": 70.1, "min": 701, "max": 701, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr60", "sku": "TR60", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 60mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "60mg", "price": 803, "perVial": 80.3, "min": 803, "max": 803, "image": "assets/tesamorelin-hero.png"}, {"slug": "tr100", "sku": "TR100", "category": "Tirzepatide", "product": "Tirzepatide", "name": "Tirzepatide — 10 Vials / 100mg", "short": "Tirzepatide", "vials": "10 Vials", "mg": "100mg", "price": 1220, "perVial": 122.0, "min": 1220, "max": 1220, "image": "assets/tesamorelin-hero.png"}, {"slug": "sm10", "sku": "SM10", "category": "Semaglutide", "product": "Semaglutide", "name": "Semaglutide — 10 Vials / 10mg", "short": "Semaglutide", "vials": "10 Vials", "mg": "10mg", "price": 221, "perVial": 22.1, "min": 221, "max": 221, "image": "assets/tesamorelin-hero.png"}, {"slug": "sm20", "sku": "SM20", "category": "Semaglutide", "product": "Semaglutide", "name": "Semaglutide — 10 Vials / 20mg", "short": "Semaglutide", "vials": "10 Vials", "mg": "20mg", "price": 308, "perVial": 30.8, "min": 308, "max": 308, "image": "assets/tesamorelin-hero.png"}, {"slug": "bc5", "sku": "BC5", "category": "BPC 157", "product": "BPC 157", "name": "BPC 157 — 10 Vials / 5mg", "short": "BPC 157", "vials": "10 Vials", "mg": "5mg", "price": 146, "perVial": 14.6, "min": 146, "max": 146, "image": "assets/bpc-157-vial.png"}, {"slug": "bc10", "sku": "BC10", "category": "BPC 157", "product": "BPC 157", "name": "BPC 157 — 10 Vials / 10mg", "short": "BPC 157", "vials": "10 Vials", "mg": "10mg", "price": 194, "perVial": 19.4, "min": 194, "max": 194, "image": "assets/bpc-157-vial.png"}, {"slug": "bb10", "sku": "BB10", "category": "BPC 157", "product": "BPC 157 + TB500", "name": "BPC 157 + TB500 — 10 Vials / BPC 5mg + TB 5mg / 10mg total", "short": "BPC 157 + TB500", "vials": "10 Vials", "mg": "BPC 5mg + TB 5mg / 10mg total", "price": 365, "perVial": 36.5, "min": 365, "max": 365, "image": "assets/bpc-157-vial.png"}, {"slug": "bb20", "sku": "BB20", "category": "BPC 157", "product": "BPC 157 + TB500", "name": "BPC 157 + TB500 — 10 Vials / BPC 10mg + TB 10mg / 20mg total", "short": "BPC 157 + TB500", "vials": "10 Vials", "mg": "BPC 10mg + TB 10mg / 20mg total", "price": 650, "perVial": 65.0, "min": 650, "max": 650, "image": "assets/bpc-157-vial.png"}, {"slug": "bt5", "sku": "BT5", "category": "TB500", "product": "TB500", "name": "TB500 — 10 Vials / 5mg", "short": "TB500", "vials": "10 Vials", "mg": "5mg", "price": 335, "perVial": 33.5, "min": 335, "max": 335, "image": "assets/wolverine-vial.png"}, {"slug": "bt10", "sku": "BT10", "category": "TB500", "product": "TB500", "name": "TB500 — 10 Vials / 10mg", "short": "TB500", "vials": "10 Vials", "mg": "10mg", "price": 563, "perVial": 56.3, "min": 563, "max": 563, "image": "assets/wolverine-vial.png"}, {"slug": "cp10", "sku": "CP10", "category": "CJC 1295 + Ipamorelin / Blends", "product": "CJC 1295 no DAC + Ipamorelin", "name": "CJC 1295 no DAC + Ipamorelin — 10 Vials / CJC 5mg + IPA 5mg / 10mg total", "short": "CJC 1295 no DAC + Ipamorelin", "vials": "10 Vials", "mg": "CJC 5mg + IPA 5mg / 10mg total", "price": 353, "perVial": 35.3, "min": 353, "max": 353, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "cd5", "sku": "CD5", "category": "CJC 1295 + Ipamorelin / Blends", "product": "CJC1295 with DAC", "name": "CJC1295 with DAC — 10 Vials / 5mg", "short": "CJC1295 with DAC", "vials": "10 Vials", "mg": "5mg", "price": 632, "perVial": 63.2, "min": 632, "max": 632, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "cd10", "sku": "CD10", "category": "CJC 1295 + Ipamorelin / Blends", "product": "CJC1295 with DAC", "name": "CJC1295 with DAC — 10 Vials / 10mg", "short": "CJC1295 with DAC", "vials": "10 Vials", "mg": "10mg", "price": 794, "perVial": 79.4, "min": 794, "max": 794, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "cnd5", "sku": "CND5", "category": "CJC 1295 + Ipamorelin / Blends", "product": "CJC 1295 without DAC", "name": "CJC 1295 without DAC — 10 Vials / 5mg", "short": "CJC 1295 without DAC", "vials": "10 Vials", "mg": "5mg", "price": 242, "perVial": 24.2, "min": 242, "max": 242, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "cnd10", "sku": "CND10", "category": "CJC 1295 + Ipamorelin / Blends", "product": "CJC 1295 without DAC", "name": "CJC 1295 without DAC — 10 Vials / 10mg", "short": "CJC 1295 without DAC", "vials": "10 Vials", "mg": "10mg", "price": 458, "perVial": 45.8, "min": 458, "max": 458, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "ip5", "sku": "IP5", "category": "CJC 1295 + Ipamorelin / Blends", "product": "Ipamorelin", "name": "Ipamorelin — 10 Vials / 5mg", "short": "Ipamorelin", "vials": "10 Vials", "mg": "5mg", "price": 146, "perVial": 14.6, "min": 146, "max": 146, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "ip10", "sku": "IP10", "category": "CJC 1295 + Ipamorelin / Blends", "product": "Ipamorelin", "name": "Ipamorelin — 10 Vials / 10mg", "short": "Ipamorelin", "vials": "10 Vials", "mg": "10mg", "price": 218, "perVial": 21.8, "min": 218, "max": 218, "image": "assets/cjc-ipamorelin-vial.png"}, {"slug": "rt5", "sku": "RT5", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 5mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "5mg", "price": 170, "perVial": 17.0, "min": 170, "max": 170, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt10", "sku": "RT10", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 10mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "10mg", "price": 272, "perVial": 27.2, "min": 272, "max": 272, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt15", "sku": "RT15", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 15mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "15mg", "price": 368, "perVial": 36.8, "min": 368, "max": 368, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt20", "sku": "RT20", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 20mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "20mg", "price": 464, "perVial": 46.4, "min": 464, "max": 464, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt30", "sku": "RT30", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 30mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "30mg", "price": 638, "perVial": 63.8, "min": 638, "max": 638, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt40", "sku": "RT40", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 40mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "40mg", "price": 797, "perVial": 79.7, "min": 797, "max": 797, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt50", "sku": "RT50", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 50mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "50mg", "price": 938, "perVial": 93.8, "min": 938, "max": 938, "image": "assets/tesamorelin-hero.png"}, {"slug": "rt60", "sku": "RT60", "category": "Retatrutide", "product": "Retatrutide", "name": "Retatrutide — 10 Vials / 60mg", "short": "Retatrutide", "vials": "10 Vials", "mg": "60mg", "price": 1082, "perVial": 108.2, "min": 1082, "max": 1082, "image": "assets/tesamorelin-hero.png"}, {"slug": "cu50", "sku": "CU50", "category": "GHK-Cu", "product": "GHK-Cu", "name": "GHK-Cu — 10 Vials / 50mg", "short": "GHK-Cu", "vials": "10 Vials", "mg": "50mg", "price": 128, "perVial": 12.8, "min": 128, "max": 128, "image": "assets/ghk-cu-vial.png"}, {"slug": "cu100", "sku": "CU100", "category": "GHK-Cu", "product": "GHK-Cu", "name": "GHK-Cu — 10 Vials / 100mg", "short": "GHK-Cu", "vials": "10 Vials", "mg": "100mg", "price": 161, "perVial": 16.1, "min": 161, "max": 161, "image": "assets/ghk-cu-vial.png"}, {"slug": "smo5", "sku": "SMO5", "category": "Sermorelin", "product": "Sermorelin", "name": "Sermorelin — 10 Vials / 5mg", "short": "Sermorelin", "vials": "10 Vials", "mg": "5mg", "price": 272, "perVial": 27.2, "min": 272, "max": 272, "image": "assets/tesamorelin-hero.png"}, {"slug": "smo10", "sku": "SMO10", "category": "Sermorelin", "product": "Sermorelin", "name": "Sermorelin — 10 Vials / 10mg", "short": "Sermorelin", "vials": "10 Vials", "mg": "10mg", "price": 488, "perVial": 48.8, "min": 488, "max": 488, "image": "assets/tesamorelin-hero.png"}, {"slug": "tsm5", "sku": "TSM5", "category": "Tesamorelin", "product": "Tesamorelin", "name": "Tesamorelin — 10 Vials / 5mg", "short": "Tesamorelin", "vials": "10 Vials", "mg": "5mg", "price": 401, "perVial": 40.1, "min": 401, "max": 401, "image": "assets/tesamorelin-hero.png"}, {"slug": "tsm10", "sku": "TSM10", "category": "Tesamorelin", "product": "Tesamorelin", "name": "Tesamorelin — 10 Vials / 10mg", "short": "Tesamorelin", "vials": "10 Vials", "mg": "10mg", "price": 692, "perVial": 69.2, "min": 692, "max": 692, "image": "assets/tesamorelin-hero.png"}, {"slug": "tsm20", "sku": "TSM20", "category": "Tesamorelin", "product": "Tesamorelin", "name": "Tesamorelin — 10 Vials / 20mg", "short": "Tesamorelin", "vials": "10 Vials", "mg": "20mg", "price": 1163, "perVial": 116.3, "min": 1163, "max": 1163, "image": "assets/tesamorelin-hero.png"}, {"slug": "nj100", "sku": "NJ100", "category": "NAD+", "product": "NAD+", "name": "NAD+ — 10 Vials / 100mg", "short": "NAD+", "vials": "10 Vials", "mg": "100mg", "price": 146, "perVial": 14.6, "min": 146, "max": 146, "image": "assets/group-catalog.png"}, {"slug": "nj500", "sku": "NJ500", "category": "NAD+", "product": "NAD+", "name": "NAD+ — 10 Vials / 500mg", "short": "NAD+", "vials": "10 Vials", "mg": "500mg", "price": 203, "perVial": 20.3, "min": 203, "max": 203, "image": "assets/group-catalog.png"}, {"slug": "nj1000", "sku": "NJ1000", "category": "NAD+", "product": "NAD+", "name": "NAD+ — 10 Vials / 1000mg", "short": "NAD+", "vials": "10 Vials", "mg": "1000mg", "price": 260, "perVial": 26.0, "min": 260, "max": 260, "image": "assets/group-catalog.png"}, {"slug": "glow70", "sku": "GLOW70", "category": "KLOW / GLOW", "product": "GLOW", "name": "GLOW — 10 Vials / 70mg total", "short": "GLOW", "vials": "10 Vials", "mg": "70mg total", "price": 692, "perVial": 69.2, "min": 692, "max": 692, "image": "assets/glow-vial.png"}, {"slug": "klow80", "sku": "KLOW80", "category": "KLOW / GLOW", "product": "KLOW", "name": "KLOW — 10 Vials / 80mg total", "short": "KLOW", "vials": "10 Vials", "mg": "80mg total", "price": 875, "perVial": 87.5, "min": 875, "max": 875, "image": "assets/glow-vial.png"}, {"slug": "ig1", "sku": "IG1", "category": "IGF-1 LR3", "product": "IGF-1 LR3", "name": "IGF-1 LR3 — 10 Vials / 1mg", "short": "IGF-1 LR3", "vials": "10 Vials", "mg": "1mg", "price": 737, "perVial": 73.7, "min": 737, "max": 737, "image": "assets/group-catalog.png"}, {"slug": "ms10", "sku": "MS10", "category": "MOTS-c", "product": "MOTS-c", "name": "MOTS-c — 10 Vials / 10mg", "short": "MOTS-c", "vials": "10 Vials", "mg": "10mg", "price": 263, "perVial": 26.3, "min": 263, "max": 263, "image": "assets/mots-c-vial.png"}, {"slug": "ms20", "sku": "MS20", "category": "MOTS-c", "product": "MOTS-c", "name": "MOTS-c — 10 Vials / 20mg", "short": "MOTS-c", "vials": "10 Vials", "mg": "20mg", "price": 431, "perVial": 43.1, "min": 431, "max": 431, "image": "assets/mots-c-vial.png"}, {"slug": "ms40", "sku": "MS40", "category": "MOTS-c", "product": "MOTS-c", "name": "MOTS-c — 10 Vials / 40mg", "short": "MOTS-c", "vials": "10 Vials", "mg": "40mg", "price": 755, "perVial": 75.5, "min": 755, "max": 755, "image": "assets/mots-c-vial.png"}, {"slug": "et10", "sku": "ET10", "category": "Epithalon", "product": "Epithalon", "name": "Epithalon — 10 Vials / 10mg", "short": "Epithalon", "vials": "10 Vials", "mg": "10mg", "price": 152, "perVial": 15.2, "min": 152, "max": 152, "image": "assets/epithalon-vial.png"}, {"slug": "et50", "sku": "ET50", "category": "Epithalon", "product": "Epithalon", "name": "Epithalon — 10 Vials / 50mg", "short": "Epithalon", "vials": "10 Vials", "mg": "50mg", "price": 527, "perVial": 52.7, "min": 527, "max": 527, "image": "assets/epithalon-vial.png"}, {"slug": "cgl5", "sku": "CGL5", "category": "Cagrilintide", "product": "Cagrilintide", "name": "Cagrilintide — 10 Vials / 5mg", "short": "Cagrilintide", "vials": "10 Vials", "mg": "5mg", "price": 479, "perVial": 47.9, "min": 479, "max": 479, "image": "assets/group-catalog.png"}, {"slug": "cgl10", "sku": "CGL10", "category": "Cagrilintide", "product": "Cagrilintide", "name": "Cagrilintide — 10 Vials / 10mg", "short": "Cagrilintide", "vials": "10 Vials", "mg": "10mg", "price": 770, "perVial": 77.0, "min": 770, "max": 770, "image": "assets/group-catalog.png"}, {"slug": "5am", "sku": "5AM", "category": "5-AMINO-1MQ", "product": "5-AMINO-1MQ", "name": "5-AMINO-1MQ — 10 Vials / 5mg", "short": "5-AMINO-1MQ", "vials": "10 Vials", "mg": "5mg", "price": 83, "perVial": 8.3, "min": 83, "max": 83, "image": "assets/group-catalog.png"}, {"slug": "10am", "sku": "10AM", "category": "5-AMINO-1MQ", "product": "5-AMINO-1MQ", "name": "5-AMINO-1MQ — 10 Vials / 10mg", "short": "5-AMINO-1MQ", "vials": "10 Vials", "mg": "10mg", "price": 161, "perVial": 16.1, "min": 161, "max": 161, "image": "assets/group-catalog.png"}];
  const CATEGORIES = ["5-AMINO-1MQ", "BPC 157", "Bacteriostatic Water", "CJC 1295 + Ipamorelin / Blends", "Cagrilintide", "Epithalon", "GHK-Cu", "IGF-1 LR3", "KLOW / GLOW", "MOTS-c", "NAD+", "Retatrutide", "Semaglutide", "Sermorelin", "TB500", "Tesamorelin", "Tirzepatide"];
  const ORDER_NUMBER = "3054491784";
  const HUMAN_NUMBER = "3053157577";
  const EMAIL = "Globalpepsorg@gmail.com";
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const money = n => "$" + Number(n || 0).toLocaleString();
  const perVial = n => "($" + (Number(n || 0) / 10).toFixed(2) + "/vial)";
  const sms = (phone, body) => "sms:" + phone + "?&body=" + encodeURIComponent(body);

  // Replace old product source everywhere after previous scripts load.
  window.PRODUCTS = REAL_PRODUCTS;

  function getCart() {
    try { return JSON.parse(localStorage.getItem("peps_cart") || "[]"); }
    catch(e) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem("peps_cart", JSON.stringify(cart));
    localStorage.setItem("wop_cart", JSON.stringify(cart));
  }
  function orderText(cart) {
    const lines = [
      "Hi PEPS GLOBAL, I want to request a research-use-only order.",
      "",
      "Please have a HUMAN sales rep review this order. No AI / no chatbot.",
      "",
      "Selected items:"
    ];
    let total = 0;
    cart.forEach(x => {
      const qty = Number(x.qty || 1);
      const price = Number(x.price || x.selectedPrice || 0);
      total += price * qty;
      lines.push("- " + (x.sku || "") + " | " + (x.product || x.name || "") + " | " + (x.vials || "10 Vials") + " | " + (x.mg || x.size || "") + " each | Qty " + qty + " | " + money(price * qty));
    });
    lines.push("", "Estimated total: " + money(total));
    lines.push("", "Please confirm availability, applicable COA documentation, shipping, and send the payment link.");
    lines.push("Research use only. Not for human or veterinary use.");
    lines.push("Email: " + EMAIL);
    return lines.join("\n");
  }
  function productCard(p) {
    return `<article class="product-card v13-product-card">
      <a href="product.html?item=${p.slug}" class="product-image real"><img loading="lazy" src="${p.image}" alt="${p.product}"></a>
      <div class="product-meta">
        <a href="product.html?item=${p.slug}" class="product-name">${p.product}</a>
        <button class="heart" type="button" aria-label="Save ${p.product}">♡</button>
        <div class="package-line"><span class="vials-pill">${p.vials}</span><span class="mg-pill">${p.mg.toUpperCase()} each</span></div>
        <div class="product-price">${money(p.price)} <small class="per-vial-inline">${perVial(p.price)}</small></div>
        <button class="btn black small add-card-btn" type="button" data-v13-add="${p.sku}">Add</button>
      </div>
    </article>`;
  }
  function setupCatalogFilters() {
    const filters = $(".filters");
    if (filters) {
      filters.innerHTML = `<h4>FILTER</h4><hr><strong>Category</strong>
      <select data-v13-category><option value="all">All Categories</option>${CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>
      <hr><strong>Search</strong><input data-v13-search placeholder="Search product, SKU, or MG"><button class="btn outline small" type="button" data-v13-reset>Reset</button>`;
    }
    const intro = $(".page-intro");
    if (intro && !$(".v13-catalog-tools")) {
      const tools = document.createElement("div");
      tools.className = "v13-catalog-tools";
      tools.innerHTML = `<input data-v13-search placeholder="Search product, SKU, or MG"><select data-v13-category><option value="all">All Categories</option>${CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>`;
      intro.appendChild(tools);
    }
    $$("[data-v13-category],[data-v13-search],.sort,[data-sort]").forEach(el => {
      el.addEventListener("input", renderCatalog);
      el.addEventListener("change", renderCatalog);
    });
    $$("[data-v13-reset]").forEach(b => b.onclick = () => {
      $$("[data-v13-category]").forEach(x=>x.value="all");
      $$("[data-v13-search]").forEach(x=>x.value="");
      renderCatalog();
    });
  }
  function renderCatalog() {
    const grid = $("[data-product-grid]");
    if (!grid) return;
    const cat = $("[data-v13-category]")?.value || "all";
    const q = ($("[data-v13-search]")?.value || "").toLowerCase().trim();
    const sort = $("[data-sort],.sort")?.value || "featured";
    let list = [...REAL_PRODUCTS];
    if (cat !== "all") list = list.filter(p => p.category === cat);
    if (q) list = list.filter(p => (p.sku + " " + p.product + " " + p.mg + " " + p.category).toLowerCase().includes(q));
    if (sort === "low") list.sort((a,b)=>a.price-b.price);
    if (sort === "high") list.sort((a,b)=>b.price-a.price);
    grid.innerHTML = list.map(productCard).join("");
    const status = $("[data-catalog-status]");
    if (status) status.textContent = "Showing " + list.length + " products";
  }
  function renderHome() {
    const grid = $("[data-home-grid]");
    if (grid) grid.innerHTML = REAL_PRODUCTS.filter(p => ["TR10","SM10","BC5","CP10"].includes(p.sku)).map(productCard).join("");
  }
  function renderDrawer() {
    const drawer = $(".cart-drawer");
    if (!drawer) return;
    const cart = getCart();
    $$(".cart-count").forEach(x => x.textContent = cart.reduce((a,b)=>a+(Number(b.qty)||1),0));
    const items = $("[data-cart-items]");
    if (items) {
      items.innerHTML = cart.length ? cart.map((x,i)=>`<article class="drawer-item-clean">
        <div class="drawer-item-top"><strong>${x.product || x.name}</strong><button type="button" data-v13-remove="${i}">×</button></div>
        <div class="drawer-meta"><span class="drawer-vials">${x.vials || "10 Vials"}</span><span>${x.mg || x.size || ""} each</span><span>Qty: ${x.qty || 1}</span><span>${money((x.price || x.selectedPrice || 0) * (x.qty || 1))}</span></div>
      </article>`).join("") : `<div class="drawer-empty">Your quote list is empty.</div>`;
    }
    Array.from(drawer.children).forEach(el => {
      if (el.classList?.contains("drawer-actions-v11") || el.classList?.contains("drawer-actions-v12") || el.classList?.contains("drawer-actions-v13")) el.remove();
      if (el.matches?.("a.btn")) el.remove();
    });
    const actions = document.createElement("div");
    actions.className = "drawer-actions-v13";
    actions.innerHTML = `<a class="btn black full" href="${sms(ORDER_NUMBER, cart.length ? orderText(cart) : "Hi PEPS GLOBAL, I want to place a research-use-only order. Please connect me with a human sales rep.")}">TEXT ORDER TO HUMAN SALES REP</a>
    <a class="btn outline full" href="${sms(HUMAN_NUMBER, "Hi PEPS GLOBAL, I want to talk to a human global agent in English or Spanish.")}">TALK TO HUMAN GLOBAL AGENT EN/ES</a>
    <a class="btn outline full" href="mailto:${EMAIL}?subject=PEPS%20GLOBAL%20Inquiry">EMAIL INQUIRY</a>`;
    drawer.appendChild(actions);
    $$("[data-v13-remove]").forEach(b=>b.onclick=()=>{const cart=getCart();cart.splice(Number(b.dataset.v13Remove),1);saveCart(cart);renderDrawer();});
  }
  function addItem(sku, qty=1) {
    const p = REAL_PRODUCTS.find(x => x.sku === sku);
    if (!p) return;
    const cart = getCart();
    cart.push({...p, qty, selectedPrice:p.price, size:p.mg});
    saveCart(cart);
    renderDrawer();
    $(".cart-drawer")?.classList.add("open");
  }
  function setupAddButtons() {
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-v13-add]");
      if (!btn) return;
      e.preventDefault();
      addItem(btn.dataset.v13Add || btn.dataset.sku);
    });
  }
  function setupProductPage() {
    if (!$("[data-product-page]")) return;
    const slug = new URLSearchParams(location.search).get("item") || "bc5";
    let selected = REAL_PRODUCTS.find(p => p.slug === slug || p.sku.toLowerCase() === slug) || REAL_PRODUCTS[0];
    const group = REAL_PRODUCTS.filter(p => p.product === selected.product);
    $("[data-product-title]") && ($("[data-product-title]").textContent = selected.product);
    $("[data-product-breadcrumb]") && ($("[data-product-breadcrumb]").textContent = selected.product);
    const img = $("[data-product-image]");
    if (img) img.innerHTML = `<img src="${selected.image}" alt="${selected.product}">`;
    const row = $(".size-row");
    function choose(p) {
      selected = p;
      $$(".size-row .size").forEach(b => b.classList.toggle("active", b.dataset.sku === p.sku));
      const price = $("[data-product-price]");
      if (price) price.innerHTML = `${money(p.price)} <small class="per-vial-inline">${perVial(p.price)}</small>`;
      let note = $(".selected-size-note");
      if (!note) { note = document.createElement("p"); note.className = "selected-size-note"; row?.insertAdjacentElement("afterend", note); }
      note.innerHTML = `<strong>${p.vials}</strong> package • <strong>${p.mg}</strong> each • <strong>${money(p.price)}</strong> <span>${perVial(p.price)}</span>`;
      const textBtn = $("[data-text-product]");
      if (textBtn) textBtn.href = sms(ORDER_NUMBER, `Hi PEPS GLOBAL, I am interested in ${p.sku} | ${p.product} | ${p.vials} | ${p.mg} each | ${money(p.price)} ${perVial(p.price)}. Please have a human sales rep confirm availability, COA documentation, shipping, and payment link. Research use only.`);
    }
    if (row) {
      row.innerHTML = group.map(p=>`<button class="size ${p.sku===selected.sku ? "active" : ""}" type="button" data-sku="${p.sku}"><span class="size-vials">${p.vials}</span><span class="size-mg">${p.mg}</span><small>${money(p.price)} ${perVial(p.price)}</small></button>`).join("");
      row.querySelectorAll(".size").forEach((b,i)=>b.onclick=()=>choose(group[i]));
    }
    choose(selected);
    const qty = $("[data-qty]");
    $$("[data-add-cart],[data-add-quote]").forEach(btn => btn.onclick = e => {
      e.preventDefault();
      addItem(selected.sku, Number(qty?.value || 1) || 1);
    });
  }
  function setupPriceList() {
    const table = $("[data-price-table]");
    if (!table) return;
    table.innerHTML = REAL_PRODUCTS.map(p=>`<tr data-category="${p.category}" data-name="${(p.sku+" "+p.product+" "+p.mg).toLowerCase()}">
      <td><strong>${p.sku}</strong></td><td>${p.product}</td><td><span class="vials-pill">${p.vials}</span></td><td><span class="mg-pill">${p.mg} each</span></td><td><strong>${money(p.price)}</strong> <small class="per-vial-inline">${perVial(p.price)}</small></td><td><button class="btn black small" type="button" data-v13-add="${p.sku}">Add</button></td>
    </tr>`).join("");
    const search = $("[data-price-search]");
    const cat = $("[data-category-filter]");
    function filter() {
      const q = (search?.value || "").toLowerCase();
      const c = cat?.value || "all";
      table.querySelectorAll("tr").forEach(row => row.style.display = ((!q || row.dataset.name.includes(q)) && (c === "all" || row.dataset.category === c)) ? "" : "none");
    }
    search?.addEventListener("input", filter);
    cat?.addEventListener("change", filter);
  }

  setupCatalogFilters();
  renderCatalog();
  renderHome();
  setupProductPage();
  setupPriceList();
  setupAddButtons();
  renderDrawer();
  document.addEventListener("click", () => setTimeout(renderDrawer, 40));
})();
