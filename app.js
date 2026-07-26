/**
 * KineticType — Minimalist Studio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasMount = document.getElementById('canvasMount');
  const inputText = document.getElementById('inputText');
  const selectFont = document.getElementById('selectFont');
  const rangeFontSize = document.getElementById('rangeFontSize');
  const rangeDensity = document.getElementById('rangeDensity');
  const rangeStiffness = document.getElementById('rangeStiffness');
  const rangeDamping = document.getElementById('rangeDamping');
  const rangeRadius = document.getElementById('rangeRadius');
  const rangeForceStrength = document.getElementById('rangeForceStrength');

  const valFontSize = document.getElementById('valFontSize');
  const valDensity = document.getElementById('valDensity');
  const valStiffness = document.getElementById('valStiffness');
  const valDamping = document.getElementById('valDamping');
  const valRadius = document.getElementById('valRadius');
  const valForceStrength = document.getElementById('valForceStrength');

  const hudFps = document.getElementById('hudFps');
  const hudParticles = document.getElementById('hudParticles');
  const hudMode = document.getElementById('hudMode');

  const segmentBtns = document.querySelectorAll('.segment-btn');
  const colorDots = document.querySelectorAll('.color-dot');
  const presetPills = document.querySelectorAll('.preset-pill');
  const btnExportCode = document.getElementById('btnExportCode');
  const btnDownloadImage = document.getElementById('btnDownloadImage');
  const btnResetPhysics = document.getElementById('btnResetPhysics');

  const exportModal = document.getElementById('exportModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCopySnippet = document.getElementById('btnCopySnippet');
  const snippetCode = document.getElementById('snippetCode');

  // Engine Active State
  let currentColors = ['#ffffff', '#94a3b8', '#334155'];
  let currentMode = 'magnetic';

  // Instantiate KineticType Engine
  const ktInstance = new KineticType(canvasMount, {
    text: inputText.value,
    fontFamily: selectFont.value,
    fontSize: parseInt(rangeFontSize.value),
    density: parseInt(rangeDensity.value),
    color: currentColors,
    mode: currentMode,
    physics: {
      stiffness: parseFloat(rangeStiffness.value),
      damping: parseFloat(rangeDamping.value),
      forceRadius: parseInt(rangeRadius.value),
      forceStrength: parseFloat(rangeForceStrength.value)
    }
  });

  // FPS Diagnostics Counter
  let lastFrameTime = performance.now();
  let frameCount = 0;

  function updateHUD() {
    const now = performance.now();
    frameCount++;
    if (now - lastFrameTime >= 1000) {
      hudFps.textContent = frameCount;
      frameCount = 0;
      lastFrameTime = now;
    }
    hudParticles.textContent = ktInstance.particles.length.toLocaleString();
    hudMode.textContent = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
    requestAnimationFrame(updateHUD);
  }
  requestAnimationFrame(updateHUD);

  // Input Listeners
  inputText.addEventListener('input', (e) => {
    ktInstance.setText(e.target.value.trim() || 'KINETIC');
  });

  selectFont.addEventListener('change', (e) => {
    document.fonts.ready.then(() => {
      ktInstance.updateOptions({ fontFamily: e.target.value });
    });
  });

  rangeFontSize.addEventListener('input', (e) => {
    valFontSize.textContent = `${e.target.value}px`;
    ktInstance.updateOptions({ fontSize: parseInt(e.target.value) });
  });

  rangeDensity.addEventListener('input', (e) => {
    valDensity.textContent = e.target.value;
    ktInstance.updateOptions({ density: parseInt(e.target.value) });
  });

  rangeStiffness.addEventListener('input', (e) => {
    valStiffness.textContent = e.target.value;
    ktInstance.updateOptions({ physics: { stiffness: parseFloat(e.target.value) } });
  });

  rangeDamping.addEventListener('input', (e) => {
    valDamping.textContent = e.target.value;
    ktInstance.updateOptions({ physics: { damping: parseFloat(e.target.value) } });
  });

  rangeRadius.addEventListener('input', (e) => {
    valRadius.textContent = `${e.target.value}px`;
    ktInstance.updateOptions({ physics: { forceRadius: parseInt(e.target.value) } });
  });

  rangeForceStrength.addEventListener('input', (e) => {
    valForceStrength.textContent = `${e.target.value}x`;
    ktInstance.updateOptions({ physics: { forceStrength: parseFloat(e.target.value) } });
  });

  // Mode Selection
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      ktInstance.setMode(currentMode);
    });
  });

  // Color Dot Selection
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      currentColors = dot.dataset.colors.split(',');
      ktInstance.updateOptions({ color: currentColors });
    });
  });

  // Presets Map
  const presetsMap = {
    cosmic: {
      mode: 'magnetic',
      font: "'Space Grotesk', sans-serif",
      size: 90,
      stiffness: 0.08,
      damping: 0.85,
      radius: 130,
      colors: ['#ffffff', '#94a3b8', '#334155']
    },
    detonate: {
      mode: 'explode',
      font: "'Syne', sans-serif",
      size: 105,
      stiffness: 0.12,
      damping: 0.80,
      radius: 180,
      colors: ['#fb7185', '#f43f5e']
    },
    liquid: {
      mode: 'wave',
      font: "'Outfit', sans-serif",
      size: 95,
      stiffness: 0.05,
      damping: 0.90,
      radius: 150,
      colors: ['#34d399', '#2dd4bf']
    },
    gravity: {
      mode: 'gravity',
      font: "'Orbitron', sans-serif",
      size: 85,
      stiffness: 0.06,
      damping: 0.88,
      radius: 140,
      colors: ['#fbbf24', '#f59e0b']
    },
    cyberpunk: {
      mode: 'matrix',
      font: "'Orbitron', sans-serif",
      size: 90,
      stiffness: 0.10,
      damping: 0.82,
      radius: 160,
      colors: ['#38bdf8', '#c084fc']
    }
  };

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const p = presetsMap[pill.dataset.preset];
      if (p) {
        selectFont.value = p.font;
        rangeFontSize.value = p.size;
        valFontSize.textContent = `${p.size}px`;
        rangeStiffness.value = p.stiffness;
        valStiffness.textContent = p.stiffness;
        rangeDamping.value = p.damping;
        valDamping.textContent = p.damping;
        rangeRadius.value = p.radius;
        valRadius.textContent = `${p.radius}px`;

        currentMode = p.mode;
        currentColors = p.colors;

        segmentBtns.forEach(s => s.classList.toggle('active', s.dataset.mode === currentMode));

        ktInstance.updateOptions({
          fontFamily: p.font,
          fontSize: p.size,
          mode: currentMode,
          color: currentColors,
          physics: {
            stiffness: p.stiffness,
            damping: p.damping,
            forceRadius: p.radius
          }
        });
      }
    });
  });

  // Reset Physics
  btnResetPhysics.addEventListener('click', () => {
    rangeStiffness.value = 0.08;
    valStiffness.textContent = '0.08';
    rangeDamping.value = 0.85;
    valDamping.textContent = '0.85';
    rangeRadius.value = 130;
    valRadius.textContent = '130px';
    rangeForceStrength.value = 1.2;
    valForceStrength.textContent = '1.2x';

    ktInstance.updateOptions({
      physics: {
        stiffness: 0.08,
        damping: 0.85,
        forceRadius: 130,
        forceStrength: 1.2
      }
    });
    ktInstance.reset();
  });

  // Export Code Modal
  btnExportCode.addEventListener('click', () => {
    const snippet = `<!-- 1. HTML Container -->
<div id="kineticHeading" style="width: 100%; height: 350px;"></div>

<!-- 2. Import KineticType Library -->
<script src="https://cdn.jsdelivr.net/npm/kinetic-type@1.0.0/kinetic-type.js"></script>

<script>
  // 3. Initialize Engine
  const kt = new KineticType('#kineticHeading', {
    text: "${inputText.value}",
    mode: "${currentMode}",
    fontFamily: "${selectFont.value}",
    fontSize: ${rangeFontSize.value},
    color: ${JSON.stringify(currentColors)},
    physics: {
      stiffness: ${rangeStiffness.value},
      damping: ${rangeDamping.value},
      forceRadius: ${rangeRadius.value},
      forceStrength: ${rangeForceStrength.value}
    }
  });
</script>`;

    snippetCode.textContent = snippet;
    exportModal.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    exportModal.classList.remove('active');
  });

  btnCopySnippet.addEventListener('click', () => {
    navigator.clipboard.writeText(snippetCode.textContent);
    btnCopySnippet.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    setTimeout(() => {
      btnCopySnippet.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Code`;
    }, 2000);
  });

  // PNG Export
  btnDownloadImage.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `kinetic-type-${Date.now()}.png`;
    link.href = ktInstance.canvas.toDataURL('image/png');
    link.click();
  });
});
