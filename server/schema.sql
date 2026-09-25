-- Database Schema for Maharaja Tours & Travels

CREATE DATABASE IF NOT EXISTS maharaja_tours;
USE maharaja_tours;

-- 1. Users Table (Customers & Admin)
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

-- 2. Tour Packages Table
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

-- 3. Package Pricing Tiers
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

-- 4. Package Gallery Images
CREATE TABLE IF NOT EXISTS package_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- 5. Blogs Table
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

-- 6. Bookings Table (from "Book Now" modal)
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

-- 7. Enquiries Table (from Package Details "Send an Enquiry")
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

-- 8. Contact Messages Table (from Contact page)
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

-- 9. Testimonials Table
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

-- 10. User AI Travel Preferences (Long-term Memory)
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

-- 11. User AI Saved & Re-Planned Itineraries
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

