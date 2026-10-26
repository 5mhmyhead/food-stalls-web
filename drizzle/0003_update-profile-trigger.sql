-- Custom SQL migration file, put your code below! --
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', lower(new.email));
  return new;
end $$;