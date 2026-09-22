// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";

import fs from "fs" // importa o módulo fs  para manipulação de arquivos

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

// define o nome do diretório onde os arquivos serão armazenados
const DATA_FILE = "./data/player.json";

/*
Função para garantir que o diretório de dados exista antes de salvar os arquivos.
Se o diretório não existir, ele será criado.
*/

function ensureDatafolderExists() {
  const dataFolder = "./data";
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
}

// chamar a função para garantir que o diretório de dados exista antes de qualquer operação de leitura ou escrita de arquivos
ensureDatafolderExists();

// Função para salvar os dados do jogador em um arquivo JSON
function savePlayerstate(player: Player) {
  // Converte o objeto player em uma string JSON
  const data = JSON.stringify(player, null, 2);
  // Salva a string JSON em um arquivo chamado players.json dentro do diretório data
  fs.writeFileSync(DATA_FILE, data, "utf-8");
}

// Função para carregar os dados do player de um arquivo JSON
function loadplayerstate(): Player {
  // Verifica se o arquivo players.json existe
  if (fs.existsSync(DATA_FILE)) {
    // Lê o conteúdo do arquivo players.json e converte  de volta para um objeto Player
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const playerData = JSON.parse(data);

    /* ATENÇÃO: JSON.parse() retorna um objeto "puro" (sem os metodos da classe player)
    Para que o objeto tenha os metodos da classe Player, precisamos criar uma nova instância da classe Player
    e passar os dados carregados para o construtor.
    */
  return new Player(playerData.name, playerData.health, playerData.level);
  }
  // cria um novo player se não existir com nome "Heroi", 100 de saúde e nível 5
  const player = new Player("Heroi", 100, 5);
  savePlayerstate(player);
  return player;
}

let player: Player = loadplayerstate(); // Carrega o estado do jogador do arquivo JSON, se existir

// Rota GET para obter informações do jogador
// Quando o usuário acessar a rota "/player", o servidor responderá com as informações do jogador
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "Informações do jogador",
    player: player
  });
});

// Rota POST para o jogador atacar
// Quando o usuário acessar a rota "/player/attack", o servidor chamará o método attack() do jogador
// é utilizado para enviar dados ou realizar ações que alteram o estado do servidor, como nesse caso onde o jogador realiza uma ação (como acionar umcomportamento de ataque), que é o método attack() do Jogador
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.post("/player/attack", (req: Request, res: Response) => {  
  const attackMessage = player.attack(); // Chama o método attack() do jogador
  // Retorna uma resposta JSON com a mensagem de ataque para o cliente que fez a requisição
  res.json({
    message: attackMessage // Retorna a mensagem de ataque como resposta
  });
});

// Rota para receber o jogador recebr dano
// Quando o usuário acessar a rota "/player/damage", o servidor chamará o método takeDamage() do jogador, passando o valor do dano recebido como parâmetro
app.post("/player/takedamage", (req: Request, res: Response) => {
  const { damage } = req.body; // Extrai o valor de dano da requisição
  const damageMessage = player.takeDamage(damage); // chama o metodo takeDamge() do jogador
  // salvar o estado atual do player no arquvi json
  savePlayerstate(player);
  // Retorna uma resposta JSON com a mensagem de dano para o cliente que fez a requisição
  res.json({
    action: damageMessage,
    currenthealth: player.health,
    currentlevel: player.level
  });
});

app.post("/player/upLevel", (req: Request, res: Response) => {

  const LevelMessage = player.upLevel(); // chama o metodo upLevel() do jogador
  // salvar o estado atual do player no arquvi json
  savePlayerstate(player);
  // Retorna uma resposta JSON com a mensagem de dano para o cliente que fez a requisição
  res.json({
    action: LevelMessage,
    currenthealth: player.health,
    currentlevel: player.level
  });
});

app.post("/player/takeHealth", (req: Request, res: Response) => {
  const { health } = req.body; // Extrai o valor de cura da requisição
  const healMessage = player.takeHealth(health); // chama o metodo takeHealth() do jogador
  // salvar o estado atual do player no arquvi json
  savePlayerstate(player);
  // Retorna uma resposta JSON com a mensagem de cura para o cliente que fez a requisição
  res.json({
    action: healMessage,
    currenthealth: player.health,
    currentlevel: player.level
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
  console.log(`POST http://localhost:${PORT}/player/upLevel - Jogador sobe de nível`);
  console.log(`POST http://localhost:${PORT}/player/takeHealth - Jogador recebe cura`);
});