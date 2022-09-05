/** ცვლადები */
const TOKEN   = "8ce3c41f1d7b74c1179b2503f3e1f6fd"; //! ამას აქ თუ შეცვლით, script_last_page.js-სა და script_employees.js-შიც შეცვალეთ
const schema  = document.getElementById("schema");
const mainBox = document.getElementById("main-box");

/**
 * API-დან მოაქვს ლეპტოპების შესახებ ინფორმაცია და ჰქმნის მათ ლისტს
 */
function fetchLaptops(){
    fetch("https://pcfy.redberryinternship.ge/api/laptops?"+new URLSearchParams({token: TOKEN,}))
    .then((res)=>res.json())
    .then((data)=>{
        for(let i of data.data){
            addNewLaptop(i);
        }
    })
    .catch((err)=>console.log(err));
}

/**
 * ჰქმნის ლეპტოპის მონაცემების მიხედვით სიის ელემენტს
 * @param {json} data მონაცემები
 */
function addNewLaptop(data){
    let newElement = schema.cloneNode(true);
    newElement.classList.remove("disable");

    newElement.id = "";

    newElement.children[0].children[0].src = "https://pcfy.redberryinternship.ge"+data.laptop.image;

    newElement.children[1].children[0].children[0].innerText = data.user.name + " " + data.user.surname;

    newElement.children[1].children[1].children[0].innerText = data.laptop.name;

    newElement.children[1].children[2].children[0].href += "?" + new URLSearchParams({id: data.laptop.id});

    mainBox.appendChild(newElement);
}

fetchLaptops();