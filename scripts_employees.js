 /** საჭირო ცვლადები */
const boxError  = "error-box-color";
const textError = "error-text-color";
const TOKEN     = "0e5e6a87f991bb29ca8a9b2a4129247a";


/** ეს ორი ფუნქცია ავსებს dropdown მენიუს option-ებს */
if(document.getElementById("dropdown-one"))
    createDropdown(document.getElementById("dropdown-one"), "https://pcfy.redberryinternship.ge/api/teams");
if(document.getElementById("dropdown-two"))
    createDropdown(document.getElementById("dropdown-two"), "https://pcfy.redberryinternship.ge/api/positions");


/**
 * @param {String} str ეს ტექსტია რაც გადაეცემა
 * @returns {Boolean}  აბრუნებს true-ს, თუ მხოლოდ და მხოლოდ ქართულ ასოებს შეიცავს, წინააღმდეგ შემთხვევაში false-ს
 */
function onlyGeo(str) {
    for(let i = 0; i<str.length; i++){
        if(!(str.charCodeAt(i) >= "ა".charCodeAt(0) && str.charCodeAt(i) <= "ჰ".charCodeAt(0))) return false;
    }
    return true;
}

/**
 * ეს არის მთავარი ვალიდატორი, რომელიც ეშვება ფორმის დასაბმითებისას
 * @returns {Boolean} აბრუნებს true-ს, თუ ყველა ვალიდაციას გაივლის, წინააღმდეგ შემთხვევაში false-ს
 */
function validator(){
    //* აქ თუ ყველას პირდაპირ დავა-return-ებდი, მაშინ ფერებს არ შეცვლიდა ყველასას ("და კავშირის მერე აღარ წაიკითხავდა")
    let name     = nameValidator();
    let mail     = mailValidator();
    let team     = dropdownValidator(document.getElementById("dropdown-one"));
    let position = dropdownValidator(document.getElementById("dropdown-two"));
    let mobile   = inputMobileNumber();

    return name && mail && team && position && mobile;
}

/**
 * უმატებს გადმოცემულ თაგს კონკრეტულ ერორის კლასს(და შესაბამისად სტილს)
 * @param {Element} htmlTag ეს არის HTML-ის Tag
 * @param {Boolean} isError ეს თუ True არის, მაშინ ერორია, წინააღმდეგ შემთხვევაში არა
 */
function changeTagStyle(htmlTag, isError = true){
    // ერორის წაშლა
    if((htmlTag.classList.contains(boxError) || htmlTag.classList.contains(textError)) && !isError){
        if(htmlTag.tagName === "INPUT" || htmlTag.tagName === "DIV"){
            htmlTag.classList.remove(boxError);
        } else {
            htmlTag.classList.remove(textError);
        }
    }
    // ერორის დამატება
    if(!(htmlTag.classList.contains(boxError) || htmlTag.classList.contains(textError)) && isError){
        if(htmlTag.tagName === "INPUT" || htmlTag.tagName === "DIV"){
            htmlTag.classList.add(boxError);
        } else {
            htmlTag.classList.add(textError);
        }
    }
}

/**
 * გადაუყვება ყველა შვილობილ კლასს და გადასცემს მოცემულ კლასს(და შესაბამისად სტილს)
 * @param {Element} parentTag მშობელი HTML-ის Tag-ი
 * @param {Boolean} isError ეს თუ True არის, მაშინ ერორია, წინააღმდეგ შემთხვევაში არა
 */
function changeErrorStyle(parentTag, isError = true){
    for(let i of parentTag.children){
        changeTagStyle(i, isError);
    }
}

/**
 * @returns {Boolean} თუ სახელი შეიცავს 1-ზე მეტ ასოს და მხოლოდ ქართული character-ებია, მაშინ აბრუნებს true-ს,
 * წინააღმდეგ შემთხვევაში false-ს
 */
function nameValidator(){
    let firstname = document.getElementById("username");
    let lastname  = document.getElementById("lastname");

    // ცვლის სტილს ერორის მიხედვით
    if (firstname.value.length < 2 || !onlyGeo(firstname.value))
        changeErrorStyle(firstname.parentNode);
    else
        changeErrorStyle(firstname.parentNode, false);

    if(lastname.value.length < 2 || !onlyGeo(lastname.value))
        changeErrorStyle(lastname.parentNode);
    else 
        changeErrorStyle(lastname.parentNode, false);

    if (firstname.value.length < 2 || lastname.value.length < 2 || !onlyGeo(firstname.value) || !onlyGeo(lastname.value))
        return false;

    return true;
}

/**
 * @returns {Boolean} თუ მეილი მთავრდება "@redberry.ge"-ით, მაშინ აბრუნებს true-ს, წინააღმდეგ შემთხვევაში false-ს
 */
function mailValidator(){
    let mailTag  = document.getElementById("mail");
    let mail     = mailTag.value.toLowerCase().trim();
    let lastPart = "@redberry.ge";

    if (mail.length > lastPart.length && lastPart === mail.substring(mail.length-lastPart.length)){
        changeErrorStyle(mailTag.parentNode, false);
        return true;
    }

    changeErrorStyle(mailTag.parentNode);
    return false;
}

/**
 * 
 * @param {Element} htmlTag select თაგის მქონე HTML-ის ელემენტი
 * @returns {Boolean} აბრუნებს false-ს თუ htmlTag-ის პირველი შვილია არჩეული (ანუ მომხმარებელს არაფერი აურჩევია), 
 * დანარჩენ შემთხვევაში კი true-ს
 */
function dropdownValidator(htmlTag){
    let position = htmlTag.value;

    if(position == htmlTag.children[0].value){
        changeTagStyle(htmlTag.parentNode);
        return false;
    }

    changeTagStyle(htmlTag.parentNode, false);
    return true;
}

/**
 * @returns {Boolean} თუ ნომერი იწყება +995-ით და არის 13 ციფრა, მაშინ აბრუნებს true-ს, თუარადა false-ს
 */
function inputMobileNumber(){
    let mobileTag = document.getElementById("mobile-number");
    let mobileNumber = mobileTag.value;
    let geoNum = "+995";

    if(mobileNumber.length == 13 && geoNum === mobileNumber.substring(0, geoNum.length)){
        changeErrorStyle(mobileTag.parentNode, false);
        return true;
    }

    changeErrorStyle(mobileTag.parentNode);
    return false;
}

/**
 * ამ ფუნქციას მოაქვს GET request-ით მონაცემები და ჰქმნის option თაგის მქონე HTML-ის ელემნტებს htmlTag-ის შვილად
 * @param {*} htmlTag select თაგის მქონე HTML-ის ელემენტი
 * @param {*} dataURL API-ს მისამართი საიდანაც მოაქვს ინფორმაცია
 */
function createDropdown(htmlTag, dataURL){
    fetch(dataURL)
    .then((response) => response.json())
    .then((data) => {
        for(let i of data.data){
            let opt = document.createElement("option");
            opt.value = i.id;
            opt.innerText = i.name;
            htmlTag.appendChild(opt);
        }
        setValue(htmlTag);
    })
    .catch((error)=>{console.log(error)});

}


/**
 * ინახავს ინფორმაციას და-refresh-ებისთვის (რომ არ წაიშალოს მონაცემები)
 * @param {*} e input-ის თაგის HTML-ის ელემენტი
 */
function saveValue(e){
    if(e.type === "radio") localStorage.setItem(e.name, e.id);
    else localStorage.setItem(e.id, e.value);
}

/**
 *  აყენებს შენახულ მნიშვნელობას htmlTag-ისთვის
 *! radio და file ტიპებისთვის ეს არ იმუშავებს
 * @param {*} htmlTag input-ის თაგის HTML-ის ელემენტი
 */
function setValue(htmlTag){
    if(localStorage.getItem(htmlTag.id))
        htmlTag.value = localStorage.getItem(htmlTag.id);
}

/**
 * HTML-ის input-ის რადიო ტიპებისთვის აყენებს ბოლოს შენახულ მდგომარეობას
 * @param {*} name რადიო ტიპების სახელი (name)
 */
function setRadioValue(name){
    if(localStorage.getItem(name))
        document.getElementById(localStorage.getItem(name)).checked = true;
}

/**
 * ეს ფუნქცია ყველა input-სთვის (სურათის გარდა) აყენებს ბოლოს შენახულ ინფოს
 */
function setAllInputValues(){
    let inputs = document.getElementsByTagName("input");
    for(let i of inputs){
        if(i.type !== "file"){
            if(i.type === "radio") setRadioValue(i.name);
            else setValue(i);
        }
    }
}

setAllInputValues();