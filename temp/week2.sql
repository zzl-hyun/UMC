USE UMC;

DROP TABLE IF EXISTS member_agree;
DROP TABLE IF EXISTS review_image;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS member_mission;
DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS member_prefer;
DROP TABLE IF EXISTS food_category;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS terms;

CREATE TABLE member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    gender VARCHAR(10),
    age INT,
    address VARCHAR(40),
    spec_address VARCHAR(40),
    phone_num VARCHAR(13),
    status VARCHAR(15),
    inactive_date DATETIME(6),
    social_type VARCHAR(10),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    email VARCHAR(50),
    point INT
);

CREATE TABLE region (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id BIGINT,
    name VARCHAR(50),
    address VARCHAR(50),
    score FLOAT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (region_id) REFERENCES region(id)
);

CREATE TABLE terms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20),
    body TEXT,
    optional BOOLEAN,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE food_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15),
    Column4 VARCHAR(15)
);

CREATE TABLE member_prefer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    category_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (category_id) REFERENCES food_category(id)
);

CREATE TABLE mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT,
    reward INT,
    deadline DATETIME,
    mission_spec TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE member_mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    mission_id BIGINT,
    status VARCHAR(15),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (mission_id) REFERENCES mission(id)
);

CREATE TABLE review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    store_id BIGINT,
    body TEXT,
    score FLOAT,
    created_at DATETIME(6),
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE review_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT,
    store_id BIGINT,
    image_url TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (review_id) REFERENCES review(id),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE member_agree (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    terms_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (terms_id) REFERENCES terms(id)
);

INSERT INTO terms (title, body, optional, created_at, updated_at)
VALUES
('Privacy Policy', 'Details about privacy.', TRUE, NOW(), NOW()),
('Terms of Service', 'Details about service.', FALSE, NOW(), NOW());

INSERT INTO food_category (name, Column4)
VALUES
('Pizza', 'Food'),
('Burgers', 'Food');

INSERT INTO member (name, gender, age, address, spec_address, status, inactive_date, social_type, created_at, updated_at, email, point, phone_num)
VALUES
('John Doe', 'Male', 28, '123 Main St', 'Suite 100', 'active', NULL, 'type1', NOW(), NOW(), 'john@example.com', 100, '010-1111-1111'),
('Jane Doe', 'Female', 25, '456 Oak St', 'Apt 200', 'active', NULL, 'type2', NOW(), NOW(), 'jane@example.com', 200, '010-1111-1111');

INSERT INTO region (name, created_at, updated_at)
VALUES ('Seoul', NOW(), NOW()), ('Busan', NOW(), NOW());

INSERT INTO store (region_id, name, address, score, created_at, updated_at)
VALUES
(1, 'Awesome Store', '789 Store Ave', 4.5, NOW(), NOW()),
(2, 'Great Shop', '101 River Rd', 4.7, NOW(), NOW());

INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at)
VALUES
(1, 500, '2024-12-31 23:59:59', 'Complete 5 purchases', NOW(), NOW()),
(2, 300, '2024-10-31 23:59:59', 'Write 2 reviews', NOW(), NOW());

INSERT INTO member_mission (member_id, mission_id, status, created_at, updated_at)
VALUES
(1, 1, '진행중', NOW(), NOW()),
(2, 2, '진행완료', NOW(), NOW());

INSERT INTO review (member_id, store_id, body, score, created_at)
VALUES
(1, 1, 'Great experience!', 5.0, NOW()),
(2, 2, 'Nice shop!', 4.8, NOW());

INSERT INTO review_image (review_id, store_id, image_url, created_at, updated_at)
VALUES
(1, 1, 'http://example.com/image1.jpg', NOW(), NOW()),
(2, 2, 'http://example.com/image2.jpg', NOW(), NOW());

INSERT INTO member_agree (member_id, terms_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());

INSERT INTO member_prefer (member_id, category_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());