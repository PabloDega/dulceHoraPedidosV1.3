let aguja = document.querySelector(".aguja");
let counter = document.querySelector("#_404timeOut");
let timeOut = 14;

document.querySelector("._404btn").addEventListener("click", () => {
  redireccionar();
});

setInterval(() => {
  let angle = Math.random() * 360;
  aguja.style.transform = `rotate(${angle}deg)`;
}, Math.random() * 2000 + 1500);

setInterval(() => {
  counter.innerHTML = timeOut;
  timeOut--;
  if (timeOut == -1) {
    redireccionar();
  }
}, 1000);

const redireccionar = () => {
  try {
    history.back();
  } catch (error) {
    window.location.href = "./";
  }
};
