let camara_boton = document.querySelector("#iniciar-camara");
let video = document.querySelector("#video");
let clic_boton = document.querySelector("#clic-foto");
let canvas = document.querySelector("#canvas");
let dataurl_container =  document.querySelector("#dataurl-container");
let dataurl = document.querySelector("#dataurl");
let azure_boton = document.querySelector("#clic-azure");
let img_azure = document.querySelector("#imgazure");
let img_azureurl = document.querySelector("#imgazure-url");

camara_boton.addEventListener('click', async function() {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio:false });
    }
    catch (error) {
        alert(error.message);
        return;
    }

    video.srcObject = stream;

    video.style.display = 'block';
    camara_boton.style.display = 'none';
    clic_boton.style.display = 'block';
});

clic_boton.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    dataurl.value = image_data_url;
    dataurl_container.style.display = 'block';
});

azure_boton.addEventListener('click', function() {
    //Convertir a binario
    canvas.toBlob(uploadFile, 'image/jpeg');
});

// funcion async para la operacion de subida
async function uploadFile(blob) {
    // Lo vamos a guardar como JPEG
    let file = null; // Aqui se guarda la imagen en binario
    let fileName = `tuimagendesdeazure${Date.now()}.jpg`;
    // Ruta de la WebAPI creada con anterioridad
    const urlAzure = 'https://webapifotos.azurewebsites.net';
    const urlFotoAzure = urlAzure + '/api/foto/'

    file = new File([blob], fileName, { type: 'image/jpeg'});

    // Se uso el objeto FormData
    // Aqui van los nombres exactamente como los pide el WebAPI
    let data = new FormData();
    data.append('nombre', fileName);
    data.append('archivo', file);

    // Llamada al servicio web con POST
    let response = await fetch(urlFotoAzure, {
        method: 'POST',
        body: data
    });

    if (response.status == 201) {
        const datos = await response.json();  // Obtiene la respuesta del servidor Azure
        img_azure.setAttribute("src", datos.url);  // Obtiene la URL de Azure
        img_azure.setAttribute("width", 320);
        img_azure.setAttribute("height", 240);
        img_azureurl.innerHTML = datos.url;
    } else {
        alert('Ocurrio un error al intentar subir la imagen: ' + response.statusText);
    }
}

