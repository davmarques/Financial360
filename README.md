# Financial360 💰

Uma plataforma completa de gestão financeira pessoal e planejamento de economia, construída com uma arquitetura moderna Full Stack.

## 🚀 Tecnologias

### Frontend
- **React.js** com **Vite**
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide React** para ícones

### Backend & Database
- **Node.js** com **TypeScript**
- **Supabase** (PostgreSQL, Auth, Real-time)
- **SQL Migrations** para versionamento do banco

## 📋 Funcionalidades

- **Visão Geral (Overview):** Resumo de saldo, orçamentos, potes e transações recentes.
- **Gerenciamento de Transações:** Fluxo completo de receitas e despesas.
- **Orçamentos Mensais:** Defina limites por categoria e acompanhe o progresso visualmente.
- **Potes de Economia (Pots):** Crie objetivos de economia e gerencie o progresso de cada um.
- **Contas Recorrentes:** Acompanhe pagamentos fixos e suas datas de vencimento.
- **Autenticação Completa:** Sistema de login e cadastro seguro via Supabase Auth.

## 🛠️ Estrutura do Projeto

O projeto utiliza uma estrutura de **Monorepo**:

- `/frontend`: Aplicação cliente React.
- `/backend`: Configurações de servidor e definições do Supabase (migrações e tipos).

## 🔧 Como Executar

### Pré-requisitos
- Node.js (v18+)
- Conta no Supabase

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/financial360.git
   ```

2. **Backend/Supabase:**
   - Acesse o diretório `backend`.
   - Configure seu projeto no Supabase Console.
   - Aplique as migrações contidas em `backend/supabase/migrations`.

3. **Frontend:**
   - Acesse o diretório `frontend`.
   - Instale as dependências: `npm install`.
   - Crie um arquivo `.env` baseado no `.env.example` com as credenciais do seu Supabase.
   - Inicie o app: `npm run dev`.

## 📄 Licença

Este projeto está sob a licença MIT.
