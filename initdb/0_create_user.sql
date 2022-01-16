CREATE USER 'dummy_user'@'%' IDENTIFIED WITH mysql_native_password BY 'dummy_password';
CREATE DATABASE allez;
GRANT ALL PRIVILEGES ON allez.* TO 'dummy_user'@'%';
