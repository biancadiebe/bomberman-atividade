// Camada de apresentação. Use os dados recebidos para desenhar e informe os controles na ficha do
// jogo.

import { CASA, PLANTA, type Casa } from "./Cenario.ts";
import type { FichaJogo } from "./tipos.ts";

const LARGURA = CASA * PLANTA[0].length;
const ALTURA = CASA * PLANTA.length;

export const ficha: FichaJogo = {
  titulo: "Arena de bombas",
  referencia: "Inspirado em Bomberman",
  descricao: "Abra caminho com explosões, elimine a patrulha e encontre a saída.",
  largura: LARGURA, altura: ALTURA, cor: "#f5a99f",
  controles: [["Setas", "Mover uma casa por toque"], ["Espaço", "Plantar bomba na versão final"], ["R", "Reiniciar"]],
};

export interface Cena {
  jogador: Casa;
  obstaculos: (Casa & { tipo: "parede" | "caixote" })[];
  guarda: Casa | undefined;
  bomba: (Casa & { restante: number }) | undefined;
  chamas: Casa[];
  saida: Casa | undefined;
}

export function desenhar(ctx: CanvasRenderingContext2D, cena: Cena): void {
  ctx.fillStyle = "#17252e";
  ctx.fillRect(0, 0, LARGURA, ALTURA);
  ctx.strokeStyle = "#293f48";
  for (let y = 0; y < PLANTA.length; y++) {
    for (let x = 0; x < PLANTA[0].length; x++) ctx.strokeRect(x * CASA, y * CASA, CASA, CASA);
  }

  if (cena.saida) {
    ctx.fillStyle = cena.guarda ? "#747c98" : "#7cd1a2";
    ctx.fillRect(cena.saida.x * CASA + 14, cena.saida.y * CASA + 11, 34, 40);
    ctx.fillStyle = "#243d43";
    ctx.fillRect(cena.saida.x * CASA + 21, cena.saida.y * CASA + 17, 20, 34);
  }

  for (const o of cena.obstaculos) {
    const x = o.x * CASA;
    const y = o.y * CASA;
    ctx.fillStyle = o.tipo === "parede" ? "#426478" : "#996650";
    ctx.fillRect(x + 3, y + 3, CASA - 6, CASA - 6);
    ctx.strokeStyle = o.tipo === "parede" ? "#688495" : "#d6a177";
    ctx.strokeRect(x + 10, y + 10, CASA - 20, CASA - 20);
    if (o.tipo === "caixote") {
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 10);
      ctx.lineTo(x + CASA - 10, y + CASA - 10);
      ctx.stroke();
    }
  }

  if (cena.bomba) {
    const x = (cena.bomba.x + .5) * CASA;
    const y = (cena.bomba.y + .5) * CASA;
    ctx.fillStyle = cena.bomba.restante < .55 ? "#e88e75" : "#bed8e2";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcb78";
    ctx.fillRect(x + 6, y - 22, 5, 8);
  }

  for (const chama of cena.chamas) {
    ctx.fillStyle = "#f7b568";
    ctx.fillRect(chama.x * CASA + 6, chama.y * CASA + 6, CASA - 12, CASA - 12);
    ctx.fillStyle = "#fff0a7";
    ctx.fillRect(chama.x * CASA + 23, chama.y * CASA + 23, 16, 16);
  }

  if (cena.guarda) {
    ctx.fillStyle = "#ec948c";
    ctx.fillRect(cena.guarda.x * CASA + 15, cena.guarda.y * CASA + 15, 32, 32);
    ctx.fillStyle = "#342733";
    ctx.fillRect(cena.guarda.x * CASA + 20, cena.guarda.y * CASA + 23, 22, 5);
  }

  const { x, y } = cena.jogador;
  ctx.fillStyle = "#87dfcf";
  ctx.fillRect(x * CASA + 19, y * CASA + 18, 24, 26);
  ctx.fillStyle = "#1d5860";
  ctx.fillRect(x * CASA + 23, y * CASA + 22, 16, 7);
}
