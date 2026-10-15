// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CamJS } from './CamJS.js';

describe('CamJS - Testes da Biblioteca Core', () => {
    let videoMock;
    let trackMock;

    beforeEach(() => {
        // Limpa e recria elementos virtuais simulados pelo JSDOM antes de cada caso de teste
        videoMock = document.createElement('video');
        
        // Forma correta e segura de injetar propriedades Read-Only no ecossistema DOM virtual
        Object.defineProperty(videoMock, 'videoWidth', { value: 640, configurable: true });
        Object.defineProperty(videoMock, 'videoHeight', { value: 480, configurable: true });
        
        // Criamos uma referência explícita da track mockada para podermos espionar no teste
        trackMock = { stop: vi.fn() };

        // Mock global da API de hardware de mídia do navegador
        global.navigator.mediaDevices = {
            getUserMedia: vi.fn().mockResolvedValue({
                getTracks: () => [trackMock] 
            })
        };
    });

    // TESTE NÍVEL 1: Validação de Parâmetros e Falhas Críticas
    it('deve lançar um erro se tentar iniciar sem um elemento de vídeo configurado', async () => {
        const camera = new CamJS();
        await expect(camera.iniciar()).rejects.toThrow("CamJS: Elemento de vídeo não fornecido");
    });

    // TESTE NÍVEL 2: Acoplamento e Atribuição de Fluxo de Mídia
    it('deve ativar a stream de vídeo e vinculá-la ao elemento ao iniciar com sucesso', async () => {
        const camera = new CamJS({ videoElement: videoMock });
        await camera.iniciar();
        
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
        expect(camera.streamAtual).toBeDefined();
        expect(videoMock.srcObject).toBeDefined();
    });

    // TESTE NÍVEL 3: Segurança e Fluxo de Ciclo de Vida
    it('deve rejeitar e barrar a captura se a câmera não tiver sido iniciada previamente', async () => {
        const camera = new CamJS({ videoElement: videoMock });
        await expect(camera.capturar()).rejects.toThrow("CamJS: A câmera não está iniciada.");
    });

    // CORREÇÃO DO TESTE DE PARAR: Monitorando a referência correta do mock instanciado
    it('deve fechar todas as faixas de hardware e limpar os elementos ao parar a câmera', async () => {
        const camera = new CamJS({ videoElement: videoMock });
        await camera.iniciar();
        
        camera.parar();

        // Validações usando a referência persistida no beforeEach
        expect(trackMock.stop).toHaveBeenCalled(); // Sucesso: O hardware foi desligado
        expect(camera.streamAtual).toBeNull();    // Sucesso: Limpou o estado interno
        expect(videoMock.srcObject).toBeNull();   // Sucesso: Desvinculou o elemento visual
    });

    // CORREÇÃO DO TESTE DE CAPTURA: Adicionando o mock do método getContext("2d") para o JSDOM
    it('deve processar o frame do vídeo e retornar o objeto literal de captura padronizado', async () => {
        const canvasMock = document.createElement('canvas');
        
        // Resolve a limitação do JSDOM fazendo o mock do contexto 2D e da função drawImage
        canvasMock.getContext = vi.fn().mockReturnValue({
            drawImage: vi.fn() // Simula o desenho do frame sem falhar
        });

        // Resolve a limitação do toBlob nativo
        canvasMock.toBlob = vi.fn((callback) => {
            const blobSimulado = new Blob(['dados_de_imagem_falsos'], { type: 'image/jpeg' });
            Object.defineProperty(blobSimulado, 'size', { value: 1024 }); 
            callback(blobSimulado);
        });

        const camera = new CamJS({ 
            videoElement: videoMock,
            canvasElement: canvasMock
        });
        
        await camera.iniciar();
        
        const resultado = await camera.capturar("image/jpeg", 0.9);

        // Asserções da estrutura de dados universal da biblioteca
        expect(resultado).toHaveProperty('blob');
        expect(resultado.formato).toBe('image/jpeg');
        expect(resultado.tamanhoBytes).toBe(1024);
        expect(resultado.dimensoes).toEqual({ largura: 640, altura: 480 });
        expect(resultado.timestamp).toBeLessThanOrEqual(Date.now());
    });

    // TESTE PARA COBRIR AS LINHAS 23-24 (Falha de Hardware)
it('deve lançar e registrar um erro se o hardware da câmera rejeitar a inicialização', async () => {
    // Sobrescreve o mock global temporariamente para simular uma rejeição (ex: Permissão Negada)
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error("Permission denied"));
    
    const camera = new CamJS({ videoElement: videoMock });
    
    await expect(camera.iniciar()).rejects.toThrow("Permission denied");
});

// TESTE PARA COBRIR A LINHA 56 (Falha no processamento do Canvas)
it('deve rejeitar a Promise se o canvas falhar em gerar um Blob', async () => {
    const canvasMock = document.createElement('canvas');
    canvasMock.getContext = vi.fn().mockReturnValue({ drawImage: vi.fn() });
    
    // Força o toBlob a responder com NULL para acionar o erro interno
    canvasMock.toBlob = vi.fn((callback) => callback(null));

    const camera = new CamJS({ videoElement: videoMock, canvasElement: canvasMock });
    await camera.iniciar();

    await expect(camera.capturar()).rejects.toThrow("CamJS: Erro ao processar a imagem.");
});
// TESTE PARA COBRIR O OUTRO CAMINHO (BRANCH) DO MÉTODO PARAR
it('deve lidar de forma segura caso o método parar seja chamado com a câmera já desligada', () => {
    const camera = new CamJS({ videoElement: videoMock });
    
    // Certifica-se de que a stream está nula (câmera desligada)
    expect(camera.streamAtual).toBeNull(); 
    
    // Executa o parar sem ter iniciado. O código deve passar direto pelos blocos "if" sem quebrar
    expect(() => camera.parar()).not.toThrow();
});
// TESTE COMPLEMENTAR: Cobre o fluxo de exclusão/omissão do elemento de vídeo no método parar()
it('deve executar o método parar com sucesso mesmo se nenhum elemento de vídeo foi configurado', () => {
    // Instancia sem passar o videoElement para forçar a ramificação falsa (if !this.videoElement)
    const cameraSemVideo = new CamJS(); 
    
    expect(() => cameraSemVideo.parar()).not.toThrow();
});
});