import { fotoBlob } from "./estado.js";

export function criarPayload(nome, idade){
    if(!fotoBlob){
        return null;
    }

    const formData = new FormData();    
        formData.append("foto", fotoBlob, "foto.jpg");
        formData.append("nome", nome);
        formData.append("idade", idade);
        
        return formData;
}