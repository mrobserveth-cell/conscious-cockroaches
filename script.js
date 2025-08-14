const canvas = document.getElementById('portfolioCanvas');
const ctx = canvas.getContext('2d');

// Particle background
let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

// Artworks
let artworks = [
  {src: "images/art1.jpg", title: "The Spiral Mind"},
  {src: "images/art2.jpg", title: "Urban Divinity"},
  {src: "images/art3.jpg", title: "Cockroach Nebula"},
  {src: "images/art4.jpg", title: "Fragments of Time"}
];

artworks.forEach((art, i) => {
  art.img = new Image();
  art.img.src = art.src;
  art.x = 120 + (i * 200);
  art.y = 250;
  art.w = 150;
  art.h = 100;
});

let titleWaveOffset = 0;
let selectedArt = null;

function drawParticles() {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#fff";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  ctx.restore();
}

function drawTitle() {
  ctx.save();
  ctx.font = "bold 50px Helvetica";
  ctx.fillStyle = "#ffcc00";
  let text = "Conscious Cockroaches";
  for (let i = 0; i < text.length; i++) {
    let letter = text[i];
    let x = 50 + i * 25;
    let y = 100 + Math.sin((i * 0.4) + titleWaveOffset) * 5;
    ctx.fillText(letter, x, y);
  }
  ctx.restore();
}

function drawArtPreviews() {
  artworks.forEach(art => {
    if (art.img.complete) {
      ctx.drawImage(art.img, art.x, art.y, art.w, art.h);
    } else {
      ctx.fillStyle = "#333";
      ctx.fillRect(art.x, art.y, art.w, art.h);
    }
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "#fff";
    ctx.fillText(art.title, art.x, art.y + art.h + 20);
  });
}

function drawLightbox() {
  if (!selectedArt) return;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (selectedArt.img.complete) {
    let imgW = selectedArt.img.width;
    let imgH = selectedArt.img.height;
    let scale = Math.min(600 / imgW, 400 / imgH);
    let drawW = imgW * scale;
    let drawH = imgH * scale;
    ctx.drawImage(selectedArt.img, (canvas.width - drawW) / 2, (canvas.height - drawH) / 2, drawW, drawH);
  }
  ctx.fillStyle = "#fff";
  ctx.font = "20px Helvetica";
  ctx.fillText(selectedArt.title, 320, 550);
  ctx.font = "14px Helvetica";
  ctx.fillText("Click anywhere to close", 320, 570);
  ctx.restore();
}

function render() {
  drawParticles();
  drawTitle();
  drawArtPreviews();
  drawLightbox();
  titleWaveOffset += 0.05;
  requestAnimationFrame(render);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (selectedArt) {
    selectedArt = null;
    return;
  }

  artworks.forEach(art => {
    if (mx > art.x && mx < art.x + art.w && my > art.y && my < art.y + art.h) {
      selectedArt = art;
    }
  });
});

render();