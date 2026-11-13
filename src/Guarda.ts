
import type { Casa } from "./Cenario.ts";

// Controla o comportamento da patrulha.
export default class Guarda {
  private posicao: Casa | undefined;
  private intervaloMovimento = 0;

  constructor(casa: Casa) {
    this.posicao = { ...casa };
  }

  get casa(): Casa | undefined {
    return this.posicao ? { ...this.posicao } : undefined;
  }

  // Movimenta a patrulha em uma direção livre.
  atualizar(
    dt: number,
    bloqueada: (casa: Casa) => boolean
  ): void {
    const posicao = this.posicao;
    if (!posicao) return;

    this.intervaloMovimento -= dt;

    if (this.intervaloMovimento > 0) return;

    const direcoes = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const opcoes = direcoes.filter((direcao) =>
      !bloqueada({
        x: posicao.x + direcao.x,
        y: posicao.y + direcao.y,
      })
    );

    if (opcoes.length > 0) {
      const direcao = opcoes[
        Math.floor(Math.random() * opcoes.length)
      ];

      this.posicao = {
        x: posicao.x + direcao.x,
        y: posicao.y + direcao.y,
      };
    }

    this.intervaloMovimento = 0.35;
  }

  // Elimina a patrulha quando ela é atingida por uma chama.
  receberExplosao(): void {
    this.posicao = undefined;
  }
}
