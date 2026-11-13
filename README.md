# Bomberman em TypeScript

Eliminar uma patrulha e alcançar a saída escondida sob um caixote. A arena tem 9 × 7 casas, uma bomba por vez e uma tentativa por rodada.

## Integrantes

- Bianca Diebe
- Maria Eduarda Camargo
- Raven Aaron

## Abrir no VS Code

Com Node.js e npm instalados, abra a pasta que contém `package.json`.

```bash
npm ci
npm run dev
```

Abra o endereço exibido no terminal. Rode `npm run build` para conferir a compilação.

**Controles.** Setas movem uma casa por toque · Espaço plantar bomba · R reiniciar

## O que a base já faz

A base fornecia a arena, o movimento por casas e o bloqueio por paredes ou caixotes. A implementação foi complementada com as regras de bombas, explosões, patrulha, condições de vitória e derrota e reinício.

O código foi organizado em arquivos separados, distribuindo as responsabilidades entre as classes.

Comecem por `src/Jogo.ts` e vejam também `src/Cenario.ts`.

## Decisões da equipe

A disposição dos caixotes foi personalizada em `PLANTA`, mantendo o tamanho da arena em 9 × 7 casas. A rota até a saída foi testada para garantir que fosse possível alcançá-la.

Foi mantida a regra de apenas uma bomba ativa por vez. Uma nova bomba só pode ser plantada depois que a anterior explodir.

**Justificativa:** essas decisões preservam as regras do jogo e permitem demonstrar as interações entre jogador, obstáculos, bombas e patrulha.

## Classes e organização do código

- **`Arena`:** organiza os obstáculos e controla suas interações.
- **`Obstaculo`:** classe abstrata que representa os bloqueadores.
- **`Parede`:** representa paredes que permanecem após uma explosão.
- **`Caixote`:** representa caixotes que podem ser destruídos.
- **`Jogador`:** controla a posição e a movimentação do jogador.
- **`Bomba`:** controla a posição e o tempo do pavio.
- **`Explosao`:** cria e atualiza as chamas da detonação.
- **`Guarda`:** controla a movimentação e a eliminação da patrulha.
- **`Jogo`:** coordena as regras, os estados e os acontecimentos da partida.

Outros arquivos complementam a implementação:

- **`Entrada.ts`:** captura e organiza os comandos do teclado.
- **`tipos.ts`:** define os tipos e contratos utilizados pelo jogo.
- **`main.ts`:** inicializa o jogo e coordena seu ciclo de atualização.
- **`telaDoJogo.ts`:** desenha os elementos e apresenta o estado da partida.

## Onde demonstrar orientação a objetos

- **Abstração.** Bomba controla o pavio. Arena organiza as casas e os obstáculos. Obstaculo representa o bloqueio.
- **Encapsulamento.** O atributo `pavio` da Bomba é privado. A coleção de obstáculos da Arena também é privada, sendo acessada por métodos e propriedades.
- **Herança.** `Parede` e `Caixote` estendem a classe abstrata `Obstaculo`, compartilhando sua estrutura e implementando comportamentos próprios.
- **Polimorfismo.** A Arena chama `receberExplosao()` nos obstáculos. A parede permanece e o caixote é removido, conforme a implementação de cada classe.

## Testes realizados

| Teste | Resultado esperado | Resultado observado |
|---|---|---|
| Movimentação | Jogador se movimenta uma casa por comando. | Funcionou conforme esperado. |
| Bloqueio | Paredes e caixotes impedem a passagem. | Funcionou conforme esperado. |
| Limite de bombas | Não permite plantar duas bombas simultaneamente. | Apenas uma bomba fica ativa por vez. |
| Explosão em parede | A chama para na parede e ela permanece. | Funcionou conforme esperado. |
| Explosão em caixote | O caixote é destruído e a chama para naquela posição. | Funcionou conforme esperado. |
| Fuga da explosão | O jogador consegue escapar da própria bomba. | Funcionou durante os testes. |
| Patrulha | A patrulha se movimenta e pode ser eliminada. | Funcionou conforme esperado. |
| Contato | Encostar na patrulha provoca derrota. | Funcionou conforme esperado. |
| Saída | A saída aparece após a destruição do caixote e só permite vitória sem a patrulha. | Funcionou conforme esperado. |
| Reinício | A tecla R reinicia a partida. | Funcionou conforme esperado. |
| Compilação | `npm run build` termina sem erros. | Executado com sucesso. |
