/** ცვლადები */
const TOKEN   = "8ce3c41f1d7b74c1179b2503f3e1f6fd"; 
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


/**
 * API-დან მოაქვს მთლიანი ინფორმაცია ლეპტოპის შესახებ და ავსებს ამ ინფორმაციით გვერდს
 */
function fetchLaptopInfo(){
    fetch("https://pcfy.redberryinternship.ge/api/laptop/"+params.id + "?" + new URLSearchParams({token: TOKEN}))
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data.data);
        changeInfo(data.data);
    })
    .catch((err)=>console.log(err));
}

/**
 * ავსებს გვერდს მოცემული მონაცემების მიხედვით
 * @param {json} data მონაცემები
 */
function changeInfo(data){
    document.getElementById("name").innerText            = data.user.name + " " + data.user.surname;
    document.getElementById("mail").innerText            = data.user.email;
    document.getElementById("number").innerText          = data.user.phone_number;
    document.getElementById("lap-name").innerText        = data.laptop.name;
    document.getElementById("img").src                   = "https://pcfy.redberryinternship.ge" + data.laptop.image;
    document.getElementById("cpu").innerText             = data.laptop.cpu.name;
    document.getElementById("cpu-core").innerText        = data.laptop.cpu.cores;
    document.getElementById("cpu-thread").innerText      = data.laptop.cpu.threads;
    document.getElementById("lap-ram").innerText         = data.laptop.ram;
    document.getElementById("lap-price").innerText       = data.laptop.price;
    document.getElementById("lap-memory-type").innerText = data.laptop.hard_drive_type;
    document.getElementById("lap-state").innerText       = data.laptop.state;
    document.getElementById("lap-date").innerText        = data.laptop.purchase_date;
    
    
    let team_id      = data.user.team_id;
    let position_id  = data.user.position_id;
    let brand_id     = data.laptop.brand_id;

    setValue(team_id, "team", "https://pcfy.redberryinternship.ge/api/teams");
    setValue(position_id, "poss", "https://pcfy.redberryinternship.ge/api/positions");
    setValue(brand_id, "lap-brand", "https://pcfy.redberryinternship.ge/api/brands");
}

/**
 * 
 * @param {*} _id მოცემული დროფდაუნ მენიუს აიდი
 * @param {*} id  HTML-ის id
 * @param {*} url მისამართი
 */
function setValue(_id, id, url){
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        for(let i of data.data){
            if(i.id === _id){
                document.getElementById(id).innerText = i.name;
            }
        }
    })
    .catch((err) => console.log(err));
}

fetchLaptopInfo();