# 🚌 Bus TK - Dhaka Bus Fare Calculator

A modern, efficient bus fare calculation system for Dhaka city with real-time location search and fare calculation capabilities.

## 🌟 **Features**

### **🚀 Core Functionality**

- **Smart Location Search**: Efficient search across 2,877+ Dhaka locations
- **Real-time Fare Calculation**: Instant fare calculation based on distance and bus type
- **Multi-language Support**: English and Bengali location names
- **Bus Type Options**: AC and Non-AC bus fare calculations
- **Discount System**: Student and monthly pass discounts
- **Input Modes**: Location-based or direct distance input

### **⚡ Performance Optimizations**

- **In-Memory Caching**: All locations loaded once at startup
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Smart Algorithms**: Priority-based search with relevance scoring
- **Focus Management**: Input focus maintained during search operations
- **Efficient Rendering**: Optimized React components with minimal re-renders

### **🎨 User Experience**

- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Support**: Beautiful dark and light themes
- **Smooth Animations**: CSS transitions and loading indicators
- **Keyboard Navigation**: Tab navigation between inputs
- **Visual Feedback**: Loading states, success indicators, and error handling

## 🏗️ **Architecture**

### **Backend (Go)**

- **Language**: Go 1.21+
- **Framework**: Standard HTTP library
- **Data Storage**: JSON file with in-memory caching
- **API Design**: RESTful endpoints with CORS support
- **Performance**: O(n) search complexity with early termination

### **Frontend (Next.js)**

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React useReducer + useState
- **Build Tool**: Turbopack for fast development

## 📁 **Project Structure**

```
bus-tk/
├── bus-tk-backend/          # Go backend service
│   ├── cmd/server/          # Main server entry point
│   ├── config/              # Configuration files
│   ├── data/                # Location data (dhaka_areas.json)
│   ├── handlers/            # HTTP request handlers
│   ├── models/              # Data structures
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── bus-tk-frontend/         # Next.js frontend
│   ├── app/                 # App router components
│   ├── types/               # TypeScript type definitions
│   └── public/              # Static assets
└── osrm-dhaka/              # OSRM routing service
    └── docker-compose.yaml  # Docker configuration
```

## 🚀 **Getting Started**

### **Prerequisites**

- Go 1.21+ (for backend)
- Node.js 18+ (for frontend)
- Docker (for OSRM service)

### **1. Clone the Repository**

```bash
git clone https://github.com/golammostafa13/bus-tk
cd bus-tk
```

### **2. Start the Backend**

```bash
cd bus-tk-backend
go mod tidy
go run ./cmd/server
```

The backend will start on `http://localhost:8888`

### **3. Start the Frontend**

```bash
cd bus-tk-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### **4. Start OSRM Service (Optional)**

```bash
cd osrm-dhaka
docker-compose up -d
```

## 🔌 **API Endpoints**

### **Location Services**

- `GET /api/locations` - Get all locations
- `GET /api/locations/search?q=query&lang=en&limit=20` - Search locations
- `GET /api/locations/stats` - Get system statistics

### **Fare Calculation**

- `POST /api/calculate-fare` - Calculate bus fare

### **Health Check**

- `GET /health` - Service health status

## 🔍 **Search Algorithm**

### **Priority-Based Search**

1. **Exact Matches** (Score: 100) - Perfect matches
2. **Prefix Matches** (Score: 50) - Starts with query
3. **Contains Matches** (Score: 25) - Contains query anywhere
4. **Language Bonus** (Score: +10) - Language preference

### **Search Features**

- **Minimum Query Length**: 2 characters
- **Case Insensitive**: Works with any case
- **Bilingual Support**: English and Bengali
- **Result Limiting**: Configurable (default: 20, max: 100)
- **Duplicate Removal**: Automatic deduplication

## 💰 **Fare Calculation**

### **Bus Types**

- **Non-AC Bus**: Standard local bus rates
- **AC Bus**: Air-conditioned bus with premium rates

### **Discount Types**

- **No Discount**: Standard fare
- **Student Discount**: 50% off
- **Monthly Pass**: 20% off

### **Calculation Method**

- **Distance-based**: Calculated from start to end coordinates
- **Rate Structure**: Base rate + distance multiplier
- **Discount Application**: Applied after base calculation

## 🎯 **Use Cases**

### **1. Location Selection**

- User types in search box
- Real-time results appear
- User selects from dropdown
- Focus maintained throughout process

### **2. Fare Calculation**

- Select start and end locations
- Choose bus type and discounts
- Instant fare calculation
- Detailed breakdown display

### **3. Distance Input**

- Direct distance input mode
- Same fare calculation logic
- Alternative to location selection

## 🚀 **Performance Metrics**

### **Backend Performance**

- **Startup Time**: ~100ms (location loading)
- **Search Response**: <10ms (in-memory search)
- **Memory Usage**: ~2MB (2,877 locations)
- **Concurrent Users**: 1000+ (theoretical)

### **Frontend Performance**

- **Search Debounce**: 300ms
- **API Response**: <50ms (local network)
- **Bundle Size**: Optimized with Next.js
- **Lighthouse Score**: 95+ (performance)

## 🛠️ **Development**

### **Backend Development**

```bash
cd bus-tk-backend
go run ./cmd/server          # Run development server
go test ./...                # Run all tests
go build ./cmd/server        # Build binary
```

### **Frontend Development**

```bash
cd bus-tk-frontend
npm run dev                   # Start development server
npm run build                # Build for production
npm run type-check           # TypeScript checking
npm run lint                 # ESLint checking
```

### **Code Quality**

- **Go**: `gofmt`, `golint`, `go vet`
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Backend
NEXT_PUBLIC_API_URL=http://localhost:8888/api

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8888/api
```

### **Backend Configuration**

- **Port**: 8888 (configurable)
- **CORS**: Enabled for development
- **Data File**: `data/dhaka_areas.json`
- **Cache Size**: All locations in memory

### **Frontend Configuration**

- **Port**: 3000 (Next.js default)
- **API Base**: Configurable via environment
- **Search Delay**: 300ms debounce
- **Result Limit**: 15 (configurable)

## 📊 **Data Sources**

### **Location Data**

- **Source**: Dhaka city areas and landmarks
- **Format**: JSON with coordinates
- **Count**: 2,877 locations
- **Languages**: English and Bengali
- **Coordinates**: WGS84 (lat/lon)

### **Fare Data**

- **Base Rates**: Current Dhaka bus rates
- **Distance Multipliers**: Per-kilometer pricing
- **Discount Rules**: Student and pass policies
- **Update Frequency**: Manual updates

## 🧪 **Testing**

### **Backend Testing**

```bash
cd bus-tk-backend
go test -v ./...             # Run all tests
go test -race ./...          # Race condition testing
go test -cover ./...         # Coverage report
```

### **Frontend Testing**

```bash
cd bus-tk-frontend
npm test                      # Run test suite
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage report
```

## 🚀 **Deployment**

### **Backend Deployment**

```bash
# Build binary
go build -o bus-tk-server ./cmd/server

# Run in production
./bus-tk-server
```

### **Frontend Deployment**

```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Docker Deployment**

```bash
# Build and run
docker build -t bus-tk-backend .
docker run -p 8888:8888 bus-tk-backend
```

## 🔒 **Security Features**

- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Server-side validation
- **Rate Limiting**: Built-in debouncing
- **Error Handling**: Graceful error responses
- **Data Sanitization**: Input sanitization

## 📈 **Monitoring & Logging**

### **Backend Logging**

- **Startup Logs**: Service initialization
- **Search Logs**: Query performance
- **Error Logs**: Detailed error information
- **Performance Logs**: Response times

### **Frontend Monitoring**

- **Console Logs**: Development debugging
- **Error Boundaries**: React error handling
- **Performance Metrics**: Lighthouse scores
- **User Analytics**: Search patterns

## 🤝 **Contributing**

### **Development Workflow**

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### **Code Standards**

- **Go**: Follow Go best practices
- **TypeScript**: Strict mode compliance
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes

## 📝 **Documentation**

- **API Documentation**: `bus-tk-backend/API_ENDPOINTS.md`
- **Frontend Guide**: `bus-tk-frontend/FRONTEND_SEARCH_GUIDE.md`
- **Focus Management**: `bus-tk-frontend/FOCUS_MANAGEMENT_GUIDE.md`
- **Code Comments**: Inline documentation

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Backend Won't Start**

```bash
# Check Go version
go version

# Verify dependencies
go mod tidy

# Check port availability
netstat -tulpn | grep 8888
```

#### **Frontend Search Not Working**

```bash
# Check backend is running
curl http://localhost:8888/health

# Verify API endpoint
curl "http://localhost:8888/api/locations/search?q=Dhaka"
```

#### **CORS Issues**

- Ensure backend CORS is configured
- Check frontend API URL configuration
- Verify browser console for errors

### **Debug Mode**

```typescript
// Add to frontend for debugging
console.log("Search query:", query);
console.log("API response:", response);
console.log("Focus state:", focusedInput);
```

## 🎯 **Roadmap**

### **Phase 1 (Current)**

- ✅ Location search and selection
- ✅ Fare calculation
- ✅ Focus management
- ✅ Performance optimization

### **Phase 2 (Next)**

- 🔄 Route visualization
- 🔄 Real-time bus tracking
- 🔄 User accounts
- 🔄 Favorite routes

### **Phase 3 (Future)**

- 📱 Mobile app
- 🔔 Push notifications
- 🗺️ Interactive maps
- 💳 Payment integration

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OSRM**: Open Source Routing Machine
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Go Community**: Go programming language
- **Dhaka Transport**: Local bus fare data

## 📞 **Support**

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [Your Email]
- **Documentation**: Project Wiki

---

**Built with ❤️ for Dhaka city commuters**

_Making bus travel planning simple, efficient, and user-friendly._ 🚌✨
