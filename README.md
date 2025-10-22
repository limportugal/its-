# Internal Ticketing System (ITS) 🎫

[![Laravel](https://img.shields.io/badge/Laravel-12.15.0-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4.7-777BB4?style=flat-square&logo=php)](https://php.net)
[![Node.js](https://img.shields.io/badge/Node.js-22.15.1-339933?style=flat-square&logo=node.js)](https://nodejs.org)

A modern, efficient internal ticketing system built with React (TypeScript) and Laravel, designed for seamless ticket management and tracking within organizations.

## ✨ Key Features

- 🔐 Secure authentication and role-based access control
- 📊 Interactive dashboard with real-time analytics
- 🎯 Advanced ticket tracking and management
- 📱 Responsive design for all devices
- 🔔 Real-time notifications
- 📈 Comprehensive reporting system
- 🔄 Automated workflow management
- 🌐 RESTful API architecture

## 🛠️ Tech Stack

### Frontend Architecture
- **Core**: React 18.3.1 with TypeScript 5.8.3
  - Native TypeScript compiler support coming in 2025 (10x faster)
- **State Management**: 
  - Zustand for global state
  - TanStack Query for server state
  - React Hook Form for form handling
- **UI/UX**:
  - Material UI components
  - Tailwind CSS for styling
  - ApexCharts for data visualization
  - SweetAlert2 for notifications
- **Data Handling**:
  - Axios for API communication
  - Zod for schema validation
  - Day.js & Date-fns for date manipulation

### Backend Architecture
- **Framework**: Laravel v12.15.0 (PHP 8.4.7)
  - Zero-breaking changes upgrade
  - xxHash for faster caching and unique identifiers
  - Improved Query Builder with optimized execution
  - Native MariaDB CLI support
  - UUID v7 for models with better time-based ordering
  - Enhanced WebSocket integration with Reverb
  - AI-powered debugging assistant
  - Latest security patches and performance improvements
  - Enhanced route caching mechanism
  - Improved validation system
  - PHP 8.4.7 features support
    - Enhanced type system
    - Improved performance with JIT 2.0
    - Advanced memory management
    - Native fiber support
- **Database**: MySQL/MariaDB
- **Features**:
  - RESTful API endpoints
  - Queue system for background tasks
  - Web Authentication with WorkOS AuthKit support
  - Database migrations and seeders

### DevOps
- **Package Manager**: PNPM
- **Version Control**: Git

## 📂 Project Structure

```
.
├── app/  # Application Core
│   ├── Http/
│   ├── Models/
│   ├── Services/
│   └── ...
│
├── resources/  # Frontend Assets
│   ├── js/
│   ├── css/
│   └── views/
│
├── routes/  # API Routes
│
├── database/  # Migrations & Seeders
│
├── public/  # Public Assets
│
├── .env
├── composer.json
├── package.json
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.15.1
- PHP >= 8.4.7
- Composer 2.6+
- PNPM >= 8.0
- MySQL 8.0+

### Installation

1. **Clone the Repository**

```sh
git clone https://github.com/arnelnrose/its.git
cd its
```

2. **Setup Environment**

```sh
cp .env.example .env
```

3. **Install Dependencies**

```sh
# INSTALL PHP DEPENDENCIES
composer install

# INSTALL NODE DEPENDENCIES
pnpm install
```

4. **Database Setup**

```sh
php artisan key:generate
php artisan migrate --seed
```

5. **Run Development Server**

```sh
# START LARAVEL SERVER
php artisan serve

# IN ANOTHER TERMINAL, START VITE DEV SERVER
pnpm run dev
```

## 🔧 Development

### Running Queue Workers

```sh
php artisan queue:work
```

### Building for Production

```sh
pnpm run build
```

## 📚 Documentation

Detailed documentation is available in the [Wiki](https://github.com/arnelnrose/its/wiki).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📧 Support

For internal support and bug reports, please contact the development team through:
- Internal ticketing system
- Development team chat

## 📄 License

**🔒 Internal Use Only** | © 2025 Apsoft, Phillogix & Ideaserv

---

*Built with ❤️ by the Apsoft Team Team*

