-- ════════════════════════════════════════════════════════════
--  InfoLab Escolar — Setup COMPLETO do Supabase
--  Colégio Estadual Mathias Jacomel · Pinhais / PR
--  (Auth + Profiles + Computadores + Painel do Professor + Realtime)
--
--  COMO USAR:
--   1. Painel do Supabase → SQL Editor → New query
--   2. Cole TODO este arquivo e clique em Run (pode rodar várias vezes)
--
--  PARA O CADASTRO DE PROFESSOR ENTRAR NA HORA (sem e-mail):
--   Authentication → Providers → Email → DESMARQUE "Confirm email" → Save
--   (Se deixar marcado, o usuário precisa clicar no link do e-mail antes.)
-- ════════════════════════════════════════════════════════════

-- ── PROFILES ──────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome text not null,
  tipo text not null default 'aluno' check (tipo in ('aluno', 'professor')),
  created_at timestamptz not null default now()
);

-- ── COMPUTADORES ──────────────────────────────────────────────
create table if not exists public.computadores (
  id bigserial primary key,
  numero integer not null unique check (numero > 0),
  status text not null default 'livre' check (status in ('livre', 'uso', 'manutencao', 'defeito')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.computadores add column if not exists updated_at timestamptz not null default now();
alter table public.computadores add column if not exists updated_by uuid references auth.users(id);

-- garante UNIQUE em numero (tabelas antigas podem não ter — sem isso o seed
-- abaixo falha com "no unique or exclusion constraint matching the ON CONFLICT")
create unique index if not exists computadores_numero_key on public.computadores (numero);

update public.computadores set status = 'manutencao'
where lower(status) in ('manutenção', 'manutencao', 'manut');

-- Realtime confiável: envia a linha inteira nos eventos UPDATE/DELETE
alter table public.computadores replica identity full;

-- ── PAINEL DO PROFESSOR: atividades / reservas / avisos / ocorrencias ──
create table if not exists public.atividades (
  id bigint generated always as identity primary key,
  titulo text not null,
  descricao text not null,
  criado_em timestamptz not null default now()
);

create table if not exists public.reservas (
  id bigint generated always as identity primary key,
  professor text not null,
  data_reserva date not null,
  horario text not null,
  criado_em timestamptz not null default now()
);

create table if not exists public.avisos (
  id bigint generated always as identity primary key,
  titulo text not null,
  mensagem text not null,
  autor text,
  criado_em timestamptz not null default now()
);

create table if not exists public.ocorrencias (
  id bigint generated always as identity primary key,
  computador integer,
  descricao text not null,
  professor text,
  criado_em timestamptz not null default now()
);

-- ── FUNÇÃO: verifica se o usuário logado é professor ──────────
create or replace function public.is_professor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and tipo = 'professor'
  );
$$;

-- ── TRIGGER: atualiza updated_at / updated_by nos computadores ─
create or replace function public.touch_computadores_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_touch_computadores_updated_at on public.computadores;
create trigger trg_touch_computadores_updated_at
before update on public.computadores
for each row execute function public.touch_computadores_updated_at();

-- ── TRIGGER: cria o profile quando o usuário se cadastra ──────
create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nome, tipo)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(coalesce(new.email, 'Aluno'), '@', 1)),
    case when new.raw_user_meta_data ->> 'tipo' = 'professor' then 'professor' else 'aluno' end
  )
  on conflict (id) do update
    set email = excluded.email, nome = excluded.nome;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_infolab on auth.users;
create trigger on_auth_user_created_infolab
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- ════════════════════════════════════════════════════════════
--  RLS (Row Level Security)
-- ════════════════════════════════════════════════════════════
alter table public.profiles    enable row level security;
alter table public.computadores enable row level security;
alter table public.atividades  enable row level security;
alter table public.reservas    enable row level security;
alter table public.avisos      enable row level security;
alter table public.ocorrencias enable row level security;

-- PROFILES: cada um lê e cria o próprio perfil (o app cria sozinho se faltar)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

-- COMPUTADORES: todos leem, só professor altera
drop policy if exists "computadores_select_authenticated" on public.computadores;
create policy "computadores_select_authenticated" on public.computadores
  for select to authenticated using (true);

drop policy if exists "computadores_update_professor" on public.computadores;
create policy "computadores_update_professor" on public.computadores
  for update to authenticated using (public.is_professor()) with check (public.is_professor());

-- ATIVIDADES: todos leem, só professor gerencia
drop policy if exists "atividades_select" on public.atividades;
create policy "atividades_select" on public.atividades
  for select to authenticated using (true);

drop policy if exists "atividades_write_professor" on public.atividades;
create policy "atividades_write_professor" on public.atividades
  for all to authenticated using (public.is_professor()) with check (public.is_professor());

-- AVISOS: todos leem, só professor gerencia
drop policy if exists "avisos_select" on public.avisos;
create policy "avisos_select" on public.avisos
  for select to authenticated using (true);

drop policy if exists "avisos_write_professor" on public.avisos;
create policy "avisos_write_professor" on public.avisos
  for all to authenticated using (public.is_professor()) with check (public.is_professor());

-- RESERVAS: todos leem (para ver conflitos), só professor gerencia
drop policy if exists "reservas_select" on public.reservas;
create policy "reservas_select" on public.reservas
  for select to authenticated using (true);

drop policy if exists "reservas_write_professor" on public.reservas;
create policy "reservas_write_professor" on public.reservas
  for all to authenticated using (public.is_professor()) with check (public.is_professor());

-- OCORRENCIAS: só professor lê e gerencia
drop policy if exists "ocorrencias_professor" on public.ocorrencias;
create policy "ocorrencias_professor" on public.ocorrencias
  for all to authenticated using (public.is_professor()) with check (public.is_professor());

-- ── SEED: 30 computadores (não duplica) ───────────────────────
insert into public.computadores (numero, status)
select n, 'livre' from generate_series(1, 30) as n
on conflict (numero) do nothing;

-- ── REALTIME: publica computadores, atividades e avisos ───────
do $$
declare t text;
begin
  foreach t in array array['computadores', 'atividades', 'avisos'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;

