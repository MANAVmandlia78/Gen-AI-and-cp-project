-- ==========================================================
-- SEED DATA FOR MAHARAJA TOURS & TRAVELS
-- Run this in phpMyAdmin SQL tab or MySQL CLI
-- ==========================================================

USE maharaja_tours;

-- 1. Insert Admin & Customer Users
-- Admin: email: admin@maharajatours.com | password: admin123
-- Customer: email: customer@example.com | password: customer123
INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'Admin', 'admin@maharajatours.com', '$2b$10$wni20LFGZ8CTlYbHrZmNP.rXjuexGrPUhXG9SByeAu40BuiwOlOPW', '+919876543210', 'admin'),
(2, 'Demo Customer', 'customer@example.com', '$2b$10$SRkuEN0GR2VMfB9VO3qHzePazIRtMeQkfy3TItJVXbIDOJH8tuLia', '+919123456780', 'customer')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Tour Packages
INSERT INTO packages (id, title, price_range, season, nights, location, main_image, description, highlights, includes, map_src, is_featured, is_active) VALUES
(1, 'Kerala Backwaters & Hills Escape', '₹18,999 - ₹28,999', 'Oct – Mar', '6 Nights / 7 Days', 'Kochi – Munnar – Alleppey – Kovalam, Kerala', '/assets/images/kerala.jpg', 
'Kerala, often called "God\'s Own Country," is a tropical paradise on the southwestern coast of India. This carefully curated package takes you through the misty tea plantations of Munnar, the tranquil backwaters of Alleppey where you\'ll stay overnight on a traditional houseboat, and the golden-sand beaches of Kovalam.\n\nYou\'ll experience authentic Kerala cuisine including fresh seafood and traditional sadya meals served on banana leaves. The trip includes visits to spice gardens, a Kathakali dance performance, and an Ayurvedic wellness session at a certified centre.',
'["Overnight houseboat stay on Alleppey Backwaters", "Guided tea plantation tour in Munnar", "Kathakali cultural performance", "Ayurvedic wellness session", "Kovalam beach sunset experience"]',
'["Private AC vehicle with experienced chauffeur", "Handpicked 3-star / 4-star hotel stays", "Daily breakfast at all hotels", "One night houseboat with full board meals", "All sightseeing as per itinerary"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4017058.895483896!2d74.00582439999999!3d10.4510439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812fcebd4d391%3A0x56b404753be23e4!2sKerala!5e0!3m2!1sen!2sin!4v1692000000000!5m2!1sen!2sin',
1, 1),

(2, 'Royal Rajasthan Heritage Circuit', '₹21,499 - ₹35,999', 'Oct – Feb', '8 Nights / 9 Days', 'Jaipur – Jodhpur – Jaisalmer – Udaipur, Rajasthan', '/assets/images/jaipur.jpg',
'Rajasthan is the land of kings, where every fort tells a story and every palace whispers of royal grandeur. This heritage circuit takes you through the iconic Pink City of Jaipur with its stunning Amber Fort and Hawa Mahal, to the Blue City of Jodhpur dominated by the imposing Mehrangarh Fort.\n\nContinue to the golden dunes of Jaisalmer for a magical desert camping experience under the stars, complete with traditional folk music and Rajasthani cuisine. The journey concludes in the romantic city of Udaipur, where you\'ll cruise on Lake Pichola surrounded by stunning palace architecture.',
'["Elephant ride at Amber Fort, Jaipur", "Desert safari & overnight camping in Jaisalmer", "Lake Pichola sunset cruise in Udaipur", "Mehrangarh Fort guided heritage walk", "Traditional Rajasthani folk dinner"]',
'["Private AC vehicle throughout the circuit", "Heritage / boutique hotel stays", "Daily breakfast and 2 dinners", "Desert camp with cultural program", "All monument entry tickets"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.667847384078!2d75.78195!3d26.92207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1692000000001!5m2!1sen!2sin',
1, 1),

(3, 'Goa Coastal Leisure Holiday', '₹12,999 - ₹22,499', 'Nov – Feb', '4 Nights / 5 Days', 'North Goa – South Goa, India', '/assets/images/goa-1.jpg',
'Goa is India\'s smallest state but its most vibrant coastal destination, blending Portuguese colonial heritage with sun-drenched beaches and a laid-back tropical lifestyle. This leisure package covers the best of both North and South Goa.\n\nExplore the bustling beaches of Calangute and Baga in the north, visit the UNESCO-listed Basilica of Bom Jesus and Se Cathedral in Old Goa, and then escape to the quieter, palm-fringed shores of Palolem and Agonda in the south. Evenings come alive with beachside shacks, live music, and fresh Goan seafood.',
'["North Goa beach hopping – Calangute, Baga, Anjuna", "Old Goa heritage church tour (UNESCO site)", "South Goa serene beaches – Palolem & Agonda", "Spice plantation visit with traditional lunch", "Dudhsagar Falls day excursion"]',
'["Airport / station transfers", "Beach-facing resort accommodation", "Daily breakfast", "North & South Goa sightseeing by AC vehicle", "Complimentary water sports voucher"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d492245.9753999704!2d73.63853!3d15.34989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba106336b741%3A0xeaf887ff62f34092!2sGoa!5e0!3m2!1sen!2sin!4v1692000000002!5m2!1sen!2sin',
1, 1),

(4, 'Kashmir Paradise Valley Tour', '₹24,999 - ₹42,999', 'Apr – Oct', '7 Nights / 8 Days', 'Srinagar – Gulmarg – Pahalgam – Sonmarg, J&K', '/assets/images/kashmir.jpg',
'Kashmir, rightfully called "Paradise on Earth," is a land of breathtaking beauty with snow-capped mountains, pristine lakes, and lush green valleys. This comprehensive tour covers all the major highlights of the Kashmir Valley.\n\nBegin your journey in Srinagar with a stay on a traditional houseboat on Dal Lake, followed by a shikara ride through floating gardens. Travel to Gulmarg for a gondola ride offering panoramic views of the Himalayas, explore the pine-covered meadows of Pahalgam, and witness the glacial beauty of Sonmarg\'s Thajiwas Glacier.',
'["Dal Lake houseboat stay & shikara ride", "Gulmarg gondola ride (Asia\'s highest cable car)", "Pahalgam Betaab Valley & Aru Valley trek", "Sonmarg glacier excursion", "Mughal Gardens tour – Nishat, Shalimar & Chashme Shahi"]',
'["Airport transfers in Srinagar", "Deluxe houseboat & hotel stays", "Daily breakfast and dinner", "Private vehicle for all sightseeing", "Pony ride at Pahalgam"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3399.839536!2d74.79717!3d34.08565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1856af84e6a13%3A0x2dfa78ec1e9c8e92!2sSrinagar%2C%20Jammu%20and%20Kashmir!5e0!3m2!1sen!2sin!4v1692000000003!5m2!1sen!2sin',
0, 1),

(5, 'Manali & Rohtang Adventure Trip', '₹15,999 - ₹26,999', 'May – Oct', '5 Nights / 6 Days', 'Chandigarh – Kullu – Manali – Rohtang, Himachal Pradesh', '/assets/images/manali.jpg',
'Manali is a high-altitude Himalayan resort town in Himachal Pradesh, known for its stunning mountain scenery, adventure sports, and ancient temples. This adventure package combines natural beauty with thrilling outdoor activities.\n\nDrive through the scenic Kullu Valley dotted with apple orchards and pine forests. In Manali, visit the centuries-old Hadimba Temple set amidst towering cedar trees, explore the charming Old Manali village, and take a day trip to the snow-covered Rohtang Pass for snowfall, skiing, and awe-inspiring views.',
'["Rohtang Pass snow point excursion", "Solang Valley adventure sports – paragliding, zorbing", "Hadimba Temple & Old Manali heritage walk", "River rafting on Beas River at Kullu", "Naggar Castle & Roerich Art Gallery visit"]',
'["Volvo bus from Delhi or private car from Chandigarh", "Mountain-view hotel stays", "Daily breakfast", "Rohtang Pass permit & vehicle", "All sightseeing as per itinerary"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.3689!2d77.18872!3d32.23947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39048708163fd03f%3A0x8129a80ebe5076cd!2sManali%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1692000000004!5m2!1sen!2sin',
0, 1),

(6, 'Shimla Colonial Hill Station Retreat', '₹14,499 - ₹24,999', 'Mar – Jun', '4 Nights / 5 Days', 'Chandigarh – Shimla – Kufri – Chail, Himachal Pradesh', '/assets/images/shimla.jpg',
'Shimla, the erstwhile summer capital of British India, is a charming hill station known for its colonial architecture, pleasant weather, and panoramic Himalayan views. This retreat captures the old-world charm blended with natural beauty.\n\nWalk along the iconic Mall Road lined with heritage buildings and shops, ride the UNESCO World Heritage Kalka-Shimla toy train through 102 tunnels, and enjoy apple orchard visits in the surrounding hills. Day trips to Kufri for adventure activities and Chail for its peaceful ambiance round off this hill station experience.',
'["Heritage Kalka-Shimla Toy Train ride (UNESCO)", "Mall Road & Ridge heritage walk", "Jakhoo Temple panoramic viewpoint", "Kufri adventure – horse riding & nature trails", "Chail Palace & cricket ground visit"]',
'["Private vehicle from Chandigarh", "Heritage / colonial-style hotel stays", "Daily breakfast", "Toy train tickets (subject to availability)", "All sightseeing as per itinerary"]',
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.923!2d77.17128!3d31.10483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6e67%3A0x1f7e7ff6ff8cf36c!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1692000000005!5m2!1sen!2sin',
0, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Insert Pricing Tiers for Packages
INSERT INTO package_pricing (package_id, pkg_tier, from_date, to_date, price) VALUES
-- Package 1 (Kerala)
(1, 'Standard (3-Star)', 'Oct 1', 'Mar 31', '₹18,999 per person'),
(1, 'Deluxe (4-Star)', 'Oct 1', 'Mar 31', '₹24,499 per person'),
(1, 'Premium (5-Star)', 'Oct 1', 'Mar 31', '₹28,999 per person'),
(1, 'Family Pack (4 pax)', 'Oct 1', 'Mar 31', '₹72,999 total'),

-- Package 2 (Rajasthan)
(2, 'Standard Heritage', 'Oct 1', 'Feb 28', '₹21,499 per person'),
(2, 'Deluxe Heritage', 'Oct 1', 'Feb 28', '₹29,999 per person'),
(2, 'Royal Heritage (Palace stays)', 'Oct 1', 'Feb 28', '₹35,999 per person'),
(2, 'Group Discount (6+ pax)', 'Oct 1', 'Feb 28', '₹18,999 per person'),

-- Package 3 (Goa)
(3, 'Budget Beach', 'Nov 1', 'Feb 28', '₹12,999 per person'),
(3, 'Comfort Resort', 'Nov 1', 'Feb 28', '₹17,499 per person'),
(3, 'Luxury Beach Villa', 'Nov 1', 'Feb 28', '₹22,499 per person'),
(3, 'Honeymoon Special', 'Nov 1', 'Feb 28', '₹32,999 per couple'),

-- Package 4 (Kashmir)
(4, 'Standard Valley', 'Apr 1', 'Oct 31', '₹24,999 per person'),
(4, 'Deluxe Valley', 'Apr 1', 'Oct 31', '₹34,999 per person'),
(4, 'Premium (Luxury Houseboat)', 'Apr 1', 'Oct 31', '₹42,999 per person'),
(4, 'Family Pack (4 pax)', 'Apr 1', 'Oct 31', '₹89,999 total'),

-- Package 5 (Manali)
(5, 'Budget Adventure', 'May 1', 'Oct 31', '₹15,999 per person'),
(5, 'Comfort Stay', 'May 1', 'Oct 31', '₹21,499 per person'),
(5, 'Luxury Cottage', 'May 1', 'Oct 31', '₹26,999 per person'),
(5, 'Group (8+ pax)', 'May 1', 'Oct 31', '₹12,999 per person'),

-- Package 6 (Shimla)
(6, 'Standard Hill', 'Mar 1', 'Jun 30', '₹14,499 per person'),
(6, 'Deluxe Heritage', 'Mar 1', 'Jun 30', '₹19,999 per person'),
(6, 'Premium (Heritage Hotel)', 'Mar 1', 'Jun 30', '₹24,999 per person'),
(6, 'Honeymoon Special', 'Mar 1', 'Jun 30', '₹38,999 per couple');

-- 4. Insert Package Gallery Images
INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES
(1, '/assets/images/kerala.jpg', 0),
(1, '/assets/images/goa-1.jpg', 1),
(1, '/assets/images/shimla.jpg', 2),

(2, '/assets/images/jaipur-2.jpg', 0),
(2, '/assets/images/jeselmer.avif', 1),
(2, '/assets/images/jaipur.jpg', 2),

(3, '/assets/images/goa-2.jpg', 0),
(3, '/assets/images/goa-1.jpg', 1),
(3, '/assets/images/kerala.jpg', 2),

(4, '/assets/images/kashmir-2.jpg', 0),
(4, '/assets/images/kashmir.jpg', 1),
(4, '/assets/images/manali.jpg', 2),

(5, '/assets/images/manali.jpg', 0),
(5, '/assets/images/shimla.jpg', 1),
(5, '/assets/images/kashmir.jpg', 2),

(6, '/assets/images/shimla.jpg', 0),
(6, '/assets/images/manali.jpg', 1),
(6, '/assets/images/kashmir-2.jpg', 2);

-- 5. Insert Blogs
INSERT INTO blogs (id, title, slug, image, author, summary, content, views_count, is_published) VALUES
(1, '10 Must-Visit Hidden Gems in Kerala That Most Tourists Miss', '10-must-visit-hidden-gems-in-kerala', '/assets/images/blog-1-370x270.jpg', 'Maharaja Tours',
'Discover uncharted backwaters, tranquil waterfalls, and secret spice villages across God’s Own Country.',
'Kerala is celebrated worldwide for its tranquil backwaters and lush tea plantations. Beyond popular hotspots like Munnar and Alleppey lie hidden sanctuaries where nature flourishes untouched. In this guide, we reveal 10 remarkable lesser-known gems in Kerala including the mystic caves of Edakkal, the secluded valley of Gavi, and the pristine golden sands of Marari beach.',
1245, 1),

(2, 'A Complete Guide to Planning Your First Rajasthan Road Trip', 'guide-to-planning-first-rajasthan-road-trip', '/assets/images/blog-2-370x270.jpg', 'Maharaja Tours',
'Step-by-step route planning, essential packing tips, and royal palace stopovers across the desert state.',
'A road trip through Rajasthan is an unforgettable journey through time. Marvel at sandstone fortresses, colorful bazaars, and golden sand dunes. We cover best road routes connecting Jaipur, Jodhpur, Jaisalmer, and Udaipur, along with top highway dhabas, heritage hotel recommendations, and permit guidance.',
982, 1),

(3, 'Best Time to Visit Kashmir: Season-by-Season Travel Guide', 'best-time-to-visit-kashmir-season-guide', '/assets/images/blog-3-370x270.jpg', 'Maharaja Tours',
'From blooming tulip gardens in spring to magical snowfall in winter — find your perfect Kashmir travel season.',
'Every season transforms the Kashmir Valley into a new paradise. Spring brings millions of blooming tulips in Srinagar. Summer offers pleasant hikes in Pahalgam and Sonmarg. Autumn paints the Chinar trees in dazzling crimson and gold. Winter turns Gulmarg into India’s premier snow wonderland.',
2134, 1),

(4, 'Manali vs Shimla: Which Hill Station Is Right for Your Holiday?', 'manali-vs-shimla-which-hill-station-to-choose', '/assets/images/blog-4-370x270.jpg', 'Maharaja Tours',
'A head-to-head comparison of attractions, adventure sports, family activities, and travel budgets.',
'Choosing between Himachal’s two most famous hill towns depends on your travel style. Shimla offers colonial charm, Mall Road walks, and heritage toy train rides perfect for a relaxing family escape. Manali caters to thrill-seekers with paragliding, river rafting, and snow trips to Rohtang Pass.',
876, 1),

(5, 'Top 7 Vegetarian-Friendly Destinations for Indian Travellers', 'top-7-vegetarian-friendly-destinations-india', '/assets/images/blog-5-370x270.jpg', 'Maharaja Tours',
'Explore culinary havens offering pure vegetarian and Jain culinary experiences with absolute peace of mind.',
'Finding authentic vegetarian and Jain food while travelling is seamless when you visit destinations renowned for their rich vegetarian food culture. From the royal thalis of Gujarat and Rajasthan to the sacred temple feasts of South India, here are top destinations with mouthwatering veg options.',
1567, 1),

(6, 'How to Pack Smart for a Week-Long Indian Holiday in Any Season', 'how-to-pack-smart-for-week-long-indian-holiday', '/assets/images/blog-6-370x270.jpg', 'Maharaja Tours',
'Essential checklist of clothing, medicines, travel gadgets, and weather essentials for hassle-free travel.',
'Packing efficiently can make or break your holiday. Whether you are heading to snowy mountain passes or sunny coastal beaches, learn how to layer clothes, organize important documents, carry essential medications, and keep your luggage lightweight.',
743, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Insert Testimonials
INSERT INTO testimonials (name, designation, rating, comment, avatar, is_approved) VALUES
('Rajesh Patel', 'Ahmedabad, Gujarat', 5, 'Maharaja Tours organized our Kerala family holiday perfectly! From the luxury houseboat stay to the private chauffeur, everything was flawless.', '/assets/images/testimonials-avatar.jpg', 1),
('Pooja Sharma', 'Mumbai, Maharashtra', 5, 'The Rajasthan Heritage tour exceeded all our expectations. The desert camp in Jaisalmer under the stars was truly magical. Highly recommended!', '/assets/images/testimonials-avatar.jpg', 1),
('Anil Mehta', 'Surat, Gujarat', 5, 'Great customer support and very reasonable pricing. My parents had a wonderful trip to Kashmir with personalized care from the team.', '/assets/images/testimonials-avatar.jpg', 1);
