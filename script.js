// =======================
// Inicialización principal
// =======================
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sobre = document.getElementById('sobre-inicial');
  const audio = document.getElementById('audio-fondo');
  const video = document.getElementById('video-fondo');
  const contenidoRetardado = document.getElementById('contenido-retardado');

  // Bloquear scroll inicial
  body.classList.add('no-scroll');

  // Configurar sobre inicial con botón de cera
  setupSobre(sobre, audio, body);

  // Iniciar contador regresivo
  initCountdown('December 20, 2025 19:00:00');

  // Mostrar contenido retardado después de un tiempo
  showDelayedContent(contenidoRetardado, 25000, video);

  // Parallax del nombre principal
  initParallaxNameTitle();

  // Parallax de secciones con data-bg
  initParallax();
});

// =======================
// Función: Configurar sobre inicial con botón 3D
// =======================
function setupSobre(sobre, audio, body) {
  if (!sobre) return;

  const canvasBtn = document.getElementById('btnCera3D');
  if (!canvasBtn || !canvasBtn.getContext) return;

  const ctx = canvasBtn.getContext('2d');
  let pressed = false;

  // Dibuja el botón con efecto 3D dorado
  function drawButton() {
    const w = canvasBtn.width;
    const h = canvasBtn.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = 70;

    ctx.clearRect(0, 0, w, h);

    // Fondo con gradiente radial dorado
    const grad = ctx.createRadialGradient(cx - 10, cy - 10, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, pressed ? '#d4af37' : '#fff1a8');  
    grad.addColorStop(0.6, pressed ? '#b38e1f' : '#ffd966');
    grad.addColorStop(1, '#8c6b1f');

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Borde del sello
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = '#a37f1f';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Texto central "Abrir"
    ctx.fillStyle = '#5c3a0f';
    ctx.font = 'bold 26px Allura, cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra para efecto grabado
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText('Abrir', cx, cy);
  }

  drawButton();

  // Eventos para efecto presionado
  canvasBtn.addEventListener('mousedown', () => {
    pressed = true;
    drawButton();
  });

  canvasBtn.addEventListener('mouseup', () => {
    pressed = false;
    drawButton();
  });

  canvasBtn.addEventListener('mouseleave', () => {
    pressed = false;
    drawButton();
  });

  // Click para abrir sobre
  canvasBtn.addEventListener('click', () => {
    if (audio && typeof audio.play === 'function') {
      audio.play().catch(e => console.error("Error al reproducir audio:", e));
    }

    // efecto fade out del sobre
    sobre.style.transition = 'opacity 0.5s ease';
    sobre.style.opacity = '0';

    setTimeout(() => {
      sobre.style.display = 'none';

      // Mostrar contenido principal
      document.querySelectorAll('.contenido-principal').forEach(el => {
        el.style.display = 'block';
      });

      // Desbloquear scroll
      body.classList.remove('no-scroll');
    }, 500);
  });

  // Mantener scroll arriba al recargar
  window.onbeforeunload = () => {
    window.scrollTo(0, 0);
  };
}
// =======================
// Función: Contador regresivo
// =======================
function initCountdown(eventDateStr) {
  const eventDate = new Date(eventDateStr);

  function update() {
    const now = new Date();
    const diff = eventDate - now;

    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    if (diff <= 0) {
      countdownEl.innerHTML = '<h2 class="section-title">¡El gran día ha llegado!</h2>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const ids = ['days', 'hours', 'minutes', 'seconds'];
    const values = [days, hours, minutes, seconds];

    ids.forEach((id, i) => {
      const valueStr = values[i].toString().padStart(2, '0');
      flipTo(id, valueStr);
    });
  }

  update();
  setInterval(update, 1000);
}

// =======================
// Función auxiliar: animar cambio de número en el contador (flip effect)
// =======================
function flipTo(id, newValue) {
  const card = document.getElementById(id);
  if (!card) return;

  const inner = card.querySelector('.flip-card-inner');
  const front = card.querySelector('.flip-card-front');
  const back = card.querySelector('.flip-card-back');

  if (!inner || !front || !back) return;

  if (front.textContent !== newValue) {
    back.textContent = newValue;
    inner.style.transform = 'rotateX(180deg)';

    setTimeout(() => {
      front.textContent = newValue;
      inner.style.transform = 'rotateX(0deg)';
    }, 300);
  }
}

// =======================
// Función: carrusel
// =======================
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  if (!prevButton || !nextButton) return;

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextButton.addEventListener('click', showNextSlide);
  prevButton.addEventListener('click', showPrevSlide);

  // Cambiar slide automáticamente cada 3 segundos
  setInterval(showNextSlide, 3000);
}

document.addEventListener('DOMContentLoaded', initCarousel);

// =======================
// Función: Crear mariposas dinámicas
// =======================
function createButterflies() {
  const bg = document.getElementById('background-container'); // Asegúrate de que exista este id o cambia a tu selector
  if (!bg) return;

  bg.innerHTML = ''; // Limpiar contenido previo

  for (let i = 0; i < 50; i++) {
    const b = document.createElement('div');
    b.className = 'butterfly';

    const size = Math.random() * 30 + 20;

    Object.assign(b.style, {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: (Math.random() * 0.5 + 0.3).toFixed(2),
      transform: `rotate(${Math.random() * 360}deg)`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none', // Para evitar interacción
    });

    bg.appendChild(b);
  }
}

// =======================
// Función: Contenido retardado
// =======================
function showDelayedContent(element, delay, video) {
  if (!element) return;

  element.style.opacity = '0';
  element.style.transition = 'opacity 1s ease-in-out';

  setTimeout(() => {
    element.style.opacity = '1';

    if (video) {
      video.play().catch(e => console.warn('Auto-play de video no permitido:', e));
      const interval = setInterval(() => {
        if (video.currentTime >= 27) {
          video.pause();
          clearInterval(interval);
        }
      }, 200);
    }
  }, delay);
}

// =======================
// Función: Mostrar hint retardado
// =======================
window.addEventListener("load", () => {
  setTimeout(() => {
    const hint = document.querySelector('.desliza-hint');
    if (hint) {
      hint.style.display = 'block'; // Mostrar la imagen o hint
    }
  }, 25000); // 25 segundos
});

// =======================
// Función: Parallax nombre principal
// =======================
function initParallaxNameTitle() {
  const texto = document.querySelector(".name-title");
  if (!texto) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY <= window.innerHeight) {
      texto.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });
}

// =======================
// Función: Parallax secciones con data-bg
// =======================
function initParallax() {
  const sections = document.querySelectorAll('.parallax');
  if (sections.length === 0) return;

  sections.forEach(section => {
    const bgName = section.getAttribute('data-bg');
    if (!bgName) return;

    // Evitar agregar varias veces el fondo
    if (section.querySelector('.parallax-bg')) return;

    const layer = document.createElement('div');
    layer.className = 'parallax-bg';
    Object.assign(layer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '150%',
      backgroundImage: `url('img/${bgName}')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      zIndex: '-1',
      transform: 'translateY(0)',
      pointerEvents: 'none',
    });

    section.style.position = 'relative'; // Asegurar posicionamiento relativo para el layer
    section.appendChild(layer);
  });

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    sections.forEach(section => {
      const bg = section.querySelector('.parallax-bg');
      const speed = 0.5;
      const distance = scrollTop - section.offsetTop;

      if (bg) {
        bg.style.transform = `translateY(${distance * speed}px)`;
      }
    });
  });
}
// =======================
// Timeline con corazones
// =======================
const canvas = document.getElementById('timelineCanvas');
const ctx = canvas.getContext('2d');
const timeline = document.querySelector('.timeline');
const timelineItems = document.querySelectorAll('.timeline-item');

const barWidth = 6;
const circleRadius = 18;
const heartSize = 18;

function resizeCanvas() {
  if (!canvas || !timeline) return;

  canvas.width = timeline.offsetWidth;
  canvas.height = timeline.offsetHeight;

  drawTimeline();
}

// Dibuja un corazón en (x,y) con tamaño y colores dados
function drawHeart(x, y, size, fillStyle, strokeStyle) {
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(size / 100, size / 100);
  ctx.beginPath();
  ctx.moveTo(50, 30);
  ctx.bezierCurveTo(50, 15, 35, 0, 20, 0);
  ctx.bezierCurveTo(0, 0, 0, 25, 0, 25);
  ctx.bezierCurveTo(0, 55, 50, 95, 50, 100);
  ctx.bezierCurveTo(50, 95, 100, 55, 100, 25);
  ctx.bezierCurveTo(100, 25, 100, 0, 80, 0);
  ctx.bezierCurveTo(65, 0, 50, 15, 50, 30);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
  ctx.restore();
}

function drawTimeline() {
  if (!canvas || !timeline) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;

  const timelineRect = timeline.getBoundingClientRect();

  // Dibujar barra gris completa
  ctx.beginPath();
  ctx.lineWidth = barWidth;
  ctx.strokeStyle = '#C0C0C0';
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  // Calcular progreso basado en scroll y posición del timeline
  const viewportCenter = window.innerHeight / 2;
  const rawProgress = viewportCenter - timelineRect.top;
  const progress = Math.min(Math.max(rawProgress, 0), timelineRect.height);

  // Dibujar barra azul hasta progreso
  ctx.beginPath();
  ctx.lineWidth = barWidth;
  ctx.strokeStyle = '#0033A0';
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, progress);
  ctx.stroke();

  // Dibujar círculos y corazones en cada item
  timelineItems.forEach(item => {
    const marker = item.querySelector('.timeline-marker');
    if (!marker) return;

    const markerRect = marker.getBoundingClientRect();
    // Coordenada Y relativa al timeline
    const y = (markerRect.top - timelineRect.top) + (marker.offsetHeight / 2);
    const x = centerX;

    // Círculo azul sólido con borde azul
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0033A0';
    ctx.fill();
    ctx.strokeStyle = '#0033A0';
    ctx.stroke();

    // Corazón: azul si aún no se ha alcanzado el progreso, gris si sí
    const heartColor = y <= progress ? "#c0c0c0" : "#0033A0";
    drawHeart(x, y, heartSize, heartColor, "#333");
  });
}

// Eventos para mantener el canvas actualizado
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', drawTimeline);
resizeCanvas();


// =======================
// Botón scroll arriba
// =======================
const btnScrollTop = document.getElementById('btnScrollTop');
let hideTimeout;

if (btnScrollTop) {
  window.addEventListener('scroll', () => {
    btnScrollTop.style.display = 'flex';
    btnScrollTop.style.opacity = '1';

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      btnScrollTop.style.opacity = '0';
      setTimeout(() => btnScrollTop.style.display = 'none', 300);
    }, 1500);
  });

  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
//****************************************************************************************************** */
// Aquí empieza lo nuevo 

// Configurar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLoaImy_Az6qWMcqeN8AR6Q8YH9IvA19c",
  authDomain: "invitaciongraduacion-29f0d.firebaseapp.com",
  databaseURL: "https://invitaciongraduacion-29f0d-default-rtdb.firebaseio.com/",
  projectId: "invitaciongraduacion-29f0d",
  storageBucket: "invitaciongraduacion-29f0d.appspot.com",
  messagingSenderId: "794213474986",
  appId: "1:794213474986:web:6d32fabfcb1e1d2d0526d3"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🌌 Constelación interactiva de invitados
const constelacionCanvas = document.getElementById("constelacion-canvas");
const constelacionCtx = constelacionCanvas.getContext("2d");

let animacionIniciada = false;
let estrellas = [];

// Ajustar tamaño del canvas al tamaño del contenedor
function ajustarCanvas() {
  if (!constelacionCanvas) return;
  const rect = constelacionCanvas.getBoundingClientRect();
  constelacionCanvas.width = rect.width;
  constelacionCanvas.height = rect.height;
}
window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

// Función principal de animación
function animarConstelacion() {
  constelacionCtx.clearRect(0, 0, constelacionCanvas.width, constelacionCanvas.height);

  // Mover y dibujar estrellas
  estrellas.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;

    // Rebotar en los bordes del canvas
    if (e.x < 0 || e.x > constelacionCanvas.width) e.vx *= -1;
    if (e.y < 0 || e.y > constelacionCanvas.height) e.vy *= -1;

    // Dibujar estrella
    constelacionCtx.beginPath();
    constelacionCtx.arc(e.x, e.y, 4, 0, 2 * Math.PI);
    constelacionCtx.fillStyle = "#c0c0c0";
    constelacionCtx.fill();

    // Dibujar nombre cerca de la estrella
    constelacionCtx.font = "13px Montserrat, sans-serif";
    constelacionCtx.fillStyle = "#87CEFA";
    constelacionCtx.fillText(e.nombre, e.x + 6, e.y - 6);
  });

  // Dibujar conexiones entre estrellas cercanas
  for (let i = 0; i < estrellas.length; i++) {
    for (let j = i + 1; j < estrellas.length; j++) {
      const dx = estrellas[i].x - estrellas[j].x;
      const dy = estrellas[i].y - estrellas[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        constelacionCtx.beginPath();
        constelacionCtx.moveTo(estrellas[i].x, estrellas[i].y);
        constelacionCtx.lineTo(estrellas[j].x, estrellas[j].y);
        constelacionCtx.strokeStyle = "#0b1e5e";
        constelacionCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animarConstelacion);
}

// Leer invitados en tiempo real desde Firebase y actualizar constelación
db.ref("asistentes").on("value", snapshot => {
  const datos = snapshot.val() || {};
  const lista = Object.values(datos).filter(a => a.nombre);

  ajustarCanvas();

  // Mantener estrellas existentes por nombre
  const mapaEstrellas = {};
  estrellas.forEach(e => {
    mapaEstrellas[e.nombre] = e;
  });

  estrellas = lista.map(a => {
    if (mapaEstrellas[a.nombre]) {
      return mapaEstrellas[a.nombre];
    }
    return {
      nombre: a.nombre,
      x: Math.random() * constelacionCanvas.width,
      y: Math.random() * constelacionCanvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    };
  });

  if (!animacionIniciada) {
    animacionIniciada = true;
    animarConstelacion();
  }
});

// Animar secciones con GSAP (asegúrate de tener GSAP y ScrollTrigger cargados)
gsap.utils.toArray(".scroll").forEach(section => {
  gsap.fromTo(section,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      duration: 1
    }
  );
});

//******************************************/
// Lista de malas palabras (personalízala)
//******************************************/
const malasPalabras = [
  "p3nd3jo", "pndjo", "p3n#jo", "pendejo", "pendeja",
  "ch1ng4tu", "ching4d4", "ch1ngad4", "chingatumadre", "ching@", "chinga tu madre",
  "put0", "pvt0", "pvt@", "put@", "püt0", "no mames",
  "m4m0n", "mam0n", "mamón", "mam4n",
  "culer0", "culer@", "kulero", "cul0", "kul0", "qlero",
  "v3rg4", "v3rga", "verga", "vrg@", "vrg4",
  "n0m4m3s", "nomames", "n0m@m3s", "no m4m3s",
  "pinche puta", "p1nch3", "pnch3", "p!nch3",
  "h1j0d3pvt4", "hijodeputa", "hijodpt4", "h1j@d3l@ch1ng4d@", "hdp", "mamador", "m4m4d0r",
  "pito", "pit0", "p1t0",
  "vergu3r0", "verg4z0", "vergazo", "verga",
  "putaz0", "putazo", "putaz@", "ptz0",
  "cabron", "c4br0n", "kbron", "c@brón",
  "cul0n", "culon", "kul0n", "kvlon", "kvlo",
  "p3rr4", "perra", "p3rro", "perr@", "prr0", "perro",
  "ch1n@d4", "chin4da", "chinad@", "chngad4", "puto", "pvt0", "idiota", "1D10T4"
];

// Función para detectar si un texto contiene malas palabras
function contieneMalasPalabras(texto) {
  texto = texto.toLowerCase();
  return malasPalabras.some(palabra => texto.includes(palabra));
}
//******************************************/
// Función para confirmar asistencia
//******************************************/
function confirmarAsistencia() {
  const inputNombre = document.getElementById("nombre");
  const nombre = inputNombre.value.trim();
  
  if (!nombre) {
    alert("Por favor, escribe tu nombre");
    return;
  }

  if (contieneMalasPalabras(nombre)) {
    alert("Por favor, no uses lenguaje ofensivo");
    return;
  }

  const nombreNormalizado = nombre.toLowerCase();

  // Consultar todos los nombres en Firebase
  db.ref("asistentes").once("value")
    .then(snapshot => {
      const datos = snapshot.val();
      if (datos) {
        const nombresExistentes = Object.values(datos)
          .map(a => a.nombre?.toLowerCase().trim());
        const yaExiste = nombresExistentes.includes(nombreNormalizado);

        if (yaExiste) {
          alert("✨ Ya confirmaste tu asistencia. O intenta con nombre y apellido :)");
          return;
        }
      }

      // Guardar nombre si no existe
      return db.ref("asistentes").push({ nombre });
    })
    .then(() => {
      // Solo se ejecuta si se guardó el nombre
      console.log("Nombre guardado exitosamente");
      const msg = `Hola, soy ${nombre}. ¡Felicidades, Erika. Nos vemos en la fiesta`;
      const link = `https://wa.me/+5215513861206?text=${encodeURIComponent(msg)}`;
      window.location.href = link;

      // Limpiar el input después de confirmar
      inputNombre.value = "";
    })
    .catch(error => {
      console.error("Error al guardar o verificar en Firebase:", error);
      alert("Hubo un error. Intenta de nuevo más tarde.");
    });
}

//----------------------------------------------------------
// Función para mostrar constelación manualmente (opcional)
//----------------------------------------------------------
function confirmarAsistencia2() {
  db.ref("asistentes").once("value")
    .then(snapshot => {
      const datos = snapshot.val() || {};
      const lista = Object.values(datos).filter(x => x.nombre && x.nombre !== "NADA");

      if (lista.length === 0) {
        alert("No hay invitados confirmados todavía. Confirma con tu nombre :)");
        return;
      }

      ajustarCanvas();

      estrellas = lista.map(a => ({
        nombre: a.nombre,
        x: Math.random() * constelacionCanvas.width,
        y: Math.random() * constelacionCanvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      }));

      if (!animacionIniciada) {
        animacionIniciada = true;
        animarConstelacion();
      }
    })
    .catch(error => {
      console.error("Error al leer asistentes:", error);
      alert("Ocurrió un error al obtener los invitados.");
    });
}


//*************************************************
//ultima funcion mensjae
//*************************************************

function enviarMensajeWhatsApp() {
  const inputMensaje = document.getElementById("mensaje");
  const mensaje = inputMensaje.value.trim();

  if (!mensaje) {
    alert("Por favor, escribe un mensaje");
    return;
  }

  if (contieneMalasPalabras(mensaje)) {
    alert("Por favor, no uses lenguaje ofensivo");
    return;
  }

  // Crear link a WhatsApp con el mensaje personalizado
  const link = `https://wa.me/+5215513861206?text=${encodeURIComponent(mensaje)}`;

  // Redirigir a WhatsApp
  window.location.href = link;

  // Limpiar el campo
  inputMensaje.value = "";
}

function contieneMalasPalabras(texto) {
  const malasPalabras = []; // puedes agregar palabras si deseas
  const textoLower = texto.toLowerCase();
  return malasPalabras.some(palabra => textoLower.includes(palabra));
}
