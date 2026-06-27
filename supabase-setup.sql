-- InfoLab Escolar - Supabase Auth + RLS setup
-- Rode este arquivo no SQL Editor do Supabase.
-- O cadastro aceita 'aluno' ou 'professor' via user metadata.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nome text not null,
  tipo text not null default 'aluno' check (tipo in ('aluno', 'professor')),
  created_at timestamptz not null default now()
);

create table if not exists public.computadores (
  id bigserial primary key,
  numero integer not null unique check (numero > 0),
  status text not null default 'livre' check (status in ('livre', 'uso', 'manutencao', 'defeito')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.computadores
  add column if not exists updated_at timestamptz not null default now();

alter table public.computadores
  add column if not exists updated_by uuid references auth.users(id);

update public.computadores
set status = 'manutencao'
where lower(status) in ('manutenção', 'manutencao', 'manut');

create or replace function public.touch_computadores_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_touch_computadores_updated_at on public.computadores;
create trigger trg_touch_computadores_updated_at
before update on public.computadores
for each row
execute function public.touch_computadores_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome, tipo)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(coalesce(new.email, 'Aluno'), '@', 1)),
    case
      when new.raw_user_meta_data ->> 'tipo' in ('aluno', 'professor')
        then new.raw_user_meta_data ->> 'tipo'
      else 'aluno'
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        nome = excluded.nome;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_infolab on auth.users;
create trigger on_auth_user_created_infolab
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.computadores enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "computadores_select_authenticated" on public.computadores;
create policy "computadores_select_authenticated"
on public.computadores
for select
to authenticated
using (true);

drop policy if exists "computadores_update_professor" on public.computadores;
create policy "computadores_update_professor"
on public.computadores
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.tipo = 'professor'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.tipo = 'professor'
  )
);

insert into public.computadores (numero, status)
select n, 'livre'
from generate_series(1, 30) as n
on conflict (numero) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'computadores'
  ) then
    alter publication supabase_realtime add table public.computadores;
  end if;
end;
$$;
