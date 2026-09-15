// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";
// importa a classe Player do arquivo player.ts
import { Player } from "./models/player.js"

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// Middlewares para permitr que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

// instanciação de um jogador utilizando a classe Player
// Criamos (instanciamos) um novo jogador chamado "Heroi" com 100 de saúde e nível 5
// a partir da classe player que foi importada do arquivo player.ts
let player1: Player = new Player("Heroi", 100, 5);

// Rota GET para obter informações do jogador
// Quando o usuário acessar a rota "/player", o servidor responderá com as informações do jogador
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "Informações do jogador",
    player: player1
  });
});

// Rota POST para o jogador atacar
// Quando o usuário acessar a rota "/player/attack", o servidor chamará o método attack() do jogador
// é utilizado para enviar dados ou realizar ações que alteram o estado do servidor, como nesse caso onde o jogador realiza uma ação (como acionar umcomportamento de ataque), que é o método attack() do Jogador
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.post("/player/attack", (req: Request, res: Response) => {  
  const attackMessage = player1.attack(); // Chama o método attack() do jogador
  // Retorna uma resposta JSON com a mensagem de ataque para o cliente que fez a requisição
  res.json({
    message: attackMessage // Retorna a mensagem de ataque como resposta
  });
});

// Rota para receber o jogador recebr dano
// Quando o usuário acessar a rota "/player/damage", o servidor chamará o método takeDamage() do jogador, passando o valor do dano recebido como parâmetro
app.post("/player/takedamage", (req: Request, res: Response) => {
  const { damage } = req.body; // Extrai o valor de dano da requisição
  const damageMessage = player1.takeDamage(damage); // chama o metodo takeDamge() do jogador
  // Retorna uma resposta JSON com a mensagem de dano para o cliente que fez a requisição
  res.json({
    action: damageMessage,
    currenthealth: player1.health,
    currentlevel: player1.level
  });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponíveis:")
  console.log(`GET http://localhost:${PORT}/player - Obter informações do jogador`);
  console.log(`POST http://localhost:${PORT}/player/attack - Jogador realiza um ataque`);
  console.log(`POST http://localhost:${PORT}/player/takedamage - Jogador recebe dano`);
});