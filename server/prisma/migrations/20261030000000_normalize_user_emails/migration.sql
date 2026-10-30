-- Store emails trimmed and lowercased, matching registration's normalisation.
-- Aborts without changes if two accounts differ only by case/whitespace;
-- those must be merged or renamed manually first.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "User"
    GROUP BY lower(trim(email))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate emails differing only by case/whitespace exist in "User"; resolve them before normalising';
  END IF;
END $$;

UPDATE "User" SET email = lower(trim(email)) WHERE email <> lower(trim(email));
