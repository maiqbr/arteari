const allowedOrigin='https://arteari.com.br';
const responseHeaders={
  'Content-Type':'application/json; charset=utf-8',
  'Access-Control-Allow-Origin':allowedOrigin,
  'Vary':'Origin',
  'X-Content-Type-Options':'nosniff',
  'Cache-Control':'no-store'
};
const parseImages=value=>{try{const images=JSON.parse(value||'[]');return Array.isArray(images)?images.filter(image=>typeof image==='string'):[]}catch{return[]}};
const mediaUrl=key=>`https://api.arteari.com.br/media/${key}`;
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{headers:{'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
    if(request.method!=='GET')return new Response(JSON.stringify({error:'Não encontrado.'}),{status:404,headers:responseHeaders});
    if(url.pathname.startsWith('/media/')){const key=decodeURIComponent(url.pathname.slice('/media/'.length));if(!key.startsWith('catalog/')||key.includes('..'))return new Response('Não encontrado.',{status:404});const object=await env.MEDIA.get(key);if(!object)return new Response('Não encontrado.',{status:404});const headers=new Headers({'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'});object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);return new Response(object.body,{headers});}
    if(url.pathname!=='/catalog')return new Response(JSON.stringify({error:'Não encontrado.'}),{status:404,headers:responseHeaders});
    const result=await env.DB.prepare(`SELECT p.*,c.name AS category_name,c.slug AS category_slug FROM catalog_products p JOIN catalog_categories c ON c.id=p.category_id WHERE p.active=1 AND c.active=1 ORDER BY p.sort_order,p.title COLLATE NOCASE`).all();
    const products=(result.results||[]).map(product=>({slug:product.slug,title:product.title,description:product.description,price_cents:product.show_price===0?null:product.price_cents,show_price:product.show_price??1,badge:product.badge,whatsapp_message:product.whatsapp_message,images:parseImages(product.images_json).map(image=>image.startsWith('catalog/')?mediaUrl(image):image),sort_order:product.sort_order,category_name:product.category_name,category_slug:product.category_slug}));
    return new Response(JSON.stringify({products}),{headers:responseHeaders});
  }
};
