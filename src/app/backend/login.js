const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Generate a random secret key
const secretKey = require('crypto').randomBytes(32).toString('hex');

// Middleware to parse JSON
app.use(bodyParser.json());

// Use the 'cors' middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// Oracle Database connection configuration
const dbConfig = {
  user: 'oussama',
  password: 'hout',
  connectString: 'localhost:1521/orcl'
};

// API endpoint for handling login
app.post('/login', async (req, res) => {
  const { idNumber, password } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT employee_id FROM Khaddema WHERE employee_id = :idNumber AND password = :password`,
      [idNumber, password]
    );

    if (result.rows.length > 0) {
      // Generate a JWT token
      const token = jwt.sign({ idNumber }, secretKey, { expiresIn: '1h' });
      res.json({ success: true, message: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await connection.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// API endpoint to fetch sons' information based on employee's ID
app.get('/sons', async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, secretKey);
    const employeeId = decodedToken.idNumber;

    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
  `SELECT s.son_id, s.son_name, s.birth_date, s.study_institution, s.level_of_studies, s.class_name, s.grade_average,
   es.canupdate
   FROM sghar s
   JOIN khaddema_sghar ks ON s.son_id = ks.son_id
   LEFT JOIN employeeupdatestatus es ON ks.employee_id = es.employeeid
   WHERE ks.employee_id = :employeeId`,
  [employeeId]
);

const sons = result.rows.map(row => ({
  sonId: row[0],
  name: row[1],
  birthdate: row[2],
  studyInstitution: row[3],
  levelOfStudies: row[4],
  className: row[5],
  gradeAverage: row[6],
  canUpdate: row[7] 
}));


    res.json({ success: true, message: 'Sons fetched successfully', sons });

    await connection.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

//api for update
app.post('/update-son', async (req, res) => {
  const { sonId, studyInstitution, levelOfStudies, className, gradeAverage } = req.body;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  console.log('Received update request:', req.body);

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const employeeId = decodedToken.idNumber;

    const connection = await oracledb.getConnection(dbConfig);

    console.log('Connected to the database');

    try {
    

      const result = await connection.execute(
        `UPDATE sghar 
        SET study_institution = :studyInstitution,
            level_of_studies = :levelOfStudies,
            class_name = :className,
            grade_average = :gradeAverage
        WHERE son_id = :sonId
          AND EXISTS (
            SELECT 1
            FROM khaddema_sghar 
            WHERE son_id = :sonId AND employee_id = :employeeId
          )`,
        [studyInstitution, levelOfStudies, className, gradeAverage, sonId, sonId, employeeId]
      );

      console.log('Executed UPDATE query:', result);

      if (result.rowsAffected > 0) {
        // Commit the transaction
        await connection.execute(`COMMIT`);
        
        console.log('Son information updated successfully');
        res.json({ success: true, message: 'Son information updated successfully' });
      } else {
        console.log('Failed to update son\'s information');
        res.json({ success: false, message: 'Failed to update son\'s information' });
      }
    } catch (err) {
      console.error(err);
      // Rollback the transaction in case of an error
      await connection.execute(`ROLLBACK`);

      res.status(500).json({ success: false, message: 'An error occurred' });
    } finally {
      // Close the connection
      await connection.close();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



