var m=Object.defineProperty;var b=(e,t,n)=>t in e?m(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var d=(e,t,n)=>(b(e,typeof t!="symbol"?t+"":t,n),n);import"./style--L3J-Kav.js";const L=8080,R="localhost",w=new WebSocket(`ws://${R}:${L}`),s=document.getElementById("game-canvas"),l=20,f=2,g=5;let a=[];class S{constructor(t,n){d(this,"x");d(this,"y");this.x=t,this.y=n}}class v{constructor(t,n){d(this,"index");d(this,"state");d(this,"player_id");this.index=t,this.state=n,this.player_id=""}}s.addEventListener("click",F);s.addEventListener("contextmenu",e=>e.preventDefault());w.addEventListener("open",()=>{console.log("Connected!"),w.send("Hello!")});w.addEventListener("game-join",e=>{console.log(e)});E();function E(){for(let e=0;e<l;e++){a[e]=[];for(let t=0;t<l;t++){let n=new S(e,t);a[e][t]=new v(n,0)}}}requestAnimationFrame(p);function p(){I(),requestAnimationFrame(p)}function I(){const e=s.getContext("2d"),t=s.offsetWidth;s.style.width=`${t}px`,s.style.height=`${t}px`;const n=window.devicePixelRatio;s.width=Math.floor(t*n),s.height=Math.floor(t*n),e!=null&&(e.scale(n,n),e.clearRect(0,0,s.width,s.height),$(e),M(e))}function M(e){const t=(s.width-l*f-f)/l,n=(s.height-l*f-f)/l;for(let o=0;o<l;o++)for(let i=0;i<l;i++){let c=a[o][i];z(e,c,t,n)}}function $(e){e.fillStyle="black",e.fillRect(0,0,s.width,s.height)}function z(e,t,n,o){let i=(n+f)*t.index.x+f,c=(o+f)*t.index.y+f;switch(t.state){case 1:k(e,i,c,n,o),B(e,i,c,n,o);break;case 2:D(e,i,c,n,o);break;case 0:k(e,i,c,n,o);break}}function B(e,t,n,o,i){e.fillStyle="red",e.fillRect(t,n,o,i)}function D(e,t,n,o,i){e.fillStyle="green",e.fillRect(t,n,o,i)}function k(e,t,n,o,i){e.fillStyle="white",e.fillRect(t,n,i,o)}function F(e){const t=s.getBoundingClientRect(),n=e.clientX-t.left,o=e.clientY-t.top;X(n,o),Y()}function X(e,t){const n=s.width/l,o=Math.floor(e/n),i=Math.floor(t/n);a[o][i].state==0?a[o][i].state=1:(a[o][i].state==2&&(a[o][i].state=0),a[o][i].state==1&&(a[o][i].state=2))}function Y(){for(let e=0;e<l;e++)for(let t=0;t<l;t++){const n=a[e][t];_(n)&&console.log("Someone scored! "+n.state)}}function _(e){if(e.state==0)return!1;let t=r(0,-1,e),n=r(-1,-1,e),o=r(1,-1,e),i=t||n||o,c=r(-1,0,e),u=r(-1,0,e),h=c||u,y=r(0,1,e),C=r(-1,1,e),x=r(1,1,e);return i||h||(y||C||x)}function r(e,t,n){let o=0;for(let i=0;i<g;i++){let c=n.index.x+e*i,u=n.index.y+t*i;if(c>=l||c<0||u>=l||u<0)break;let h=a[c][u];if(h.state!=0&&h.state==n.state){o++;continue}o=0}return o>=g}