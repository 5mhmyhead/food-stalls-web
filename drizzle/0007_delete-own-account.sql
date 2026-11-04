-- Custom SQL migration file, put your code below! --
create function public.delete_own_account() returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not_signed_in';
  end if;

  -- never delete the only manager
  if exists (select 1 from public.profiles where id = uid and account_type = 'ADMIN')
     and (select count(*) from public.profiles where account_type = 'ADMIN') = 1 then
    raise exception 'last_admin';
  end if;

  delete from auth.users where id = uid;  -- the profile row is removed by cascade
end $$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;