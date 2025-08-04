/*
  # Module Résidences Meublées

  1. Nouvelle Table
    - `furnished_residences` - Gestion des résidences meublées
    - `furnished_bookings` - Réservations des résidences
    - `furnished_amenities` - Équipements disponibles

  2. Fonctionnalités
    - Location courte durée (journalière)
    - Location longue durée (mensuelle)
    - Gestion des équipements et services
    - Système de réservation
    - Tarification flexible

  3. Sécurité
    - RLS activé
    - Permissions par agence
*/

-- Table des résidences meublées
CREATE TABLE IF NOT EXISTS furnished_residences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  type text NOT NULL CHECK (type IN ('studio', 'apartment', 'villa', 'duplex')),
  rooms integer NOT NULL CHECK (rooms > 0),
  capacity integer NOT NULL CHECK (capacity > 0),
  daily_rate numeric(10,2) NOT NULL CHECK (daily_rate >= 0),
  monthly_rate numeric(10,2) NOT NULL CHECK (monthly_rate >= 0),
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  description text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS furnished_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  residence_id uuid NOT NULL REFERENCES furnished_residences(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_phone text NOT NULL,
  guest_email text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests_count integer NOT NULL CHECK (guests_count > 0),
  booking_type text NOT NULL CHECK (booking_type IN ('daily', 'monthly')),
  total_amount numeric(12,2) NOT NULL,
  deposit numeric(12,2) DEFAULT 0,
  status text NOT NULL CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_furnished_residences_agency_id ON furnished_residences(agency_id);
CREATE INDEX IF NOT EXISTS idx_furnished_residences_available ON furnished_residences(is_available);
CREATE INDEX IF NOT EXISTS idx_furnished_residences_type ON furnished_residences(type);

CREATE INDEX IF NOT EXISTS idx_furnished_bookings_residence_id ON furnished_bookings(residence_id);
CREATE INDEX IF NOT EXISTS idx_furnished_bookings_agency_id ON furnished_bookings(agency_id);
CREATE INDEX IF NOT EXISTS idx_furnished_bookings_dates ON furnished_bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_furnished_bookings_status ON furnished_bookings(status);

-- Triggers pour les timestamps
CREATE TRIGGER update_furnished_residences_updated_at 
  BEFORE UPDATE ON furnished_residences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_furnished_bookings_updated_at 
  BEFORE UPDATE ON furnished_bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE furnished_residences ENABLE ROW LEVEL SECURITY;
ALTER TABLE furnished_bookings ENABLE ROW LEVEL SECURITY;

-- Policies pour les résidences meublées
CREATE POLICY "Users can manage furnished residences in their agency" 
  ON furnished_residences FOR ALL TO authenticated 
  USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Policies pour les réservations
CREATE POLICY "Users can manage bookings in their agency" 
  ON furnished_bookings FOR ALL TO authenticated 
  USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Fonction pour vérifier la disponibilité
CREATE OR REPLACE FUNCTION check_residence_availability(
  residence_uuid uuid,
  check_in_date date,
  check_out_date date
) RETURNS boolean AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM furnished_bookings
  WHERE residence_id = residence_uuid
    AND status IN ('confirmed', 'checked_in')
    AND (
      (check_in_date >= check_in AND check_in_date < check_out) OR
      (check_out_date > check_in AND check_out_date <= check_out) OR
      (check_in_date <= check_in AND check_out_date >= check_out)
    );
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le montant total
CREATE OR REPLACE FUNCTION calculate_booking_amount(
  residence_uuid uuid,
  check_in_date date,
  check_out_date date,
  booking_type_param text
) RETURNS numeric AS $$
DECLARE
  daily_rate_val numeric;
  monthly_rate_val numeric;
  days_count integer;
  total_amount numeric;
BEGIN
  SELECT daily_rate, monthly_rate INTO daily_rate_val, monthly_rate_val
  FROM furnished_residences
  WHERE id = residence_uuid;
  
  days_count := check_out_date - check_in_date;
  
  IF booking_type_param = 'daily' THEN
    total_amount := daily_rate_val * days_count;
  ELSIF booking_type_param = 'monthly' THEN
    total_amount := monthly_rate_val * CEIL(days_count / 30.0);
  ELSE
    total_amount := 0;
  END IF;
  
  RETURN total_amount;
END;
$$ LANGUAGE plpgsql;