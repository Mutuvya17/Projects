(function(){
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const topTextInput = document.getElementById('topText');
  const bottomTextInput = document.getElementById('bottomText');
  const fontSizeInput = document.getElementById('fontSize');
  const textColorInput = document.getElementById('textColor');
  const strokeColorInput = document.getElementById('strokeColor');
  const randomBtn = document.getElementById('randomBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const templateSelect = document.getElementById('templateSelect');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const autoToggle = document.getElementById('autoToggle');
  const historyChips = document.getElementById('historyChips');
  const templateCountElem = document.getElementById('templateCount');

  let templates = [];
  let currentIndex = 0;
  let history = [];
  let autoInterval = null;

  const FALLBACK_TEMPLATES = [
    {id:'fallback1', name:'Distracted Boyfriend', url:'https://i.imgflip.com/1ur9b0.jpg'},
    {id:'fallback2', name:'Drake Hotline Bling', url:'https://i.imgflip.com/30b1gx.jpg'},
    {id:'fallback3', name:'Two Buttons', url:'https://i.imgflip.com/1g8my4.jpg'},
    {id:'fallback4', name:'Left Exit 12 Off Ramp', url:'https://i.imgflip.com/22bdq6.jpg'},
    {id:'fallback5', name:'Change My Mind', url:'https://i.imgflip.com/24y43o.jpg'}
  ];

  function fetchTemplates(){
    return fetch('https://api.imgflip.com/get_memes', {cache: "no-cache"})
      .then(r => r.json())
      .then(json => {
        if(json && json.success && Array.isArray(json.data.memes)){
          return json.data.memes.map(m => ({
            id: m.id,
            name: m.name,
            url: m.url,
            width: m.width,
            height: m.height
          }));
        }
        throw new Error('Unexpected response');
      })
      .catch(() => FALLBACK_TEMPLATES.map(t => ({...t, width:800, height:800})));
  }

  function populateTemplateList(){
    templateSelect.innerHTML = '';
    templates.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = t.name;
      templateSelect.appendChild(opt);
    });
    templateCountElem.textContent = templates.length;
  }

  function loadImage(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = e => reject(e);
      img.src = src;
    });
  }

  function fitCanvasToImage(img){
    canvas.width = img.width;
    canvas.height = img.height;
  }

  function drawMeme(img){
    fitCanvasToImage(img);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const topText = topTextInput.value.trim();
    const bottomText = bottomTextInput.value.trim();
    const fontSize = parseInt(fontSizeInput.value, 10) || 48;
    const textColor = textColorInput.value || '#fff';
    const strokeColor = strokeColorInput.value || '#000';

    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(6, Math.floor(fontSize / 12));
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;

    const drawWrappedText = (text, y, align) => {
      if(!text) return;
      const maxWidth = canvas.width * 0.92;
      const words = text.split(/\s+/);
      const lines = [];
      let cur = '';
      words.forEach(w => {
        const test = cur ? cur + ' ' + w : w;
        if(ctx.measureText(test).width > maxWidth && cur){
          lines.push(cur);
          cur = w;
        } else cur = test;
      });
      if(cur) lines.push(cur);
      if(align === 'bottom') y -= (lines.length-1) * (fontSize + 6);
      lines.forEach((line, idx) => {
        const lineY = y + idx * (fontSize + 6);
        ctx.strokeText(line, canvas.width/2, lineY);
        ctx.fillText(line, canvas.width/2, lineY);
      });
    };

    drawWrappedText(topText.toUpperCase(), 8, 'top');
    drawWrappedText(bottomText.toUpperCase(), canvas.height - fontSize - 8, 'bottom');
    updateHistoryChips();
  }

  function updateHistoryChips(){
    historyChips.innerHTML = '';
    history.slice(0,6).forEach(h => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.title = h.name;
      chip.textContent = h.name.length > 20 ? h.name.slice(0,20)+'…' : h.name;
      historyChips.appendChild(chip);
    });
  }

  async function showTemplate(index){
    currentIndex = ((index % templates.length) + templates.length) % templates.length;
    templateSelect.value = currentIndex;
    const t = templates[currentIndex];
    try {
      const img = await loadImage(t.url);
      drawMeme(img);
      if(!history.find(h => h.id === t.id)){
        history.unshift(t);
        if(history.length > 12) history.pop();
      }
    } catch(e){
      console.error('Failed to load image', e);
    }
  }

  function randomIndex(){
    return Math.floor(Math.random()*templates.length);
  }

  function randomize(){
    return showTemplate(randomIndex());
  }

  // Event listeners
  randomBtn.addEventListener('click', randomize);
  nextBtn.addEventListener('click', () => showTemplate(currentIndex + 1));
  prevBtn.addEventListener('click', () => showTemplate(currentIndex - 1));
  templateSelect.addEventListener('change', (e) => showTemplate(parseInt(e.target.value,10)));
  [topTextInput, bottomTextInput, fontSizeInput, textColorInput, strokeColorInput].forEach(inp => {
    inp.addEventListener('input', () => {
      const t = templates[currentIndex];
      if(t) loadImage(t.url).then(drawMeme);
    });
  });

  clearTextBtn.addEventListener('click', () => {
    topTextInput.value = '';
    bottomTextInput.value = '';
    const t = templates[currentIndex];
    if(t) loadImage(t.url).then(drawMeme);
  });

  downloadBtn.addEventListener('click', () => {
    const filename = `${(templates[currentIndex] && templates[currentIndex].name) || 'meme'}.png`;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = filename.replace(/\s+/g,'_').toLowerCase();
    a.click();
  });

  shareBtn.addEventListener('click', async () => {
    if(navigator.canShare){
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
      const filesArray = [new File([blob], 'meme.png', { type: 'image/png' })];
      navigator.share({ files: filesArray, title: 'Generated Meme' }).catch(()=>{});
    } else {
      alert('Web Share API not supported. Use Download instead.');
    }
  });

  window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'r') { e.preventDefault(); randomize(); }
    if(e.code === 'Space') { e.preventDefault(); const t = templates[currentIndex]; if(t) loadImage(t.url).then(drawMeme); }
    if(e.key === 'Enter') { e.preventDefault(); downloadBtn.click(); }
  });

  autoToggle.addEventListener('change', (e) => {
    if(e.target.checked){
      autoInterval = setInterval(randomize, 3000);
    } else {
      if(autoInterval) clearInterval(autoInterval);
    }
  });

  (async function init(){
    templates = await fetchTemplates();
    populateTemplateList();
    await showTemplate(randomIndex());
  })();
})();
