import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'mssql';
import axios from 'axios'; // Import axios
import requestIp from 'request-ip'; // Import request-ip

const { json } = bodyParser;
const { connect, Request } = pkg;

const app = express();
const port = 3000;

app.use(json());
app.use(cors());
app.use(requestIp.mw()); // Use request-ip middleware

const dbConfig = {
  user: 'sa',
  password: '145188644',
  server: 'DESKTOP-M4PV8OO',
  database: 'master',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: 1433
  }
};

connect(dbConfig, err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

const getLocationFromIP = async (ip) => {
  try {
    console.log(`Fetching location for IP: ${ip}`);
    const response = await axios.get(`http://ipinfo.io/${ip}/json?token=your_ipinfo_token`);
    console.log(`Location response: ${JSON.stringify(response.data)}`);
    return response.data.city || 'Local';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Unknown';
  }
};

app.post('/api/register', async (req, res) => {
  const { username, password, email, phone, securityQuestion, securityAnswer, authType } = req.body;

  try {
    const request = new Request();
    request.input('username', pkg.VarChar, username);
    request.input('password', pkg.VarChar, password);
    request.input('email', pkg.VarChar, email);
    request.input('phone', pkg.VarChar, phone);
    request.input('securityQuestion', pkg.VarChar, securityQuestion);
    request.input('securityAnswer', pkg.VarChar, securityAnswer);
    request.input('authType', pkg.VarChar, authType);

    await request.query(`
      INSERT INTO users (username, password, email, phone, securityQuestion, securityAnswer, authType)
      VALUES (@username, @password, @email, @phone, @securityQuestion, @securityAnswer, @authType)
    `);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const clientIP = req.clientIp; // Get the real IP address

  try {
    const request = new Request();
    request.input('username', pkg.VarChar, username);
    request.input('password', pkg.VarChar, password);
    request.input('currentTime', pkg.DateTime, currentTime); // Declare and set @currentTime
    request.input('clientIP', pkg.VarChar, clientIP); // Declare and set @clientIP

    const result = await request.query(`
      SELECT * FROM users WHERE username = @username
    `);

    if (result.recordset.length === 0) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const user = result.recordset[0];

    if (user.failedLoginAttempts >= 3) {
      res.status(403).json({ message: 'Account locked due to multiple failed login attempts', otpRequired: true, otp: '123456' });
      return;
    }

    if (user.password !== password) {
      await request.query(`
        UPDATE users SET failedLoginAttempts = failedLoginAttempts + 1 WHERE username = @username
      `);
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    await request.query(`
      UPDATE users SET failedLoginAttempts = 0 WHERE username = @username
    `);

    if (currentHour < 9 || currentHour > 16) {
      res.status(200).json({ message: 'OTP required due to login time', otpRequired: true, otp: '123456' });
      return;
    }

    const lastLoginLocation = await getLocationFromIP(clientIP); // Get location from IP
    request.input('lastLoginLocation', pkg.VarChar, lastLoginLocation); // Declare and set @lastLoginLocation

    await request.query(`
      UPDATE users SET lastLoginTime = @currentTime, lastLoginIP = @clientIP, lastLoginLocation = @lastLoginLocation WHERE username = @username
    `);

    res.status(200).json({ message: 'Login successful', lastLoginTime: currentTime, lastLoginIP: clientIP, lastLoginLocation });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
