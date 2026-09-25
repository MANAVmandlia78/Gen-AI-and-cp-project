import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'maharaja_tours';

const initialPackages = [
  {
    title: 'Kerala Backwaters & Hills Escape',
    price_range: '₹18,999 - ₹28,999',
    season: 'Oct – Mar',
    nights: '6 Nights / 7 Days',
    location: 'Kochi – Munnar – Alleppey – Kovalam, Kerala',
    main_image: '/assets/images/kerala.jpg',
    description: `Kerala, often called "God's Own Country," is a tropical paradise on the southwestern coast of India. This carefully curated package takes you through the misty tea plantations of Munnar, the tranquil backwaters of Alleppey where you'll stay overnight on a traditional houseboat, and the golden-sand beaches of Kovalam.

You'll experience authentic Kerala cuisine including fresh seafood and traditional sadya meals served on banana leaves. The trip includes visits to spice gardens, a Kathakali dance performance, and an Ayurvedic wellness session at a certified centre.`,
    highlights: JSON.stringify([
      'Overnight houseboat stay on Alleppey Backwaters',
      'Guided tea plantation tour in Munnar',
      'Kathakali cultural performance',
      'Ayurvedic wellness session',
      'Kovalam beach sunset experience'
    ]),
    includes: JSON.stringify([
      'Private AC vehicle with experienced chauffeur',
      'Handpicked 3-star / 4-star hotel stays',
      'Daily breakfast at all hotels',
      'One night houseboat with full board meals',
      'All sightseeing as per itinerary'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4017058.895483896!2d74.00582439999999!3d10.4510439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812fcebd4d391%3A0x56b404753be23e4!2sKerala!5e0!3m2!1sen!2sin!4v1692000000000!5m2!1sen!2sin',
    is_featured: true,
    gallery: ['/assets/images/kerala.jpg', '/assets/images/goa-1.jpg', '/assets/images/shimla.jpg'],
    pricing: [
      { pkg_tier: 'Standard (3-Star)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹18,999 per person' },
      { pkg_tier: 'Deluxe (4-Star)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹24,499 per person' },
      { pkg_tier: 'Premium (5-Star)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹28,999 per person' },
      { pkg_tier: 'Family Pack (4 pax)', from_date: 'Oct 1', to_date: 'Mar 31', price: '₹72,999 total' }
    ]
  },
  {
    title: 'Royal Rajasthan Heritage Circuit',
    price_range: '₹21,499 - ₹35,999',
    season: 'Oct – Feb',
    nights: '8 Nights / 9 Days',
    location: 'Jaipur – Jodhpur – Jaisalmer – Udaipur, Rajasthan',
    main_image: '/assets/images/jaipur.jpg',
    description: `Rajasthan is the land of kings, where every fort tells a story and every palace whispers of royal grandeur. This heritage circuit takes you through the iconic Pink City of Jaipur with its stunning Amber Fort and Hawa Mahal, to the Blue City of Jodhpur dominated by the imposing Mehrangarh Fort.

Continue to the golden dunes of Jaisalmer for a magical desert camping experience under the stars, complete with traditional folk music and Rajasthani cuisine. The journey concludes in the romantic city of Udaipur, where you'll cruise on Lake Pichola surrounded by stunning palace architecture.`,
    highlights: JSON.stringify([
      'Elephant ride at Amber Fort, Jaipur',
      'Desert safari & overnight camping in Jaisalmer',
      'Lake Pichola sunset cruise in Udaipur',
      'Mehrangarh Fort guided heritage walk',
      'Traditional Rajasthani folk dinner'
    ]),
    includes: JSON.stringify([
      'Private AC vehicle throughout the circuit',
      'Heritage / boutique hotel stays',
      'Daily breakfast and 2 dinners',
      'Desert camp with cultural program',
      'All monument entry tickets'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.667847384078!2d75.78195!3d26.92207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1692000000001!5m2!1sen!2sin',
    is_featured: true,
    gallery: ['/assets/images/jaipur-2.jpg', '/assets/images/jeselmer.avif', '/assets/images/jaipur.jpg'],
    pricing: [
      { pkg_tier: 'Standard Heritage', from_date: 'Oct 1', to_date: 'Feb 28', price: '₹21,499 per person' },
      { pkg_tier: 'Deluxe Heritage', from_date: 'Oct 1', to_date: 'Feb 28', price: '₹29,999 per person' },
      { pkg_tier: 'Royal Heritage (Palace stays)', from_date: 'Oct 1', to_date: 'Feb 28', price: '₹35,999 per person' },
      { pkg_tier: 'Group Discount (6+ pax)', from_date: 'Oct 1', to_date: 'Feb 28', price: '₹18,999 per person' }
    ]
  },
  {
    title: 'Goa Coastal Leisure Holiday',
    price_range: '₹12,999 - ₹22,499',
    season: 'Nov – Feb',
    nights: '4 Nights / 5 Days',
    location: 'North Goa – South Goa, India',
    main_image: '/assets/images/goa-1.jpg',
    description: `Goa is India's smallest state but its most vibrant coastal destination, blending Portuguese colonial heritage with sun-drenched beaches and a laid-back tropical lifestyle. This leisure package covers the best of both North and South Goa.

Explore the bustling beaches of Calangute and Baga in the north, visit the UNESCO-listed Basilica of Bom Jesus and Se Cathedral in Old Goa, and then escape to the quieter, palm-fringed shores of Palolem and Agonda in the south. Evenings come alive with beachside shacks, live music, and fresh Goan seafood.`,
    highlights: JSON.stringify([
      'North Goa beach hopping – Calangute, Baga, Anjuna',
      'Old Goa heritage church tour (UNESCO site)',
      'South Goa serene beaches – Palolem & Agonda',
      'Spice plantation visit with traditional lunch',
      'Dudhsagar Falls day excursion'
    ]),
    includes: JSON.stringify([
      'Airport / station transfers',
      'Beach-facing resort accommodation',
      'Daily breakfast',
      'North & South Goa sightseeing by AC vehicle',
      'Complimentary water sports voucher'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d492245.9753999704!2d73.63853!3d15.34989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba106336b741%3A0xeaf887ff62f34092!2sGoa!5e0!3m2!1sen!2sin!4v1692000000002!5m2!1sen!2sin',
    is_featured: true,
    gallery: ['/assets/images/goa-2.jpg', '/assets/images/goa-1.jpg', '/assets/images/kerala.jpg'],
    pricing: [
      { pkg_tier: 'Budget Beach', from_date: 'Nov 1', to_date: 'Feb 28', price: '₹12,999 per person' },
      { pkg_tier: 'Comfort Resort', from_date: 'Nov 1', to_date: 'Feb 28', price: '₹17,499 per person' },
      { pkg_tier: 'Luxury Beach Villa', from_date: 'Nov 1', to_date: 'Feb 28', price: '₹22,499 per person' },
      { pkg_tier: 'Honeymoon Special', from_date: 'Nov 1', to_date: 'Feb 28', price: '₹32,999 per couple' }
    ]
  },
  {
    title: 'Kashmir Paradise Valley Tour',
    price_range: '₹24,999 - ₹42,999',
    season: 'Apr – Oct',
    nights: '7 Nights / 8 Days',
    location: 'Srinagar – Gulmarg – Pahalgam – Sonmarg, J&K',
    main_image: '/assets/images/kashmir.jpg',
    description: `Kashmir, rightfully called "Paradise on Earth," is a land of breathtaking beauty with snow-capped mountains, pristine lakes, and lush green valleys. This comprehensive tour covers all the major highlights of the Kashmir Valley.

Begin your journey in Srinagar with a stay on a traditional houseboat on Dal Lake, followed by a shikara ride through floating gardens. Travel to Gulmarg for a gondola ride offering panoramic views of the Himalayas, explore the pine-covered meadows of Pahalgam, and witness the glacial beauty of Sonmarg's Thajiwas Glacier.`,
    highlights: JSON.stringify([
      'Dal Lake houseboat stay & shikara ride',
      'Gulmarg gondola ride (Asia\'s highest cable car)',
      'Pahalgam Betaab Valley & Aru Valley trek',
      'Sonmarg glacier excursion',
      'Mughal Gardens tour – Nishat, Shalimar & Chashme Shahi'
    ]),
    includes: JSON.stringify([
      'Airport transfers in Srinagar',
      'Deluxe houseboat & hotel stays',
      'Daily breakfast and dinner',
      'Private vehicle for all sightseeing',
      'Pony ride at Pahalgam'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3399.839536!2d74.79717!3d34.08565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1856af84e6a13%3A0x2dfa78ec1e9c8e92!2sSrinagar%2C%20Jammu%20and%20Kashmir!5e0!3m2!1sen!2sin!4v1692000000003!5m2!1sen!2sin',
    is_featured: false,
    gallery: ['/assets/images/kashmir-2.jpg', '/assets/images/kashmir.jpg', '/assets/images/manali.jpg'],
    pricing: [
      { pkg_tier: 'Standard Valley', from_date: 'Apr 1', to_date: 'Oct 31', price: '₹24,999 per person' },
      { pkg_tier: 'Deluxe Valley', from_date: 'Apr 1', to_date: 'Oct 31', price: '₹34,999 per person' },
      { pkg_tier: 'Premium (Luxury Houseboat)', from_date: 'Apr 1', to_date: 'Oct 31', price: '₹42,999 per person' },
      { pkg_tier: 'Family Pack (4 pax)', from_date: 'Apr 1', to_date: 'Oct 31', price: '₹89,999 total' }
    ]
  },
  {
    title: 'Manali & Rohtang Adventure Trip',
    price_range: '₹15,999 - ₹26,999',
    season: 'May – Oct',
    nights: '5 Nights / 6 Days',
    location: 'Chandigarh – Kullu – Manali – Rohtang, Himachal Pradesh',
    main_image: '/assets/images/manali.jpg',
    description: `Manali is a high-altitude Himalayan resort town in Himachal Pradesh, known for its stunning mountain scenery, adventure sports, and ancient temples. This adventure package combines natural beauty with thrilling outdoor activities.

Drive through the scenic Kullu Valley dotted with apple orchards and pine forests. In Manali, visit the centuries-old Hadimba Temple set amidst towering cedar trees, explore the charming Old Manali village, and take a day trip to the snow-covered Rohtang Pass for snowfall, skiing, and awe-inspiring views.`,
    highlights: JSON.stringify([
      'Rohtang Pass snow point excursion',
      'Solang Valley adventure sports – paragliding, zorbing',
      'Hadimba Temple & Old Manali heritage walk',
      'River rafting on Beas River at Kullu',
      'Naggar Castle & Roerich Art Gallery visit'
    ]),
    includes: JSON.stringify([
      'Volvo bus from Delhi or private car from Chandigarh',
      'Mountain-view hotel stays',
      'Daily breakfast',
      'Rohtang Pass permit & vehicle',
      'All sightseeing as per itinerary'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.3689!2d77.18872!3d32.23947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39048708163fd03f%3A0x8129a80ebe5076cd!2sManali%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1692000000004!5m2!1sen!2sin',
    is_featured: false,
    gallery: ['/assets/images/manali.jpg', '/assets/images/shimla.jpg', '/assets/images/kashmir.jpg'],
    pricing: [
      { pkg_tier: 'Budget Adventure', from_date: 'May 1', to_date: 'Oct 31', price: '₹15,999 per person' },
      { pkg_tier: 'Comfort Stay', from_date: 'May 1', to_date: 'Oct 31', price: '₹21,499 per person' },
      { pkg_tier: 'Luxury Cottage', from_date: 'May 1', to_date: 'Oct 31', price: '₹26,999 per person' },
      { pkg_tier: 'Group (8+ pax)', from_date: 'May 1', to_date: 'Oct 31', price: '₹12,999 per person' }
    ]
  },
  {
    title: 'Shimla Colonial Hill Station Retreat',
    price_range: '₹14,499 - ₹24,999',
    season: 'Mar – Jun',
    nights: '4 Nights / 5 Days',
    location: 'Chandigarh – Shimla – Kufri – Chail, Himachal Pradesh',
    main_image: '/assets/images/shimla.jpg',
    description: `Shimla, the erstwhile summer capital of British India, is a charming hill station known for its colonial architecture, pleasant weather, and panoramic Himalayan views. This retreat captures the old-world charm blended with natural beauty.

Walk along the iconic Mall Road lined with heritage buildings and shops, ride the UNESCO World Heritage Kalka-Shimla toy train through 102 tunnels, and enjoy apple orchard visits in the surrounding hills. Day trips to Kufri for adventure activities and Chail for its peaceful ambiance round off this hill station experience.`,
    highlights: JSON.stringify([
      'Heritage Kalka-Shimla Toy Train ride (UNESCO)',
      'Mall Road & Ridge heritage walk',
      'Jakhoo Temple panoramic viewpoint',
      'Kufri adventure – horse riding & nature trails',
      'Chail Palace & cricket ground visit'
    ]),
    includes: JSON.stringify([
      'Private vehicle from Chandigarh',
      'Heritage / colonial-style hotel stays',
      'Daily breakfast',
      'Toy train tickets (subject to availability)',
      'All sightseeing as per itinerary'
    ]),
    map_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.923!2d77.17128!3d31.10483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6e67%3A0x1f7e7ff6ff8cf36c!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1692000000005!5m2!1sen!2sin',
    is_featured: false,
    gallery: ['/assets/images/shimla.jpg', '/assets/images/manali.jpg', '/assets/images/kashmir-2.jpg'],
    pricing: [
      { pkg_tier: 'Standard Hill', from_date: 'Mar 1', to_date: 'Jun 30', price: '₹14,499 per person' },
      { pkg_tier: 'Deluxe Heritage', from_date: 'Mar 1', to_date: 'Jun 30', price: '₹19,999 per person' },
      { pkg_tier: 'Premium (Heritage Hotel)', from_date: 'Mar 1', to_date: 'Jun 30', price: '₹24,999 per person' },
      { pkg_tier: 'Honeymoon Special', from_date: 'Mar 1', to_date: 'Jun 30', price: '₹38,999 per couple' }
    ]
  }
];

const initialBlogs = [
  {
    title: '10 Must-Visit Hidden Gems in Kerala That Most Tourists Miss',
    slug: '10-must-visit-hidden-gems-in-kerala',
    image: '/assets/images/blog-1-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'Discover uncharted backwaters, tranquil waterfalls, and secret spice villages across God’s Own Country.',
    content: 'Kerala is celebrated worldwide for its tranquil backwaters and lush tea plantations. Beyond popular hotspots like Munnar and Alleppey lie hidden sanctuaries where nature flourishes untouched. In this guide, we reveal 10 remarkable lesser-known gems in Kerala including the mystic caves of Edakkal, the secluded valley of Gavi, and the pristine golden sands of Marari beach.',
    views_count: 1245
  },
  {
    title: 'A Complete Guide to Planning Your First Rajasthan Road Trip',
    slug: 'guide-to-planning-first-rajasthan-road-trip',
    image: '/assets/images/blog-2-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'Step-by-step route planning, essential packing tips, and royal palace stopovers across the desert state.',
    content: 'A road trip through Rajasthan is an unforgettable journey through time. Marvel at sandstone fortresses, colorful bazaars, and golden sand dunes. We cover best road routes connecting Jaipur, Jodhpur, Jaisalmer, and Udaipur, along with top highway dhabas, heritage hotel recommendations, and permit guidance.',
    views_count: 982
  },
  {
    title: 'Best Time to Visit Kashmir: Season-by-Season Travel Guide',
    slug: 'best-time-to-visit-kashmir-season-guide',
    image: '/assets/images/blog-3-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'From blooming tulip gardens in spring to magical snowfall in winter — find your perfect Kashmir travel season.',
    content: 'Every season transforms the Kashmir Valley into a new paradise. Spring brings millions of blooming tulips in Srinagar. Summer offers pleasant hikes in Pahalgam and Sonmarg. Autumn paints the Chinar trees in dazzling crimson and gold. Winter turns Gulmarg into India’s premier snow wonderland.',
    views_count: 2134
  },
  {
    title: 'Manali vs Shimla: Which Hill Station Is Right for Your Holiday?',
    slug: 'manali-vs-shimla-which-hill-station-to-choose',
    image: '/assets/images/blog-4-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'A head-to-head comparison of attractions, adventure sports, family activities, and travel budgets.',
    content: 'Choosing between Himachal’s two most famous hill towns depends on your travel style. Shimla offers colonial charm, Mall Road walks, and heritage toy train rides perfect for a relaxing family escape. Manali caters to thrill-seekers with paragliding, river rafting, and snow trips to Rohtang Pass.',
    views_count: 876
  },
  {
    title: 'Top 7 Vegetarian-Friendly Destinations for Indian Travellers',
    slug: 'top-7-vegetarian-friendly-destinations-india',
    image: '/assets/images/blog-5-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'Explore culinary havens offering pure vegetarian and Jain culinary experiences with absolute peace of mind.',
    content: 'Finding authentic vegetarian and Jain food while travelling is seamless when you visit destinations renowned for their rich vegetarian food culture. From the royal thalis of Gujarat and Rajasthan to the sacred temple feasts of South India, here are top destinations with mouthwatering veg options.',
    views_count: 1567
  },
  {
    title: 'How to Pack Smart for a Week-Long Indian Holiday in Any Season',
    slug: 'how-to-pack-smart-for-week-long-indian-holiday',
    image: '/assets/images/blog-6-370x270.jpg',
    author: 'Maharaja Tours',
    summary: 'Essential checklist of clothing, medicines, travel gadgets, and weather essentials for hassle-free travel.',
    content: 'Packing efficiently can make or break your holiday. Whether you are heading to snowy mountain passes or sunny coastal beaches, learn how to layer clothes, organize important documents, carry essential medications, and keep your luggage lightweight.',
    views_count: 743
  }
];

const initialTestimonials = [
  {
    name: 'Rajesh Patel',
    designation: 'Ahmedabad, Gujarat',
    rating: 5,
    comment: 'Maharaja Tours organized our Kerala family holiday perfectly! From the luxury houseboat stay to the private chauffeur, everything was flawless.',
    avatar: '/assets/images/testimonials-avatar.jpg'
  },
  {
    name: 'Pooja Sharma',
    designation: 'Mumbai, Maharashtra',
    rating: 5,
    comment: 'The Rajasthan Heritage tour exceeded all our expectations. The desert camp in Jaisalmer under the stars was truly magical. Highly recommended!',
    avatar: '/assets/images/testimonials-avatar.jpg'
  },
  {
    name: 'Anil Mehta',
    designation: 'Surat, Gujarat',
    rating: 5,
    comment: 'Great customer support and very reasonable pricing. My parents had a wonderful trip to Kashmir with personalized care from the team.',
    avatar: '/assets/images/testimonials-avatar.jpg'
  }
];

export async function initializeDatabase() {
  let connection;
  try {
    console.log(`[DB Init] Connecting to MySQL server at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);
    
    // Connect without database first
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`[DB Init] Database "${DB_NAME}" verified/created.`);

    // Switch to database
    await connection.changeUser({ database: DB_NAME });

    // 1. Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 2. Packages Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price_range VARCHAR(100) NOT NULL,
        season VARCHAR(100),
        nights VARCHAR(100),
        location VARCHAR(255),
        main_image VARCHAR(255),
        description TEXT,
        highlights JSON,
        includes JSON,
        map_src TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 3. Package Pricing Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS package_pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NOT NULL,
        pkg_tier VARCHAR(150) NOT NULL,
        from_date VARCHAR(50),
        to_date VARCHAR(50),
        price VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
      );
    `);

    // 4. Package Gallery Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS package_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
      );
    `);

    // 5. Blogs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        image VARCHAR(255),
        author VARCHAR(150) DEFAULT 'Maharaja Tours',
        summary TEXT,
        content LONGTEXT,
        views_count INT DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 6. Bookings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        package_id INT NULL,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        pickup_location VARCHAR(255),
        return_location VARCHAR(255),
        pickup_date VARCHAR(100),
        return_date VARCHAR(100),
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
      );
    `);

    // 7. Enquiries Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date1 VARCHAR(50),
        date2 VARCHAR(50),
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'contacted', 'closed') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
      );
    `);

    // 8. Contact Messages Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Testimonials Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        designation VARCHAR(150),
        rating INT DEFAULT 5,
        comment TEXT NOT NULL,
        avatar VARCHAR(255),
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. User AI Travel Preferences (Long-term Memory)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_ai_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_id VARCHAR(100) NULL,
        budget_tier VARCHAR(50) DEFAULT 'moderate',
        favorite_destinations JSON,
        food_preferences JSON,
        hotel_preference VARCHAR(100) DEFAULT '3-star boutique or verified partner',
        preferred_style VARCHAR(100) DEFAULT 'Balanced',
        preferred_activities JSON,
        avoided_activities JSON,
        preferred_pace VARCHAR(50) DEFAULT 'moderate',
        wake_up_time VARCHAR(50) DEFAULT '08:30',
        custom_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 11. User AI Saved & Re-Planned Itineraries
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_ai_itineraries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_id VARCHAR(100) NULL,
        destination VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        travelers INT DEFAULT 1,
        budget_limit DECIMAL(10,2) NULL,
        estimated_budget DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        itinerary_json JSON NOT NULL,
        plan_version INT DEFAULT 1,
        replanned_from_id INT NULL,
        replan_reason VARCHAR(255) NULL,
        replan_diff JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    console.log('[DB Init] All database tables verified/created successfully.');

    // Seed Admin User (Admin Account)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maharajatours.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminPhone = process.env.ADMIN_PHONE || '+919876543210';

    const [adminRows] = await connection.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (adminRows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, adminPhone, 'admin']
      );
      console.log(`[DB Seed] Admin account created: Email: ${adminEmail} / Password: ${adminPassword}`);
    } else {
      console.log(`[DB Seed] Admin account (${adminEmail}) already exists.`);
    }

    // Seed Demo Customer
    const customerEmail = 'customer@example.com';
    const [customerRows] = await connection.query('SELECT id FROM users WHERE email = ?', [customerEmail]);
    if (customerRows.length === 0) {
      const hashedCustPassword = await bcrypt.hash('customer123', 10);
      await connection.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Demo Customer', customerEmail, hashedCustPassword, '+919123456780', 'customer']
      );
      console.log(`[DB Seed] Demo customer created: Email: ${customerEmail} / Password: customer123`);
    }

    // Seed Packages
    const [pkgCountRows] = await connection.query('SELECT COUNT(*) as count FROM packages');
    if (pkgCountRows[0].count === 0) {
      console.log('[DB Seed] Seeding initial tour packages...');
      for (const pkg of initialPackages) {
        const [res] = await connection.query(
          `INSERT INTO packages (title, price_range, season, nights, location, main_image, description, highlights, includes, map_src, is_featured, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pkg.title,
            pkg.price_range,
            pkg.season,
            pkg.nights,
            pkg.location,
            pkg.main_image,
            pkg.description,
            pkg.highlights,
            pkg.includes,
            pkg.map_src,
            pkg.is_featured,
            true
          ]
        );

        const packageId = res.insertId;

        // Insert pricing tiers
        if (pkg.pricing && pkg.pricing.length > 0) {
          for (const pr of pkg.pricing) {
            await connection.query(
              'INSERT INTO package_pricing (package_id, pkg_tier, from_date, to_date, price) VALUES (?, ?, ?, ?, ?)',
              [packageId, pr.pkg_tier, pr.from_date, pr.to_date, pr.price]
            );
          }
        }

        // Insert gallery images
        if (pkg.gallery && pkg.gallery.length > 0) {
          for (let i = 0; i < pkg.gallery.length; i++) {
            await connection.query(
              'INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES (?, ?, ?)',
              [packageId, pkg.gallery[i], i]
            );
          }
        }
      }
      console.log(`[DB Seed] Seeded ${initialPackages.length} tour packages.`);
    }

    // Seed Blogs
    const [blogCountRows] = await connection.query('SELECT COUNT(*) as count FROM blogs');
    if (blogCountRows[0].count === 0) {
      console.log('[DB Seed] Seeding initial blogs...');
      for (const blog of initialBlogs) {
        await connection.query(
          `INSERT INTO blogs (title, slug, image, author, summary, content, views_count, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [blog.title, blog.slug, blog.image, blog.author, blog.summary, blog.content, blog.views_count, true]
        );
      }
      console.log(`[DB Seed] Seeded ${initialBlogs.length} blogs.`);
    }

    // Seed Testimonials
    const [testiCountRows] = await connection.query('SELECT COUNT(*) as count FROM testimonials');
    if (testiCountRows[0].count === 0) {
      console.log('[DB Seed] Seeding initial testimonials...');
      for (const t of initialTestimonials) {
        await connection.query(
          'INSERT INTO testimonials (name, designation, rating, comment, avatar, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
          [t.name, t.designation, t.rating, t.comment, t.avatar, true]
        );
      }
      console.log(`[DB Seed] Seeded ${initialTestimonials.length} testimonials.`);
    }

    console.log('[DB Init] Database initialization and seeding completed successfully! 🎉');
  } catch (error) {
    console.error('[DB Init Error]:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run directly if called from command line
if (process.argv[1] && process.argv[1].endsWith('initDb.js')) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
