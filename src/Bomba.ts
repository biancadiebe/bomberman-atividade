
import type { Casa } from "./Cenario.ts";

// Representa uma bomba plantada na arena.
export default class Bomba {
  private pavio: number;
  private readonly posicao: Casa;

  constructor(casa: Casa) {
    this.posicao = { ...casa };
    this.pavio = 1.8;
  }

  get casa(): Casa {
    return { ...this.posicao };
  }

  get restante(): number {
    return this.pavio;
  }

  // Retorna true quando o pavio chega ao fim.
  atualizar(dt: number): boolean {
    this.pavio -= dt;
    return this.pavio <= 0;
  }
}
