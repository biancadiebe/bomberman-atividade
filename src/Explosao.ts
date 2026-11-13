
import { Arena, PLANTA, type Casa } from "./Cenario.ts";

// Controla as chamas geradas pela detonação de uma bomba.
export default class Explosao {
  private chamas: (Casa & { vida: number })[] = [];

  // Cria uma explosão em cruz com alcance máximo de duas casas.
  criar(casa: Casa, arena: Arena): void {
    // A casa da bomba também recebe uma chama.
    this.chamas.push({ ...casa, vida: 0.45 });

    const direcoes = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    for (const direcao of direcoes) {
      for (let distancia = 1; distancia <= 2; distancia++) {
        const destino = {
          x: casa.x + direcao.x * distancia,
          y: casa.y + direcao.y * distancia,
        };

        // Impede que a chama ultrapasse os limites da arena.
        if (PLANTA[destino.y]?.[destino.x] === undefined) {
          break;
        }

        this.chamas.push({ ...destino, vida: 0.45 });

        // Paredes e caixotes interrompem a propagação.
        // A Arena decide se o obstáculo permanece ou é removido.
        if (arena.receberExplosao(destino)) {
          break;
        }
      }
    }
  }

  // Atualiza o tempo de duração das chamas.
  atualizar(dt: number): void {
    for (const chama of this.chamas) {
      chama.vida -= dt;
    }

    this.chamas = this.chamas.filter(
      (chama) => chama.vida > 0
    );
  }

  // Verifica se determinada casa foi atingida.
  atinge(casa: Casa): boolean {
    return this.chamas.some(
      (chama) => chama.x === casa.x && chama.y === casa.y
    );
  }

  get listaChamas(): Casa[] {
    return this.chamas.map(({ x, y }) => ({ x, y }));
  }
}
