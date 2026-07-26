/**
 * KineticType Studio App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
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

  const modeCards = document.querySelectorAll('.mode-card');
  const paletteBtns = document.querySelectorAll('.palette-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const btnExportCode = document.getElementById('btnExportCode');
  const btnDownloadImage = document.getElementById('btnDownloadImage');
  const btnResetPhysics = document.getElementById('btnResetPhysics');

  const exportModal = document.getElementById('exportModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCopySnippet = document.getElementById('btnCopySnippet');
  const snippetCode = document.getElementById('snippetCode');

  // Default Instance Settings
  let currentColors = ['#00f2fe', '#4facfe', '#6b11ff'];
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

  // FPS Monitoring
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
    // Force web font render tick
    document.fonts.ready.then(() => {
      ktInstance.updateOptions({ fontFamily: e.target.value });
    });
  });

  rangeFontSize.addEventListener('input', (e) => {
    valFontSize.textContent = `${e.target.value}px`;
    ktInstance.updateOptions({ fontSize: parseInt(e.target.value) });
  });

  rangeDensity.addEventListener('input', (e) => {
    const val = e.target.value;
    valDensity.textContent = val == 2 ? 'Ultra High (2)' : val == 4 ? 'High (4)' : `Medium (${val})`;
    ktInstance.updateOptions({ density: parseInt(val) });
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
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentMode = card.dataset.mode;
      ktInstance.setMode(currentMode);
    });
  });

  // Palette Selection
  paletteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColors = btn.dataset.colors.split(',');
      ktInstance.updateOptions({ color: currentColors });
    });
  });

  // Presets Configuration Map
  const presets = {
    cosmic: {
      mode: 'magnetic',
      font: "'Space Grotesk', sans-serif",
      size: 90,
      stiffness: 0.08,
      damping: 0.85,
      radius: 130,
      colors: ['#00f2fe', '#4facfe', '#6b11ff']
    },
    detonate: {
      mode: 'explode',
      font: "'Syne', sans-serif",
      size: 105,
      stiffness: 0.12,
      damping: 0.80,
      radius: 180,
      colors: ['#ff0844', '#ffb199']
    },
    liquid: {
      mode: 'wave',
      font: "'Outfit', sans-serif",
      size: 95,
      stiffness: 0.05,
      damping: 0.90,
      radius: 150,
      colors: ['#00ff87', '#60efff']
    },
    gravity: {
      mode: 'gravity',
      font: "'Orbitron', sans-serif",
      size: 85,
      stiffness: 0.06,
      damping: 0.88,
      radius: 140,
      colors: ['#f9d423', '#ff4e50']
    },
    cyberpunk: {
      mode: 'matrix',
      font: "'Orbitron', sans-serif",
      size: 90,
      stiffness: 0.10,
      damping: 0.82,
      radius: 160,
      colors: ['#e0c3fc', '#8ec5fc']
    }
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = presets[btn.dataset.preset];
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

        // Sync mode card active state
        modeCards.forEach(c => {
          c.classList.toggle('active', c.dataset.mode === currentMode);
        });

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

  // Export Code Modal Logic
  btnExportCode.addEventListener('click', () => {
    const code = `<!-- 1. Include Container in your HTML -->
<div id="kineticContainer" style="width: 100%; height: 350px;"></div>

<!-- 2. Import KineticType.js -->
<script src="https://cdn.jsdelivr.net/npm/kinetic-type@1.0.0/kinetic-type.js"></script>

<script>
  // 3. Initialize Physics Engine
  const kt = new KineticType('#kineticContainer', {
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

    snippetCode.textContent = code;
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

  // Download Snapshot PNG
  btnDownloadImage.addEventListener('click', () => {
    const canvas = ktInstance.canvas;
    const link = document.createElement('a');
    link.download = `kinetic-type-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});
