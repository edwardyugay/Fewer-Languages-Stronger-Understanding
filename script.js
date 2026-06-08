
const slides = Array.from(document.querySelectorAll(".slide"));
const allVideos = Array.from(document.querySelectorAll(".page-video"));
const dots = Array.from(document.querySelectorAll(".dot"));
const nextButtons = Array.from(document.querySelectorAll(".nextBtn"));
const backButtons = Array.from(document.querySelectorAll(".backBtn"));
const startButtons = Array.from(document.querySelectorAll(".startSound"));
const soundGate = document.getElementById("soundGate");

let current = 0;
let soundUnlocked = false;

function setActiveDot(index){
  dots.forEach(dot => dot.classList.toggle("active", Number(dot.dataset.go) === index));
}

async function playCurrentVideo(){
  const activeVideo = slides[current].querySelector(".page-video");

  allVideos.forEach(video => {
    if (video !== activeVideo) {
      video.pause();
      video.currentTime = 0;
    }
  });

  if (!activeVideo) return;

  activeVideo.loop = true;
  activeVideo.muted = !soundUnlocked;
  activeVideo.volume = 1;

  try {
    await activeVideo.play();
  } catch (error) {
    // Browser fallback: autoplay is allowed only muted before the first click.
    activeVideo.muted = true;
    try { await activeVideo.play(); } catch (e) {}
  }
}

function goTo(index){
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
  setActiveDot(current);
  playCurrentVideo();
}

function next(){ goTo(current + 1); }
function back(){ goTo(current - 1); }

nextButtons.forEach(btn => btn.addEventListener("click", next));
backButtons.forEach(btn => btn.addEventListener("click", back));
dots.forEach(dot => dot.addEventListener("click", () => goTo(Number(dot.dataset.go))));

async function unlockSound(){
  soundUnlocked = true;
  soundGate.classList.add("hidden");
  allVideos.forEach(video => {
    video.muted = false;
    video.volume = 1;
  });
  await playCurrentVideo();
}

startButtons.forEach(btn => btn.addEventListener("click", unlockSound));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") next();
  if (event.key === "ArrowLeft") back();
});

playCurrentVideo();
