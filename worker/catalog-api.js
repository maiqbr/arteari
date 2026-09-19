const allowedOrigin='https://arteari.com.br';
const responseHeaders={
  'Content-Type':'application/json; charset=utf-8',
  'Access-Control-Allow-Origin':allowedOrigin,
  'Vary':'Origin',
  'X-Content-Type-Options':'nosniff',
  'Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
};
const parseImages=value=>{try{const images=JSON.parse(value||'[]');return Array.isArray(images)?images.filter(image=>typeof image==='string'):[]}catch{return[]}};
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{headers:{'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
    if(request.method!=='GET'||url.pathname!=='/catalog')return new Response(JSON.stringify({error:'Não encontrado.'}),{status:404,headers:responseHeaders});
    const result=await env.DB.prepare(`SELECT p.slug,p.title,p.description,p.price_cents,p.badge,p.whatsapp_message,p.images_json,p.sort_order,c.name AS category_name,c.slug AS category_slug FROM catalog_products p JOIN catalog_categories c ON c.id=p.category_id WHERE p.active=1 AND c.active=1 ORDER BY p.sort_order,p.title COLLATE NOCASE`).all();
    const products=(result.results||[]).map(product=>({...product,images:parseImages(product.images_json)}));
    return new Response(JSON.stringify({products}),{headers:responseHeaders});
  }
};
