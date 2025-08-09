/*
  # Créer les comptes administrateurs par défaut

  1. Comptes Admin
    - Super administrateur: admin@gestion360immo.com
    - Administrateur support: support@gestion360immo.com
  
  2. Sécurité
    - Mots de passe sécurisés
    - Permissions granulaires
    - Accès séparé des agences
*/

-- Créer les comptes administrateurs dans la table platform_admins
INSERT INTO platform_admins (
  id,
  email,
  first_name,
  last_name,
  role,
  permissions,
  is_active
) VALUES 
(
  gen_random_uuid(),
  'admin@gestion360immo.com',
  'Admin',
  'Principal',
  'super_admin',
  '{
    "agencyManagement": true,
    "subscriptionManagement": true,
    "platformSettings": true,
    "reports": true,
    "userSupport": true
  }'::jsonb,
  true
),
(
  gen_random_uuid(),
  'support@gestion360immo.com',
  'Support',
  'Admin',
  'admin',
  '{
    "agencyManagement": true,
    "subscriptionManagement": true,
    "platformSettings": false,
    "reports": true,
    "userSupport": true
  }'::jsonb,
  true
)
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();