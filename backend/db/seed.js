const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
const bcrypt = require('bcrypt');
const { pool, initDb } = require('./index');

const sampleExpenses = [
  { title: 'Swiggy Dinner', amount: 450, category: 'Food', description: 'Gourmet bowl dinner with friends', payment_method: 'UPI', date: '2026-08-21' },
  { title: 'Uber Ride to Office', amount: 320, category: 'Transport', description: 'Morning office cab ride', payment_method: 'UPI', date: '2026-08-20' },
  { title: 'Amazon Electronics', amount: 2400, category: 'Shopping', description: 'Wireless mechanical keyboard', payment_method: 'Credit Card', date: '2026-08-18' },
  { title: 'Electricity Bill', amount: 3100, category: 'Bills', description: 'Monthly electricity bill payment', payment_method: 'Bank Transfer', date: '2026-08-15' },
  { title: 'Netflix Subscription', amount: 649, category: 'Entertainment', description: 'Premium 4K monthly plan', payment_method: 'Credit Card', date: '2026-08-14' },
  { title: 'College Supplies & Textbooks', amount: 1500, category: 'Education', description: 'Advanced Algorithms handbook', payment_method: 'Debit Card', date: '2026-08-12' },
  { title: 'Blue Tokai Cafe Coffee', amount: 280, category: 'Food', description: 'Cold brew and croissant', payment_method: 'UPI', date: '2026-08-10' },
  { title: 'Weekly Grocery Shopping', amount: 3250, category: 'Food', description: 'Fresh veggies, fruits, and essentials at Nature Basket', payment_method: 'UPI', date: '2026-08-08' },
  { title: 'Cult.fit Gym Membership', amount: 2200, category: 'Health', description: 'Monthly fitness pass', payment_method: 'Credit Card', date: '2026-08-05' },
  { title: 'PVR Movie Tickets', amount: 950, category: 'Entertainment', description: 'IMAX movie night with popcorn', payment_method: 'UPI', date: '2026-08-03' },
  { title: 'Pharmacy & Doctor Checkup', amount: 1200, category: 'Health', description: 'Routine health check and vitamins', payment_method: 'UPI', date: '2026-08-02' },
  { title: 'Fuel for Car', amount: 2500, category: 'Transport', description: 'Petrol tank refill', payment_method: 'Debit Card', date: '2026-08-01' },
  { title: 'Zomato Pizza Feast', amount: 890, category: 'Food', description: 'Weekend pizza party', payment_method: 'UPI', date: '2026-07-28' },
  { title: 'Laptop Purchase', amount: 68000, category: 'Shopping', description: 'MacBook Air M2 upgrade', payment_method: 'Credit Card', date: '2026-07-20' },
  { title: 'Wifi Broadband Bill', amount: 1199, category: 'Bills', description: 'Airtel Xstream Fiber 300Mbps', payment_method: 'UPI', date: '2026-07-15' },
  { title: 'Uber Intercity Cab', amount: 1850, category: 'Transport', description: 'Weekend getaway trip transport', payment_method: 'UPI', date: '2026-07-10' },
  { title: 'Udemy React Masterclass', amount: 499, category: 'Education', description: 'Full-stack development course', payment_method: 'UPI', date: '2026-07-05' },
  { title: 'Mobile Postpaid Bill', amount: 799, category: 'Bills', description: 'Jio Postpaid Plus plan', payment_method: 'UPI', date: '2026-06-18' },
  { title: 'New Running Shoes', amount: 4500, category: 'Shopping', description: 'Nike Pegasus 40', payment_method: 'Credit Card', date: '2026-06-12' },
  { title: 'Dinner at Fine Dining', amount: 3400, category: 'Food', description: 'Family anniversary dinner', payment_method: 'Credit Card', date: '2026-06-05' }
];

async function seed() {
  try {
    await initDb();

    // Create or find demo user
    const demoEmail = 'demo@expensevault.io';
    const demoPassword = await bcrypt.hash('Demo@1234', 10);

    let userResult = await pool.query('SELECT id FROM users WHERE email = $1', [demoEmail]);
    let userId;

    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
      console.log(`Demo user already exists (id: ${userId}).`);
    } else {
      const insertResult = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        ['Demo User', demoEmail, demoPassword]
      );
      userId = insertResult.rows[0].id;
      console.log(`Created demo user (id: ${userId}).`);
    }

    // Clear existing expenses for demo user and re-seed
    await pool.query('DELETE FROM expenses WHERE user_id = $1', [userId]);

    console.log('Seeding sample expenses...');
    for (const exp of sampleExpenses) {
      await pool.query(
        `INSERT INTO expenses (user_id, title, amount, category, description, payment_method, expense_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [userId, exp.title, exp.amount, exp.category, exp.description, exp.payment_method, exp.date]
      );
    }

    console.log(`Successfully seeded ${sampleExpenses.length} expenses for demo user!`);
    console.log(`Login with: ${demoEmail}`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await pool.end();
  }
}

seed();
