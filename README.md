# React App med Frontend och Backend

Detta är en fullstack React-applikation med separata frontend och backend mappar.

## Projektstruktur

```
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # React komponenter
│   │   ├── pages/         # Sidor
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Hjälpfunktioner
│   │   ├── context/       # React Context
│   │   ├── assets/        # Bilder och ikoner
│   │   └── styles/        # CSS filer
│   ├── public/
│   └── package.json
│
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Data modeller
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Hjälpfunktioner
│   │   └── config/        # Konfiguration
│   ├── .env
│   └── package.json
│
└── README.md
```

## Installation och körning

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend körs på http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend körs på http://localhost:3000

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/weather/current/:city` - Nuvarande väder för stad
- `GET /api/weather/forecast/:city` - Väderprognos för stad
- `GET /api/weather/coordinates?lat=:lat&lon=:lon` - Väder baserat på koordinater

## Miljövariabler

Skapa en `.env` fil i backend-mappen:
```
PORT=5000
WEATHER_API_KEY=your_openweathermap_api_key_here
NODE_ENV=development
```

## Teknologier

### Frontend
- React
- Material-UI
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- CORS
- Helmet
- Morgan
- Axios
- Dotenv

## Utveckling

För att köra både frontend och backend samtidigt:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```
