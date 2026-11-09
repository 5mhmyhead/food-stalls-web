-- Custom SQL migration file, put your code below! --
create function public.revert_own_admin() returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  admin_count int;
begin
  if uid is null then
    raise exception 'not_signed_in';
  end if;

  -- lock the admin rows so two simultaneous reverts can't both pass the check
  select count(*) into admin_count
  from (select id from public.profiles where account_type = 'ADMIN' for update) a;

  if not exists (
    select 1 from public.profiles where id = uid and account_type = 'ADMIN'
  ) then
    raise exception 'not_admin';
  end if;

  if admin_count <= 1 then
    raise exception 'last_admin';
  end if;

  update public.profiles set account_type = 'WORKER' where id = uid;
end $$;

revoke execute on function public.revert_own_admin() from public, anon;
grant execute on function public.revert_own_admin() to authenticated;