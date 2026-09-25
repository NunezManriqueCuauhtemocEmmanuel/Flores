(function(){
  const sunflowerBtn = document.getElementById('sunflowerBtn');
  const roseBtn = document.getElementById('roseBtn');
  const choiceRow = document.getElementById('choiceRow');
  const prompt = document.getElementById('prompt');
  const svg = document.getElementById('bouquet');
  const message = document.getElementById('message');
  const againBtn = document.getElementById('againBtn');
  const switchBtn = document.getElementById('switchBtn');
  const tqmText = document.getElementById('tqmText');
  const subText = document.getElementById('subText');

  const NS = "http://www.w3.org/2000/svg";
  let currentMode = null;

  function el(tag, attrs){
    const e = document.createElementNS(NS, tag);
    for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // ---------- SUNFLOWERS ----------
  function makeSunflower(cx, cy, scale, rot){
    const g = el('g', {class:'flower', style:`--start-rot:${rot-15}deg;--end-rot:${rot}deg;transform-origin:${cx}px ${cy}px;`});
    const petalCount = 14;
    const petalGroup = el('g', {});
    for(let i=0;i<petalCount;i++){
      const angle = (360/petalCount)*i;
      const petal = el('ellipse', {
        cx: cx, cy: cy - 32*scale,
        rx: 8*scale, ry: 20*scale,
        fill: i % 2 === 0 ? 'var(--petal)' : 'var(--petal-dark)',
        transform: `rotate(${angle} ${cx} ${cy})`
      });
      petalGroup.appendChild(petal);
    }
    g.appendChild(petalGroup);
    const center = el('circle', {cx:cx, cy:cy, r: 20*scale, fill:'var(--center)'});
    g.appendChild(center);
    const centerDots = el('circle', {cx:cx, cy:cy, r: 20*scale, fill:'url(#seedPattern)'});
    g.appendChild(centerDots);
    const centerEdge = el('circle', {cx:cx, cy:cy, r: 20*scale, fill:'none', stroke:'var(--center-dark)', 'stroke-width':1.5});
    g.appendChild(centerEdge);
    return g;
  }

  // ---------- ROSES ----------
  const roseColors = [
    {light:'#ffe6a3', mid:'#f7ca43', dark:'#c98f1c'}, // amarilla
    {light:'#f6b8b8', mid:'#d94f4f', dark:'#a12f2f'}, // roja
    {light:'#b9cdf0', mid:'#4a6fa5', dark:'#2d4770'}, // azul
    {light:'#ffe6a3', mid:'#f7ca43', dark:'#c98f1c'}, // amarilla
    {light:'#f6b8b8', mid:'#d94f4f', dark:'#a12f2f'}  // roja
  ];

  function petalPath(cx, cy, len, width){
    const topY = cy - len;
    return `M ${cx} ${cy} C ${cx-width} ${cy-len*0.6} ${cx-width*0.6} ${topY} ${cx} ${topY} `+
           `C ${cx+width*0.6} ${topY} ${cx+width} ${cy-len*0.6} ${cx} ${cy} Z`;
  }

  function makeRose(cx, cy, scale, rot, colors){
    const g = el('g', {class:'flower', style:`--start-rot:${rot-15}deg;--end-rot:${rot}deg;transform-origin:${cx}px ${cy}px;`});

    const outerPetals = 6, innerPetals = 5;
    const outerG = el('g', {});
    for(let i=0;i<outerPetals;i++){
      const angle = (360/outerPetals)*i + rot;
      const petal = el('path', {
        d: petalPath(cx, cy, 24*scale, 15*scale),
        fill: colors.mid,
        stroke: colors.dark,
        'stroke-width':1,
        transform: `rotate(${angle} ${cx} ${cy})`
      });
      outerG.appendChild(petal);
    }
    g.appendChild(outerG);

    const innerG = el('g', {});
    for(let i=0;i<innerPetals;i++){
      const angle = (360/innerPetals)*i + rot + 22;
      const petal = el('path', {
        d: petalPath(cx, cy, 15*scale, 9*scale),
        fill: colors.light,
        stroke: colors.dark,
        'stroke-width':0.8,
        transform: `rotate(${angle} ${cx} ${cy})`
      });
      innerG.appendChild(petal);
    }
    g.appendChild(innerG);

    const center = el('circle', {cx:cx, cy:cy, r: 4.5*scale, fill: colors.dark});
    g.appendChild(center);

    return g;
  }

  function makeLeaf(x1,y1,x2,y2,side, fill, strokeColor){
    const midx = (x1+x2)/2 + (side*14);
    const midy = (y1+y2)/2;
    return el('path', {
      d:`M ${x1} ${y1} Q ${midx} ${midy} ${x2} ${y2} Q ${midx-side*6} ${midy} ${x1} ${y1} Z`,
      fill: fill,
      stroke: strokeColor,
      'stroke-width':1
    });
  }

  const flowerSpecs = [
    {sx:240, ex:150, ey:270, fscale:1.0, rot:-8, leafSide:-1},
    {sx:240, ex:240, ey:230, fscale:1.15, rot:0, leafSide:1},
    {sx:240, ex:330, ey:270, fscale:1.0, rot:8, leafSide:-1},
    {sx:240, ex:190, ey:310, fscale:0.85, rot:-14, leafSide:1},
    {sx:240, ex:290, ey:310, fscale:0.85, rot:14, leafSide:-1},
  ];

  const baseY = 420;
  const stemGreen = '#4c7a3d';
  const stemGreenDark = '#356028';

  function buildSeedDefs(){
    const defs = el('defs', {});
    const pattern = el('pattern', {id:'seedPattern', width:6, height:6, patternUnits:'userSpaceOnUse', patternTransform:'rotate(20)'});
    pattern.appendChild(el('rect', {width:6, height:6, fill:'none'}));
    pattern.appendChild(el('circle', {cx:1.5, cy:1.5, r:1, fill:'var(--center-dark)'}));
    defs.appendChild(pattern);
    return defs;
  }

  function buildBouquet(mode){
    svg.innerHTML = '';
    const defs = buildSeedDefs();
    svg.appendChild(defs);

    flowerSpecs.forEach((f) => {
      const stem = el('path', {
        d:`M ${f.sx} ${baseY} Q ${(f.sx+f.ex)/2} ${(baseY+f.ey)/2} ${f.ex} ${f.ey}`,
        fill:'none',
        stroke: stemGreenDark,
        'stroke-width': 5,
        'stroke-linecap':'round',
        class:'stem-line'
      });
      svg.appendChild(stem);

      const leafY = baseY - (baseY-f.ey)*0.4;
      const leafX = f.sx + (f.ex-f.sx)*0.4;
      svg.appendChild(makeLeaf(leafX, leafY, leafX + f.leafSide*40, leafY-10, f.leafSide, stemGreen, stemGreenDark));
    });

    const ribbonColor = mode === 'rose' ? '#8a4fa1' : '#d94f4f';
    const ribbonStroke = mode === 'rose' ? '#5f3273' : '#a83636';
    const ribbon = el('path', {
      d:`M 200 ${baseY-6} Q 240 ${baseY+18} 280 ${baseY-6} L 270 ${baseY+2} Q 240 ${baseY+22} 210 ${baseY+2} Z`,
      fill: ribbonColor,
      stroke: ribbonStroke,
      'stroke-width':1.5,
      class:'ribbon'
    });
    svg.appendChild(ribbon);

    flowerSpecs.forEach((f, i) => {
      if(mode === 'rose'){
        svg.appendChild(makeRose(f.ex, f.ey, f.fscale, f.rot, roseColors[i]));
      } else {
        svg.appendChild(makeSunflower(f.ex, f.ey, f.fscale, f.rot));
      }
    });

    return {ribbon};
  }

  function playAnimation(mode){
    currentMode = mode;
    const {ribbon} = buildBouquet(mode);

    if(mode === 'rose'){
      tqmText.textContent = '🌹 Para ti, Irene 💛';
      subText.textContent = 'Rosas amarillas, rojas y azules… ninguna tan bonita como tú';
    } else {
      tqmText.textContent = 'TQM Irene 💛';
      subText.textContent = 'Te quiero mucho, mereces todas las flores del mundo 💛, la niña más bonita de todas';
    }

    requestAnimationFrame(() => {
      svg.querySelectorAll('.stem-line').forEach((s, i) => {
        s.style.animationDelay = (i*0.06)+'s';
        s.classList.add('draw');
      });
      svg.querySelectorAll('.flower').forEach((f, i) => {
        f.style.animationDelay = (0.3 + i*0.12)+'s';
        f.classList.add('pop');
      });
      ribbon.classList.add('show');
    });

    setTimeout(() => {
      message.classList.add('show');
      againBtn.classList.add('show');
      switchBtn.classList.add('show');
    }, 50);
  }

  function startMode(mode){
    prompt.classList.add('hidden');
    choiceRow.classList.add('hidden');
    playAnimation(mode);
  }

  sunflowerBtn.addEventListener('click', () => startMode('sunflower'));
  roseBtn.addEventListener('click', () => startMode('rose'));

  againBtn.addEventListener('click', () => {
    message.classList.remove('show');
    againBtn.classList.remove('show');
    switchBtn.classList.remove('show');
    svg.innerHTML = '';
    void svg.offsetWidth;
    playAnimation(currentMode);
  });

  switchBtn.addEventListener('click', () => {
    message.classList.remove('show');
    againBtn.classList.remove('show');
    switchBtn.classList.remove('show');
    svg.innerHTML = '';
    prompt.classList.remove('hidden');
    choiceRow.classList.remove('hidden');
  });
})();