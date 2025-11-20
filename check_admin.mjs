import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { users } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

const adminEmail = 'paco.miguel.hartmann@gmx.at';
const adminOpenId = process.env.OWNER_OPEN_ID;

console.log('Checking for admin user...');
console.log('Email:', adminEmail);
console.log('OpenID:', adminOpenId);

const userByEmail = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
const userByOpenId = await db.select().from(users).where(eq(users.openId, adminOpenId)).limit(1);

console.log('\nUser by email:', userByEmail.length > 0 ? userByEmail[0] : 'Not found');
console.log('\nUser by openId:', userByOpenId.length > 0 ? userByOpenId[0] : 'Not found');

process.exit(0);
