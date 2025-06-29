/*
  # Insert Sample Data for SkillSwap AI

  This migration adds sample data for categories, skills, and initial setup data
  to help with development and testing.
*/

-- Insert Categories
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('Web Development', 'Website and web application development services', '💻', 'from-blue-500 to-cyan-500', 1),
('Mobile Development', 'iOS and Android app development', '📱', 'from-green-500 to-emerald-500', 2),
('Design & Creative', 'UI/UX design, graphic design, and creative services', '🎨', 'from-purple-500 to-pink-500', 3),
('Digital Marketing', 'SEO, social media, and online marketing services', '📈', 'from-orange-500 to-red-500', 4),
('Writing & Content', 'Content writing, copywriting, and translation', '✍️', 'from-indigo-500 to-purple-500', 5),
('Business Services', 'Consulting, accounting, and business support', '💼', 'from-gray-600 to-gray-800', 6),
('Home Services', 'Plumbing, electrical, cleaning, and maintenance', '🏠', 'from-green-500 to-emerald-500', 7),
('Fitness & Health', 'Personal training, nutrition, and wellness', '💪', 'from-orange-500 to-red-500', 8),
('Education & Tutoring', 'Academic tutoring and skill training', '📚', 'from-indigo-500 to-purple-500', 9),
('Photography & Video', 'Photography, videography, and editing', '📸', 'from-pink-500 to-rose-500', 10),
('Music & Audio', 'Music production, audio editing, and sound design', '🎵', 'from-purple-500 to-indigo-500', 11),
('Legal Services', 'Legal consultation and document preparation', '⚖️', 'from-blue-600 to-indigo-600', 12);

-- Insert Skills for Web Development
INSERT INTO skills (name, description, category_id) VALUES
('React', 'JavaScript library for building user interfaces', (SELECT id FROM categories WHERE name = 'Web Development')),
('Node.js', 'JavaScript runtime for server-side development', (SELECT id FROM categories WHERE name = 'Web Development')),
('JavaScript', 'Programming language for web development', (SELECT id FROM categories WHERE name = 'Web Development')),
('TypeScript', 'Typed superset of JavaScript', (SELECT id FROM categories WHERE name = 'Web Development')),
('Python', 'High-level programming language', (SELECT id FROM categories WHERE name = 'Web Development')),
('PHP', 'Server-side scripting language', (SELECT id FROM categories WHERE name = 'Web Development')),
('HTML/CSS', 'Markup and styling languages for web', (SELECT id FROM categories WHERE name = 'Web Development')),
('Vue.js', 'Progressive JavaScript framework', (SELECT id FROM categories WHERE name = 'Web Development')),
('Angular', 'TypeScript-based web application framework', (SELECT id FROM categories WHERE name = 'Web Development')),
('WordPress', 'Content management system', (SELECT id FROM categories WHERE name = 'Web Development')),
('Shopify', 'E-commerce platform development', (SELECT id FROM categories WHERE name = 'Web Development')),
('AWS', 'Amazon Web Services cloud platform', (SELECT id FROM categories WHERE name = 'Web Development')),
('Docker', 'Containerization platform', (SELECT id FROM categories WHERE name = 'Web Development')),
('MongoDB', 'NoSQL database', (SELECT id FROM categories WHERE name = 'Web Development')),
('PostgreSQL', 'Relational database', (SELECT id FROM categories WHERE name = 'Web Development'));

-- Insert Skills for Mobile Development
INSERT INTO skills (name, description, category_id) VALUES
('React Native', 'Cross-platform mobile development framework', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('Flutter', 'Google''s UI toolkit for mobile development', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('iOS Development', 'Native iOS app development', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('Android Development', 'Native Android app development', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('Swift', 'Programming language for iOS development', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('Kotlin', 'Programming language for Android development', (SELECT id FROM categories WHERE name = 'Mobile Development')),
('Xamarin', 'Microsoft''s cross-platform development framework', (SELECT id FROM categories WHERE name = 'Mobile Development'));

-- Insert Skills for Design & Creative
INSERT INTO skills (name, description, category_id) VALUES
('UI/UX Design', 'User interface and experience design', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Graphic Design', 'Visual design and branding', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Adobe Photoshop', 'Image editing and manipulation software', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Adobe Illustrator', 'Vector graphics design software', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Figma', 'Collaborative design tool', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Sketch', 'Digital design toolkit', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Adobe XD', 'User experience design software', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Branding', 'Brand identity and visual design', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Logo Design', 'Logo creation and brand identity', (SELECT id FROM categories WHERE name = 'Design & Creative')),
('Web Design', 'Website visual design', (SELECT id FROM categories WHERE name = 'Design & Creative'));

-- Insert Skills for Digital Marketing
INSERT INTO skills (name, description, category_id) VALUES
('SEO', 'Search engine optimization', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Google Ads', 'Google advertising platform', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Facebook Ads', 'Facebook advertising platform', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Social Media Marketing', 'Social media strategy and management', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Content Marketing', 'Content strategy and creation', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Email Marketing', 'Email campaign management', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('Analytics', 'Data analysis and reporting', (SELECT id FROM categories WHERE name = 'Digital Marketing')),
('PPC Advertising', 'Pay-per-click advertising', (SELECT id FROM categories WHERE name = 'Digital Marketing'));

-- Insert Skills for Home Services
INSERT INTO skills (name, description, category_id) VALUES
('Plumbing', 'Water system installation and repair', (SELECT id FROM categories WHERE name = 'Home Services')),
('Electrical Work', 'Electrical installation and repair', (SELECT id FROM categories WHERE name = 'Home Services')),
('Carpentry', 'Woodworking and furniture making', (SELECT id FROM categories WHERE name = 'Home Services')),
('Painting', 'Interior and exterior painting', (SELECT id FROM categories WHERE name = 'Home Services')),
('Cleaning', 'House and office cleaning services', (SELECT id FROM categories WHERE name = 'Home Services')),
('Gardening', 'Garden maintenance and landscaping', (SELECT id FROM categories WHERE name = 'Home Services')),
('HVAC', 'Heating, ventilation, and air conditioning', (SELECT id FROM categories WHERE name = 'Home Services')),
('Appliance Repair', 'Home appliance maintenance and repair', (SELECT id FROM categories WHERE name = 'Home Services'));

-- Insert Skills for Fitness & Health
INSERT INTO skills (name, description, category_id) VALUES
('Personal Training', 'Fitness coaching and training', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Yoga Instruction', 'Yoga teaching and practice', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Nutrition Counseling', 'Diet and nutrition guidance', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Weight Training', 'Strength and resistance training', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Cardio Training', 'Cardiovascular fitness training', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Pilates', 'Pilates instruction and training', (SELECT id FROM categories WHERE name = 'Fitness & Health')),
('Sports Coaching', 'Athletic coaching and training', (SELECT id FROM categories WHERE name = 'Fitness & Health'));

-- Insert Skills for Education & Tutoring
INSERT INTO skills (name, description, category_id) VALUES
('Mathematics', 'Math tutoring and instruction', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('English', 'English language and literature', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('Science', 'Science subjects tutoring', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('Programming', 'Computer programming instruction', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('Music Lessons', 'Musical instrument instruction', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('Language Teaching', 'Foreign language instruction', (SELECT id FROM categories WHERE name = 'Education & Tutoring')),
('Test Preparation', 'Standardized test preparation', (SELECT id FROM categories WHERE name = 'Education & Tutoring'));

-- Insert Skills for Writing & Content
INSERT INTO skills (name, description, category_id) VALUES
('Content Writing', 'Blog posts and article writing', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Copywriting', 'Marketing and sales copy', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Technical Writing', 'Technical documentation and manuals', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Creative Writing', 'Fiction and creative content', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Translation', 'Language translation services', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Proofreading', 'Text editing and proofreading', (SELECT id FROM categories WHERE name = 'Writing & Content')),
('Grant Writing', 'Grant proposal writing', (SELECT id FROM categories WHERE name = 'Writing & Content'));

-- Insert Skills for Business Services
INSERT INTO skills (name, description, category_id) VALUES
('Business Consulting', 'Business strategy and consulting', (SELECT id FROM categories WHERE name = 'Business Services')),
('Accounting', 'Financial accounting and bookkeeping', (SELECT id FROM categories WHERE name = 'Business Services')),
('Tax Preparation', 'Tax filing and preparation', (SELECT id FROM categories WHERE name = 'Business Services')),
('Project Management', 'Project planning and execution', (SELECT id FROM categories WHERE name = 'Business Services')),
('Virtual Assistant', 'Administrative support services', (SELECT id FROM categories WHERE name = 'Business Services')),
('Data Entry', 'Data processing and entry', (SELECT id FROM categories WHERE name = 'Business Services')),
('Market Research', 'Market analysis and research', (SELECT id FROM categories WHERE name = 'Business Services'));

-- Insert Skills for Photography & Video
INSERT INTO skills (name, description, category_id) VALUES
('Portrait Photography', 'Portrait and headshot photography', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Wedding Photography', 'Wedding and event photography', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Product Photography', 'Commercial product photography', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Video Editing', 'Video post-production and editing', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Videography', 'Video production and filming', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Photo Editing', 'Photo retouching and editing', (SELECT id FROM categories WHERE name = 'Photography & Video')),
('Drone Photography', 'Aerial photography and videography', (SELECT id FROM categories WHERE name = 'Photography & Video'));

-- Insert Skills for Legal Services
INSERT INTO skills (name, description, category_id) VALUES
('Legal Consultation', 'Legal advice and consultation', (SELECT id FROM categories WHERE name = 'Legal Services')),
('Contract Review', 'Contract analysis and review', (SELECT id FROM categories WHERE name = 'Legal Services')),
('Document Preparation', 'Legal document drafting', (SELECT id FROM categories WHERE name = 'Legal Services')),
('Immigration Law', 'Immigration legal services', (SELECT id FROM categories WHERE name = 'Legal Services')),
('Family Law', 'Family legal matters', (SELECT id FROM categories WHERE name = 'Legal Services')),
('Business Law', 'Business legal services', (SELECT id FROM categories WHERE name = 'Legal Services'));