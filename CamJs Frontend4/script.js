import {botao, video, canvas, capturar, enviar, cancelar, galeria} from './js/dom.js';
import {fotoBlob, streamAtual, setFotoBlob, setStreamAtual} from './js/estado.js';
import { abrirCamera, capturarFoto, resetarCamera } from './js/camera.js';
import { postarFoto, listarFotos } from './js/api.js';
import { criarCard } from './js/card.js';
import { adicionarFotoGaleria, carregarGaleria } from './js/galeria.js';
import { criarPayload } from './js/payload.js';

//-----Abrir Camera----------
botao.addEventListener("click", abrirCamera);

//----Fechar Camera------
cancelar.addEventListener("click", resetarCamera);

//-----Capturar Imagem----------
capturar.addEventListener("click", capturarFoto);


//----Postar foto------------
enviar.addEventListener("click", async () => {
    const formData = criarPayload("João SIX-SEVEN", 15);

    if(!formData){
        alert('Nenhuma foto capturada');
        return;
    }

    try {
        const data = await postarFoto(formData);

        adicionarFotoGaleria(data);
        
        resetarCamera();
        
        console.log("Resposta do Servidor", data);
        alert('SIX-SEVEN Jão!');

    } catch (error) {
        console.error("Erro ao enviar para API:", error);
        alert('SIX-SEVEN com problemas!')

    }

});

//----Carregar Fotos
carregarGaleria();


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