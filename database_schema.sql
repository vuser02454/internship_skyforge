-- 1. Create a table for User Profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text check (role in ('freelancer', 'client')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Create a table for Tasks (Job Postings)
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  budget numeric not null,
  status text default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for tasks
alter table public.tasks enable row level security;
create policy "Tasks are viewable by everyone." on tasks for select using (true);
create policy "Clients can insert their own tasks." on tasks for insert with check (auth.uid() = client_id);
create policy "Clients can update their own tasks." on tasks for update using (auth.uid() = client_id);

-- 3. Create an automated trigger
-- This automatically creates a row in 'profiles' whenever a new user signs up!
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'user_role', 'freelancer') -- defaults to freelancer
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
