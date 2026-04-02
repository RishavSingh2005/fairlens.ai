p · JS
Copy

/**
 * FairLens AI — app.js
 * Enterprise Responsible AI Dashboard
 * Vanilla JavaScript SPA with animation engine
 */
 
'use strict';
 
/* ═══════════════════════════════════════════════════
   APP CONTROLLER
═══════════════════════════════════════════════════ */
const app = (() => {
 
  /* ── State ─────────────────────────────────────── */
  let currentSection  = 'dashboard';
  let uploadDone      = false;
  let fixApplied      = false;
  let animationFrames = [];
 
  /* ── Init ───────────────────────────────────────── */
  function init() {
    setReportDate();
    bindNavigation();
    bindStrategyCards();
    runDashboardAnimations();
  }
 
  /* ── Navigation ─────────────────────────────────── */
  function bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        goTo(section);
      });
    });
  }
 
  function goTo(section) {
    // Hide current
    const prevSection = document.getElementById(`section-${currentSection}`);
    if (prevSection) prevSection.classList.remove('active');
 
    // Update sidebar highlight
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
 
    // Show next
    currentSection = section;
    const nextSection = document.getElementById(`section-${section}`);
    if (nextSection) {
      nextSection.classList.add('active');
      // Trigger section-specific animations
      triggerSectionAnimations(section);
    }
  }
 
  /* ── Section animations on enter ───────────────── */
  function triggerSectionAnimations(section) {
    switch (section) {
      case 'dashboard':
        runDashboardAnimations();
        break;
      case 'analysis':
        runAnalysisAnimations();
        break;
      case 'fix':
        // No auto-animations; user drives
        break;
      case 'report':
        setReportDate();
        break;
    }
  }
 
  /* ── Dashboard animations ───────────────────────── */
  function runDashboardAnimations() {
    // Animate the arc score
    setTimeout(() => animateArc(73), 200);
 
    // Animate metric numbers
    const metricValues = document.querySelectorAll('.metric-value[data-target]');
    metricValues.forEach((el, i) => {
      setTimeout(() => {
        const target  = parseFloat(el.dataset.target);
        const decimal = parseInt(el.dataset.decimal) || 0;
        countUp(el, 0, target, 1200, decimal);
      }, 300 + i * 120);
    });
 
    // Animate metric bars
    const metricBars = document.querySelectorAll('.metric-bar[data-width]');
    metricBars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 400 + i * 100);
    });
  }
 
  /* ── Arc animation (semi-circle gauge) ─────────── */
  function animateArc(score) {
    const arcFill   = document.getElementById('arcFill');
    const arcNumber = document.getElementById('arcNumber');
    if (!arcFill || !arcNumber) return;
 
    const totalLength = 282; // dasharray for the arc path
    const endOffset   = totalLength - (score / 100) * totalLength;
 
    // Animate stroke
    arcFill.style.strokeDashoffset = endOffset;
 
    // Color based on score
    if (score >= 60) {
      arcFill.style.stroke = 'var(--red)';
    } else if (score >= 30) {
      arcFill.style.stroke = 'var(--amber)';
    } else {
      arcFill.style.stroke = 'var(--green)';
    }
 
    // Count up number
    countUp(arcNumber, 0, score, 1500, 0, true /* SVG text */);
  }
 
  /* ── Count-up utility ───────────────────────────── */
  function countUp(el, from, to, duration, decimal = 0, isSvgText = false) {
    const start = performance.now();
    const diff  = to - from;
 
    function step(now) {
      const elapsed  = Math.min(now - start, duration);
      const progress = easeOut(elapsed / duration);
      const value    = from + diff * progress;
      const formatted = decimal > 0 ? value.toFixed(decimal) : Math.round(value).toString();
 
      if (isSvgText) {
        el.textContent = formatted;
      } else {
        el.textContent = formatted;
      }
 
      if (elapsed < duration) {
        const id = requestAnimationFrame(step);
        animationFrames.push(id);
      }
    }
 
    const id = requestAnimationFrame(step);
    animationFrames.push(id);
  }
 
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
 
  /* ── Analysis animations ────────────────────────── */
  function runAnalysisAnimations() {
    // Animate bar chart bars
    setTimeout(() => {
      document.querySelectorAll('.bar-fill[data-w]').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }, 200);
 
    // Animate proxy bars
    setTimeout(() => {
      document.querySelectorAll('.proxy-bar[data-w]').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }, 400);
  }
 
  /* ── Upload simulation ──────────────────────────── */
  function simulateUpload() {
    const inner   = document.getElementById('uploadInner');
    const success = document.getElementById('uploadSuccess');
    if (!inner || !success) return;
 
    // Fade out inner
    inner.style.opacity = '0';
    inner.style.transform = 'translateY(-10px)';
    inner.style.transition = 'all 0.35s ease';
 
    setTimeout(() => {
      inner.style.display  = 'none';
      success.classList.add('visible');
      uploadDone = true;
    }, 350);
  }
 
  /* ── Fix bias ────────────────────────────────────── */
  function applyFix() {
    if (fixApplied) return;
 
    const btn = document.getElementById('applyBtn');
    const label = document.getElementById('applyBtnLabel');
    if (!btn || !label) return;
 
    // Loading state
    label.textContent = 'Applying Mitigation…';
    btn.disabled = true;
    btn.style.opacity = '0.7';
 
    // Simulate processing
    let dots = 0;
    const loadingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      label.textContent = 'Applying Mitigation' + '.'.repeat(dots);
    }, 400);
 
    setTimeout(() => {
      clearInterval(loadingInterval);
      fixApplied = true;
 
      // Show post-fix view
      document.getElementById('fixPre').style.display = 'none';
      const fixPost = document.getElementById('fixPost');
      fixPost.style.display = 'block';
 
      // Animate after-score and metrics
      setTimeout(() => {
        const afterScore = document.getElementById('afterScore');
        if (afterScore) countUp(afterScore, 73, 28, 1200, 0);
      }, 300);
 
      setTimeout(() => {
        const afDI = document.getElementById('afDI');
        const afEO = document.getElementById('afEO');
        const afDP = document.getElementById('afDP');
        if (afDI) countUp(afDI, 0.64, 0.87, 1000, 2);
        if (afEO) countUp(afEO, 0.31, 0.09, 1000, 2);
        if (afDP) countUp(afDP, 0.28, 0.08, 1000, 2);
      }, 500);
 
      // Update dashboard hero to reflect improvement
      updateDashboardAfterFix();
 
    }, 2800);
  }
 
  function updateDashboardAfterFix() {
    // Update hero status text & arc color if user goes back
    const heroStatus = document.getElementById('heroStatus');
    if (heroStatus) {
      heroStatus.classList.remove('high');
      heroStatus.classList.add('good');
      heroStatus.textContent = 'Fairness Improved';
    }
 
    // Update arc color to green
    const arcFill = document.getElementById('arcFill');
    if (arcFill) {
      arcFill.style.stroke = 'var(--green)';
      arcFill.style.strokeDashoffset = 282 - (28 / 100) * 282;
    }
 
    // Update arc number
    const arcNumber = document.getElementById('arcNumber');
    if (arcNumber) {
      countUp(arcNumber, 73, 28, 1000, 0, true);
    }
 
    // Update status dot text
    const statusText = document.getElementById('statusText');
    if (statusText) {
      statusText.textContent = 'Fairness Criteria Met';
    }
  }
 
  function resetFix() {
    fixApplied = false;
 
    document.getElementById('fixPost').style.display = 'none';
    const fixPre = document.getElementById('fixPre');
    fixPre.style.display = 'block';
 
    const btn   = document.getElementById('applyBtn');
    const label = document.getElementById('applyBtnLabel');
    if (btn)   { btn.disabled = false; btn.style.opacity = '1'; }
    if (label) { label.textContent = 'Apply Selected Mitigation'; }
  }
 
  /* ── Strategy card selection ─────────────────────── */
  function bindStrategyCards() {
    document.querySelectorAll('.strat-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.strat-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
 
        // Swap check icon
        document.querySelectorAll('.strat-check').forEach(ch => { ch.innerHTML = ''; });
        card.querySelector('.strat-check').innerHTML = `
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
      });
    });
  }
 
  /* ── Download report (visual only) ──────────────── */
  function downloadReport() {
    const btn = document.querySelector('.btn-primary[onclick*="downloadReport"]');
    if (!btn) return;
 
    const original = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="none" width="16">
        <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Report Generated`;
    btn.style.background = 'var(--green)';
 
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 3000);
  }
 
  /* ── Set report date ─────────────────────────────── */
  function setReportDate() {
    const el = document.getElementById('reportDate');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
 
  /* ── Session ID (random each load) ──────────────── */
  function randomizeSession() {
    const el = document.getElementById('sessionId');
    if (!el) return;
    const num = Math.floor(Math.random() * 9000) + 1000;
    el.textContent = `FS-2024-${num}`;
  }
 
  /* ── Public API ─────────────────────────────────── */
  return { init, goTo, simulateUpload, applyFix, resetFix, downloadReport };
 
})();
 
/* ═══════════════════════════════════════════════════
   INTERSECTION OBSERVER — trigger bar animations on
   scroll-into-view for analysis section
═══════════════════════════════════════════════════ */
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Bar fills
        entry.target.querySelectorAll('.bar-fill[data-w]').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        entry.target.querySelectorAll('.proxy-bar[data-w]').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        entry.target.querySelectorAll('.metric-bar[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.1 });
 
  document.querySelectorAll('.analysis-card, .metric-card').forEach(el => {
    observer.observe(el);
  });
}
 
/* ═══════════════════════════════════════════════════
   SUBTLE BACKGROUND NOISE TEXTURE
═══════════════════════════════════════════════════ */
function injectNoiseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width  = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(200, 200);
 
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i]     = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 8; // very faint
  }
  ctx.putImageData(img, 0, 0);
 
  document.body.style.backgroundImage = `url(${canvas.toDataURL()})`;
}
 
/* ═══════════════════════════════════════════════════
   TOPNAV STATUS CYCLING
═══════════════════════════════════════════════════ */
function startStatusCycle() {
  const messages = [
    'Fairness Monitoring Active',
    'Audit Engine Ready',
    'Bias Detection Online',
    'Compliance Module Active',
  ];
  let idx = 0;
  const el = document.getElementById('statusText');
  if (!el) return;
 
  setInterval(() => {
    idx = (idx + 1) % messages.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = messages[idx];
      el.style.opacity = '1';
      el.style.transition = 'opacity 0.4s ease';
    }, 300);
  }, 5000);
}
 
/* ═══════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  setupScrollAnimations();
  injectNoiseTexture();
  startStatusCycle();
});
