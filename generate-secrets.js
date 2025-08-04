#!/usr/bin/env node

const crypto = require('crypto');

console.log('=== Production Security Keys ===');
console.log('');
console.log('Copy these into your .env file:');
console.log('');
console.log(`JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`);
console.log(`NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}`);
console.log('');
console.log('⚠️  IMPORTANT: These are new secrets for production.');
console.log('   - Save them securely');
console.log('   - Do not commit them to version control');
console.log('   - Replace the old secrets in your .env file');
console.log('');
