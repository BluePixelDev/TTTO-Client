const siteWrapper = document.getElementById('gradient-background') as HTMLDivElement;

//Name Input - Dialog
const namePopup = document.getElementById('name-popup') as HTMLDivElement;
const nameInput = document.getElementById('name-input') as HTMLInputElement;
const nameInputButton = document.getElementById('name-input-button') as HTMLInputElement;

//Join
const joinInput = document.getElementById('join-input') as HTMLInputElement;
const joinButton = document.getElementById("join-button") as HTMLButtonElement;

let colPos0 = 0;
let colPos1 = 20;
let startTime = Date.now();

nameInputButton.addEventListener('click', () => {
    if(nameInput.value != ""){
        namePopup.style.display = 'none'
        sessionStorage.setItem('username', nameInput.value);
    }
    else{
        nameInput.style.borderColor = 'red';
    }
});

//==== JOINING ====
joinButton.addEventListener('click', () => {
    if(joinInput.value != ""){
        sessionStorage.setItem('join-code', joinInput.value);
        window.location.replace(`${import.meta.env.BASE_URL}/play/join`)
        sessionStorage.setItem('isHosting',"false");
    }
    else{
        joinInput.style.borderColor = 'red';
    }
})

//==== BACKGROUND ANIMATION ====
requestAnimationFrame(animation);
function animation(){
    if(siteWrapper != null){
        siteWrapper.style.background = `linear-gradient(hsl(${colPos0}deg 50% 50%), hsl(${colPos1}deg 50% 50%))`
    }
    var currentTime = Date.now();
    var delta = startTime - currentTime;
    startTime = Date.now(); 
    
    colPos0 += 2 / delta;
    colPos1 += 2 / delta;
 
    requestAnimationFrame(animation);
}