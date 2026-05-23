const form = document.querySelector('form');
form.addEventListener('submit', uploadFiles);
form.uploads.addEventListener('change', selectedFiles);
form.threshold.addEventListener('change',thresholdChange);
const loader = document.getElementById('loader');
const backendUrl = window.MALARIA_APP_CONFIG?.backendUrl || 'http://localhost:5000';
let savedResults = [];

async function uploadFiles(e){
    e.preventDefault();
    if(!form.uploads.files.length)
        return
    loader.classList.add("load-anim");

    try{    
        const formData = new FormData();

        for (let i= 0; i < form.uploads.files.length; i++) {
            formData.append('files',form.uploads.files[i])
        }
        console.log('-- Request body --');
        console.log(formData);
        const response = await fetch(backendUrl, {
            method: 'POST',
            body: formData,
    });

        const data = await response.json();
        const results = data.results;
        savedResults = [...results]; 
        loader.classList.remove("load-anim");
        console.log(`-- Response body --`);
        console.log(results);
        UI.renderUI(results);
      
    }catch(err){
        loader.classList.remove("load-anim");
        console.log(err);
    }
}


function selectedFiles(){
    savedResults = [];

    if (this.files.length){ 
        UI.renderSelectedFiles(this);
    }else{
        UI.clearSelectedFiles();
    }
}

function thresholdChange(e){
    if(savedResults.length)
        UI.renderUI(savedResults);
}


class UI{
    static form = document.querySelector('form');
    static gallery = document.getElementById('gallery');
    static emptyState = document.getElementById('empty-state');

    static hideEmptyState(){
        this.emptyState.classList.add('is-hidden');
    }

    static showEmptyState(){
        this.emptyState.classList.remove('is-hidden');
    }

    static clearSelectedFiles(){
        this.gallery.innerHTML = '';
        this.showEmptyState();
    }

    static renderSelectedFiles(fileForm){
        this.hideEmptyState();
        this.gallery.innerHTML ='';

        for (let i = 0; i < fileForm.files.length; i++){

            const div = document.createElement("div");
            const p = document.createElement('p');
            const figure =  document.createElement("figure");
            const figCaption = document.createElement("figcaption");
            const title = document.createTextNode(fileForm.files[i].name);
            const img = document.createElement("img");

            img.src = URL.createObjectURL(fileForm.files[i]);
            img.onload = function() { URL.revokeObjectURL(this.src); }
            figCaption.appendChild(title)  
            figure.appendChild(figCaption)
            figure.appendChild(img)
            div.appendChild(figure)
            div.appendChild(p)
            this.gallery.appendChild(div)
        }    
    }

    static renderUI(resultsArray){
        this.hideEmptyState();
        const paragraphs = document.querySelectorAll('div#gallery p');
        const images = document.querySelectorAll('div#gallery img');
        
        for (let i = 0; i < paragraphs.length; i++){

            if(resultsArray[i][1]>=parseFloat(UI.form.threshold.value)){
                paragraphs[i].innerHTML =  `Cell is healthy.<br> Probability: <span>${(resultsArray[i][1]*100).toPrecision(7)}%</span>`;
                paragraphs[i].style.color = 'green';
                images[i].style.borderColor = 'green';
                images[i].style.borderStyle = 'solid';
            }else{
                paragraphs[i].innerHTML =  `Cell is infected.<br> Probability: <span>${((1-resultsArray[i][1])*100).toPrecision(7)}%</span>`;
                paragraphs[i].style.color = 'red';
                images[i].style.borderColor = 'red';
                images[i].style.borderStyle = 'solid';
            }    
        }
    }
}
