
import {
  Arena,
  Jogador,
  localizar,
  PLANTA,
  type Casa,
} from "./Cenario.ts";

import type { Cena } from "./telaDoJogo.ts";
import type { Comandos, EstadoGeral } from "./tipos.ts";

import Bomba from "./Bomba.ts";
import Explosao from "./Explosao.ts";
import Guarda from "./Guarda.ts";

export class Jogo {
  private jogador = new Jogador();
  private arena = new Arena();
  private guarda = new Guarda(localizar("G"));
  private bomba: Bomba | undefined;
  private explosao = new Explosao();
  private saida: Casa = localizar("S");

  private situacao: EstadoGeral["situacao"] = "protótipo";
  private mensagem = "Pressione uma seta para começar.";

  // Reinicia a partida e restaura o cenário original.
  reiniciar(): void {
    this.jogador = new Jogador();
    this.arena = new Arena();
    this.guarda = new Guarda(localizar("G"));
    this.bomba = undefined;
    this.explosao = new Explosao();
    this.saida = localizar("S");

    this.situacao = "em jogo";
    this.mensagem = "Elimine a patrulha e encontre a saída.";
  }

  // Verifica se uma casa está livre para movimentação.
  private bloqueada(casa: Casa): boolean {
    return (
      PLANTA[casa.y]?.[casa.x] === undefined ||
      this.arena.bloqueada(casa) ||
      (this.bomba !== undefined &&
        this.bomba.casa.x === casa.x &&
        this.bomba.casa.y === casa.y)
    );
  }

  // Atualiza os acontecimentos da partida.
  atualizar(dt: number, comandos: Comandos): void {
    if (
      this.situacao === "vitória" ||
      this.situacao === "derrota"
    ) {
      return;
    }

    // Inicia a partida ao receber um comando do jogador.
    if (this.situacao === "protótipo") {
      const iniciou = [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " ",
      ].some((tecla) => comandos.novas.has(tecla));

      if (!iniciou) return;

      this.situacao = "em jogo";
      this.mensagem = "Elimine a patrulha e encontre a saída.";
    }

    // Movimenta o jogador.
    this.jogador.mover(
      comandos,
      (casa) => this.bloqueada(casa)
    );

    // Planta uma bomba se não existir outra na arena.
    if (comandos.novas.has(" ") && !this.bomba) {
      this.bomba = new Bomba(this.jogador.casa);
    }

    // Verifica se o pavio terminou.
    if (this.bomba?.atualizar(dt)) {
      this.explosao.criar(this.bomba.casa, this.arena);
      this.bomba = undefined;
    }

    // Atualiza a duração das chamas.
    this.explosao.atualizar(dt);

    // Verifica se o jogador foi atingido.
    const posicaoJogador = this.jogador.casa;

    if (this.explosao.atinge(posicaoJogador)) {
      this.situacao = "derrota";
      this.mensagem = "Você foi atingido por uma explosão!";
      return;
    }

    // Movimenta a patrulha.
    this.guarda.atualizar(
      dt,
      (casa) => this.bloqueada(casa)
    );

    // Verifica se a patrulha foi atingida pelas chamas.
    const posicaoGuarda = this.guarda.casa;

    if (posicaoGuarda && this.explosao.atinge(posicaoGuarda)) {
      this.guarda.receberExplosao();
      this.mensagem = "Patrulha eliminada! Encontre a saída.";
    }

    // Verifica se o jogador encostou na patrulha.
    const guardaAtual = this.guarda.casa;

    if (
      guardaAtual &&
      posicaoJogador.x === guardaAtual.x &&
      posicaoJogador.y === guardaAtual.y
    ) {
      this.situacao = "derrota";
      this.mensagem = "Você foi capturado pela patrulha!";
      return;
    }

    // Verifica se o jogador chegou à saída revelada.
    if (
      !guardaAtual &&
      !this.arena.bloqueada(this.saida) &&
      posicaoJogador.x === this.saida.x &&
      posicaoJogador.y === this.saida.y
    ) {
      this.situacao = "vitória";
      this.mensagem = "Você encontrou a saída e concluiu o jogo!";
    }
  }

  // Disponibiliza os dados da partida para a interface.
  obterEstado(): EstadoGeral & Cena {
    const caixotes = this.arena.listaObstaculos.filter(
      (obstaculo) => obstaculo.tipo === "caixote"
    ).length;

    return {
      situacao: this.situacao,
      mensagem: this.mensagem,

      indicadores: [
        ["Caixotes", caixotes],
        ["Patrulha", this.guarda.casa ? "Ativa" : "Eliminada"],
        ["Bomba", this.bomba ? "Plantada" : "Disponível"],
      ],

      jogador: this.jogador.casa,
      obstaculos: this.arena.listaObstaculos,
      guarda: this.guarda.casa,

      bomba: this.bomba
        ? {
            ...this.bomba.casa,
            restante: this.bomba.restante,
          }
        : undefined,

      chamas: this.explosao.listaChamas,

      // A saída aparece quando o caixote que a escondia é destruído.
      saida: this.arena.bloqueada(this.saida)
        ? undefined
        : this.saida,
    };
  }
}
