# Coupon System

## Setup Instructions

**Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/coupon.git
   cd coupon
   ```
**Install dependencies**

    ```bash
    npm install
    # or
    yarn instal
    # or
    pnpm install
    # or
    bun intstall
```
**Update the Mondodb URI**

    change the MONGODB_URI in seed.js and db.js.

**Run database seed script**

    ```bash
    node seed.js
    ```

**Then, run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Abuse Prevention Strategies

1. **Rate Limiting:**
   The project implements a cooldown period to prevent users from claiming coupons too frequently. This is done by checking if the user has claimed a coupon recently based on their IP address or cookie ID. If a recent claim is found, the user is informed of the remaining cooldown time before they can claim another coupon. This is implemented in the [`GET`](src/app/api/coupons/route.ts ) function.

2. **Cookie-Based User Identification:**
   Users are assigned a unique cookie ID which is used to track their coupon claims. This helps in identifying users even if their IP address changes. The cookie is set or refreshed each time a user interacts with the coupon system.

3. **IP Address Tracking:**
   The user's IP address is recorded along with their coupon claims. This helps in identifying and preventing abuse from users who might try to bypass the cooldown period by using different devices or clearing cookies.

4. **Database Logging:**
   All coupon claims are logged in the database with details such as the coupon ID, IP address, user agent, cookie ID, and the timestamp of the claim. This provides a comprehensive record of user activity and helps in monitoring and preventing abuse.

These strategies work together to ensure that the coupon system is not abused and that users can only claim coupons within the allowed limits.
```
