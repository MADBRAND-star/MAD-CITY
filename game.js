const state={x:0,y:0,money:0,score:0,car:false,mission:false,relationship:0,companion:false};
const speed=4;
const player=document.getElementById("player"),car=document.getElementById("car");
const city=document.getElementById("city"),msg=document.getElementById("message");

function update(){
  player.classList.toggle("hidden",state.car); car.classList.toggle("hidden",!state.car);
  document.getElementById("money").textContent=state.money;
  document.getElementById("score").textContent=state.score;
  document.getElementById("mission").textContent=state.mission?"Mission Active":"Free Roam";
  document.getElementById("relationship").textContent=state.relationship;
  const obj=state.car?car:player;
  obj.style.left="50%";obj.style.top="50%";
  city.style.transform=`translate(${-state.x}px,${-state.y}px)`;
}
function saveGame(){
  localStorage.setItem("madCitySave",JSON.stringify(state));
  msg.textContent="✅ Game saved! You can leave and come back later.";
}
function loadGame(){
  const s=localStorage.getItem("madCitySave");
  if(!s){msg.textContent="No saved game yet.";return}
  Object.assign(state,JSON.parse(s)); update();
  msg.textContent="✅ Saved game loaded.";
}
function move(dx,dy){
  state.x+=dx;state.y+=dy;
  state.score+=1;
  // simple collectible zones
  const ax=state.x, ay=state.y;
  if(!state.mission && Math.abs(ax+200)<180 && Math.abs(ay+100)<180){
    state.mission=true; msg.textContent="🎯 Mission started! Reach the yellow !";
  }
  if(state.mission && Math.abs(ax-400)<180 && Math.abs(ay-300)<180){
    state.money+=100;state.score+=500;state.mission=false;
    msg.textContent="🏆 Mission complete! +$100";
    saveGame();
  }
  update();
}
document.addEventListener("keydown",e=>{
  const k=e.key;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(k)){
    e.preventDefault();
    if(k==="ArrowUp"||k==="w")move(0,speed);
    if(k==="ArrowDown"||k==="s")move(0,-speed);
    if(k==="ArrowLeft"||k==="a")move(speed,0);
    if(k==="ArrowRight"||k==="d")move(-speed,0);
  }
  if(k.toLowerCase()==="e")toggleCar();
});
document.querySelectorAll("#controls button[data-key]").forEach(b=>{
  b.addEventListener("pointerdown",()=>move(
    b.dataset.key==="ArrowLeft"?speed:b.dataset.key==="ArrowRight"?-speed:0,
    b.dataset.key==="ArrowUp"?speed:b.dataset.key==="ArrowDown"?-speed:0
  ));
});
function toggleCar(){state.car=!state.car;msg.textContent=state.car?"🚗 You're driving!":"👤 You're on foot.";update()}
document.getElementById("action").onclick=toggleCar;
document.getElementById("save").onclick=saveGame;
document.getElementById("load").onclick=loadGame;
document.getElementById("reset").onclick=()=>{
  if(confirm("Start a new game? Your current saved game will remain until you save over it.")){
    state.x=state.y=state.money=state.score=0;state.car=false;state.mission=false;state.relationship=0;state.companion=false;update();msg.textContent="New game started.";
  }
};
update();

function npcTalk(){
  const lines=["Asha: Hey! Nice to see you in MAD CITY.","Asha: Want to explore the city together?","Asha: Good friends help each other out."];
  msg.textContent=lines[Math.floor(Math.random()*lines.length)];
  state.relationship=Math.min(100,state.relationship+5); update();
}
function npcGift(){
  if(state.money<20){msg.textContent="💰 You need $20 for a gift.";return}
  state.money-=20; state.relationship=Math.min(100,state.relationship+15);
  msg.textContent="🎁 Asha liked the gift! Relationship +15%.";
  saveGame();
}
function toggleCompanion(){
  if(state.relationship<20){msg.textContent="❤️ Build at least 20% friendship first.";return}
  state.companion=!state.companion;
  msg.textContent=state.companion?"🤝 Asha is now your companion.":"👋 Asha is no longer following you.";
  saveGame(); update();
}
document.getElementById("talk").onclick=npcTalk;
document.getElementById("gift").onclick=npcGift;
document.getElementById("companion").onclick=toggleCompanion;
