// Test di motore regole, prezzi, scenari e traduzioni. Esegui: npm test
const fs=require('fs'),vm=require('vm');
const path=require('path');
const html=fs.readFileSync(process.argv[2]||path.join(__dirname,'..','webapp','index.html'),'utf8');
const blk=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b)+b.length);
const code=blk('/*I18N_START*/','/*I18N_END*/')+'\n'+blk('/*ENGINE_START*/','/*ENGINE_END*/')+`
function toast(){}
let bad=0;const chk=(c,l)=>{if(!c){console.log('FAIL',l);bad++}};
for(const p of P){S.pid=p.id;S.qty=1;S.cust.group='LISTINO';initSel();
  chk(Object.keys(S.sel).every(id=>reqOk(OBJ[id])),'reqOk '+p.id);
  const T=totals();chk(Number.isFinite(T.total)&&T.total>0,'total '+p.id);
  for(const g of GORD){const it=O.filter(x=>x.grp===g&&appl(x));if(it.length&&groupRequired(it))chk(it.some(x=>S.sel[x.id]),'radio default '+g+' '+p.id)}
  chk(hints().length>0,'hints '+p.id);chk(p.dim&&p.dim.length===3,'dim '+p.id)}
for(const r of PRESETS){applyPreset(r);const T=totals();chk(Object.keys(r.opts).every(id=>on(id)),'preset opts '+r.id);chk(Object.keys(S.sel).every(id=>reqOk(OBJ[id])),'preset valid '+r.id);console.log(r.id,P.find(p=>p.id===r.pid).name,'x'+S.qty,'total',Math.round(T.total),'vol',T.vp+'%')}
S.pid='lift';S.qty=1;initSel();turnOn('OF-PWR');chk(on('OF-PWR')&&on('OF-TRAY'),'power adds tray');
turnOn('OF-SCRF');turnOn('OF-SCRG');chk(on('OF-SCRG')&&!on('OF-SCRF'),'screens exclusive');
turnOn('OF-MARM1');turnOn('OF-MARM2');chk(on('OF-MARM2')&&!on('OF-MARM1'),'arms exclusive');
delete S.sel['OF-TRAY'];prune();chk(!on('OF-PWR'),'power pruned without tray');
S.pid='ergo';initSel();turnOn('OF-HEAD');chk(on('OF-HEAD')&&on('OF-LUMB'),'headrest adds lumbar');chk(on('OF-ARM0'),'ergo default arms');
S.pid='ergoplus';initSel();chk(isIncl(OBJ['OF-LUMB'])&&on('OF-ARM4'),'plus includes lumbar, 4D default');turnOn('OF-HEAD');chk(on('OF-HEAD'),'plus headrest ok');
S.pid='bench';initSel();chk(isIncl(OBJ['OF-TRAY']),'bench tray incl');turnOn('OF-PWR');chk(on('OF-PWR'),'bench power');
S.pid='booth';initSel();chk(isIncl(OBJ['OF-PWR'])&&isIncl(OBJ['OF-ASSY']),'booth incl');
S.pid='agora';initSel();turnOn('OF-T360');chk(on('OF-T360')&&!on('OF-T200'),'table size radio');
const keys=l=>Object.keys(UI[l]).sort().join(',');chk(keys('it')===keys('en')&&keys('it')===keys('es'),'UI keys');
const cat=new Set();Object.values(CARE).forEach(x=>cat.add(x));CATS.forEach(c=>{cat.add(c.name);cat.add(c.txt)});P.forEach(p=>{cat.add(p.name);cat.add(p.tag);p.specs.forEach(r=>{cat.add(r[0]);cat.add(r[1])})});
O.forEach(x=>{cat.add(x.name);if(x.desc)cat.add(x.desc)});Object.values(GMETA).forEach(g=>{cat.add(g[0]);cat.add(g[1])});PG.forEach(g=>cat.add(g.label));PRESETS.forEach(r=>{cat.add(r.label);cat.add(r.txt)});
const miss=[...cat].filter(x=>!(x in TR));chk(!miss.length,'untranslated: '+miss.join(' | '));
for(const L of LANGS){LANG=L;for(const p of P){S.pid=p.id;initSel();for(const q of [1,4,12]){S.qty=q;chk(hints().every(h=>typeof h[1]==='string'&&h[1].length>5),'hint '+L+' '+p.id)}}}
console.log(bad?'FAILURES '+bad:'ALL OK');process.exitCode=bad?1:0;
`;
vm.runInNewContext(code,{console,process});
