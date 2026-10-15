//Criando a fechar camera
//Criando a função card

const botao = document.getElementById("abrirCamera");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const capturar = document.getElementById("capturar");
const enviar = document.getElementById("enviar");
const galeria = document.getElementById("galeria");
const cancelar = document.getElementById("cancelar");


let fotoBlob = null;
let streamAtual = null;


//-----Abrir Camera----------
botao.addEventListener("click", async () => {

    try {
       streamAtual = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        video.srcObject = streamAtual;
    } catch (erro) {
        alert('Erro ao acessar a camera SIX-SEVEN');
        console.log("Erro ao acessar a câmera", erro);
    }
});

//----Fechar Camera------
cancelar.addEventListener("click", ()=>{
resetarCaptura();
});

//-----Capturar Imagem----------
capturar.addEventListener("click", () => {

    const contexto = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    contexto.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {

        fotoBlob = blob;

        console.log("Foto capturada:");
        console.log(blob);

    }, "image/jpeg", 0.9);

});

//---Criar CARD-------
function criarCard(foto){
    const card = document.createElement('div');
    const nome = document.createElement('h3');
    const img = document.createElement('img');

    nome.textContent = foto.nome;
    img.src = foto.foto.url;
    img.width = 200;

    card.appendChild(nome);
    card.appendChild(img);

    return card;
};

function resetarCaptura(){
    //limpa o blob
    fotoBlob=null;

    //limpa o canva
    const contexto = canvas.getContext("2d");
    contexto.clearRect(0,0, canvas.width, canvas.height);

    canvas.width = 0;
    canvas.height=0;

    //fecha o stream atual
    if(streamAtual){
        streamAtual.getTracks().forEach(track =>{
            track.stop();
        });
        streamAtual = null;
    }
    //remove video
    video.srcObject = null;
}

//----Postar foto------------

enviar.addEventListener("click", async () => {

    if (!fotoBlob) {
        console.log("Nenhuma foto foi capturada.");
        return;
    }

    const formData = new FormData();

    formData.append("foto", fotoBlob, "foto.jpg");
    formData.append("nome", "João SIX-SEVEN");
    formData.append("idade", 15);

    try {

        const response = await fetch("http://localhost:5000/api/postar", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        const novoCard = criarCard(data);
        galeria.insertBefore(novoCard, galeria.firstChild);
        resetarCaptura();
        
        console.log("Resposta do Servidor", data);
        alert('SIX-SEVEN Jão!');

    } catch (error) {
        console.error("Erro ao enviar para API:", error);
        alert('SIX-SEVEN com problemas!')

    }

});



//---------------Listar Fotos
async function carregarFotos() {
    try {
        const response = await fetch("http://localhost:5000/api/listar");
        const fotos = await response.json();
        console.log(fotos);

        fotos.forEach((foto)=>{
            const card = criarCard(foto);
            galeria.appendChild(card);
        });

    } catch (error) {
        alert('Erro ao carregar fotos SIX-SEVEN');
        console.error(error);
    }
};

carregarFotos();



//-----------------------------Preparando PAYLOAD Versão 01------------------------
// enviar.addEventListener("click", () => {

//     if (!fotoBlob) {
//         console.log("Nenhuma foto foi capturada.");
//         return;
//     }

//     const formData = new FormData();

//     formData.append("foto", fotoBlob, "foto.jpg");
//     formData.append("nome", "João");
//     formData.append("idade", 30);

//     console.log("Payload preparado:");

//     for (let [chave, valor] of formData.entries()) {
//         console.log(chave, valor);
//     }

// });

//-----------------------Versão 01 POST----------------------------------
//  try {

//         const response = await fetch("http://localhost:5000/api/fotos", {
//             method: "POST",
//             body: formData
//         });

//         const data = await response.json();
//         resultado.innerHTML = 
//         `
//         <h3>${data.nome}</h3>
//         <img 
//             src="${data.foto.url}"
//             width="300"
//         >`;
        
//         console.log("Resposta do Servidor", data);
//         alert('SIX-SEVEN Jão!');

//     } catch (error) {
//         console.error("Erro ao enviar para API:", error);
//         alert('SIX-SEVEN com problemas!')

//     }

// });