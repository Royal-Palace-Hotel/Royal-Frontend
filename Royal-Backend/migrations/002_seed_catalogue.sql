INSERT INTO room_types (id, slug, translation_key, base_price, currency, images, size_sqm, max_guests, amenities, total_inventory)
VALUES
  ('classic', 'chambre-classique', 'classic', 65.00, 'EUR', '["/images/rooms/room-4.jpg", "/images/rooms/room-1.jpg"]'::jsonb, 22, 2, '["ac", "wifi", "tv", "bathroom"]'::jsonb, 8),
  ('superior', 'chambre-superieure', 'superior', 95.00, 'EUR', '["/images/rooms/room-1.jpg", "/images/rooms/room-2.jpg"]'::jsonb, 28, 3, '["ac", "wifi", "tv", "minibar", "safe", "bathroom"]'::jsonb, 6),
  ('deluxe', 'chambre-deluxe', 'deluxe', 130.00, 'EUR', '["/images/rooms/room-2.jpg", "/images/rooms/room-3.jpg"]'::jsonb, 34, 3, '["ac", "wifi", "tv", "minibar", "safe", "bathroom", "balcony"]'::jsonb, 4),
  ('suite', 'suite-royale', 'suite', 220.00, 'EUR', '["/images/rooms/room-3.jpg", "/images/rooms/room-4.jpg"]'::jsonb, 55, 4, '["ac", "wifi", "tv", "minibar", "safe", "bathroom", "balcony", "lounge"]'::jsonb, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_sections (id, title_fr, title_en, sort_order)
VALUES
  ('starters', 'Entrées', 'Starters', 1),
  ('mains', 'Plats Principaux', 'Main Courses', 2),
  ('desserts', 'Desserts', 'Desserts', 3),
  ('drinks', 'Bar & Boissons', 'Bar & Drinks', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, section_id, name_fr, name_en, description_fr, description_en, price, currency, sort_order)
VALUES
  ('s1', 'starters', 'Salade de crudités du jardin', 'Garden salad', 'Légumes frais de notre potager, vinaigrette maison', 'Fresh vegetables from our garden, homemade dressing', 12000, 'MGA', 1),
  ('s2', 'starters', 'Samoussas malgaches', 'Malagasy samosas', 'Trois pièces, viande ou légumes, sauce pimentée', 'Three pieces, meat or vegetable, chili sauce', 10000, 'MGA', 2),
  ('s3', 'starters', 'Soupe de courge et gingembre', 'Squash and ginger soup', 'Velouté onctueux, crème fraîche', 'Creamy velouté, fresh cream', 11000, 'MGA', 3),
  ('m1', 'mains', 'Romazava traditionnel malgache', 'Traditional Malagasy Romazava', 'Bouillon de viande et brèdes mafana, riz blanc', 'Meat broth with mafana greens, white rice', 28000, 'MGA', 1),
  ('m2', 'mains', 'Poisson grillé, sauce vanille de Madagascar', 'Grilled fish, Madagascar vanilla sauce', 'Poisson du jour, sauce vanille bourbon, légumes de saison', 'Catch of the day, bourbon vanilla sauce, seasonal vegetables', 32000, 'MGA', 2),
  ('m3', 'mains', 'Filet de zébu au poivre sauvage', 'Zebu filet with wild pepper', 'Poivre sauvage de Madagascar, gratin de pommes de terre', 'Madagascar wild pepper, potato gratin', 35000, 'MGA', 3),
  ('m4', 'mains', 'Curry de crevettes au lait de coco', 'Shrimp curry with coconut milk', 'Riz parfumé, brochette de légumes grillés', 'Fragrant rice, grilled vegetable skewer', 34000, 'MGA', 4),
  ('d1', 'desserts', 'Assiette de fruits tropicaux', 'Tropical fruit plate', 'Fruits frais du jardin de l''hôtel', 'Fresh fruits from the hotel''s garden', 9000, 'MGA', 1),
  ('d2', 'desserts', 'Mousse au chocolat et vanille de Madagascar', 'Chocolate mousse with Madagascar vanilla', 'Chocolat noir 70%, éclats de vanille bourbon', '70% dark chocolate, bourbon vanilla shavings', 12000, 'MGA', 2),
  ('b1', 'drinks', 'Cocktail signature "Royal Palace"', '"Royal Palace" signature cocktail', 'Rhum arrangé maison, fruits de la passion', 'House-infused rum, passion fruit', 15000, 'MGA', 1),
  ('b2', 'drinks', 'Jus frais naturel', 'Fresh natural juice', 'Ananas, mangue ou fruit de la passion', 'Pineapple, mango or passion fruit', 7000, 'MGA', 2),
  ('b3', 'drinks', 'Sélection de vins', 'Wine selection', 'Vins locaux et importés au verre ou en bouteille', 'Local and imported wines by the glass or bottle', 18000, 'MGA', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO spa_treatments (id, translation_key, duration_key, duration_minutes, price, currency)
VALUES
  ('t1', 'treatment1', 'treatment1Duration', 60, 45000, 'MGA'),
  ('t2', 'treatment2', 'treatment2Duration', 75, 60000, 'MGA'),
  ('t3', 'treatment3', 'treatment3Duration', 45, 40000, 'MGA'),
  ('t4', 'treatment4', 'treatment4Duration', 50, 42000, 'MGA'),
  ('t5', 'treatment5', 'treatment5Duration', 90, 95000, 'MGA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_venues (id, translation_key, image_path, capacity)
VALUES
  ('room1', 'room1', '/images/events/events-1.jpg', 150),
  ('room2', 'room2', '/images/events/events-2.jpg', 60),
  ('room3', 'room3', '/images/events/events-3.jpg', 200)
ON CONFLICT (id) DO NOTHING;
