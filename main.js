const apiKey = "live_AnXUfN46yefwCpSb94ScYLdsAVjC23MIJtqkJsoCA9KA5Ta2Msot2SLcURsNjNaq";

const api = axios.create({
    baseURL:'https://api.thecatapi.com/v1',
});

api.defaults.headers.common['X-API-KEY'] = apiKey;


const API_randoms = `https://api.thecatapi.com/v1/images/search?limit=2`;
const API_favorites = `https://api.thecatapi.com/v1/favourites?`;
const API_favorites_delete = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_upload = `https://api.thecatapi.com/v1/images/upload`;

const spanError = document.getElementById('error');

/*async function fechData(urlApi){

    try{
        const res = await fetch(urlApi)
        const data = await res.json();

        return data;
    }catch (error){
        spanError.innerHTML = "Hubo un error" + res.status;
    }
    
}*/


async function loadRandomMichis(){

    //const data = await fechData(API_randoms);
    
    const res = await fetch(API_randoms)
    const data = await res.json();

    console.log("Random");
    console.log(data);

    if(res.status !== 200){
        spanError.innerText = "Hubo un error: " + res.status;
    }else{
        const img1 = document.getElementById('image1');
        const img2 = document.getElementById('image2');
        const btn1 = document.getElementById('btnAddFavorites1');
        const btn2 = document.getElementById('btnAddFavorites2');

        img1.src = data[0].url;  
        img2.src = data[1].url;

        btn1.onclick = () => saveMichiFavorities(data[0].id);
        btn2.onclick = () => saveMichiFavorities(data[1].id);
    }

}

async function loadFavoritesMichis(){

    //const data = await fechData(API_favorites);
    
    const res = await fetch(API_favorites,{
        method:'GET',
        headers: {
            'X-API-KEY':apiKey
        }
    });


    if(res.status !== 200){
        spanError.innerText = "Hubo un error: " + res.status;
    }else{
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        const data = await res.json();

        data.forEach(michi =>{

            
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Eliminar de favoritos');

            btn.onclick = () => deleteMichiFavorite(michi.id);
            btn.appendChild(btnText);
            img.src = michi.image.url;
            img.width = 150;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);


        });

        console.log("Favorites");
        console.log(data);
    }

}

async function saveMichiFavorities(id){ 

    /*const res = await fetch(API_favorites, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY':apiKey
        },
        body: JSON.stringify({ 
            "image_id": id,
        })

    })*/

    const {data, status} = await api.post('/favourites',{
        image_id: id
    });

    if(status !== 200){
        spanError.innerText = "Hubo un error: " + status;
    }else{
        loadFavoritesMichis();
    }

}

async function deleteMichiFavorite(id){

    const res = await fetch(API_favorites_delete(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY':apiKey
        }
    });

    if(res.status !== 200){
        spanError.innerText = "Hubo un error: " + res.status;
    }else{
        loadFavoritesMichis();
    }

}

async function uploadMichiImage(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    const res = await fetch(API_upload, {
        method: 'POST',
        headers: {
            'X-API-KEY':apiKey,
            'Content-Type':'multipart/form-data'
        },
        body: formData
    });

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${res.message}`
    }
    else {
        data = res.json();

        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveMichiFavorities(data.id) //para agregar el michi cargado a favoritos.
    }
}

loadRandomMichis();
loadFavoritesMichis();