# iFruit Web

Este é o repositório web do projeto iFruit.

## Tecnologias Utilizadas

- **React**: Uma biblioteca JavaScript para construir interfaces de usuário.
- **Vite**: Um bundler de próxima geração para desenvolvimento web.
- **TypeScript**: Um superconjunto tipado de JavaScript que compila para JavaScript puro.
- **Tailwind CSS**: Um framework CSS utilitário para estilização rápida.
- **Bun**: Um runtime JavaScript rápido, bundler, transpiler e gerenciador de pacotes tudo-em-um.

## Como Subir o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o [Bun](https://bun.sh/docs/installation) instalado em sua máquina.

### Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd ifruit-web
   ```
   (Substitua `[URL_DO_REPOSITORIO]` pela URL real do seu repositório.)

2. Instale as dependências usando Bun:
   ```bash
   bun install
   ```

### Executando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
bun dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

### Construindo o Projeto para Produção

Para construir o projeto para produção:

```bash
bun build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Estrutura do Projeto

- `public/`: Arquivos estáticos.
- `src/`: Código fonte da aplicação.
  - `src/components/`: Componentes React reutilizáveis.
  - `src/components/ui/`: Componentes de UI baseados em Shadcn/ui.
  - `src/contexts/`: Contextos React para gerenciamento de estado global.
  - `src/hooks/`: Hooks React personalizados.
  - `src/lib/`: Funções utilitárias.
  - `src/pages/`: Páginas principais da aplicação.

## Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

- `bun dev`: Inicia o servidor de desenvolvimento.
- `bun build`: Constrói o aplicativo para produção.
- `bun lint`: Executa o linter para verificar problemas de código.
- `bun preview`: Serve a build de produção localmente.
