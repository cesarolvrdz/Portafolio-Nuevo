console.log('🔍 Probando conexión a Supabase...');

const supabaseUrl = 'https://wlkjxdhjcbyimozkvuxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsa2p4ZGhqY2J5aW1vemt2dXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyOTA1NDEsImV4cCI6MjA3Mjg2NjU0MX0.VMofJMFZzuzXHGM6OEGChdSTlwuZdZGD6rRGPMqlbuw';

async function testSupabaseConnection() {
  console.log('📊 Testing all tables...');
  
  const tables = ['profile', 'projects', 'social_links', 'site_settings'];
  
  for (const table of tables) {
    console.log(`\n🔍 Testing table: ${table}`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=3`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ ${table}: ${data.length} records found`);
      
      if (data.length > 0) {
        console.log('📋 Sample record structure:');
        console.log('Columns:', Object.keys(data[0]));
        
        // Show sample data
        const sample = data[0];
        console.log('Sample data:');
        for (const [key, value] of Object.entries(sample)) {
          if (typeof value === 'string' && value.length > 100) {
            console.log(`  ${key}: "${value.substring(0, 100)}..."`);
          } else {
            console.log(`  ${key}:`, value);
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${table}:`, error.message);
    }
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log('\n✅ Test completed!');
}).catch(console.error);
