import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const app = document.querySelector('#app');
app.innerHTML = `
<header class="topbar">
  <div class="brand"><div class="logo">A</div><div><strong>ANDROMEDA</strong><small>Tu Asistente de Producción Musical</small></div></div>
  <div class="online"><i></i> En línea</div>
  <div class="top-actions"><span>ESTUDIO VIRTUAL</span><button id="resetView" title="Restablecer cámara">⟳</button><button id="fullscreen" title="Pantalla completa">⛶</button></div>
</header>
<main class="layout">
  <section class="studio-panel">
    <div class="scene-wrap">
      <div id="scene"></div>
      <div class="scene-chip"><i></i> ESTUDIO 3D · ANDROMEDA</div>
      <div class="scene-help">Arrastra para girar · rueda para acercar</div>
      <div class="loading" id="loading">Construyendo el estudio…</div>
    </div>
    <section class="camera-panel">
      <div class="camera-title">▣ &nbsp; CÁMARAS</div>
      <div class="camera-list" id="cameraList">
        <button class="cam active" data-cam="principal">Vista principal</button>
        <button class="cam" data-cam="frontal">Frontal</button>
        <button class="cam" data-cam="izquierda">Lateral izquierda</button>
        <button class="cam" data-cam="derecha">Lateral derecha</button>
        <button class="cam" data-cam="cenital">Cenital</button>
        <button class="cam" data-cam="mesa">Detalle mesa</button>
        <button class="cam" data-cam="robot">Detalle robot</button>
        <button class="cam" data-cam="cinta">Máquina de cinta</button>
      </div>
    </section>
    <div class="notice"><b>Nota:</b> esta versión construye un estudio 3D interactivo inspirado en tu referencia. La fotografía original se conserva en <code>public/studio-original.png</code>; una sola foto no permite reconstruir exactamente todos sus ángulos.</div>
  </section>
  <aside class="chat-panel">
    <div class="chat-head"><span>◉ &nbsp; Chat ANDROMEDA</span><span class="tiny-status">● LISTA</span></div>
    <div class="chat-intro"><div class="mini-logo">A</div><div><b>ANDROMEDA</b><small>Asistente de producción musical</small></div></div>
    <div class="messages" id="messages">
      <div class="bubble bot">¡Hola! Soy ANDROMEDA. Puedo orientarte con beats, arreglos, grabación, mezcla y masterización. ¿Qué estás creando hoy?</div>
    </div>
    <div class="attach-row">
      <label class="attach">＋ Imagen<input type="file" id="imageFile" accept="image/*" hidden></label>
      <label class="attach">♫ Audio<input type="file" id="audioFile" accept="audio/*" hidden></label>
      <span id="fileStatus">Adjunta una imagen o audio para la demo</span>
    </div>
    <form id="chatForm" class="composer">
      <textarea id="prompt" rows="2" placeholder="Escribe tu pregunta musical…" required></textarea>
      <button type="submit" aria-label="Enviar">➤</button>
    </form>
    <div class="disclaimer">Modo demostración: respuestas locales de ejemplo. No controla FL Studio ni modifica tus proyectos o audio.</div>
  </aside>
</main>
<footer>ANDROMEDA <span>•</span> ESTUDIO 3D INTERACTIVO <span>•</span> PROTOTIPO COMPLETO DE INTERFAZ</footer>
`;

const mount = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080b19);
scene.fog = new THREE.Fog(0x080b19, 17, 38);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(0, 5.8, 14);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
mount.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.1, 0);
controls.enableDamping = true;
controls.minDistance = 3.5;
controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI * .48;

scene.add(new THREE.HemisphereLight(0x9cbcff, 0x211022, 2.0));
const key = new THREE.PointLight(0x287aff, 75, 30); key.position.set(-5,7,5); scene.add(key);
const warm = new THREE.PointLight(0xff8b35, 65, 25); warm.position.set(4,6,-4); scene.add(warm);
const blue = new THREE.PointLight(0x075dff, 45, 20); blue.position.set(0,1,4); scene.add(blue);

const mat = (color, metalness=.25, roughness=.55, emissive=0x000000) => new THREE.MeshStandardMaterial({color, metalness, roughness, emissive, emissiveIntensity: .65});
const dark=mat(0x11172a,.65,.35), black=mat(0x050812,.35,.35), chrome=mat(0x8997b8,.8,.25), blueMat=mat(0x087cff,.35,.25,0x003caa), amber=mat(0xffa13b,.2,.25,0x8c3100), wood=mat(0x39251e,.15,.75);
const boxGeo = new THREE.BoxGeometry(1,1,1);
function box(parent, name, x,y,z,sx,sy,sz, material=dark) {
  const m=new THREE.Mesh(boxGeo,material); m.name=name; m.position.set(x,y,z); m.scale.set(sx,sy,sz); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
function cylinder(parent,x,y,z,r1,r2,h,material,segments=24,rotation=0){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.rotation.z=rotation;m.castShadow=true;parent.add(m);return m;
}
function glowLine(parent,x,y,z,sx,sy,sz,color=0x146bff){
 const m=box(parent,'neon',x,y,z,sx,sy,sz,new THREE.MeshBasicMaterial({color}));return m;
}

// Floor and fixed studio shell
box(scene,'floor',0,-.18,0,22,.25,18,mat(0x101426,.25,.35));
box(scene,'back wall',0,4.1,-8.8,22,8.5,.35,mat(0x111326));
box(scene,'left wall',-10.8,4,0,.35,8.2,18,mat(0x0b1426));
for(let i=0;i<9;i++){
  box(scene,'acoustic panel',-8.5+i*2.1,5.3,-8.55,1.35,2.3,.08,mat(i%2?0x22243a:0x171d32));
  glowLine(scene,-8.5+i*2.1,6.55,-8.43,1.2,.035,.04,0x126cff);
}
// Neon ceiling strips
glowLine(scene,0,7.9,-7.9,19,.045,.06,0x075dff);
glowLine(scene,-9.4,7.8,0,.05,.04,15,0x126bff);
glowLine(scene,9.4,7.8,0,.05,.04,15,0x126bff);

// Rack wall, many lit equipment faces and knobs
for(let row=0;row<3;row++) for(let col=0;col<10;col++){
 const x=-8.6+col*1.9, y=2.2+row*1.65;
 box(scene,'rack unit',x,y,-8.35,1.68,1.42,.28,dark);
 box(scene,'rack face',x,y,-8.17,1.48,1.15,.05,mat(0x20283a,.7,.3));
 for(let k=0;k<5;k++){
  cylinder(scene,x-.55+k*.27,y-.18,-8.10,.065,.065,.07,k%2?chrome:blueMat,16,Math.PI/2);
 }
 for(let k=0;k<3;k++) glowLine(scene,x-.48+k*.38,y+.25,-8.09,.22,.035,.025,k===1?0x17baff:0xffa33c);
}
// Console desk and 50-channel style surface
box(scene,'console desk',0,1.45,-2.8,10.8,.42,2.6,black);
const board=box(scene,'mixing surface',0,1.72,-2.75,10.3,.12,2.15,mat(0x202a3c,.75,.3));
for(let ch=0;ch<25;ch++){
 const x=-4.85+ch*.405;
 box(scene,'channel strip',x,1.81,-2.85,.32,.045,1.82,mat(0x30384b,.6,.35));
 for(let n=0;n<4;n++){
  const knob=cylinder(scene,x,1.9,-3.45+n*.32,.075,.075,.09,n===0?blueMat:chrome,16);
  knob.userData.turn=true;
 }
 box(scene,'fader slot',x,1.9,-1.98,.035,.025,.58,black);
 box(scene,'fader cap',x,1.94,-2.0+Math.random()*.35,.12,.08,.13,chrome);
}
// Monitor and speakers
box(scene,'monitor',0,3.5,-4.1,4.1,2.25,.22,black);
box(scene,'screen',0,3.5,-3.96,3.86,2.02,.035,mat(0x071c38,.1,.2,0x062b78));
for(let i=0;i<8;i++) box(scene,'DAW track',-.95+i*.27,3.2,-3.92,.2,.09,.02,i%2?blueMat:amber);
for(let s of [-1,1]){
 box(scene,'speaker',s*5.25,3.2,-3.4,1.2,2.25,1,dark);
 cylinder(scene,s*5.25,3.1,-2.86,.38,.38,.08,black,32,Math.PI/2);
 cylinder(scene,s*5.25,3.1,-2.80,.25,.25,.08,amber,32,Math.PI/2);
 cylinder(scene,s*5.25,3.85,-2.86,.14,.14,.08,blueMat,24,Math.PI/2);
}
// Tape machine on left, fixed position, spinning reels
const tape = new THREE.Group(); tape.position.set(-7.3,2.5,-4.5); scene.add(tape);
box(tape,'tape deck',0,0,0,2.3,2.6,.55,dark);
box(tape,'tape panel',0,0,.3,2.08,2.3,.08,mat(0x30394b,.8,.25));
const reels=[];
for(const x of [-.58,.58]){
 const g=new THREE.Group();g.position.set(x,.45,.42);tape.add(g);
 cylinder(g,0,0,0,.47,.47,.12,chrome,48);
 cylinder(g,0,0,.07,.37,.37,.04,black,48);
 for(let i=0;i<6;i++){const spoke=box(g,'reel spoke',0,.19,.1,.055,.34,.025,chrome);spoke.rotation.z=i*Math.PI/3;}
 cylinder(g,0,0,.12,.09,.09,.05,amber,24);
 reels.push(g);
}
box(tape,'tape display',0,-.68,.39,1.35,.34,.06,black);
for(let i=0;i<4;i++) glowLine(tape,-.45+i*.3,-.68,.43,.16,.035,.02,0x1aaaff);
// Robot, built from simple articulated pieces
const robot=new THREE.Group();robot.position.set(-1.6,0,-.4);scene.add(robot);
const shell=mat(0xd9e5f4,.55,.3), joint=mat(0x28344d,.7,.25);
function sphere(parent,x,y,z,sx,sy,sz,material){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
cylinder(robot,0,.22,0,.5,.58,.4,joint,32);
box(robot,'torso',0,1.55,0,1.05,1.35,.62,shell);
box(robot,'chest emblem',0,1.62,.34,.42,.38,.035,blueMat);
sphere(robot,0,2.65,0,.52,.57,.48,shell);
box(robot,'visor',0,2.68,.43,.66,.22,.08,black);
sphere(robot,0,2.68,.49,.11,.11,.04,blueMat);
const armL=new THREE.Group();armL.position.set(-.65,2.05,0);robot.add(armL);
sphere(armL,0,0,0,.25,.27,.25,joint);box(armL,'upper arm',-.05,-.42,0,.27,.78,.3,shell);sphere(armL,-.05,-.84,.02,.2,.2,.2,joint);box(armL,'forearm',.08,-1.15,.12,.25,.6,.28,shell);
const armR=armL.clone();armR.position.x=.65;robot.add(armR);
for(const x of [-.28,.28]){box(robot,'leg',x,.55,0,.3,.9,.36,joint);box(robot,'foot',x,.12,.22,.42,.2,.65,shell);}
const headphone=new THREE.Mesh(new THREE.TorusGeometry(.52,.075,10,40,Math.PI),blueMat);headphone.position.set(0,2.75,0);headphone.rotation.x=Math.PI/2;robot.add(headphone);

// Small desk lamp and decorative plants
cylinder(scene,3.8,2.5,-1.4,.05,.05,1.1,chrome);
sphere(scene,3.8,3.1,-1.4,.38,.18,.38,amber);
for(const x of [-9.4,9.1]){cylinder(scene,x,.45,-1,.42,.5,.8,mat(0x687080,.7,.3));for(let j=0;j<5;j++){const leaf=sphere(scene,x+Math.sin(j*1.2)*.35,1.3+j%2*.18,-1+Math.cos(j*1.2)*.3,.12,.65,.14,mat(0x16764f));leaf.rotation.z=(j-2)*.18;}}

const cameraViews={
 principal:{p:[0,6.2,15],t:[0,2.1,-1.5]},
 frontal:{p:[0,4.3,7.2],t:[0,2.1,-1.8]},
 izquierda:{p:[-8,4.2,5.4],t:[-1,2,-2]},
 derecha:{p:[8,4.2,5.4],t:[1,2,-2]},
 cenital:{p:[0,15,.1],t:[0,0,-1.8]},
 mesa:{p:[0,3.4,1.5],t:[0,1.7,-2.7]},
 robot:{p:[-2.3,3.8,3.4],t:[-1.6,2,0]},
 cinta:{p:[-8.5,3.5,1.8],t:[-7.3,2.5,-4.5]}
};
function goCamera(id){
 const v=cameraViews[id];if(!v)return;
 camera.position.set(...v.p);controls.target.set(...v.t);controls.update();
 document.querySelectorAll('.cam').forEach(b=>b.classList.toggle('active',b.dataset.cam===id));
}
document.querySelector('#cameraList').addEventListener('click',e=>{const b=e.target.closest('[data-cam]');if(b)goCamera(b.dataset.cam)});
document.querySelector('#resetView').onclick=()=>goCamera('principal');
document.querySelector('#fullscreen').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};

function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(mount);resize();
document.querySelector('#loading').remove();
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);const t=clock.getElapsedTime();
 reels.forEach((r,i)=>r.rotation.z=t*(i===0?1.1:-1.1));
 robot.position.y=Math.sin(t*1.5)*.035;
 robot.rotation.y=Math.sin(t*.45)*.08;
 armL.rotation.z=Math.sin(t*1.3)*.06;
 armR.rotation.z=-Math.sin(t*1.1)*.06;
 scene.traverse(o=>{if(o.userData.turn)o.rotation.y=Math.sin(t*.7+o.position.x)*.12;});
 controls.update();renderer.render(scene,camera);
}
animate();

let selectedFile=null;
for(const [id,type] of [['imageFile','imagen'],['audioFile','audio']]){
 document.getElementById(id).addEventListener('change',e=>{
  selectedFile=e.target.files?.[0]||null;
  document.querySelector('#fileStatus').textContent=selectedFile?`${type}: ${selectedFile.name}`:'Sin archivo';
 });
}
const messages=document.querySelector('#messages');
function addBubble(text,who){
 const d=document.createElement('div');d.className=`bubble ${who}`;d.textContent=text;messages.append(d);messages.scrollTop=messages.scrollHeight;
}
function demoReply(q,file){
 const s=q.toLowerCase();
 if(file) return `Recibí tu ${file.type.startsWith('image/')?'imagen':'audio'} (“${file.name}”). En esta versión puedo mostrar el archivo adjunto, pero todavía no tengo análisis inteligente conectado.`;
 if(s.includes('reguet')||s.includes('beat')) return 'Para empezar un beat de reguetón, prueba 95–100 BPM. Construye primero el patrón de kick y snare/clap, añade hats con variación y deja espacio para la voz. Ajusta todo escuchando el groove, no solo mirando la pantalla.';
 if(s.includes('mezcla')||s.includes('master')) return 'Empieza equilibrando niveles y paneo. Después limpia frecuencias problemáticas con EQ, controla dinámica con compresión moderada y compara el resultado a volumen igualado. En el master evita perseguir volumen antes de tener una buena mezcla.';
 if(s.includes('voz')||s.includes('vocal')) return 'Para grabar voces: busca una sala silenciosa, coloca el micrófono a unos 15–20 cm con filtro antipop y graba picos alrededor de -12 a -6 dBFS. Deja margen y evita saturar la entrada.';
 return 'Puedo orientarte sobre ritmo, selección de sonidos, grabación, arreglos, mezcla y masterización. Cuéntame el género, el BPM y qué resultado buscas. Esta respuesta es una demostración local, no una IA conectada.';
}
document.querySelector('#chatForm').addEventListener('submit',e=>{
 e.preventDefault();const input=document.querySelector('#prompt');const q=input.value.trim();if(!q&&!selectedFile)return;
 if(q)addBubble(q,'user');
 if(selectedFile)addBubble(`Archivo adjunto: ${selectedFile.name}`,'user');
 addBubble(demoReply(q,selectedFile),'bot');input.value='';selectedFile=null;
 document.querySelector('#fileStatus').textContent='Adjunta una imagen o audio para la demo';
 document.querySelector('#imageFile').value='';document.querySelector('#audioFile').value='';
});
