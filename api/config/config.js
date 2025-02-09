import 'dotenv/config';

const config = {
  databaseURL: process.env.MONGO , // MongoDB connection
  port: process.env.PORT || 3000, // Server port
  agenda: {
    dbCollection: 'agendaJobs', // MongoDB collection for jobs
    pooltime: '1 minute', // How often Agenda checks for jobs
    concurrency: 100, // Max concurrent jobs
  },
  mailer: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
  BASE_URL: process.env.BASE_URL,  // Add BASE_URL to the config
};

export default config;
