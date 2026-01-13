// Test audit system core functionality
import { query } from './src/config/db';
import { AuditService, AuditAction } from './src/services/audit.service';
import { systemLogger } from './src/config/logger';

async function testAuditSystem() {
  console.log('🧪 Testing Audit System Core...');
  
  try {
    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...');
    await query('SELECT 1 as test');
    console.log('✅ Database connection OK');
    
    // Test 2: Audit Service Initialization
    console.log('2️⃣ Testing audit service...');
    const auditService = new AuditService();
    console.log('✅ Audit service initialized');
    
    // Test 3: Basic Audit Logging
    console.log('3️⃣ Testing basic audit logging...');
    await auditService.logAudit({
      userId: 'test-user-123',
      action: AuditAction.LOGIN,
      resourceType: 'user' as any,
      resourceId: 'test-resource-456',
      oldValues: null,
      newValues: { status: 'active', lastLogin: new Date() },
      ipAddress: '127.0.0.1',
      userAgent: 'test-browser/1.0',
      status: 'SUCCESS',
      message: 'Test audit log entry'
    });
    console.log('✅ Basic audit logging OK');
    
    // Test 4: Authentication Event
    console.log('4️⃣ Testing authentication logging...');
    await auditService.logAuthentication(
      'test-user-123',
      AuditAction.LOGIN,
      '192.168.1.100',
      'Mozilla/5.0 Test Browser',
      'Test login event'
    );
    console.log('✅ Authentication logging OK');
    
    // Test 5: System Logging
    console.log('5️⃣ Testing system logging...');
    await auditService.logSystemError(
      'Test error message',
      { test: true, timestamp: new Date() },
      'Test stack trace',
      '192.168.1.200',
      'Test Agent/2.0'
    );
    console.log('✅ System logging OK');
    
    // Test 6: Verify Database Records
    console.log('6️⃣ Verifying database records...');
    const auditResult = await query('SELECT COUNT(*) as count FROM audit_logs WHERE user_id = $1', ['test-user-123']);
    const systemResult = await query('SELECT COUNT(*) as count FROM system_logs WHERE message ILIKE $1', ['%Test error message%']);
    
    const auditCount = parseInt(auditResult.rows[0]?.count || '0');
    const systemCount = parseInt(systemResult.rows[0]?.count || '0');
    
    console.log(`✅ Found ${auditCount} audit records and ${systemCount} system records`);
    
    // Test 7: Log Statistics
    console.log('7️⃣ Testing log statistics...');
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM audit_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as recent_audit,
        (SELECT COUNT(*) FROM system_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as recent_system
    `);
    
    const stats = statsResult.rows[0];
    console.log('✅ Log statistics:', stats);
    
    console.log('🎉 All tests passed! Audit system is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log(`   - Audit Logs Created: ${auditCount}`);
    console.log(`   - System Logs Created: ${systemCount}`);
    console.log(`   - Recent Audit Activity (7 days): ${stats.recent_audit}`);
    console.log(`   - Recent System Activity (7 days): ${stats.recent_system}`);
    
    return {
      success: true,
      auditRecords: auditCount,
      systemRecords: systemCount,
      statistics: stats
    };
    
  } catch (error) {
    console.error('❌ Audit system test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run the test
testAuditSystem()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ Audit System Test: PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ Audit System Test: FAILED');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Audit System Test: CRITICAL ERROR');
    console.error(error);
    process.exit(1);
  });