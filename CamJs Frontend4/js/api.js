const URL_BASE = "https://api-cam-js.vercel.app";

export async function postarFoto(formData){
    const response = await fetch(
        `${URL_BASE}/api/postar`,{
            method:"POST",
            body:formData
        }
    );
    return response.json();
};


export async function listarFotos(){
    const response = await fetch(
        `${URL_BASE}/api/listar`
    );
    return response.json();
};

