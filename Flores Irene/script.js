(function(){
  const btn = document.getElementById('growBtn');
  const again = document.getElementById('againBtn');
  const prompt = document.getElementById('prompt');
  const svg = document.getElementById('bouquet');
  const message = document.getElementById('message');

  const NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs){
    const e = document.createElementNS(NS, tag);
    for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

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

  function makeLeaf(x1,y1,x2,y2,side){
    const midx = (x1+x2)/2 + (side*14);
    const midy = (y1+y2)/2;
    return el('path', {
      d:`M ${x1} ${y1} Q ${midx} ${midy} ${x2} ${y2} Q ${midx-side*6} ${midy} ${x1} ${y1} Z`,
      fill:'var(--stem)',
      stroke:'var(--stem-dark)',
      'stroke-width':1
    });
  }

  const defs = el('defs', {});
  const pattern = el('pattern', {id:'seedPattern', width:6, height:6, patternUnits:'userSpaceOnUse', patternTransform:'rotate(20)'});
  pattern.appendChild(el('rect', {width:6, height:6, fill:'none'}));
  pattern.appendChild(el('circle', {cx:1.5, cy:1.5, r:1, fill:'var(--center-dark)'}));
  defs.appendChild(pattern);
  svg.appendChild(defs);

  const flowerSpecs = [
    {sx:240, ex:150, ey:270, fscale:1.0, rot:-8, leafSide:-1},
    {sx:240, ex:240, ey:230, fscale:1.15, rot:0, leafSide:1},
    {sx:240, ex:330, ey:270, fscale:1.0, rot:8, leafSide:-1},
    {sx:240, ex:190, ey:310, fscale:0.85, rot:-14, leafSide:1},
    {sx:240, ex:290, ey:310, fscale:0.85, rot:14, leafSide:-1},
  ];

  const baseY = 420;

  function buildBouquet(){
    svg.innerHTML = '';
    svg.appendChild(defs);

    flowerSpecs.forEach((f, i) => {
      const stem = el('path', {
        d:`M ${f.sx} ${baseY} Q ${(f.sx+f.ex)/2} ${(baseY+f.ey)/2} ${f.ex} ${f.ey}`,
        fill:'none',
        stroke:'var(--stem-dark)',
        'stroke-width': 5,
        'stroke-linecap':'round',
        class:'stem-line'
      });
      svg.appendChild(stem);

      const leafY = baseY - (baseY-f.ey)*0.4;
      const leafX = f.sx + (f.ex-f.sx)*0.4;
      svg.appendChild(makeLeaf(leafX, leafY, leafX + f.leafSide*40, leafY-10, f.leafSide));
    });

    const ribbon = el('path', {
      d:`M 200 ${baseY-6} Q 240 ${baseY+18} 280 ${baseY-6} L 270 ${baseY+2} Q 240 ${baseY+22} 210 ${baseY+2} Z`,
      fill:'#d94f4f',
      stroke:'#a83636',
      'stroke-width':1.5,
      class:'ribbon'
    });
    svg.appendChild(ribbon);

    flowerSpecs.forEach(f => {
      svg.appendChild(makeSunflower(f.ex, f.ey, f.fscale, f.rot));
    });

    return {ribbon};
  }

  function playAnimation(){
    const {ribbon} = buildBouquet();

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
      document.getElementById('againBtn').classList.add('show');
    }, 50);
  }

  btn.addEventListener('click', () => {
    prompt.classList.add('hidden');
    btn.classList.add('done');
    playAnimation();
  });

  again.addEventListener('click', () => {
    message.classList.remove('show');
    document.getElementById('againBtn').classList.remove('show');
    svg.innerHTML = '';
    void svg.offsetWidth;
    playAnimation();
  });
})();
