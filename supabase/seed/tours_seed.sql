-- Seed: copies the eight mock tours into Supabase, fully translated EN/IT/DE/FR.
-- Idempotent — safe to re-run; uses ON CONFLICT (slug) to upsert.
-- Run AFTER 0001_init.sql and 0002_content.sql.

insert into public.tours
  (slug, category, title, summary, duration_days, price_from_eur, hero_image, gallery, destinations, highlights, rating, review_count, featured, display_order)
values
(
  'golden-triangle-classic', 'golden-triangle',
  '{"en":"The Classic Golden Triangle","it":"Il Triangolo d''Oro Classico","de":"Das klassische Goldene Dreieck","fr":"Le Triangle d''Or classique"}'::jsonb,
  '{"en":"India''s essential first journey: Delhi, Agra, Jaipur — at a slow, private pace.","it":"Il primo viaggio essenziale in India: Delhi, Agra, Jaipur — al tuo ritmo, in privato.","de":"Indiens essentielle erste Reise: Delhi, Agra, Jaipur — in ruhigem, privatem Tempo.","fr":"Le premier voyage essentiel en Inde : Delhi, Agra, Jaipur — à un rythme lent et privé."}'::jsonb,
  7, 1290,
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000',
  array['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600','https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1600','https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600'],
  '[
    {"slug":"delhi","name":{"en":"Delhi","it":"Delhi","de":"Delhi","fr":"Delhi"}},
    {"slug":"agra","name":{"en":"Agra","it":"Agra","de":"Agra","fr":"Agra"}},
    {"slug":"jaipur","name":{"en":"Jaipur","it":"Jaipur","de":"Jaipur","fr":"Jaipur"}}
  ]'::jsonb,
  '[
    {"en":"Taj Mahal at sunrise, before the crowds","it":"Taj Mahal all''alba, prima della folla","de":"Taj Mahal bei Sonnenaufgang, vor den Menschenmassen","fr":"Taj Mahal au lever du soleil, avant la foule"},
    {"en":"Amber Fort, with a local historian","it":"Forte Amber con uno storico locale","de":"Amber Fort mit einem lokalen Historiker","fr":"Fort d''Amber avec un historien local"},
    {"en":"Old Delhi by cycle rickshaw","it":"Vecchia Delhi in cycle rickshaw","de":"Alt-Delhi per Cycle-Rickshaw","fr":"Vieux Delhi en cycle-rickshaw"},
    {"en":"Block printing workshop in Bagru","it":"Laboratorio di stampa a blocchi a Bagru","de":"Blockdruck-Workshop in Bagru","fr":"Atelier d''impression à Bagru"}
  ]'::jsonb,
  4.9, 312, true, 10
),
(
  'rajasthan-royal', 'rajasthan',
  '{"en":"Rajasthan, by Royal Roads","it":"Rajasthan, sulle vie reali","de":"Rajasthan, auf königlichen Wegen","fr":"Rajasthan, par les routes royales"}'::jsonb,
  '{"en":"From Jaipur''s pink palaces to the Thar desert, sleeping in restored havelis.","it":"Dai palazzi rosa di Jaipur al deserto del Thar, dormendo in haveli restaurate.","de":"Von Jaipurs rosa Palästen zur Thar-Wüste, übernachten in restaurierten Havelis.","fr":"Des palais roses de Jaipur au désert du Thar, en dormant dans des havelis restaurés."}'::jsonb,
  12, 2390,
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000',
  array['https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600','https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600'],
  '[
    {"slug":"jaipur","name":{"en":"Jaipur","it":"Jaipur","de":"Jaipur","fr":"Jaipur"}},
    {"slug":"jodhpur","name":{"en":"Jodhpur","it":"Jodhpur","de":"Jodhpur","fr":"Jodhpur"}},
    {"slug":"jaisalmer","name":{"en":"Jaisalmer","it":"Jaisalmer","de":"Jaisalmer","fr":"Jaisalmer"}},
    {"slug":"udaipur","name":{"en":"Udaipur","it":"Udaipur","de":"Udaipur","fr":"Udaipur"}}
  ]'::jsonb,
  '[
    {"en":"Mehrangarh Fort at golden hour","it":"Forte di Mehrangarh all''ora d''oro","de":"Mehrangarh Fort zur goldenen Stunde","fr":"Fort de Mehrangarh à l''heure dorée"},
    {"en":"Camel safari into the Thar desert","it":"Safari in cammello nel deserto del Thar","de":"Kamelsafari in die Thar-Wüste","fr":"Safari à dos de chameau dans le désert du Thar"},
    {"en":"Sunset boat ride on Lake Pichola","it":"Tramonto in barca sul Lago Pichola","de":"Bootsfahrt bei Sonnenuntergang auf dem Pichola-See","fr":"Coucher de soleil en bateau sur le lac Pichola"},
    {"en":"Pushkar bazaar at twilight","it":"Bazar di Pushkar al crepuscolo","de":"Pushkar-Basar in der Dämmerung","fr":"Bazar de Pushkar au crépuscule"}
  ]'::jsonb,
  4.95, 187, true, 20
),
(
  'kerala-backwaters', 'kerala',
  '{"en":"Kerala, Slowly","it":"Kerala, lentamente","de":"Kerala, langsam","fr":"Kerala, lentement"}'::jsonb,
  '{"en":"Tea hills, spice gardens, an overnight on a private houseboat — the south at its quietest.","it":"Colline di tè, giardini di spezie, una notte su una houseboat privata — il sud nella sua quiete.","de":"Teeberge, Gewürzgärten, eine Nacht auf einem privaten Hausboot — der Süden in seiner ruhigsten Form.","fr":"Collines de thé, jardins d''épices, une nuit sur une houseboat privée — le sud dans son calme."}'::jsonb,
  9, 1790,
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000',
  array['https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1600','https://images.unsplash.com/photo-1609337448894-1ab40b85d3df?q=80&w=1600'],
  '[
    {"slug":"cochin","name":{"en":"Cochin","it":"Cochin","de":"Cochin","fr":"Cochin"}},
    {"slug":"munnar","name":{"en":"Munnar","it":"Munnar","de":"Munnar","fr":"Munnar"}},
    {"slug":"thekkady","name":{"en":"Thekkady","it":"Thekkady","de":"Thekkady","fr":"Thekkady"}},
    {"slug":"alleppey","name":{"en":"Alleppey","it":"Alleppey","de":"Alleppey","fr":"Alleppey"}}
  ]'::jsonb,
  '[
    {"en":"Overnight on a private houseboat","it":"Notte su una houseboat privata","de":"Übernachtung auf einem privaten Hausboot","fr":"Nuit sur une houseboat privée"},
    {"en":"Tea plantation walk in Munnar","it":"Passeggiata tra le piantagioni di tè a Munnar","de":"Spaziergang durch Teeplantagen in Munnar","fr":"Balade dans les plantations de thé de Munnar"},
    {"en":"Kathakali performance in Cochin","it":"Spettacolo Kathakali a Cochin","de":"Kathakali-Aufführung in Cochin","fr":"Spectacle de Kathakali à Cochin"},
    {"en":"Authentic Ayurvedic treatment","it":"Trattamento ayurvedico autentico","de":"Authentische Ayurveda-Behandlung","fr":"Soin ayurvédique authentique"}
  ]'::jsonb,
  4.92, 241, true, 30
),
(
  'himalaya-ladakh', 'himalaya',
  '{"en":"Ladakh, on the Roof of the World","it":"Ladakh, sul tetto del mondo","de":"Ladakh, auf dem Dach der Welt","fr":"Ladakh, sur le toit du monde"}'::jsonb,
  '{"en":"Buddhist monasteries, high passes, and the impossible blue of Pangong Lake.","it":"Monasteri buddisti, passi d''alta quota e l''impossibile azzurro del Lago Pangong.","de":"Buddhistische Klöster, hohe Pässe und das unmögliche Blau des Pangong-Sees.","fr":"Monastères bouddhistes, hauts cols, et le bleu impossible du lac Pangong."}'::jsonb,
  10, 2490,
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000',
  array['https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1600','https://images.unsplash.com/photo-1626015449180-c7a3a6d8f6d6?q=80&w=1600'],
  '[
    {"slug":"leh","name":{"en":"Leh","it":"Leh","de":"Leh","fr":"Leh"}},
    {"slug":"nubra-valley","name":{"en":"Nubra Valley","it":"Valle di Nubra","de":"Nubra-Tal","fr":"Vallée de Nubra"}},
    {"slug":"pangong-lake","name":{"en":"Pangong Lake","it":"Lago Pangong","de":"Pangong-See","fr":"Lac Pangong"}}
  ]'::jsonb,
  '[
    {"en":"Pangong Lake at altitude","it":"Lago Pangong in alta quota","de":"Pangong-See in großer Höhe","fr":"Lac Pangong en altitude"},
    {"en":"Buddhist monastery circuit","it":"Circuito dei monasteri buddisti","de":"Buddhistische Klosterrundreise","fr":"Circuit des monastères bouddhistes"},
    {"en":"Crossing Khardung La pass","it":"Passo di Khardung La","de":"Überquerung des Khardung-La-Passes","fr":"Traversée du col de Khardung La"},
    {"en":"Nubra Valley sand dunes","it":"Dune di sabbia di Nubra","de":"Sanddünen des Nubra-Tals","fr":"Dunes de la vallée de Nubra"}
  ]'::jsonb,
  4.97, 96, false, 40
),
(
  'south-india-temples', 'south-india',
  '{"en":"Temples of the South","it":"I templi del Sud","de":"Tempel des Südens","fr":"Les temples du Sud"}'::jsonb,
  '{"en":"Tamil Nadu''s towering temples, French-quarter Pondicherry, Chola bronzes.","it":"Templi torreggianti del Tamil Nadu, il quartiere francese di Pondicherry, bronzi Chola.","de":"Tamil Nadus aufragende Tempel, das französische Viertel von Pondicherry, Chola-Bronzen.","fr":"Les temples imposants du Tamil Nadu, le quartier français de Pondichéry, les bronzes Chola."}'::jsonb,
  14, 2890,
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000',
  array['https://images.unsplash.com/photo-1582553081697-a2e0e0e7b86e?q=80&w=1600'],
  '[
    {"slug":"chennai","name":{"en":"Chennai","it":"Chennai","de":"Chennai","fr":"Chennai"}},
    {"slug":"mahabalipuram","name":{"en":"Mahabalipuram","it":"Mahabalipuram","de":"Mahabalipuram","fr":"Mahabalipuram"}},
    {"slug":"pondicherry","name":{"en":"Pondicherry","it":"Pondicherry","de":"Pondicherry","fr":"Pondichéry"}},
    {"slug":"tanjore","name":{"en":"Tanjore","it":"Tanjore","de":"Tanjore","fr":"Tanjore"}},
    {"slug":"madurai","name":{"en":"Madurai","it":"Madurai","de":"Madurai","fr":"Madurai"}}
  ]'::jsonb,
  '[
    {"en":"Meenakshi temple by torchlight","it":"Tempio di Meenakshi a lume di torcia","de":"Meenakshi-Tempel im Fackelschein","fr":"Temple de Meenakshi à la lueur des torches"},
    {"en":"Chola bronzes in Tanjore","it":"Bronzi Chola a Tanjore","de":"Chola-Bronzen in Tanjore","fr":"Bronzes Chola à Tanjore"},
    {"en":"French quarter of Pondicherry","it":"Quartiere francese di Pondicherry","de":"Französisches Viertel von Pondicherry","fr":"Quartier français de Pondichéry"},
    {"en":"Shore temple of Mahabalipuram","it":"Tempio sulla costa di Mahabalipuram","de":"Shore-Tempel von Mahabalipuram","fr":"Temple côtier de Mahabalipuram"}
  ]'::jsonb,
  4.88, 134, false, 50
),
(
  'varanasi-spiritual', 'spiritual',
  '{"en":"Varanasi & the Sacred Ganges","it":"Varanasi e il sacro Gange","de":"Varanasi und der heilige Ganges","fr":"Varanasi et le Gange sacré"}'::jsonb,
  '{"en":"Sunrise on the Ganges, the Aarti ceremony, and the Buddha''s first sermon at Sarnath.","it":"Alba sul Gange, la cerimonia Aarti e il primo discorso del Buddha a Sarnath.","de":"Sonnenaufgang am Ganges, die Aarti-Zeremonie und Buddhas erste Predigt in Sarnath.","fr":"Lever du soleil sur le Gange, la cérémonie Aarti et le premier sermon du Bouddha à Sarnath."}'::jsonb,
  5, 990,
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000',
  array['https://images.unsplash.com/photo-1561361398-a8a08e0bbd87?q=80&w=1600'],
  '[
    {"slug":"varanasi","name":{"en":"Varanasi","it":"Varanasi","de":"Varanasi","fr":"Varanasi"}},
    {"slug":"sarnath","name":{"en":"Sarnath","it":"Sarnath","de":"Sarnath","fr":"Sarnath"}}
  ]'::jsonb,
  '[
    {"en":"Ganga Aarti from a private boat","it":"Ganga Aarti da una barca privata","de":"Ganga Aarti von einem privaten Boot","fr":"Ganga Aarti depuis un bateau privé"},
    {"en":"Sunrise boat ride on the Ganges","it":"Giro in barca all''alba sul Gange","de":"Bootsfahrt bei Sonnenaufgang auf dem Ganges","fr":"Promenade en bateau à l''aube sur le Gange"},
    {"en":"Sarnath, where Buddha first taught","it":"Sarnath, dove Buddha insegnò","de":"Sarnath, wo Buddha zum ersten Mal lehrte","fr":"Sarnath, où Bouddha enseigna"},
    {"en":"Silk weavers'' quarter of Varanasi","it":"Quartiere dei tessitori di seta a Varanasi","de":"Seidenweberviertel von Varanasi","fr":"Quartier des tisserands de soie de Varanasi"}
  ]'::jsonb,
  4.86, 178, true, 60
),
(
  'wildlife-tiger-trail', 'wildlife',
  '{"en":"On the Trail of the Tiger","it":"Sulle tracce della tigre","de":"Auf den Spuren des Tigers","fr":"Sur les traces du tigre"}'::jsonb,
  '{"en":"Two daily safaris through India''s best tiger reserves, with a private naturalist.","it":"Due safari quotidiani nelle migliori riserve di tigri dell''India, con un naturalista privato.","de":"Zwei tägliche Safaris durch Indiens beste Tigerreservate, mit einem privaten Naturforscher.","fr":"Deux safaris quotidiens dans les meilleures réserves de tigres de l''Inde, avec un naturaliste privé."}'::jsonb,
  8, 2190,
  'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000',
  array['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600'],
  '[
    {"slug":"ranthambore","name":{"en":"Ranthambore","it":"Ranthambore","de":"Ranthambore","fr":"Ranthambore"}},
    {"slug":"bandhavgarh","name":{"en":"Bandhavgarh","it":"Bandhavgarh","de":"Bandhavgarh","fr":"Bandhavgarh"}},
    {"slug":"kanha","name":{"en":"Kanha","it":"Kanha","de":"Kanha","fr":"Kanha"}}
  ]'::jsonb,
  '[
    {"en":"Two daily tiger jeep safaris","it":"Due safari quotidiani in jeep","de":"Zwei tägliche Tiger-Jeep-Safaris","fr":"Deux safaris quotidiens en jeep"},
    {"en":"Private naturalist guide","it":"Guida naturalista privata","de":"Privater Naturforscher als Guide","fr":"Guide naturaliste privé"},
    {"en":"Luxury jungle lodge","it":"Lodge di lusso nella giungla","de":"Luxus-Dschungellodge","fr":"Lodge de luxe en pleine jungle"},
    {"en":"Ethical elephant encounter","it":"Incontro etico con gli elefanti","de":"Ethische Elefantenbegegnung","fr":"Rencontre éthique avec les éléphants"}
  ]'::jsonb,
  4.91, 89, false, 70
),
(
  'grand-india-explorer', 'south-india',
  '{"en":"Grand India, North to South","it":"Grande India, da Nord a Sud","de":"Großes Indien, von Nord nach Süd","fr":"Grande Inde, du Nord au Sud"}'::jsonb,
  '{"en":"Three weeks, the full arc of India — North to South, palaces to backwaters.","it":"Tre settimane, l''arco completo dell''India — da Nord a Sud, dai palazzi alle backwater.","de":"Drei Wochen, der gesamte Bogen Indiens — von Nord nach Süd, von Palästen zu Backwaters.","fr":"Trois semaines, l''arc complet de l''Inde — du Nord au Sud, des palais aux backwaters."}'::jsonb,
  21, 4990,
  'https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2000',
  array['https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600'],
  '[
    {"slug":"delhi","name":{"en":"Delhi","it":"Delhi","de":"Delhi","fr":"Delhi"}},
    {"slug":"agra","name":{"en":"Agra","it":"Agra","de":"Agra","fr":"Agra"}},
    {"slug":"jaipur","name":{"en":"Jaipur","it":"Jaipur","de":"Jaipur","fr":"Jaipur"}},
    {"slug":"varanasi","name":{"en":"Varanasi","it":"Varanasi","de":"Varanasi","fr":"Varanasi"}},
    {"slug":"cochin","name":{"en":"Cochin","it":"Cochin","de":"Cochin","fr":"Cochin"}},
    {"slug":"munnar","name":{"en":"Munnar","it":"Munnar","de":"Munnar","fr":"Munnar"}},
    {"slug":"alleppey","name":{"en":"Alleppey","it":"Alleppey","de":"Alleppey","fr":"Alleppey"}}
  ]'::jsonb,
  '[
    {"en":"Full arc of India in three weeks","it":"L''arco completo dell''India in tre settimane","de":"Der gesamte Bogen Indiens in drei Wochen","fr":"L''arc complet de l''Inde en trois semaines"},
    {"en":"North and South, contrasted","it":"Nord e Sud, a confronto","de":"Norden und Süden im Kontrast","fr":"Nord et Sud, en contraste"},
    {"en":"Private English-speaking guide","it":"Guida privata di lingua italiana","de":"Privater deutschsprachiger Guide","fr":"Guide privé francophone"},
    {"en":"Heritage and palace properties","it":"Proprietà di lusso e palazzi storici","de":"Heritage- und Palast-Hotels","fr":"Propriétés patrimoniales et palais"}
  ]'::jsonb,
  4.99, 67, false, 80
)
on conflict (slug) do update set
  category       = excluded.category,
  title          = excluded.title,
  summary        = excluded.summary,
  duration_days  = excluded.duration_days,
  price_from_eur = excluded.price_from_eur,
  hero_image     = excluded.hero_image,
  gallery        = excluded.gallery,
  destinations   = excluded.destinations,
  highlights     = excluded.highlights,
  rating         = excluded.rating,
  review_count   = excluded.review_count,
  featured       = excluded.featured,
  display_order  = excluded.display_order;

-- ---------- Destinations seed (lightweight) ----------
insert into public.destinations (slug, name, region, hero_image, display_order) values
  ('delhi',    '{"en":"Delhi","it":"Delhi","de":"Delhi","fr":"Delhi"}'::jsonb,            'north', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600', 10),
  ('agra',     '{"en":"Agra","it":"Agra","de":"Agra","fr":"Agra"}'::jsonb,                'north', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600', 20),
  ('jaipur',   '{"en":"Jaipur","it":"Jaipur","de":"Jaipur","fr":"Jaipur"}'::jsonb,        'north', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600', 30),
  ('udaipur',  '{"en":"Udaipur","it":"Udaipur","de":"Udaipur","fr":"Udaipur"}'::jsonb,    'west',  'https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600', 40),
  ('jaisalmer','{"en":"Jaisalmer","it":"Jaisalmer","de":"Jaisalmer","fr":"Jaisalmer"}'::jsonb, 'west', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600', 50),
  ('varanasi', '{"en":"Varanasi","it":"Varanasi","de":"Varanasi","fr":"Varanasi"}'::jsonb,'north', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600', 60),
  ('kerala',   '{"en":"Kerala","it":"Kerala","de":"Kerala","fr":"Kerala"}'::jsonb,        'south', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600', 70),
  ('ladakh',   '{"en":"Ladakh","it":"Ladakh","de":"Ladakh","fr":"Ladakh"}'::jsonb,        'himalaya','https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600', 80),
  ('goa',      '{"en":"Goa","it":"Goa","de":"Goa","fr":"Goa"}'::jsonb,                    'west',  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600', 90)
on conflict (slug) do update set
  name          = excluded.name,
  region        = excluded.region,
  hero_image    = excluded.hero_image,
  display_order = excluded.display_order;

-- ---------- Testimonials seed ----------
insert into public.testimonials (author, trip, quote, rating, featured, display_order) values
(
  'Chiara & Marco',
  '{"en":"Rajasthan & Varanasi, 18 days","it":"Rajasthan e Varanasi, 18 giorni","de":"Rajasthan & Varanasi, 18 Tage","fr":"Rajasthan et Varanasi, 18 jours"}'::jsonb,
  '{"en":"The most thoughtful trip we have ever taken. Our designer understood what we wanted before we did. Twenty days, not one wasted moment.","it":"Il viaggio più curato che abbiamo mai fatto. La nostra designer ha capito cosa volevamo prima di noi. Venti giorni, neanche un momento sprecato.","de":"Die durchdachteste Reise, die wir je gemacht haben. Unsere Designerin hat verstanden, was wir wollten, bevor wir es selbst wussten. Zwanzig Tage, kein verlorener Moment.","fr":"Le voyage le plus réfléchi que nous ayons jamais fait. Notre designer a compris ce que nous voulions avant nous. Vingt jours, pas un moment de perdu."}'::jsonb,
  5, true, 10
),
(
  'Famille Bonnet',
  '{"en":"Kerala & Tamil Nadu, 14 days","it":"Kerala e Tamil Nadu, 14 giorni","de":"Kerala & Tamil Nadu, 14 Tage","fr":"Kerala et Tamil Nadu, 14 jours"}'::jsonb,
  '{"en":"We travelled with our two teenagers. The team handled everything — every guide spoke fluent French, every hotel was hand-picked. Magical.","it":"Abbiamo viaggiato con i nostri due adolescenti. Il team ha gestito tutto — ogni guida parlava un francese fluente, ogni hotel scelto a mano. Magico.","de":"Wir reisten mit unseren beiden Teenagern. Das Team hat sich um alles gekümmert — jeder Guide sprach fließend Französisch, jedes Hotel war handverlesen. Magisch.","fr":"Nous avons voyagé avec nos deux adolescents. L''équipe a tout géré — chaque guide parlait un français parfait, chaque hôtel choisi à la main. Magique."}'::jsonb,
  5, true, 20
),
(
  'Giulia R.',
  '{"en":"Ladakh & Himalaya, 12 days","it":"Ladakh e Himalaya, 12 giorni","de":"Ladakh & Himalaya, 12 Tage","fr":"Ladakh et Himalaya, 12 jours"}'::jsonb,
  '{"en":"I have travelled in India four times. This was the first time I felt I was truly meeting it. Bravissimi.","it":"Sono stata in India quattro volte. Questa è la prima in cui ho sentito di incontrarla davvero. Bravissimi.","de":"Ich war viermal in Indien. Dies war das erste Mal, dass ich das Gefühl hatte, ihm wirklich zu begegnen. Bravissimi.","fr":"J''ai voyagé en Inde quatre fois. C''était la première fois que j''avais l''impression de vraiment la rencontrer. Bravissimi."}'::jsonb,
  5, true, 30
);
