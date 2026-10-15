import { video, canvas } from "./dom.js";
import { streamAtual, setStreamAtual, setFotoBlob } from "./estado.js";

//Abrir Camera
export async function abrirCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        setStreamAtual(stream);
        video.srcObject = stream;
    } catch (erro) {
        alert('Erro ao acessar a camera SIX-SEVEN');
        console.log("Erro ao acessar a câmera", erro);
    }
};

//Capturar Foto
export function capturarFoto() {
    const contexto = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    contexto.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {

        setFotoBlob(blob);

        console.log("Foto capturada:");
        console.log(blob);

    }, "image/jpeg", 0.9);
};

//Resetar Camera
export function resetarCamera(){
    //limpa o blob
        setFotoBlob(null);
    
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
            setStreamAtual(null);
        }
        //remove video
        video.srcObject = null;
};