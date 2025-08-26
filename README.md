# Movie Reservation System

A backend movie ticket booking application built with **Node.js**, **Express**, **Sequelize ORM**, and **MySQL**.  
It includes **Stripe payment integration**, **Redis caching**, and **parallel booking prevention** to ensure that no two users can book the same seats at the same time.

---

## Features

### Movie Management
- Create, update, delete, and fetch movies.
- Poster image URL support.
- Caching with Redis for faster read performance.
- Admin-only access for create, update, and delete.

### Showtime Management
- Create showtimes for specific movies.
- Fetch showtimes by movie.
- Cached results for improved performance.

### Reservation System
- Reserve seats for a given showtime.
- Parallel booking prevention using database transactions and row-level locking.
- Cancel reservations before the showtime starts.
- View personal reservations.

### Payment Integration
- Integrated with Stripe Payment Intents API.
- Users must pay before confirming a reservation.
- Can be tested using Postman or integrated with a frontend.

### Authentication and Authorization
- JWT-based authentication.
- Role-based access control for admin and regular users.

---

## Technology Stack

- **Backend:** Node.js, Express  
- **Database:** MySQL with Sequelize ORM  
- **Cache:** Redis  
- **Payments:** Stripe  
- **Authentication:** JWT  

---

## Project Structure

```
MovieReservationSystem/
│
├── controllers/       # Business logic for movies, showtimes, reservations, payments
├── models/            # Sequelize models for Movie, Showtime, Reservation, User
├── routes/            # API endpoints
├── middleware/        # Authentication and authorization logic
├── utils/             # Redis and Stripe helper modules
├── .env               # Environment variables
└── server.js          # Entry point
```

---

## Installation

1. **Clone the repository**
```bash
https://github.com/Deepak-SBaghel/MovieReservationSystem.git
cd MovieReservationSystem
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up `.env`**
```
PORT=5000
DB_NAME=moviedb
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_yourkey
```

4. **Run Redis** (locally or via Docker)
```bash
redis-server
# or
docker run --name redis -p 6379:6379 redis
```

5. **Start the server**
```bash
npm run start
```

---

## API Endpoints

### Auth
- `POST /auth/signup` – Register a new user.
- `POST /auth/login` – Login.

### Movies
- `GET /movies` – Get all movies.
- `POST /movies` – Create a movie (Admin only).
- `PUT /movies/:movieId` – Update a movie (Admin only).
- `DELETE /movies/:movieId` – Delete a movie (Admin only).

### Showtimes
- `GET /movies/:movieId/showtimes` – Get showtimes for a movie.
- `POST /movies/:movieId/showtimes` – Create showtime (Admin only).

### Payments
- `POST /payment/create-payment-intent` – Create a Stripe payment intent.

### Reservations
- `POST /reservations` – Create a reservation after payment.
- `GET /reservations/my-reservations` – Get current user’s reservations.
- `DELETE /reservations/:reservationId` – Cancel a reservation.
- `GET /reservations/showtime/:showtimeId` – Admin view of reservations for a showtime.

---

## Parallel Booking Prevention

This project uses **MySQL transactions** with **row-level locking** to ensure that seat availability checks and reservation creation are performed atomically.  
By using Sequelize’s `lock: transaction.LOCK.UPDATE`, the system prevents race conditions where multiple users attempt to reserve the same seats at the same time.

---

## Payment Flow

1. The client requests a payment intent via `/payment/create-payment-intent`.
2. Stripe processes the payment.
3. Upon success, the client calls `/reservations` with the `paymentIntentId`.
4. The server verifies the payment, checks seat availability, and creates the reservation.
