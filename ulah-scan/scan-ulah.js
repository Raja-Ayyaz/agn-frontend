// scan-ulah.js
// Usage: node scan-ulah.js
const https = require('https');
const fs = require('fs');
const pages = ['https://ulah.es/','https://ulah.es/en/'];

function fetch(url){
  return new Promise((res, rej)=>{
    https.get(url, (r)=>{
      let data='';
      r.on('data', c=> data+=c);
      r.on('end', ()=> res({url, data}));
    }).on('error', rej);
  });
}

function findCssLinks(html, baseUrl){
  const hrefs = [];
  const linkRe = /<link[^>]+href=["']([^"']+)["']/gi;
  let m;
  while ((m = linkRe.exec(html))){
    hrefs.push(new URL(m[1], baseUrl).href);
  }
  return hrefs;
}

function extractVars(css){
  const vars = {};
  // find :root { ... } blocks
  const rootRe = /:root\\s*{([\\s\\S]*?)}/g;
  let m;
  while ((m = rootRe.exec(css))){
    const body = m[1];
    const varRe = /--([a-zA-Z0-9-_]+)\\s*:\\s*([^;]+);/g;
    let v;
    while ((v = varRe.exec(body))){
      vars[v[1].trim()] = v[2].trim();
    }
  }
  // collect hex colors elsewhere
  const hexes = Array.from(new Set((css.match(/#([0-9a-fA-F]{3,6})/g)||[])));
  return {vars, hexes};
}

(async ()=>{
  try{
    const results = [];
    for (const p of pages){
      const {data} = await fetch(p);
      const cssLinks = findCssLinks(data, p);
      const inlineStyles = [];
      // find inline <style> blocks
      const styleRe = /<style[^>]*>([\\s\\S]*?)<\\/style>/gi;
      let s;
      while ((s = styleRe.exec(data))){
        inlineStyles.push(s[1]);
      }
      const pageResult = {page:p, cssLinks, inlineStyles, vars: {}, hexes: []};
      // fetch css files
      for (const href of cssLinks){
        try{
          const {data:css} = await fetch(href);
          const found = extractVars(css);
          Object.assign(pageResult.vars, found.vars || {});
          pageResult.hexes.push(...found.hexes);
        }catch(e){ /* skip */ }
      }
      // inspect inline styles
      for (const st of inlineStyles){
        const found = extractVars(st);
        Object.assign(pageResult.vars, found.vars || {});
        pageResult.hexes.push(...found.hexes);
      }
      pageResult.hexes = Array.from(new Set(pageResult.hexes));
      results.push(pageResult);
    }
    console.log(JSON.stringify(results, null, 2));
  }catch(err){
    console.error('Failed:', err.message);
    process.exit(1);
  }
})();