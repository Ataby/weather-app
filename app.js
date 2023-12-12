const form = document.querySelector("section.top-banner form");
const inputCity = document.querySelector(".container input");
const uyari = document.querySelector(".msg");
const ulListe = document.querySelector(".ajax-section .cities");


localStorage.setItem("tokenKey",
"4x912ZjORv3Lfr22mPR0RSJJIqbNRnks2jxZVG+P0MYvonSVzxaX0gyw6sBHX9G1");
//KEY, ENCRYPTED SEKILDE LOCAL'E KAYIT EDILDI.

form.addEventListener("submit",(page)=>{
    page.preventDefault();
    //FORM OGESININ VARSAYILAN REFRESH OZELLIGINI DURDUR.
    getDataFromApi();
})

const getDataFromApi= async()=>{
    const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));
    // alert(tokenKey);

    const inputValue=inputCity.value;
    const units='metric';
    const lang='tr';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

try {
        
    const response = await axios(url);
    // fetch(url).then((res)=>{
    //     if(!res.ok){ //FALSE MU DEGIL MI KONTROL
    //         throw new Error("something went wrong"); 
    //         // BU SATIRA ISLEM GELIRSE DIREK CATCH KISMINA ATLAR KALAN "THEN"LER IPTAL OLUR
    //     }
    //     return res.json();})
    console.log(response);
    const {main,sys,weather,name}=response.data; 
    //ISTEDIGIMIZ VERI, DATA OBJESININ ALTINDA 

    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    const citySpans = ulListe.querySelectorAll(".city span");
    const citySpansArray = Array.from(citySpans);
    console.log(citySpans);
    if(citySpansArray.length>0){
        const filteredArray= citySpansArray.filter((elem)=>elem.innerText == name)
        if(filteredArray.length>0){
            uyari.innerText =`You got the weather for ${name}, Please search another location.`;
            form.reset();
            setTimeout(()=>{uyari.innerText=""},4000);
            return; // BREAK YAPAR VE AYNI SEHRI EKLEMEYE ENGEL OLUR.
        }
    }
    
    const createLi = document.createElement("li");
    createLi.classList.add("city");
    createLi.innerHTML = 
    `<h2 class="city-name" data-name="${name},${sys.country}">
    <span>${name}</span>
    <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>*C</sup></div>
    <figure> 
    <img class="city-icon" src="${iconUrl}">
    <figcaption>${weather[0].description}</figcaption>
    </figure> `;
    //FIGURE VE FIGCAPTION ICEREN TASARIMLAR, DAHA USTLERDE GOZUKMESI ICIN ARTI PUANDIR.
    
    //ulListe.append(createLi); //APPEND SONA EKLER.
    ulListe.prepend(createLi); //PREPEND BASA EKLER.

    // createLi.addEventListener("click",(item)=>{
    //     if(item.target.tagName=="IMG"){ 
    //         //IKONA TIKLANDIGINDA FARKLI TIP RESIM YAP.
    //         item.target.src = (item.target.src==iconUrl)? iconUrlAWS : iconUrl;
    //     }
    // })

    createLi.addEventListener("click",((item)=>{
        alert(`${item.target.tagName} is clicked.`);
        window.location.href="https://github.com/Ataby?tab=repositories/";
        // item.stopPropagation(); // BUBBLING'IN UST ELEMENTI TETIKLEMESINI DURDURUR.
    }))
} 
catch (error) {
    uyari.innerText =`404 City not found`;
    form.reset();
    setTimeout(()=>{uyari.innerText=""},4000);
}
form.reset();
    
}
