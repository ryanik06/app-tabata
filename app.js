let state = { time:20, total:20, phase:"work", running:false };
let interval;

function startApp(){
  document.getElementById("onboarding").classList.remove("active");
  document.getElementById("app").classList.remove("hidden");
}

function update(){
  time.innerText = state.time;
  let percent = (state.time/state.total)*100;
  circle.style.background =
   `conic-gradient(#ef4444 ${percent}%, #1e293b ${percent}%)`;
}

function tick(){
  state.time--;
  if(state.time<=0){
    state.time = +work.value;
  }
  update();
}

function start(){
  if(state.running) return;
  state.running=true;
  interval=setInterval(tick,1000);
}

function pause(){
  clearInterval(interval);
  state.running=false;
}

function reset(){
  pause();
  state.time = +work.value;
  update();
}

// sessions
function saveSession(){
  let list = JSON.parse(localStorage.getItem("sessions")||"[]");
  list.push({name:sessionName.value, work:work.value});
  localStorage.setItem("sessions",JSON.stringify(list));
  loadSessions();
}

function loadSessions(){
  let list = JSON.parse(localStorage.getItem("sessions")||"[]");
  sessions.innerHTML="";
  list.forEach(s=>{
    let d=document.createElement("div");
    d.innerHTML=`${s.name} <button onclick="work.value=${s.work}">▶</button>`;
    sessions.appendChild(d);
  });
}

loadSessions();
update();