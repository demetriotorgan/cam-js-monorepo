import { galeria } from "./dom.js";
import { listarFotos } from "./api.js";
import { criarCard } from "./card.js";

//adicionar um foto no topo
export function adicionarFotoGaleria(foto){
    const card = criarCard(foto);
        galeria.insertBefore(
            card,
            galeria.firstChild
        );
};

//carregar fotos
export async function carregarGaleria(){
     try {
        
        const fotos = await listarFotos();

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