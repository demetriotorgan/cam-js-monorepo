export function criarCard(foto){
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