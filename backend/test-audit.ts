// Simple test file to verify audit system works
import { auditService, AuditAction } from '../src/services/audit.service';

async function testAuditSystem() {
  console.log('Testing audit system...');
  
  try {
    // Test basic audit logging
    await auditService.logAudit({
      userId: 'test-user',
      action: AuditAction.LOGIN,
      resourceType: 'user',
      resourceId: 'test-id',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      status: 'SUCCESS',
      message: 'Test audit log'
    });
    
    console.log('✅ Audit system test passed');
  } catch (error) {
    console.error('❌ Audit system test failed:', error);
  }
}

testAuditSystem();