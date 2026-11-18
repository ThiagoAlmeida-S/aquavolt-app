# 💧⚡ AquaVolt — App

Aplicativo mobile da **Smart Water & Energy Station**: um painel para acompanhar, em tempo real,
o nível do reservatório, a vazão e o consumo elétrico de uma estação de água e energia, acionar
atuadores (bomba, válvula e relé) e acompanhar alertas de falha.

Projeto da disciplina **Advanced Programming and Mobile Dev** — Global Solution 2026.

> Este app consome a API do repositório
> **[aquavolt-api](https://github.com/ThiagoAlmeida-S/aquavolt-api)** (backend em Spring Boot).
> Suba o backend antes de abrir o app.

## Funcionalidades

- **Painel:** nível do reservatório (tanque animado que muda de cor: normal, baixo e crítico),
  vazão (L/min) e consumo elétrico (kW), atualizados automaticamente a cada 3 segundos.
  Puxar a tela para baixo atualiza na hora.
- **Controles:** liga e desliga a bomba, a válvula e o relé.
- **Alertas:** falhas ativas e histórico, com cor por severidade e botão para marcar como resolvida.
- **API fora do ar:** se o backend ficar indisponível, o app mostra um aviso, mantém os últimos
  valores na tela, desabilita os comandos e reconecta sozinho quando a API volta.

## Telas

| Painel | Controles | Alertas |
|---|---|---|
| ![Painel](docs/painel.png) | ![Controles](docs/controles.png) | ![Alertas](docs/alertas.png) |

## Tecnologias

- React Native com Expo (SDK 58)
- TypeScript
- React Navigation (abas inferiores)
- @expo/vector-icons

## Como executar

**Pré-requisitos:** Node.js (versão LTS) e o backend rodando em `http://localhost:8080`.
Para usar no celular, instale o app **Expo Go**.

```bash
git clone https://github.com/ThiagoAlmeida-S/aquavolt-app.git
cd aquavolt-app
npm install
cp .env.example .env      # no Windows (PowerShell): Copy-Item .env.example .env
npx expo start
```

Depois, pressione `w` para abrir no navegador, ou escaneie o QR code com o Expo Go
(o celular precisa estar na **mesma rede Wi-Fi** do computador).

### Endereço da API

O endereço do computador que roda o backend fica no arquivo `.env`:

| Onde o app roda | Valor de `EXPO_PUBLIC_API_HOST` |
|---|---|
| Navegador ou simulador iOS | `localhost` |
| Emulador Android | `10.0.2.2` |
| Celular de verdade | IPv4 do computador (rode `ipconfig`) |

Se mudar o `.env`, reinicie com `npx expo start -c`. No celular, o Firewall do Windows precisa
permitir a porta **8080** em redes privadas.

## Estrutura do projeto

```
src/
├── api/          → comunicação com o backend (com timeout e tratamento de "API fora do ar")
├── components/   → peças reutilizáveis (tanque, cartões, alertas, aviso de API fora do ar)
├── hooks/        → atualização automática dos dados (usePolling)
├── navigation/   → navegação por abas
├── screens/      → telas: Painel, Controles e Alertas
├── theme/        → cores, espaçamentos e tamanhos de fonte
└── types/        → tipos TypeScript que espelham o que o backend devolve
```

## Endpoints consumidos

| Método | Rota | Uso no app |
|---|---|---|
| GET | `/api/leituras/ultimas` | Painel: nível, vazão e consumo |
| GET | `/api/atuadores` | Controles: lista de atuadores |
| PUT | `/api/atuadores/{id}/ligar` e `/desligar` | Controles: acionamento |
| GET | `/api/falhas` | Alertas: ativas e histórico |
| PUT | `/api/falhas/{id}/resolver` | Alertas: marcar como resolvida |

## Integrantes

| Nome completo | RM |
|---|---|
| `Thiago Almeida` | `565365` |
| `Nicolas Alves` | `561692` |
| `Gustavo Pereira` | `563280` |