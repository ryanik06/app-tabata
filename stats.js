function drawChart(){
  const ctx = document.getElementById("chart").getContext("2d");

  const data = JSON.parse(localStorage.getItem("history")||"[]");

  ctx.clearRect(0,0,300,150);

  data.slice(-7).forEach((d,i)=>{
    ctx.fillRect(i*40,150-d.duration,20,d.duration);
  });
}

drawChart();