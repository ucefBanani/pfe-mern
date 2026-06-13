const RegisterUser = require('./src/application/use-cases/auth/RegisterUser');
const User = require('./src/domain/entities/User');

// Lightweight test suite runner for verification
const runTests = async () => {
  console.log('\n==================================================');
  console.log('RUNNING BACKEND DOMAIN & USE-CASE UNIT TESTS');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  // 1. Test Domain Entity user validation
  try {
    const invalidUser = new User({ name: '', email: 'invalid', password: '123' });
    try {
      invalidUser.validate();
      assert(false, 'Should throw error for invalid name and password length');
    } catch (err) {
      assert(err.message === 'User name is required.', 'Throws correct error on invalid name');
    }

    const validUser = new User({ name: 'Alex', email: 'alex@todoflow.com', password: 'password123' });
    validUser.validate();
    assert(true, 'Valid user schema passes validation');
  } catch (err) {
    assert(false, `Domain entity test failed: ${err.message}`);
  }

  // 2. Test RegisterUser use-case with mock Repository & services
  try {
    const mockDb = [];
    const mockUserRepository = {
      findByEmail: async (email) => mockDb.find(u => u.email === email),
      save: async (userEntity) => {
        const copy = { ...userEntity, id: 'mock-id-123' };
        mockDb.push(copy);
        return copy;
      }
    };

    const mockHashService = {
      hash: async (pass) => `hashed_${pass}`
    };

    const mockMailService = {
      sendVerificationEmail: async (email, token) => {
        // Mock send email
        return true;
      }
    };

    const registerUseCase = new RegisterUser({
      userRepository: mockUserRepository,
      hashService: mockHashService,
      mailService: mockMailService
    });

    const result = await registerUseCase.execute({
      name: 'Test Student',
      email: 'student@university.edu',
      password: 'mypassword123'
    });

    assert(result.id === 'mock-id-123', 'Use case returns the generated database ID');
    assert(result.email === 'student@university.edu', 'Use case stores correct user email');
    assert(mockDb[0].password === 'hashed_mypassword123', 'Password is hashed before database storage');
    assert(mockDb[0].isVerified === false, 'Account starts as unverified by default');
  } catch (err) {
    assert(false, `RegisterUser use-case test failed: ${err.message}`);
  }

  console.log('==================================================');
  console.log(`TEST SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
