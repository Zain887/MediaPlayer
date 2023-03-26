function wrraper() {
    let sliceWrraper1 = document.getElementById('sliceWrraper1');
    sliceWrraper1.style.top = '-1vw';
    sliceWrraper1.style.left = '0.5vw';
    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper2() {
    let sliceWrraper1 = document.getElementById('sliceWrraper2');
    sliceWrraper1.style.top = '-0.4vw';
    sliceWrraper1.style.left = '1vw';

    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper3() {
    let sliceWrraper1 = document.getElementById('sliceWrraper3');
    sliceWrraper1.style.top = '0.5vw';
    sliceWrraper1.style.left = '1vw';

    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper4() {
    let sliceWrraper1 = document.getElementById('sliceWrraper4');
    sliceWrraper1.style.top = '1vw';
    sliceWrraper1.style.left = '0vw';
    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper5() {
    let sliceWrraper1 = document.getElementById('sliceWrraper5');
    sliceWrraper1.style.top = '0.5vw';
    sliceWrraper1.style.left = '-1vw';
    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper6() {
    let sliceWrraper1 = document.getElementById('sliceWrraper6');
    sliceWrraper1.style.top = '-0.4vw';
    sliceWrraper1.style.left = '-1vw';
    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}
function wrraper7() {
    let sliceWrraper1 = document.getElementById('sliceWrraper7');
    sliceWrraper1.style.top = '-1vw';
    sliceWrraper1.style.left = '-0.5vw';
    setTimeout(() => {
        sliceWrraper1.style.top = '0vw';
        sliceWrraper1.style.left = '0vw';
    }, 500);
}

function onStartUp() {
    setTimeout(wrraper, 500);
    setTimeout(wrraper2, 1000);
    setTimeout(wrraper3, 1500);
    setTimeout(wrraper4, 2000);
    setTimeout(wrraper5, 2500);
    setTimeout(wrraper6, 3000);
    setTimeout(wrraper7, 3500);
}

// function onload(){
//     setInterval(onStartUp, 1000);
// }
