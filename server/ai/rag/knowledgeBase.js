/**
 * RAG Knowledge Base - Verified Ground Truth Data for Maharaja Tours & Travels
 * Used for grounding AI recommendations, vector retrieval, and context construction.
 */

export const DESTINATIONS_KNOWLEDGE = [
  {
    id: 'dest_goa',
    name: 'Goa',
    state: 'Goa',
    region: 'West Coast India',
    image: '/assets/images/goa-1.jpg',
    bestSeason: 'October to May',
    tags: ['beaches', 'nightlife', 'seafood', 'portuguese heritage', 'water sports'],
    description: 'Goa is India’s premier coastal paradise, celebrated for its sun-drenched Arabian Sea beaches, UNESCO Portuguese churches in Old Goa, vibrant beach shacks, and spice plantations.',
    airport: 'Dabolim (GOI) / Mopa (GOX)',
    railwayStation: 'Madgaon (MAO) / Thivim (THVM)',
    avgDailyCostPerPerson: {
      budget: 2500,
      moderate: 4500,
      luxury: 9500
    },
    attractions: [
      { name: 'Baga & Calangute Beach', type: 'beach', cost: 0, hours: 'Open 24 hrs', duration: '2-3 hrs', region: 'North Goa', highlights: 'Water sports, shacks, beach lounges' },
      { name: 'Aguada Fort & Lighthouse', type: 'heritage', cost: 50, hours: '09:30 - 17:30', duration: '1.5 hrs', region: 'Sinquerim', highlights: '17th-century Portuguese fortress overlooking sea' },
      { name: 'Basilica of Bom Jesus', type: 'heritage', cost: 0, hours: '09:00 - 18:30', duration: '1 hr', region: 'Old Goa', highlights: 'UNESCO World Heritage, remains of St. Francis Xavier' },
      { name: 'Dudhsagar Waterfalls Trek & Jeep Safari', type: 'nature', cost: 750, hours: '08:30 - 16:30', duration: '4-5 hrs', region: 'Mollem', highlights: 'Four-tiered milky waterfall in Bhagwan Mahaveer Sanctuary' },
      { name: 'Palolem Beach & Silent Noise Club', type: 'beach', cost: 0, hours: 'Open 24 hrs', duration: '3 hrs', region: 'South Goa', highlights: 'Crescent beach, dolphin spotting, serene shacks' },
      { name: 'Anjuna Flea Market & Curlies', type: 'culture', cost: 0, hours: 'Wednesdays / Evenings', duration: '2 hrs', region: 'Anjuna', highlights: 'Bohemian crafts, live music, sunset vibes' },
      { name: 'Sahakari Spice Farm Tour with Goan Buffet', type: 'food', cost: 500, hours: '10:00 - 16:00', duration: '2.5 hrs', region: 'Ponda', highlights: 'Guided botanical tour, elephant shower, traditional Goan meal' },
      { name: 'Mandovi River Sunset Cruise', type: 'cruise', cost: 500, hours: '17:30 - 19:30', duration: '1.5 hrs', region: 'Panaji', highlights: 'Goan folk dance performances and river breeze' },
      { name: 'Fontainhas Latin Quarter Walk', type: 'culture', cost: 0, hours: 'Daytime', duration: '1.5 hrs', region: 'Panaji', highlights: 'Vibrant yellow and blue Portuguese colonial houses and bakeries' }
    ],
    verifiedHotels: [
      { name: 'Sonesta Inns Beach Resort', stars: 4, area: 'Candolim', pricePerNight: 5500, type: 'Beachfront Resort' },
      { name: 'Lemon Tree Amarante Beach Resort', stars: 4, area: 'Candolim', pricePerNight: 6200, type: 'Heritage Styled Resort' },
      { name: 'Santana Beach Resort', stars: 3, area: 'Candolim', pricePerNight: 3200, type: 'Boutique Garden Stay' },
      { name: 'The Leela Goa', stars: 5, area: 'Cavelossim (South Goa)', pricePerNight: 16000, type: 'Luxury Beach Resort' },
      { name: 'Casa Vagator', stars: 3, area: 'Vagator', pricePerNight: 3800, type: 'Cliffside Boutique' }
    ],
    verifiedRestaurants: [
      { name: 'Fisherman’s Wharf', cuisine: 'Goan Seafood, Continental', avgCost: 900, area: 'Panaji & Cavelossim', specialty: 'Goan Fish Curry, Prawn Balchão' },
      { name: 'Gunpowder', cuisine: 'South Indian Coastal, Vegetarian friendly', avgCost: 750, area: 'Assagao', specialty: 'Kerala Beef Roast, Malabar Parotta, Appam & Stew' },
      { name: 'Vinayak Family Restaurant', cuisine: 'Traditional Goan Hindu Seafood & Veg', avgCost: 400, area: 'Assagao', specialty: 'Authentic Fish Thali, Solkadhi' },
      { name: 'Brittos', cuisine: 'Multi-cuisine, Seafood, Desserts', avgCost: 800, area: 'Baga Beach', specialty: 'Crab Xec Xec, Bebinca' },
      { name: 'Viva Panjim', cuisine: 'Authentic Goan Portuguese & Veg', avgCost: 500, area: 'Fontainhas', specialty: 'Vindaloo, Pork Sorpotel, Mushroom Xacuti' }
    ]
  },
  {
    id: 'dest_kerala',
    name: 'Kerala',
    state: 'Kerala',
    region: 'South India',
    image: '/assets/images/kerala.jpg',
    bestSeason: 'September to March',
    tags: ['backwaters', 'tea plantations', 'ayurveda', 'houseboats', 'nature', 'wildlife'],
    description: 'God’s Own Country offers serene palm-fringed backwaters of Alleppey, emerald tea gardens of Munnar, historic Fort Kochi, and wildlife sanctuaries in Thekkady.',
    airport: 'Cochin International (COK) / Trivandrum (TRV)',
    railwayStation: 'Ernakulam (ERS) / Alleppey (ALLP)',
    avgDailyCostPerPerson: {
      budget: 2800,
      moderate: 4800,
      luxury: 11000
    },
    attractions: [
      { name: 'Alleppey Backwaters Houseboat Cruise', type: 'cruise', cost: 7500, hours: 'Overnight / Day cruise', duration: 'Overnight', region: 'Alleppey', highlights: 'Private Kettuvallam boat with chef serving Kerala Sadya' },
      { name: 'Munnar Tea Gardens & Mattupetty Dam', type: 'nature', cost: 100, hours: '09:00 - 17:00', duration: '3 hrs', region: 'Munnar', highlights: 'Rolling emerald hills, tea tasting, echo point' },
      { name: 'Fort Kochi Heritage Walk & Chinese Fishing Nets', type: 'heritage', cost: 0, hours: '07:00 - 19:00', duration: '2 hrs', region: 'Kochi', highlights: 'Colonial lanes, St. Francis Church, cantilevered fishing nets' },
      { name: 'Periyar Wildlife Sanctuary Bamboo Rafting', type: 'nature', cost: 1800, hours: '07:30 - 14:30', duration: '5 hrs', region: 'Thekkady', highlights: 'Elephant and tiger habitat, scenic lake cruise' },
      { name: 'Kathakali Dance & Kalaripayattu Martial Arts Show', type: 'culture', cost: 400, hours: '17:00 - 19:30', duration: '2.5 hrs', region: 'Kochi / Thekkady', highlights: 'Vibrant face makeup, mudras, ancient martial art form' },
      { name: 'Kovalam Lighthouse Beach & Ayurvedic Massage', type: 'relaxation', cost: 1200, hours: '09:00 - 18:00', duration: '2 hrs', region: 'Kovalam', highlights: 'Certified Ayurvedic rejuvenation therapies by the beach' }
    ],
    verifiedHotels: [
      { name: 'Fragrant Nature Munnar', stars: 4, area: 'Munnar', pricePerNight: 6500, type: 'Mountain View Resort' },
      { name: 'Lake Palace Houseboats (Maharaja Partner)', stars: 4, area: 'Alleppey', pricePerNight: 8500, type: 'Luxury Houseboat' },
      { name: 'Brunton Boatyard - CGH Earth', stars: 5, area: 'Fort Kochi', pricePerNight: 14000, type: 'Colonial Heritage Hotel' },
      { name: 'Abad Turtle Beach Resort', stars: 3, area: 'Marari Beach', pricePerNight: 4200, type: 'Eco Beach Resort' }
    ],
    verifiedRestaurants: [
      { name: 'Grand Pavilion', cuisine: 'Traditional Kerala & Malabar', avgCost: 550, area: 'MG Road, Kochi', specialty: 'Karimeen Pollichathu, Kerala Parotta' },
      { name: 'Saravana Bhavan / Pai Brothers Fast Food', cuisine: 'Pure Vegetarian South Indian', avgCost: 200, area: 'Kochi', specialty: '36 varieties of crispy Dosas' },
      { name: 'Rapsy Restaurant', cuisine: 'Local Kerala & Tibetan', avgCost: 250, area: 'Munnar Market', specialty: 'Egg Roast, Spanish Omelette, Parottas' }
    ]
  },
  {
    id: 'dest_rajasthan',
    name: 'Rajasthan (Jaipur, Jodhpur, Udaipur, Jaisalmer)',
    state: 'Rajasthan',
    region: 'North-West India',
    image: '/assets/images/jaipur.jpg',
    bestSeason: 'October to March',
    tags: ['forts', 'palaces', 'desert safari', 'heritage', 'royalty', 'folk music', 'rajasthani food'],
    description: 'The Land of Kings showcases majestic hill forts, shimmering desert dunes of the Thar, opulent palaces in Lake City Udaipur, and rich royal heritage.',
    airport: 'Jaipur (JAI) / Udaipur (UDR)',
    railwayStation: 'Jaipur Junction (JP) / Jaisalmer (JSM)',
    avgDailyCostPerPerson: {
      budget: 2600,
      moderate: 4600,
      luxury: 12000
    },
    attractions: [
      { name: 'Amber Fort & Sheesh Mahal', type: 'heritage', cost: 200, hours: '08:00 - 17:30', duration: '3 hrs', region: 'Jaipur', highlights: 'Grand hilltop fortress, mirror palace, elephant/jeep ascent' },
      { name: 'Hawa Mahal & City Palace Jaipur', type: 'heritage', cost: 300, hours: '09:00 - 17:00', duration: '2 hrs', region: 'Jaipur', highlights: 'Palace of Winds, royal artifacts, astronomical Jantar Mantar' },
      { name: 'Sam Sand Dunes Camel Safari & Camp', type: 'adventure', cost: 2500, hours: '16:00 - Overnight', duration: 'Overnight', region: 'Jaisalmer', highlights: 'Sunset camel ride, Kalbeliya folk dance, Rajasthani thali' },
      { name: 'City Palace & Lake Pichola Boat Ride', type: 'heritage', cost: 650, hours: '09:30 - 18:00', duration: '3 hrs', region: 'Udaipur', highlights: 'Boat cruise past Jag Mandir and Taj Lake Palace' },
      { name: 'Mehrangarh Fort & Jaswant Thada', type: 'heritage', cost: 200, hours: '09:00 - 17:00', duration: '2.5 hrs', region: 'Jodhpur', highlights: 'Imposing cliffside fortress with panoramic Blue City views' },
      { name: 'Chokhi Dhani Ethnic Village Resort', type: 'culture', cost: 950, hours: '17:30 - 23:00', duration: '3 hrs', region: 'Jaipur', highlights: 'Traditional puppets, folk acrobatics, unlimited royal thali' }
    ],
    verifiedHotels: [
      { name: 'Shahpura Haveli / House', stars: 4, area: 'Jaipur', pricePerNight: 5500, type: 'Heritage Haveli' },
      { name: 'Desert Haveli & Sam Dunes Camp', stars: 3, area: 'Jaisalmer', pricePerNight: 3500, type: 'Luxury Desert Swiss Tent' },
      { name: 'Fateh Garh Heritage Resort', stars: 5, area: 'Udaipur', pricePerNight: 12500, type: 'Hilltop Palace Resort' },
      { name: 'Hotel Rang Mahal', stars: 4, area: 'Jaisalmer', pricePerNight: 4800, type: 'Yellow Sandstone Heritage' }
    ],
    verifiedRestaurants: [
      { name: 'LMB (Laxmi Misthan Bhandar)', cuisine: 'Pure Vegetarian Royal Rajasthani', avgCost: 450, area: 'Johari Bazaar, Jaipur', specialty: 'Rajasthani Royal Thali, Ghewar, Dal Baati Churma' },
      { name: '1135 AD (Amber Fort)', cuisine: 'Royal Mughlai & Rajputana', avgCost: 1800, area: 'Amber Fort, Jaipur', specialty: 'Laal Maas, Dum Biryani' },
      { name: 'Ambrai Restaurant', cuisine: 'North Indian & Rajasthani', avgCost: 1100, area: 'Amet Haveli, Udaipur', specialty: 'Lakeside dinner facing illuminated City Palace' }
    ]
  },
  {
    id: 'dest_manali',
    name: 'Manali & Himachal',
    state: 'Himachal Pradesh',
    region: 'North India Himalayas',
    image: '/assets/images/manali.jpg',
    bestSeason: 'Year-round (Snow in Dec-Feb, Pleasant in Mar-Jun)',
    tags: ['mountains', 'snow', 'adventure', 'trekking', 'nature', 'valleys', 'pine forests'],
    description: 'Nestled on the banks of the Beas River, Manali is the gateway to Solang Valley, Rohtang Pass, and scenic pine-forested alpine trails.',
    airport: 'Bhuntar / Kullu (KUU) (50km) / Chandigarh (IXC)',
    railwayStation: 'Chandigarh (CDG) / Kalka (KLK)',
    avgDailyCostPerPerson: {
      budget: 2200,
      moderate: 3900,
      luxury: 8500
    },
    attractions: [
      { name: 'Solang Valley & Rohtang Pass Snow Point', type: 'adventure', cost: 1500, hours: '08:00 - 16:30', duration: '5-6 hrs', region: 'Solang', highlights: 'Ziplining, paragliding, ATV rides, snow tube gliding' },
      { name: 'Hadimba Wooden Temple & Dhungri Cedar Forest', type: 'heritage', cost: 0, hours: '08:00 - 18:00', duration: '1.5 hrs', region: 'Old Manali', highlights: '16th century pagoda temple amidst towering Deodar trees' },
      { name: 'Old Manali Bohemian Cafes & Beas River Walk', type: 'culture', cost: 0, hours: '10:00 - 22:00', duration: '2 hrs', region: 'Old Manali', highlights: 'Live acoustic music, apple orchards, river sound' },
      { name: 'Vashisht Hot Sulphur Springs & Jogni Waterfalls', type: 'nature', cost: 0, hours: '07:00 - 18:00', duration: '3 hrs', region: 'Vashisht', highlights: 'Natural mineral baths and gentle scenic pine forest trek' },
      { name: 'Atal Tunnel & Sissu Waterfall (Lahaul Valley)', type: 'sightseeing', cost: 0, hours: '08:00 - 17:00', duration: '4 hrs', region: 'Lahaul', highlights: 'World’s longest highway tunnel above 10,000 ft leading to Lahaul valley' }
    ],
    verifiedHotels: [
      { name: 'The Himalayan Resort & Spa', stars: 5, area: 'Old Manali Road', pricePerNight: 11000, type: 'Victorian Gothic Castle Resort' },
      { name: 'Apple Country Resorts', stars: 4, area: 'Log Huts Area', pricePerNight: 5200, type: 'Cedar Valley View Resort' },
      { name: 'Sterling Manali', stars: 3, area: 'Prini', pricePerNight: 3600, type: 'Pine Forest Retreat' }
    ],
    verifiedRestaurants: [
      { name: 'Cafe 1947', cuisine: 'Italian, Continental, Trout Fish', avgCost: 650, area: 'Old Manali near Bridge', specialty: 'Wood-fired Pizza, Fresh Trout, Beas riverside seating' },
      { name: 'Johnson’s Cafe & Bar', cuisine: 'European, Himalayan Trout', avgCost: 700, area: 'Circuit House Road', specialty: 'Baked Trout in Almond Sauce, Apple Crumble' },
      { name: 'Chopsticks Restaurant', cuisine: 'Tibetan, Chinese, Bhutanese', avgCost: 400, area: 'Mall Road', specialty: 'Momos, Thukpa, Tibetan Tingmo' }
    ]
  },
  {
    id: 'dest_kashmir',
    name: 'Kashmir (Srinagar, Gulmarg, Pahalgam)',
    state: 'Jammu & Kashmir',
    region: 'North Himalayas',
    image: '/assets/images/kashmir.jpg',
    bestSeason: 'April to October (Spring/Summer) & Dec to Feb (Snow)',
    tags: ['shikara', 'dal lake', 'snow', 'gondola', 'meadows', 'paradise', 'tulips'],
    description: 'Revered as Paradise on Earth, Kashmir enchants with Dal Lake houseboats, Mughal gardens, Gulmarg snow meadows with the world’s second-highest gondola, and pine-scented Pahalgam.',
    airport: 'Sheikh ul-Alam International Airport, Srinagar (SXR)',
    railwayStation: 'Jammu Tawi (JAT) / Udhampur (UHP)',
    avgDailyCostPerPerson: {
      budget: 3000,
      moderate: 5200,
      luxury: 13000
    },
    attractions: [
      { name: 'Dal Lake Shikara Ride & Floating Vegetable Market', type: 'cruise', cost: 800, hours: '06:00 - 19:00', duration: '2 hrs', region: 'Srinagar', highlights: 'Traditional carved wooden boat, lotus flowers, floating handicrafts' },
      { name: 'Gulmarg Gondola Cable Car (Phase 1 & Phase 2)', type: 'adventure', cost: 1850, hours: '09:00 - 16:30', duration: '4 hrs', region: 'Gulmarg (12,293 ft)', highlights: 'Highest operating cable car in Asia with panoramic snow peaks' },
      { name: 'Mughal Gardens (Shalimar Bagh & Nishat Bagh)', type: 'heritage', cost: 50, hours: '09:00 - 18:30', duration: '2 hrs', region: 'Srinagar', highlights: 'Terraced fountains, Chinar trees, Dal Lake view' },
      { name: 'Betaab Valley & Aru Valley Excursion', type: 'nature', cost: 200, hours: '08:30 - 17:00', duration: '4-5 hrs', region: 'Pahalgam', highlights: 'Crystal Lidder River, pony rides, alpine flower meadows' },
      { name: 'Traditional Wazwan 7-Course Dinner Experience', type: 'food', cost: 1100, hours: '19:00 - 22:00', duration: '2 hrs', region: 'Srinagar', highlights: 'Rogan Josh, Gushtaba, Rista, Kashmiri Pulao on trammi plate' }
    ],
    verifiedHotels: [
      { name: 'Mascot Luxury Houseboat (Maharaja Partner)', stars: 4, area: 'Nigeen Lake, Srinagar', pricePerNight: 6800, type: 'Handcarved Cedar Houseboat' },
      { name: 'The Khyber Himalayan Resort & Spa', stars: 5, area: 'Gulmarg', pricePerNight: 24000, type: 'Luxury Alpine Ski Resort' },
      { name: 'Hotel Heevan Pahalgam', stars: 4, area: 'Lidder River Bank, Pahalgam', pricePerNight: 7200, type: 'Riverside Retreat' },
      { name: 'Grand Mumtaz Resorts', stars: 3, area: 'Srinagar', pricePerNight: 4100, type: 'City Heritage Hotel' }
    ],
    verifiedRestaurants: [
      { name: 'Ahdoos Restaurant (Since 1918)', cuisine: 'Authentic Kashmiri Wazwan & Bakery', avgCost: 750, area: 'Residency Road, Srinagar', specialty: 'Gushtaba, Tabak Maaz, Mutton Rogan Josh' },
      { name: 'Mughal Darbar', cuisine: 'Kashmiri Wazwan & North Indian', avgCost: 550, area: 'Srinagar', specialty: 'Kashmiri Dum Aloo, Nadru Yakhni (Lotus Stem)' },
      { name: 'Chai Jaai Tea Room', cuisine: 'Kashmiri Tea & Bakery', avgCost: 350, area: 'Dalgate, Srinagar', specialty: 'Kahwa with saffron and crushed almonds, Sheermal' }
    ]
  },
  {
    id: 'dest_shimla',
    name: 'Shimla & Kufri',
    state: 'Himachal Pradesh',
    region: 'North India',
    image: '/assets/images/shimla.jpg',
    bestSeason: 'March to June & December to February',
    tags: ['colonial heritage', 'toy train', 'hill station', 'panoramic views', 'mall road'],
    description: 'The former British summer capital retains its Victorian architecture, Mall Road promenades, Ridge views, and UNESCO World Heritage toy train.',
    airport: 'Jubbarhatti (SLV) (22km) / Chandigarh (IXC) (115km)',
    railwayStation: 'Shimla (SML) / Kalka (KLK)',
    avgDailyCostPerPerson: {
      budget: 2000,
      moderate: 3800,
      luxury: 8000
    },
    attractions: [
      { name: 'Mall Road & Ridge Heritage Walk', type: 'sightseeing', cost: 0, hours: 'Open all day', duration: '2-3 hrs', region: 'Shimla City', highlights: 'Christ Church, Gaiety Theatre, pedestrian promenade' },
      { name: 'Kalka-Shimla Toy Train Ride (UNESCO)', type: 'heritage', cost: 350, hours: 'Scheduled timings', duration: '4-5 hrs', region: 'Kalka to Shimla', highlights: '102 tunnels, curved bridges, picturesque oak valleys' },
      { name: 'Jakhoo Temple & Ropeway Cable Car', type: 'culture', cost: 500, hours: '08:00 - 18:00', duration: '2 hrs', region: 'Jakhoo Hill', highlights: '108-ft Lord Hanuman statue and highest peak view in Shimla' },
      { name: 'Kufri Nature Trails & Adventure Valley', type: 'adventure', cost: 600, hours: '09:00 - 17:00', duration: '3-4 hrs', region: 'Kufri', highlights: 'Horse riding, Himalayan wildlife zoo, winter skiing' }
    ],
    verifiedHotels: [
      { name: 'Wildflower Hall, An Oberoi Resort', stars: 5, area: 'Mashobra / Shimla', pricePerNight: 28000, type: 'Luxury Colonial Resort' },
      { name: 'The Oberoi Cecil', stars: 5, area: 'Chaura Maidan', pricePerNight: 16000, type: 'Grand Heritage Hotel' },
      { name: 'Hotel Willow Banks', stars: 4, area: 'Near Mall Road', pricePerNight: 5500, type: 'Boutique Hilltop Hotel' },
      { name: 'Radisson Jass Shimla', stars: 4, area: 'Lower Bharari Road', pricePerNight: 6200, type: 'Valley View Hotel' }
    ],
    verifiedRestaurants: [
      { name: 'Wake & Bake Cafe', cuisine: 'Continental, French Crepes, Coffee', avgCost: 400, area: 'The Mall Road', specialty: 'Nutella Waffles, Wood-fired Pizza, rooftop valley view' },
      { name: 'Baljees & Fascination', cuisine: 'North Indian, Himachali', avgCost: 450, area: 'Mall Road', specialty: 'Gulab Jamun, Butter Chicken, Chana Madra' },
      { name: 'Cafe Simla Times', cuisine: 'Italian, Mexican, Craft mocktails', avgCost: 600, area: 'Near Ridge', specialty: 'Wood-fired sourdough pizza, outdoor patio' }
    ]
  }
];

export const TRAVEL_FAQS_KNOWLEDGE = [
  {
    topic: 'Booking & Payments',
    question: 'How do I confirm a customized tour package with Maharaja Tours?',
    answer: 'Select your preferred itinerary, submit the booking form or contact our 24/7 travel desk. A 20% deposit secures verified hotel inventory and chauffeur vehicle. The remaining balance is payable prior to trip departure.'
  },
  {
    topic: 'Dietary Preferences',
    question: 'Can Maharaja Tours cater to Pure Vegetarian, Jain, or Vegan dietary needs?',
    answer: 'Yes! All partner hotels and meal inclusions can be customized for Pure Vegetarian, No-Onion-No-Garlic Jain meals, or Vegan preferences without extra surcharge.'
  },
  {
    topic: 'Weather & Safety',
    question: 'What happens if bad weather or road closures affect an activity?',
    answer: 'Our dedicated on-trip coordinators and AI Re-planning system immediately offer equivalent indoor or sheltered alternatives (e.g. museums, tea tastings, cultural shows) and handle hotel/transport adjustments seamlessly.'
  },
  {
    topic: 'Transportation',
    question: 'What kind of private transport is provided in Maharaja Tours packages?',
    answer: 'We provide sanitized, air-conditioned private vehicles (Sedan for 2-3 travelers, SUV Innova Crysta for 4-6 travelers, Urbania/Tempo Traveller for larger groups) driven by experienced local tourist chauffeurs.'
  }
];
