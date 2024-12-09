CREATE DATABASE auth_db;

USE auth_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  securityQuestion VARCHAR(255) NOT NULL,
  securityAnswer VARCHAR(255) NOT NULL,
  authType VARCHAR(20) NOT NULL,
  failedAttempts INT DEFAULT 0
);

CREATE TABLE auth_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
