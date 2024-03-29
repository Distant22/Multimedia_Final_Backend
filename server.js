const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const { Pool } = require('pg');

let pool;

const connectToDB = async () => {
  try {
    pool = new Pool({
      user: 'dt22',
      host: 'dpg-cmapu96n7f5s7395nsjg-a',
      database: 'messages_9wpq',
      password: 'vJqkuku8GiRl3boMEgI9YcFoJ0kZiUEA',
      port: 5432,
    });

    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');
    await initializeDB(pool);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    setTimeout(connectToDB, 3000); // Retry connection after 3 seconds
  }
};

const initializeDB = async (pool) => {
  try {

    await pool.query('DROP TABLE IF EXISTS message');
    const createQueries = [
      "CREATE TABLE message (id SERIAL PRIMARY KEY, text TEXT NOT NULL, sender TEXT NOT NULL, room_id TEXT NOT NULL);",
      "GRANT ALL PRIVILEGES ON TABLE message TO dt22;"
    ];

    for (const query of createQueries) {
      await pool.query(query);
      console.log('Executed query:', query);
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

connectToDB();

const io = new Server(server, {
    cors: {
      origin: 'https://multimedia-final-frontend.vercel.app',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });

io.on('connection', (socket) => {
  socket.on('message', ({
    'text': text,
    'from' : userId,
    'room' : roomId,
  }) => {

    console.log("I receive message. text:",text)
    const insertQuery = 'INSERT INTO message (room_id, text, sender) VALUES ($1, $2, $3)';
    const values = [roomId, text, userId]; 

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error('Error inserting message:', err);
      } else {
        console.log('Message inserted into the database');
      }
    });

    console.log(`User ID：${userId}｜Text：${text}｜Room ID：${roomId}`);
    io.emit('updatedMessages', "");
  });

  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors())
app.post('/api/messages', (req, res) => {
  const roomId = req.body.room
  const selectQuery = 'SELECT * FROM message WHERE room_id = $1';
  const values = [roomId];
  pool.query(selectQuery, values, (err, result) => {
    if (err) {
      console.log('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(result.rows);
    }
  });
});
app.get('', (req, res) => {
  res.status(200).json({
    "result": "Multimedia Final setup Successfully!"
  })
})