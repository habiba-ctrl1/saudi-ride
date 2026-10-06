-- 0020: Pricing Book as the single source of pricing rules (additive, idempotent).
-- route_price_approvals already holds one row per (route family, trip type, vehicle category)
-- with observed range + final_approved_price. We extend it instead of creating a duplicate table:
--   final_approved_price = RECOMMENDED selling price (set by owner)
--   price_min            = lowest acceptable selling price
--   est_cost             = estimated driver/vendor cost
--   border_fee           = border-crossing fees (cross-border routes)
--   range_low/range_high = optional owner-set range shown to the operator (falls back to observed range)
--   category             = riyadh | airport_city | intercity | border | ziyarat

ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS range_low double precision;
ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS range_high double precision;
ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS price_min double precision;
ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS est_cost double precision;
ALTER TABLE route_price_approvals ADD COLUMN IF NOT EXISTS border_fee double precision;
CREATE INDEX IF NOT EXISTS route_price_approvals_category_idx ON route_price_approvals (category)
