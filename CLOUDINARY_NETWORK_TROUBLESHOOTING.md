# Cloudinary Network Connectivity Troubleshooting

If you're experiencing network issues when trying to connect to Cloudinary, here are some steps to troubleshoot and resolve the problem.

## Common Error: `getaddrinfo EAI_AGAIN api.cloudinary.com`

This error indicates a DNS resolution issue where your system can't resolve the Cloudinary API domain name.

## Troubleshooting Steps

### 1. Check Your Internet Connection

Ensure your computer has a working internet connection:
- Try opening websites in your browser
- Check if other applications can access the internet

### 2. Test DNS Resolution

Open a command prompt/terminal and try these commands:

**Windows:**
```
ping api.cloudinary.com
nslookup api.cloudinary.com
```

**Mac/Linux:**
```
ping api.cloudinary.com
dig api.cloudinary.com
```

If these commands fail, you have DNS resolution issues.

### 3. Check DNS Settings

- Try using a different DNS server like Google DNS (8.8.8.8, 8.8.4.4) or Cloudflare DNS (1.1.1.1)
- On Windows, you can flush your DNS cache with: `ipconfig /flushdns`
- On Mac: `sudo killall -HUP mDNSResponder`

### 4. Check Firewall/Proxy Settings

- Ensure your firewall isn't blocking outbound HTTPS connections
- If you're using a proxy, make sure it's configured correctly
- Try temporarily disabling your firewall or antivirus to test

### 5. Use a VPN

If you're on a restricted network:
- Try connecting through a VPN to bypass potential network restrictions
- Disconnect from the VPN if you're already using one (it could be causing the issue)

### 6. Check Cloudinary Status

Check if Cloudinary is experiencing service issues:
- Visit [Cloudinary Status](https://status.cloudinary.com/)

### 7. Advanced: Configure with Proxy

If you need to use a proxy:

```javascript
// Add this before cloudinary.config
const http = require('http');
const https = require('https');

// Configure global proxy
const globalAgent = new https.Agent({
  proxy: 'http://your-proxy-address:port',
  rejectUnauthorized: false // Only use if needed for self-signed certificates
});

// Configure Cloudinary to use the proxy
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  proxy: 'http://your-proxy-address:port'
});
```

## Retry Logic

The updated script includes retry logic that will:
- Attempt each upload up to 3 times
- Wait 3 seconds between retries
- Handle network-specific errors with appropriate retries

## Using Mobile Hotspot

If nothing else works:
- Try connecting your computer to a mobile hotspot
- This uses a different network path and may bypass corporate/ISP restrictions

## Running the Script Offline

If you can't resolve the connectivity issues:
1. Upload your images manually through the Cloudinary dashboard
2. Then run the script with the "update-db-only" option to just update your database
