// A palavra "class" define que estamos criando um molde.
// A palavra "export" permite que esse arquivo seja usado por outros arquivos (como o app.ts).

export class Player {
    public name: string; // o nome do jogador (texto)
    public health: number; // a saude do jogador (numero)
    public level: number; // o nivel do jogador (numero)

    // Construtores (O construtor é um método especial que executado automaticamente quando a classe é instanciada apenas uma unica vez)

    constructor(name: string, health: number = 100, level: number = 1){
        // A palavra "this" faz referencia a propria classe, ou seja, "Pegue o atributo 'name' da classe player e atribua o valor do parametros 'name' a ele"

        this.name = name;
        this.health = health;
        this.level = level;
    }

    //Metodos (comportamentos da classe)
    // metodos são as funções que a classe pode executar, ou seja, são os comportamentos da classe.
    // o metodo attack é um metodo que retorna uma string
    public attack(): string {
        const damage = this.level * 10; // calcula o dano baseado no nivel do jogador
        return `${this.name} atacou e causou ${damage} de dano!`;
    }

    // o metodo takeDamage é um metodo que recebe um numero como parametro e não retorna nada (void)
    public takeDamage(amount: number): string{
        this.health -= amount;  // reduz a saude do jogador pelo valor do parametro
        if (this.health < 0) {
            this.health = 0; // garante que a saude não fique negativa
            return `${this.name} foi derrotado!`; // retorna uma mensagem de derrota
        }

        return `${this.name} recebeu ${amount} de dano e agora tem ${this.health} de saude!`;
    }

    public takeHealth(amount: number): string {
        this.health += amount; // aumenta a saúde do jogador pelo valor do parâmetro
        if (this.health > 100) {
            this.health = 100; // garante que a saúde não ultrapasse 100
        }
        return `${this.name} recebeu ${amount} de cura e agora tem ${this.health} de saúde!`;
    }

    public upLevel(): string {
        this.level += 1; // aumenta o nível do jogador em 1
        if (this.level > 100) {
            this.level = 100; // garante que o nível não ultrapasse 100
        }
        return `${this.name} subiu para o nível ${this.level}!`; // retorna uma mensagem de nível
        return `o máximo nivel do jogador é 100, ${this.name} já está no nível máximo!`; // retorna uma mensagem de nível máximo
    }
}