# Setup do Painel Admin com Payload CMS + Supabase

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (gratuito)
2. Crie um novo projeto
3. Escolha uma região próxima (ex: `South America (São Paulo)`)
4. Defina uma senha forte para o banco de dados (anote-a!)

## 2. Obter a Connection String

1. No dashboard do Supabase, vá em **Project Settings** (engrenagem)
2. Clique em **Database** no menu lateral
3. Role até **Connection string**
4. Copie a **URI** (formato PostgreSQL)
5. Substitua `[YOUR-PASSWORD]` pela senha que você definiu

Exemplo de URI:

```
postgresql://postgres.abcdefgh:SuaSenhaAqui@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## 3. Configurar o arquivo `.env`

Edite o arquivo `.env` na raiz do projeto:

```env
# Payload CMS
PAYLOAD_SECRET=mare-mansa-wallpaper-catalog-secret-key-2026

# Supabase PostgreSQL
DATABASE_URI=postgresql://postgres.SEU_REF:[SUA_SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## 4. Rodar o projeto localmente

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse:

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## 5. Criar primeiro usuário admin

Na primeira vez que acessar `/admin`, o Payload irá criar as tabelas automaticamente e você poderá criar o primeiro usuário administrador.

## 6. Deploy na Vercel

1. Conecte seu repositório GitHub na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente:
   - `PAYLOAD_SECRET` = sua chave secreta (mínimo 32 caracteres)
   - `DATABASE_URI` = sua connection string do Supabase
   - `NEXT_PUBLIC_SERVER_URL` = URL do seu deploy (ex: https://seu-site.vercel.app)

## Estrutura das Collections

O CMS possui as seguintes collections:

- **Users**: Usuários administradores
- **Products**: Papéis de parede (nome, cores, categorias, imagens)
- **Categories**: Categorias dos produtos
- **Textures**: Texturas disponíveis
- **Media**: Upload de imagens

## Comandos úteis

```bash
# Gerar tipos TypeScript
pnpm generate:types

# Rodar seed (popular banco com dados iniciais)
pnpm seed
```
