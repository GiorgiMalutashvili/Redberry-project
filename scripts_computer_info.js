/** ცვლადები */
const specialChars = new Set(["!", "@", "#", "$", "%", "^", "&", "*", "(" , ")" ,"_" , "+", "="]);
const minWidth = 1075; //! თუ CSS-ში დააპირებთ @Media-ში min-width-ის შეცვლას, აქაც უნდა შეიცვალოს ეს რიცხვი
let image = "";

/** ეს ორი ფუნქცია ავსებს dropdown მენიუს option-ებს */
createDropdown(document.getElementById("dropdown-laptop"), "https://pcfy.redberryinternship.ge/api/brands");
createDropdown(document.getElementById("dropdown"), "https://pcfy.redberryinternship.ge/api/cpus");

/**
 * ეს ფუნქცია ამატებს ღილაკის ფუნქციას ტელეფონის ვერსიისთვის
 */
function mobileImgSelector(){
    if(window.innerWidth < minWidth){
        document.getElementById('img-upload').click();
    }
}

/**
 * ეს ფუნქცია ცვლის საიტის დიზაინს, როდესაც მომხმარებელი სურათს აირჩევს
 */
function imgPreview(){
    let inputTag = document.getElementById("img-upload");
    let imgInfoTag = document.getElementById("img-info");
    let imgInfoTextTag = document.getElementById("img-info-text");
    let imgInfoSizeTag = document.getElementById("img-info-size");
    let imgtInput  = document.getElementById("img-input");
    let imgPrev    = document.getElementById("prev");

    if(inputTag.files.length > 0){
        image = inputTag.files[0];
        if(imgInfoTag.classList.contains("disable")){
            imgInfoTag.classList.remove("disable");
            imgPrev.parentNode.classList.add("disable-border");
        }
        if(imgPrev.classList.contains("disable"))
            imgPrev.classList.remove("disable");
      
        if(!imgtInput.classList.contains("disable")){
            imgtInput.classList.add("disable");
        }
        imgInfoTextTag.innerText = inputTag.files[0].name + ",";
        imgInfoSizeTag.innerText = Math.round(inputTag.files[0].size/1000000) + "mb";
        imgPrev.src = window.URL.createObjectURL(inputTag.files[0]);
    } else {
        if(!imgInfoTag.classList.contains("disable")){
            imgInfoTag.classList.add("disable");
            imgPrev.parentNode.classList.remove("disable-border");
        }
        if(!imgPrev.classList.contains("disable")){
            imgPrev.classList.add("disable");
        }
        
        if(imgtInput.classList.contains("disable")){
            imgtInput.classList.remove("disable");
        }
        imgPrev.src = "";
    } 
}

/**
 * გზავნის კონკრეტულ მისამართზე მონაცემებს
 * @param {FormData} data მონაცემები, რომლებსაც ვგზავნით
 * @param {String} url API-ის მისამართი
 * @returns {application/json} აბრუნებს პასუხს
 */
async function sendData(data, url){
    const response = fetch(url, 
    {
        method: 'POST',
        body: data,
    });
    const content = (await response).json();
    
    return content;
}

/**
 * ეს არის მეორე გვერდის (computer-info) ვალიდაციები
 * @returns {Boolean} თუ გაიარა ვალიდაციები აბრუნებს true-ს, თუარადა false-ს
 */
function secondValidator(){
    let dropdownLaptop = dropdownValidator(document.getElementById("dropdown-laptop"));
    let dropdown       = dropdownValidator(document.getElementById("dropdown"));
    let laptopNameVal  = laptopNameValidator();
    let memoryTypes    = radioValidator("radio-checkbox-type", "memory-type-error");
    let stateTypes     = radioValidator("radio-checkbox", "state-type-error");
    let dateVal        = dateValidator();
    let cpuCoreVal     = numInputValidator(document.getElementById("laptop-cpu-core"));
    let cpuThreadVal   = numInputValidator(document.getElementById("laptop-cpu-thread"));
    let ramVal         = numInputValidator(document.getElementById("laptop-ram"));
    let priceVal       = numInputValidator(document.getElementById("laptop-price"));
    let imgValidator   = imageValidator();
    let result = dropdownLaptop && dropdown && laptopNameVal && memoryTypes && stateTypes && dateVal && cpuCoreVal && cpuThreadVal && ramVal && priceVal && imgValidator;

    // თუ გაივლის ვალიდაციას, ინფორმაციას გავგზავნით სერვერზე
    if(result){
        let formData = createFormData();
        sendData(formData, "https://pcfy.redberryinternship.ge/api/laptop/create").then((res) => console.log(res));
        return true;
    }
    
    return false;
}

/**
 * ეს ამოწმებს ლეპტოპის სახელს
 * @returns {Boolean} თუ სახელი შეიცავს ციფრებს ან ლათინურ ასოებს ან ზემოთ შენახულ character-ებს, აბრუნებს true-ს, თუარადა false-ს
 */
function laptopNameValidator(){
    let inputTag = document.getElementById("laptop_name");
    let name = inputTag.value.toLowerCase().trim();
    if(name.length === 0) {
        changeErrorStyle(inputTag.parentNode);
        return false;
    }
    
    for(let i = 0; i<name.length; i++){
        let isLatin   = name.charCodeAt(i) >= "a".charCodeAt(0) && name.charCodeAt(i) <= "z".charCodeAt(0);
        let isNumeric = name.charCodeAt(i) >= "0".charCodeAt(0) && name.charCodeAt(i) <= "9".charCodeAt(0);
        let isSpecial = specialChars.has(name[i]);
        if(!(isLatin || isNumeric || isSpecial)){
            changeErrorStyle(inputTag.parentNode);
            return false;
        }
    }
    changeErrorStyle(inputTag.parentNode, false);
    return true;
}

/**
 * @param {Element} checkboxes ეს არის HTML-ის ელემენტების სიმრავლე
 * @returns {Boolean} ეს ფუნქცია გადაუყვება checkboxes-ის და თუ რომელიმე მონიშნულია აბრუნებს true-ს, წინააღმდეგ შემთხვევაში false-ს
 */
function checkingRadio(checkboxes){
    for(let i of checkboxes){
        if(i.checked === true) return true;
    }
    return false;
}

/**
 * 
 * @param {String} radioName ეს არის radio ღილაკების საერთო სახელი
 * @param {String} errorName ეს არის error კლასის სახელი (ეს ვიზუალი მიეცემა თუ არცერთი არ იქნა მონიშნული)
 * @returns {Boolean} აბრუნებს true-ს თუ რომელიმე მაინცაა არჩეული, წინააღმდეგ შემთხვევაში false-ს
 */
function radioValidator(radioName, errorName){
    let radio = document.getElementsByName(radioName);
    let error = document.getElementById(errorName);

    if(!checkingRadio(radio)) {
        changeTagStyle(radio[0].parentNode.parentNode.children[0]);
        if(error.classList.contains("disable")){
            error.classList.remove("disable");
        }
        return false;
    }

    if(!error.classList.contains("disable")){
        error.classList.add("disable");
    }

    changeTagStyle(radio[0].parentNode.parentNode.children[0], false);
    return true;
}

/**
 * ამოწმებს თარიღის ვალიდაციას
 * @returns {Boolean} თუ გაიარა ვალიდაციები აბრუნებს true-ს, თუარადა false-ს
 */
function dateValidator() {
    let date     = document.getElementById("laptop-sale");
    let dateRgex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    
    if(date.value.trim() === "") return true;

    if(!dateRgex.test(date.value)){
        changeErrorStyle(date.parentNode);
        return false;
    } 
    changeErrorStyle(date.parentNode, false);
    return true;
}

/**
 * @param {Element} htmlTag ეს არის HTML-ის ელემენტი, ამ შემთხვევაში input თაგისა და numbet type-ის მქონე
 * @returns {Boolean} თუ რამე წერია მასში, აბრუნებს true-ს, წინააღმდეგ შემთხვევაში false-ს
 */
function numInputValidator(htmlTag){
    if(htmlTag.value.trim() === ""){
        changeErrorStyle(htmlTag.parentNode);
        return false;
    }
    changeErrorStyle(htmlTag.parentNode, false);
    return true;
}

/**
 * @returns {Boolean} თუ რამე ფოტო აირჩია მომხმარებელმა აბრუნებს true-ს, თუარადა false-ს
 */
function imageValidator(){
    let img     = document.getElementById("img-upload");
    let imgBox  = document.getElementById("photo-box");
    let textOne = document.getElementById("photo-text");
    let textTwo = document.getElementById("photo-text-two");
    let imgErr  = document.getElementById("img-problem");

    if(img.files.length === 0){
        changeTagStyle(textOne);
        changeTagStyle(textTwo);
        if(!imgBox.classList.contains("error-image")){
            imgBox.classList.add("error-image");
            imgErr.classList.remove("disable");
        }
        return false
    } 

    changeTagStyle(textOne, false);
    changeTagStyle(textTwo, false);
    if(imgBox.classList.contains("error-image")){
        imgBox.classList.remove("error-image");
        imgErr.classList.add("disable");
    }
    return true;
}

/**
 *! ამ ფუნქციის გამოყენებამდე აუცილებელია ვალიდაციები დაკმაყოფილებული იყოს
 * @returns {FormData} აბრუნებს ამ ტიპის მქონე ცვლადს, რომელიც მზადაა უკვე დასაასბმითებლად
 */
function createFormData(){
    let formData = new FormData();
    formData.append("name", localStorage.getItem("username"));
    formData.append("surname", localStorage.getItem("lastname"));
    formData.append("team_id", localStorage.getItem("dropdown-one"));
    formData.append("position_id", localStorage.getItem("dropdown-two"));
    formData.append("phone_number", localStorage.getItem("mobile-number"));
    formData.append("email", localStorage.getItem("mail"));
    formData.append("phone_number", localStorage.getItem("mobile-number"));
    formData.append("token", TOKEN);
    formData.append("laptop_name", localStorage.getItem("laptop_name"));
    formData.append("laptop_image", image);
    formData.append("laptop_brand_id", localStorage.getItem("dropdown-laptop"));
    formData.append("laptop_cpu", document.getElementById("dropdown").children[localStorage.getItem("dropdown")].innerText);
    formData.append("laptop_cpu_cores", localStorage.getItem("laptop-cpu-core"));
    formData.append("laptop_cpu_threads", localStorage.getItem("laptop-cpu-thread"));
    formData.append("laptop_ram", localStorage.getItem("laptop-ram"));
    formData.append("laptop_hard_drive_type", document.getElementById(localStorage.getItem("radio-checkbox-type")).parentNode.children[1].innerText);
    formData.append("laptop_state", localStorage.getItem("radio-checkbox"));
    formData.append("laptop_price", localStorage.getItem("laptop-price"));
    if(localStorage.getItem("laptop-sale").trim() !== "")
        formData.append("laptop_purchase_date", localStorage.getItem("laptop-sale"));
    return formData;
}
