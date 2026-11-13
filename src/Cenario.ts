import type { Comandos } from "./tipos.ts";

export const CASA = 62;

export const PLANTA = [
  "#########",
  "#P..+..S#",
  "#.#.#.#.#",
  "#.+...+.#",
  "#.#.#.#.#",
  "#..+G...#",
  "#########",
] as const;

export interface Casa {
  x: number;
  y: number;
}

// Classe base para todos os obstáculos da arena.
export abstract class Obstaculo {
  protected readonly posicao: Casa;

  constructor(casa: Casa) {
    this.posicao = { ...casa };
  }

  get casa(): Casa {
    return { ...this.posicao };
  }

  abstract receberExplosao(): boolean;
  abstract get tipo(): "parede" | "caixote";
}

// A parede recebe a explosão, mas não é destruída.
export class Parede extends Obstaculo {
  get tipo(): "parede" {
    return "parede";
  }

  receberExplosao(): boolean {
    return true;
  }
}

// O caixote é destruído quando atingido pela explosão.
export class Caixote extends Obstaculo {
  get tipo(): "caixote" {
    return "caixote";
  }

  receberExplosao(): boolean {
    return false;
  }
}

export function localizar(simbolo: string): Casa {
  for (const [y, linha] of PLANTA.entries()) {
    const x = linha.indexOf(simbolo);

    if (x >= 0) {
      return { x, y };
    }
  }

  throw new Error("Posição ausente no mapa: " + simbolo);
}

export function chave({ x, y }: Casa): string {
  return `${x},${y}`;
}

export function igual(a: Casa, b: Casa): boolean {
  return a.x === b.x && a.y === b.y;
}

// A Arena organiza os obstáculos e controla suas interações.
export class Arena {
  private obstaculos: Obstaculo[] = [];

  constructor() {
    for (const [y, linha] of PLANTA.entries()) {
      for (const [x, marca] of [...linha].entries()) {
        const casa = { x, y };

        if (marca === "#") {
          this.obstaculos.push(new Parede(casa));
        } else if (marca === "+" || marca === "S") {
          this.obstaculos.push(new Caixote(casa));
        }
      }
    }
  }

  // Disponibiliza os obstáculos para a interface.
  get listaObstaculos(): (Casa & {
    tipo: "parede" | "caixote";
  })[] {
    return this.obstaculos.map((obstaculo) => ({
      ...obstaculo.casa,
      tipo: obstaculo.tipo,
    }));
  }

  bloqueada(casa: Casa): boolean {
    return this.obstaculos.some(
      (obstaculo) => igual(obstaculo.casa, casa)
    );
  }

  // O polimorfismo permite tratar paredes e caixotes pela classe base.
  receberExplosao(casa: Casa): boolean {
    const indice = this.obstaculos.findIndex(
      (obstaculo) => igual(obstaculo.casa, casa)
    );

    if (indice < 0) return false;

    const obstaculo = this.obstaculos[indice];
    const permanece = obstaculo.receberExplosao();

    if (!permanece) {
      this.obstaculos.splice(indice, 1);
    }

    // Retorna true quando a explosão deve parar nessa casa.
    return true;
  }
}

// Controla a posição e o movimento do jogador.
export class Jogador {
  private posicao = localizar("P");

  get casa(): Casa {
    return { ...this.posicao };
  }

  mover(
    comandos: Comandos,
    bloqueada: (casa: Casa) => boolean
  ): void {
    const direcoes = [
      { tecla: "arrowleft", x: -1, y: 0 },
      { tecla: "arrowright", x: 1, y: 0 },
      { tecla: "arrowup", x: 0, y: -1 },
      { tecla: "arrowdown", x: 0, y: 1 },
    ];

    const passo = direcoes.find(({ tecla }) =>
      comandos.novas.has(tecla)
    );

    if (!passo) return;

    const destino = {
      x: this.posicao.x + passo.x,
      y: this.posicao.y + passo.y,
    };

    if (!bloqueada(destino)) {
      this.posicao = destino;
    }
  }
}
