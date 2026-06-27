# InfoLab Escolar — Colégio Estadual Mathias Jacomel

Sistema web de gestão da sala de informática, com **autenticação segura (Supabase)**,
**mapa de computadores em tempo real** e **painel do professor** completo.

Pinhais / PR · Fundado em 1963

## ✨ Recursos
- Login e cadastro (aluno / professor) com Supabase Auth
- Mapa da sala com status dos PCs (livre, em uso, manutenção, defeito)
- **Sincronização em tempo real**: o status mudado pelo professor aparece na hora para os alunos
- Filtro por status e busca de computadores
- **Painel do Professor**: criar atividades, reservar laboratório, enviar avisos e registrar ocorrências (com opção de excluir)
- Atividades e avisos dinâmicos e em tempo real para os alunos
- Relatório para impressão

## 🗂️ Arquivos
- `index.html` — estrutura da página
- `style.css` — estilos (tema azul escuro premium)
- `script.js` — lógica (auth, realtime, painel do professor)
- `animations.js` / `animations.ts` — animações (fundo, reveals, pulsos)
- `supabase-config.js` — URL e chave **pública** do Supabase
- `supabase-setup.sql` — script único que cria todo o banco

## 🚀 Como rodar
1. Crie um projeto no [Supabase](https://supabase.com).
2. Em **SQL Editor**, cole e execute o conteúdo de `supabase-setup.sql`.
3. (Recomendado) Em **Authentication → Providers → Email**, desmarque **"Confirm email"**
   para o cadastro entrar na hora.
4. Em `supabase-config.js`, coloque a **Project URL** e a **publishable key** do seu projeto
   (Settings → API).
5. Abra o `index.html` (ou hospede em GitHub Pages / Vercel).

> A chave em `supabase-config.js` é a **publishable/anon key**, feita para uso no front-end.
> Nunca coloque a `service_role` key aqui.
