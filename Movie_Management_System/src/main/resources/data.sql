-- Test kullanıcıları için şifreler: 'admin123', 'user123', 'editor123'
-- BCrypt ile hashlenmiş hali
INSERT INTO users (id, username, email, password, role) VALUES 
(1, 'Admin', 'admin@example.com', '$2a$10$3B2yuzQDkP6U5P4v1q1/EOyJHGqN8MtV.eR4YFScOqRo7HpMKc5HK', 'ADMIN'),
(2, 'User1', 'user@example.com', '$2a$10$ufX5.x4hH4CIIZDkUURsn.ZQF9xmO3NyRGkM8xHRRZK2p.nLiFQS6', 'CUSTOMER'),
(3, 'Editor', 'editor@example.com', '$2a$10$XTcwjZIgzP40.SAeAbkLUO6njJ.WKQP1vSuFGS60SZ2o.6Kze1v42', 'EDITOR'); 

UPDATE users SET password = '$2a$10$yNrHaGSBzUdb7wSPv5wXl.X9YnICssibqUm6E9afyRFOvDy2F7wGO' WHERE username = 'your_username'; 