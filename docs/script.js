/* script.js - Portfolio Interactive Scripts and Sound Synthesizer */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Navigation
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close nav on click link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Active Link on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // 3. Image Modal (Lightbox)
  const modal = document.getElementById('mediaModal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.querySelector('.modal-close');

  window.openImageModal = function(src) {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // 4. Code Showcase Tabs
  const tabButtons = document.querySelectorAll('.code-tabs .tab-btn');
  const codeBlocks = document.querySelectorAll('.code-content-wrapper .code-block-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      codeBlocks.forEach(block => block.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // 5. System Architecture Interactive Diagram
  const classDetails = {
    'PlayerController': {
      title: 'PlayerController',
      path: 'Assets/Scripts/Player/PlayerController.cs',
      classType: 'node-player',
      desc: '自機の操作とステータスを制御するC#スクリプト。W/A/S/D移動、ジャンプ、スタミナ消費式の無敵ダッシュを実装。ステージ境界からはみ出さないクランプ処理と、奈落に落下した際に初期座標へ放物線補間で舞い戻る帰還システム（GoStart）を含みます。',
      methods: ['Move() - 入力に応じたプレイヤーの基本移動', 'Dash() - 無敵時間付きダッシュ & スタミナ消費', 'ClampPositionToStage() - ドーナツ型ステージ外への移動制限', 'GoStart() - 被弾落下時の放物線軌道による初期位置復帰']
    },
    'BossBase': {
      title: 'BossBase',
      path: 'Assets/Scripts/Enemys/BossBase.cs',
      classType: 'node-boss',
      desc: 'すべての敵ボスキャラクターの基本設計となる抽象クラス。自機狙い（Aim）、扇状の予兆エリア描画（SetFanMesh）、多方向射出（NWayShot）といった汎用弾幕関数を完備。また、後続の「弾リンクシステム」を稼働させるための一時弾管理スコープを提供します。',
      methods: ['AimAtPlayer() - プレイヤーへの方向ベクトルを算出', 'Shot() / NWayShot() - 各種弾幕射出ユーティリティ', 'BeginBulletCollect() - リンク生成のための弾収集を開始', 'LinkCollectedBullets() - 収集した弾同士をレーザーで接続']
    },
    'Boss1': {
      title: 'Boss1 (第一のボス)',
      path: 'Assets/Scripts/Enemys/Boss1.cs',
      classType: 'node-boss',
      desc: 'HP低下（67%以下、34%以下）によって3つのフェーズに移行するボス。5Way/6Way/15Wayなどの円形スプレッド弾幕に加え、発射後に速度が落ちる「減速弾」や、地面への扇形危険エリア予兆レーザーを組み合わせてプレイヤーを追い詰めます。',
      methods: ['Update() - 行動パターンのフレーム管理', 'PhaseChange() - HP判定による弾幕パターンの強化遷移', 'AttackPatternA() - プレイヤー狙い5Way + 減速弾幕']
    },
    'Boss2': {
      title: 'Boss2 (レーザーボス)',
      path: 'Assets/Scripts/Enemys/Boss2.cs',
      classType: 'node-boss',
      desc: '弾リンクによるレーザー障害物生成に特化した第2のボス。HPが75%, 50%, 25%以下になるとフェーズが移行し、プレイヤーの頭上や足元を繋ぐ巨大なレーザーの壁を回転・走査させ、ジャンプや無敵ダッシュによる回避を強制する行動パターンを持ちます。',
      methods: ['LaserSweepAttack() - フィールドを回転走査するレーザー壁攻撃', 'SpawnLaserGrid() - プレイヤーを囲い込む弾幕リンクフェンス']
    },
    'Boss3': {
      title: 'Boss3 (最終ボス)',
      path: 'Assets/Scripts/Enemys/Boss3.cs',
      classType: 'node-boss',
      desc: '左右にオフセットした位置にサブ射出ポートを展開し、挟み込むような超高密度弾幕を展開する第3のボス。HPが80%, 60%, 40%, 20%を切るたびに発狂段階（フェーズ）がアップし、同時射出弾数と弾速が引き上げられます。',
      methods: ['SpawnOffsetEmitter() - 左右独立型の射出ポートを初期化', 'CrossFireShot() - 挟み撃ちクロスNWay弾幕']
    },
    'BulletLinkLine': {
      title: 'BulletLinkLine',
      path: 'Assets/Scripts/Bullets/BulletLinkLine.cs',
      classType: 'node-player',
      desc: '２つの飛翔する弾丸（BulletBase）を繋ぐレーザー判定オブジェクト。Update関数内で二点間の距離と回転角（LookRotation）を毎フレーム再計算し、スケールをリアルタイム伸縮させます。コライダーを搭載し、プレイヤーとの接触を検出します。',
      methods: ['Initialize(BulletBase a, BulletBase b) - 接続元・接続先弾を設定', 'Update() - 弾の移動に合わせて位置・回転・スケールをリアルタイム更新', 'OnTriggerEnter() - プレイヤー衝突時のダメージ通知 & 自己破棄']
    },
    'GameController': {
      title: 'GameController',
      path: 'Assets/Scripts/System/GameController.cs',
      classType: 'node-sys',
      desc: 'ゲーム全体の進行、シーン間パラメータの受け渡し、ドーナツ型ステージの内外径定義などを司るシングルトンクラス。ゲーム内のコア状態を管理し、ボス撃破時やプレイヤー死亡時のディレイ付き遷移を統括します。',
      methods: ['Instance - シングルトンアクセサー', 'InitializeGameScene() - ボス選択状態に基づくステージ展開', 'UpdateTitleScene() - タイトル画面でのスペースキー待機入力']
    },
    'BossManager': {
      title: 'BossManager',
      path: 'Assets/Scripts/System/BossManager.cs',
      classType: 'node-sys',
      desc: 'バトルシーン開始時に、選択されたボス型（BossType）に応じたプレハブをインスタンス化するマネージャー。カメラの追従ターゲット設定や、UIの体力ゲージ（GaugeController）とボスオブジェクトの紐付けを行います。',
      methods: ['SpawnBoss() - 選択肢に応じたボスの生成', 'GetBossHealthPercent() - UIにボスのHP比率を供給']
    },
    'SoundManager': {
      title: 'SoundManager',
      path: 'Assets/Scripts/System/SoundManager.cs',
      classType: 'node-sys',
      desc: 'ゲーム内の音響効果（BGM・SE）を集中管理するクラス。BGMのループ制御のほか、効果音（SE）用に最大10個のAudioSourceをあらかじめプールし、破綻のない同時発声をサポートしています。',
      methods: ['PlayBGM(BgmType type) - ループ付きBGM再生', 'PlaySE(SeType type) - 空きプールチャンネルを利用した効果音再生']
    }
  };

  const diagNodes = document.querySelectorAll('.diag-node');
  const detailsTitle = document.getElementById('detailsTitle');
  const detailsPath = document.getElementById('detailsPath');
  const detailsDesc = document.getElementById('detailsDesc');
  const detailsMethodsList = document.getElementById('detailsMethods');

  diagNodes.forEach(node => {
    node.addEventListener('click', () => {
      const classKey = node.getAttribute('data-class');
      const data = classDetails[classKey];

      if (!data) return;

      // Update active state in SVG
      diagNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      // Fill panel
      detailsTitle.textContent = data.title;
      detailsTitle.className = ''; // reset classes
      detailsTitle.classList.add(data.classType);
      
      detailsPath.textContent = data.path;
      detailsDesc.textContent = data.desc;

      detailsMethodsList.innerHTML = '';
      data.methods.forEach(method => {
        const li = document.createElement('li');
        li.textContent = method;
        detailsMethodsList.appendChild(li);
      });
    });
  });

  // Set default active node
  if (diagNodes.length > 0) {
    diagNodes[0].dispatchEvent(new Event('click'));
  }

  // 6. Web Audio API Sound Console & Visualizer
  let audioCtx = null;
  let analyser = null;
  let isPlayingBgm = false;
  let currentBgmType = 'none';
  let tempo = 120; // BPM
  let bgmIntervalId = null;
  let stepIndex = 0;
  let isPhase2 = false;
  let masterGain = null;

  const startConsoleBtn = document.getElementById('startConsoleBtn');
  const consoleStatus = document.getElementById('consoleStatus');
  const ledDot = document.getElementById('ledDot');
  const volumeSlider = document.getElementById('volumeSlider');
  const sysActiveState = document.getElementById('sysActiveState');

  // Synth triggers
  const btnBgmTitle = document.getElementById('btnBgmTitle');
  const btnBgmSelect = document.getElementById('btnBgmSelect');
  const btnBgmBoss = document.getElementById('btnBgmBoss');
  const btnBgmStop = document.getElementById('btnBgmStop');
  const btnPhase2 = document.getElementById('btnPhase2');

  const btnSeLaser = document.getElementById('btnSeLaser');
  const btnSeDash = document.getElementById('btnSeDash');
  const btnSeHit = document.getElementById('btnSeHit');
  const btnSeWarning = document.getElementById('btnSeWarning');

  const canvas = document.getElementById('visualizer');
  const canvasCtx = canvas.getContext('2d');

  // Initialize Canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth - 40;
    canvas.height = 220;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Fallback visualizer animation (draws generic glowing waves when AudioContext is inactive)
  let animationFrameId = null;
  let phaseOffset = 0;

  function drawIdleVisualizer() {
    canvasCtx.fillStyle = '#06090d';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines
    canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    canvasCtx.lineWidth = 1;
    const gridSpacing = 20;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, 0);
      canvasCtx.lineTo(x, canvas.height);
      canvasCtx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSpacing) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, y);
      canvasCtx.lineTo(canvas.width, y);
      canvasCtx.stroke();
    }

    // Draw beautiful idle wave (sine wave)
    canvasCtx.beginPath();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgba(0, 242, 255, 0.4)';
    
    // Dual waves
    for (let i = 0; i < canvas.width; i++) {
      const y = canvas.height / 2 + Math.sin(i * 0.01 + phaseOffset) * 15 * Math.sin(i * 0.002);
      if (i === 0) canvasCtx.moveTo(i, y);
      else canvasCtx.lineTo(i, y);
    }
    canvasCtx.stroke();

    canvasCtx.beginPath();
    canvasCtx.strokeStyle = 'rgba(255, 0, 123, 0.3)';
    for (let i = 0; i < canvas.width; i++) {
      const y = canvas.height / 2 + Math.sin(i * 0.015 - phaseOffset * 1.5) * 12 * Math.cos(i * 0.003);
      if (i === 0) canvasCtx.moveTo(i, y);
      else canvasCtx.lineTo(i, y);
    }
    canvasCtx.stroke();

    phaseOffset += 0.05;
    animationFrameId = requestAnimationFrame(drawIdleVisualizer);
  }
  drawIdleVisualizer();

  // Initialize Web Audio
  function initAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volumeSlider.value;

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Switch visualizer to active AudioContext mode
    cancelAnimationFrame(animationFrameId);
    drawActiveVisualizer();

    consoleStatus.textContent = 'ONLINE (BGM: OFF)';
    ledDot.style.background = '#00f2ff';
    ledDot.style.boxShadow = '0 0 15px #00f2ff';
    sysActiveState.innerHTML = '<span class="sys-state-dot"></span> SYSTEM ACTIVE';
    startConsoleBtn.textContent = 'SOUND CONSOLE READY';
    startConsoleBtn.classList.add('active');
  }

  // Active analyzer rendering
  const bufferLength = 128; // analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength);

  function drawActiveVisualizer() {
    requestAnimationFrame(drawActiveVisualizer);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = '#06090d';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    canvasCtx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, 0);
      canvasCtx.lineTo(x, canvas.height);
      canvasCtx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, y);
      canvasCtx.lineTo(canvas.width, y);
      canvasCtx.stroke();
    }

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    // Draw nice bars (pink in background)
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 0.7;

      // Glow effect gradient
      const grad = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      grad.addColorStop(0, 'rgba(255, 0, 123, 0.2)');
      grad.addColorStop(1, 'rgba(0, 242, 255, 0.8)');

      canvasCtx.fillStyle = grad;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }

    // Draw central oscilloscope line overlaid (cyan)
    const timeArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeArray);

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 2.5;
    canvasCtx.strokeStyle = '#00f2ff';
    canvasCtx.shadowBlur = 8;
    canvasCtx.shadowColor = '#00f2ff';

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let tX = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = timeArray[i] / 128.0;
      const tY = v * canvas.height / 2;

      if (i === 0) {
        canvasCtx.moveTo(tX, tY);
      } else {
        canvasCtx.lineTo(tX, tY);
      }

      tX += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
    canvasCtx.shadowBlur = 0; // reset shadow
  }

  // Trigger init on user action
  startConsoleBtn.addEventListener('click', () => {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });

  volumeSlider.addEventListener('input', () => {
    if (masterGain) {
      masterGain.gain.value = volumeSlider.value;
    }
  });

  // Sound effects synthesizers
  window.playSE = function(type) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const t = audioCtx.currentTime;
    
    if (type === 'laser') {
      // Linear downward sweep (synth laser)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.28);
      
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t);
      osc.stop(t + 0.3);
    } 
    else if (type === 'dash') {
      // Noise-like sound using upward sine/triangle and pitch bending
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(1800, t + 0.18);
      
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t);
      osc.stop(t + 0.22);
    } 
    else if (type === 'hit') {
      // Low frequency thump and high decay
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(20, t + 0.15);
      
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t);
      osc.stop(t + 0.2);
    } 
    else if (type === 'warning') {
      // Alternate double siren tone
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'sawtooth';
      
      osc1.frequency.setValueAtTime(440, t);
      osc1.frequency.setValueAtTime(554, t + 0.1);
      osc1.frequency.setValueAtTime(440, t + 0.2);
      osc1.frequency.setValueAtTime(554, t + 0.3);
      
      osc2.frequency.setValueAtTime(220, t);
      osc2.frequency.setValueAtTime(277, t + 0.1);
      osc2.frequency.setValueAtTime(220, t + 0.2);
      osc2.frequency.setValueAtTime(277, t + 0.3);
      
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);
      
      osc1.start(t);
      osc2.start(t);
      
      osc1.stop(t + 0.42);
      osc2.stop(t + 0.42);
    }
  };

  // Event Listeners for SE buttons
  btnSeLaser.addEventListener('click', () => playSE('laser'));
  btnSeDash.addEventListener('click', () => playSE('dash'));
  btnSeHit.addEventListener('click', () => playSE('hit'));
  btnSeWarning.addEventListener('click', () => playSE('warning'));

  // Generative Sequencer BGM Engine
  function stopBgmSequencer() {
    if (bgmIntervalId) {
      clearInterval(bgmIntervalId);
      bgmIntervalId = null;
    }
    isPlayingBgm = false;
    currentBgmType = 'none';
    
    // Reset buttons
    btnBgmTitle.classList.remove('active');
    btnBgmSelect.classList.remove('active');
    btnBgmBoss.classList.remove('active');
    btnBgmStop.classList.add('active');
    
    if (audioCtx) {
      consoleStatus.textContent = 'ONLINE (BGM: STOPPED)';
    }
  }

  function startBgmSequencer(bgmType) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    stopBgmSequencer();

    currentBgmType = bgmType;
    isPlayingBgm = true;
    stepIndex = 0;
    
    btnBgmStop.classList.remove('active');
    if (bgmType === 'title') {
      tempo = 90;
      btnBgmTitle.classList.add('active');
      consoleStatus.textContent = 'PLAYING: TITLE BGM';
    } else if (bgmType === 'select') {
      tempo = 110;
      btnBgmSelect.classList.add('active');
      consoleStatus.textContent = 'PLAYING: SELECT BGM';
    } else if (bgmType === 'boss') {
      tempo = isPhase2 ? 165 : 138;
      btnBgmBoss.classList.add('active');
      consoleStatus.textContent = isPhase2 ? 'PLAYING: BOSS BGM (PHASE 2 INTENSE!)' : 'PLAYING: BOSS BGM';
    }

    const stepDuration = 60 / tempo / 2; // eighth notes (8分音符)
    
    // Melodic notes configurations
    // Minor Pentatonic: A1 (55Hz), A2 (110Hz), C3 (130Hz), D3 (146Hz), E3 (164Hz), G3 (196Hz), A3 (220Hz), C4 (261Hz)...
    const notes = {
      title: {
        bass: [55.00, 55.00, 65.41, 65.41, 73.42, 73.42, 82.41, 82.41],
        lead: [220.00, 0, 261.63, 293.66, 0, 329.63, 392.00, 440.00],
        wave: 'sine',
        leadWave: 'sine'
      },
      select: {
        bass: [110.00, 110.00, 130.81, 146.83, 110.00, 110.00, 164.81, 196.00],
        lead: [440.00, 392.00, 440.00, 523.25, 440.00, 587.33, 523.25, 440.00],
        wave: 'triangle',
        leadWave: 'sine'
      },
      boss: {
        // More heavy tension in D minor / chromatic
        bass: isPhase2 ? [73.42, 73.42, 87.31, 73.42, 98.00, 92.50, 87.31, 82.41] : [73.42, 73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 82.41],
        lead: isPhase2 ? [293.66, 311.13, 293.66, 349.23, 392.00, 440.00, 466.16, 523.25] : [293.66, 0, 349.23, 293.66, 392.00, 0, 349.23, 440.00],
        wave: 'sawtooth',
        leadWave: 'sawtooth'
      }
    };

    const currentNotes = notes[bgmType];
    
    // Interval loop
    bgmIntervalId = setInterval(() => {
      if (!isPlayingBgm || !audioCtx) return;
      
      const t = audioCtx.currentTime;
      const idx = stepIndex % 8;
      
      // 1. Play Bass Note
      const bassFreq = currentNotes.bass[idx];
      if (bassFreq > 0) {
        const bassOsc = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        
        bassOsc.type = currentNotes.wave;
        bassOsc.frequency.setValueAtTime(bassFreq, t);
        
        bassGain.connect(masterGain);
        bassOsc.connect(bassGain);
        
        bassGain.gain.setValueAtTime(bgmType === 'boss' ? 0.08 : 0.15, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration - 0.02);
        
        bassOsc.start(t);
        bassOsc.stop(t + stepDuration);
      }
      
      // 2. Play Lead/Melody Note (every alternate step or based on list)
      const leadFreq = currentNotes.lead[idx];
      if (leadFreq > 0 && (idx % 2 === 0 || bgmType === 'boss')) {
        const leadOsc = audioCtx.createOscillator();
        const leadGain = audioCtx.createGain();
        
        leadOsc.type = currentNotes.leadWave;
        leadOsc.frequency.setValueAtTime(leadFreq, t);
        
        // Add subtle vibrato in Boss BGM
        if (bgmType === 'boss') {
          const lfo = audioCtx.createOscillator();
          const lfoGain = audioCtx.createGain();
          lfo.frequency.value = isPhase2 ? 12 : 7; // speed
          lfoGain.gain.value = 8; // depth in Hz
          
          lfo.connect(lfoGain);
          lfoGain.connect(leadOsc.frequency);
          
          lfo.start(t);
          lfo.stop(t + stepDuration);
        }
        
        leadOsc.connect(leadGain);
        leadGain.connect(masterGain);
        
        leadGain.gain.setValueAtTime(bgmType === 'boss' ? 0.05 : 0.08, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.5 - 0.05);
        
        leadOsc.start(t);
        leadOsc.stop(t + stepDuration * 1.5);
      }
      
      // 3. Play simple hi-hat/noise trigger on alternate steps in Boss BGM
      if (bgmType === 'boss' && idx % 2 === 1) {
        // High frequency chirp simulating hi-hat
        const hatOsc = audioCtx.createOscillator();
        const hatGain = audioCtx.createGain();
        
        hatOsc.type = 'triangle';
        hatOsc.frequency.setValueAtTime(8000, t);
        
        hatOsc.connect(hatGain);
        hatGain.connect(masterGain);
        
        hatGain.gain.setValueAtTime(0.02, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        
        hatOsc.start(t);
        hatOsc.stop(t + 0.05);
      }

      // 4. In Phase 2 Boss BGM, add a subtle sirens sweeping in background
      if (bgmType === 'boss' && isPhase2 && idx === 0) {
        const sweepOsc = audioCtx.createOscillator();
        const sweepGain = audioCtx.createGain();
        
        sweepOsc.type = 'sine';
        sweepOsc.frequency.setValueAtTime(400, t);
        sweepOsc.frequency.exponentialRampToValueAtTime(800, t + stepDuration * 4);
        
        sweepOsc.connect(sweepGain);
        sweepGain.connect(masterGain);
        
        sweepGain.gain.setValueAtTime(0.015, t);
        sweepGain.gain.linearRampToValueAtTime(0.015, t + stepDuration * 3);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 4);
        
        sweepOsc.start(t);
        sweepOsc.stop(t + stepDuration * 4);
      }
      
      stepIndex++;
    }, stepDuration * 1000);
  }

  // Generative BGM Button Events
  btnBgmTitle.addEventListener('click', () => startBgmSequencer('title'));
  btnBgmSelect.addEventListener('click', () => startBgmSequencer('select'));
  btnBgmBoss.addEventListener('click', () => startBgmSequencer('boss'));
  btnBgmStop.addEventListener('click', () => stopBgmSequencer());

  // Phase change toggle (only affects Boss BGM)
  btnPhase2.addEventListener('click', () => {
    isPhase2 = !isPhase2;
    btnPhase2.classList.toggle('active');
    
    if (isPhase2) {
      btnPhase2.textContent = 'PHASE 2 (発狂中)';
      if (currentBgmType === 'boss') {
        // Speed up and shift
        startBgmSequencer('boss');
      }
      // Play a cool alert when phase transition is clicked!
      playSE('warning');
    } else {
      btnPhase2.textContent = 'PHASE CHANGE (第二形態)';
      if (currentBgmType === 'boss') {
        startBgmSequencer('boss');
      }
    }
  });
});
