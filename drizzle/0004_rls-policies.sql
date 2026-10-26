-- Custom SQL migration file, put your code below! --
-- helper: is the current user a manager?
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and account_type = 'ADMIN'
  )
$$;

-- let signed-in users reach the tables (policies below decide what they may do)
grant select, insert, update, delete on
  public.profiles, public.categories, public.products,
  public.orders, public.order_items
to authenticated;

-- profiles (the "read own profile" policy already exists from migration 0001)
create policy "admins read all profiles" on public.profiles
  for select to authenticated using (public.is_admin());

-- categories and products
create policy "read categories" on public.categories
  for select to authenticated using (true);
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "read products" on public.products
  for select to authenticated using (true);
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- orders
create policy "read orders" on public.orders
  for select to authenticated using (true);
create policy "create own orders" on public.orders
  for insert to authenticated with check (employee_id = (select auth.uid()));
create policy "update own or admin orders" on public.orders
  for update to authenticated
  using (employee_id = (select auth.uid()) or public.is_admin());
create policy "admins delete orders" on public.orders
  for delete to authenticated using (public.is_admin());

-- order_items
create policy "read order items" on public.order_items
  for select to authenticated using (true);
create policy "add items to own orders" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o
            where o.id = order_id
              and (o.employee_id = (select auth.uid()) or public.is_admin()))
  );
create policy "admins manage order items" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());