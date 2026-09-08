CREATE TABLE room_types (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  slug TEXT NOT NULL UNIQUE,
  translation_key TEXT NOT NULL UNIQUE,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  size_sqm INTEGER NOT NULL CHECK (size_sqm > 0),
  max_guests INTEGER NOT NULL CHECK (max_guests > 0),
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_inventory INTEGER NOT NULL CHECK (total_inventory >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER NOT NULL CHECK (adults > 0),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (check_out > check_in)
);

CREATE TABLE booking_rooms (
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  room_type_id TEXT NOT NULL REFERENCES room_types(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  nightly_rate NUMERIC(10, 2) NOT NULL CHECK (nightly_rate >= 0),
  currency CHAR(3) NOT NULL,
  PRIMARY KEY (booking_id, room_type_id)
);

CREATE INDEX booking_dates_idx ON bookings (check_in, check_out) WHERE status IN ('pending', 'confirmed');
CREATE INDEX booking_rooms_room_type_idx ON booking_rooms (room_type_id);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_messages_status_created_idx ON contact_messages (status, created_at DESC);

CREATE TABLE event_inquiries (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date DATE,
  guest_count INTEGER CHECK (guest_count > 0),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX event_inquiries_status_created_idx ON event_inquiries (status, created_at DESC);

CREATE TABLE menu_sections (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE CHECK (sort_order >= 0)
);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  section_id TEXT NOT NULL REFERENCES menu_sections(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'MGA',
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (section_id, sort_order)
);

CREATE TABLE spa_treatments (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  translation_key TEXT NOT NULL UNIQUE,
  duration_key TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'MGA',
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE event_venues (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  translation_key TEXT NOT NULL UNIQUE,
  image_path TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_types_set_updated_at
BEFORE UPDATE ON room_types
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
