/*
  # Fix RLS Policies - Remove Infinite Recursion

  1. Security Updates
    - Simplify users table RLS policies to prevent recursion
    - Fix circular dependencies between users and agencies tables
    - Ensure safe INSERT policies for user registration

  2. Changes Made
    - Replace complex policies with simple auth.uid() checks
    - Remove recursive subqueries in RLS policies
    - Add proper INSERT policies for new user registration
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view users from their agency" ON users;
DROP POLICY IF EXISTS "Directors can manage users in their agency" ON users;
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Create simple, non-recursive policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Simplify agencies policies to prevent recursion
DROP POLICY IF EXISTS "Directors can update their agency" ON agencies;
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Allow all operations on agencies" ON agencies;

CREATE POLICY "Allow agency creation"
  ON agencies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view agencies"
  ON agencies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Directors can update agencies"
  ON agencies
  FOR UPDATE
  TO authenticated
  USING (director_id = auth.uid())
  WITH CHECK (director_id = auth.uid());

-- Ensure other tables have simple policies
DROP POLICY IF EXISTS "Users can manage owners in their agency" ON owners;
DROP POLICY IF EXISTS "Users can view owners from their agency" ON owners;
DROP POLICY IF EXISTS "Allow all operations on owners" ON owners;

CREATE POLICY "Users can manage owners in their agency"
  ON owners
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  );

-- Fix properties policies
DROP POLICY IF EXISTS "Users can manage properties in their agency" ON properties;
DROP POLICY IF EXISTS "Users can view properties from their agency" ON properties;
DROP POLICY IF EXISTS "Allow all operations on properties" ON properties;

CREATE POLICY "Users can manage properties in their agency"
  ON properties
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  );

-- Fix tenants policies
DROP POLICY IF EXISTS "Users can manage tenants in their agency" ON tenants;
DROP POLICY IF EXISTS "Users can view tenants from their agency" ON tenants;
DROP POLICY IF EXISTS "Users can update tenants in their agency" ON tenants;
DROP POLICY IF EXISTS "All agencies can search tenant history for collaboration" ON tenants;
DROP POLICY IF EXISTS "Allow all operations on tenants" ON tenants;

CREATE POLICY "Users can manage tenants in their agency"
  ON tenants
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "All agencies can search tenant history"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (true);

-- Fix contracts policies
DROP POLICY IF EXISTS "Users can manage contracts in their agency" ON contracts;
DROP POLICY IF EXISTS "Allow all operations on contracts" ON contracts;

CREATE POLICY "Users can manage contracts in their agency"
  ON contracts
  FOR ALL
  TO authenticated
  USING (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  );