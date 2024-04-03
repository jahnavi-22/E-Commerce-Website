const startBtn = document.querySelector("#startbutton")
const stopBtn = document.querySelector("#stopbutton")

let timeSpent = 0
let timer = null
let time = document.querySelector("#stopwatch")


startBtn.addEventListener('click', function(){
    if(timer){
        clearInterval(timer);
    }

    timer = setInterval(function(){
     timeSpent += 1;
     time.textContent = timeSpent;
    }, 1000);
})

// stopBtn.addEventListener('click', function(){
//     if(timer){
//         clearInterval(timer);
//     }
// }