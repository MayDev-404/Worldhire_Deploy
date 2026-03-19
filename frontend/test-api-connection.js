/**
 * Test script to verify frontend-backend connection
 * Run with: node test-api-connection.js
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function testConnection() {
  console.log('🧪 Testing Backend Connection...\n');
  console.log(`Backend URL: ${API_BASE_URL}\n`);

  // Test 1: Health Check
  try {
    console.log('1. Testing Health Endpoint...');
    const healthRes = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('   ✓ Health check passed:', healthData);
  } catch (error) {
    console.log('   ✗ Health check failed:', error.message);
  }

  // Test 2: Root Endpoint
  try {
    console.log('\n2. Testing Root Endpoint...');
    const rootRes = await fetch(`${API_BASE_URL}/`);
    const rootData = await rootRes.json();
    console.log('   ✓ Root endpoint works:', rootData.message);
    console.log('   Available endpoints:', Object.keys(rootData.endpoints || {}).length);
  } catch (error) {
    console.log('   ✗ Root endpoint failed:', error.message);
  }

  // Test 3: CORS
  try {
    console.log('\n3. Testing CORS...');
    const corsRes = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    const corsHeader = corsRes.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log('   ✓ CORS configured:', corsHeader);
    } else {
      console.log('   ⚠ CORS header not found');
    }
  } catch (error) {
    console.log('   ✗ CORS test failed:', error.message);
  }

  // Test 4: API Endpoints
  try {
    console.log('\n4. Testing API Endpoints...');
    const rootRes = await fetch(`${API_BASE_URL}/`);
    const rootData = await rootRes.json();
    
    if (rootData.endpoints) {
      console.log('   Available API endpoints:');
      Object.entries(rootData.endpoints).forEach(([name, endpoint]) => {
        console.log(`     - ${name}: ${endpoint}`);
      });
    }
  } catch (error) {
    console.log('   ✗ Failed to get endpoint list:', error.message);
  }

  console.log('\n✅ Connection test complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure Next.js is running: npm run dev');
  console.log('   2. Open http://localhost:3000 in your browser');
  console.log('   3. Try uploading a CV to test the parse-cv endpoint');
  console.log('   4. Fill out and submit the form to test submit-application');
}

// Run the test
testConnection().catch(console.error);

