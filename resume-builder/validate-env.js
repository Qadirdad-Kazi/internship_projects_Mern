#!/usr/bin/env node

/**
 * Environment Validation Script for Resume Builder
 * Validates all required environment variables for production deployment
 */

const fs = require('fs');
const path = require('path');

// Required environment variables for different environments
const REQUIRED_ENV = {
  backend: {
    production: [
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_EXPIRE',
      'CORS_ORIGIN',
      'NODE_ENV'
    ],
    development: [
      'MONGODB_URI',
      'JWT_SECRET',
      'PORT'
    ]
  },
  frontend: {
    production: [
      'VITE_API_URL',
      'VITE_APP_NAME',
      'VITE_APP_VERSION'
    ],
    development: [
      'VITE_API_URL'
    ]
  }
};

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnvironment(envPath, requiredVars, envName) {
  log(`\n🔍 Validating ${envName} environment...`, 'blue');
  
  if (!fs.existsSync(envPath)) {
    log(`❌ Environment file not found: ${envPath}`, 'red');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      envVars[key.trim()] = value.trim();
    }
  });

  let isValid = true;
  const missing = [];
  const empty = [];

  requiredVars.forEach(varName => {
    if (!(varName in envVars)) {
      missing.push(varName);
      isValid = false;
    } else if (!envVars[varName]) {
      empty.push(varName);
      isValid = false;
    }
  });

  if (missing.length > 0) {
    log(`❌ Missing variables: ${missing.join(', ')}`, 'red');
  }

  if (empty.length > 0) {
    log(`⚠️  Empty variables: ${empty.join(', ')}`, 'yellow');
  }

  if (isValid) {
    log(`✅ All required variables present and non-empty`, 'green');
  }

  return isValid;
}

function validatePackageJson(packagePath, type) {
  log(`\n📦 Validating ${type} package.json...`, 'blue');
  
  if (!fs.existsSync(packagePath)) {
    log(`❌ Package.json not found: ${packagePath}`, 'red');
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check for required fields
    const required = ['name', 'version', 'scripts'];
    const missing = required.filter(field => !packageJson[field]);
    
    if (missing.length > 0) {
      log(`❌ Missing package.json fields: ${missing.join(', ')}`, 'red');
      return false;
    }

    // Check for build script in frontend
    if (type === 'frontend' && !packageJson.scripts.build) {
      log(`❌ Missing build script in frontend package.json`, 'red');
      return false;
    }

    // Check for start script in backend
    if (type === 'backend' && !packageJson.scripts.start) {
      log(`❌ Missing start script in backend package.json`, 'red');
      return false;
    }

    // Check for engines specification
    if (!packageJson.engines) {
      log(`⚠️  No engines specification found`, 'yellow');
    } else if (!packageJson.engines.node) {
      log(`⚠️  No Node.js version specified in engines`, 'yellow');
    }

    log(`✅ Package.json validation passed`, 'green');
    return true;
  } catch (error) {
    log(`❌ Invalid package.json: ${error.message}`, 'red');
    return false;
  }
}

function validateDeploymentFiles() {
  log(`\n🚀 Validating deployment configuration...`, 'blue');
  
  const deploymentFiles = [
    { path: 'backend/vercel.json', name: 'Vercel config' },
    { path: 'frontend/netlify.toml', name: 'Netlify config' },
    { path: 'frontend/public/_redirects', name: 'Netlify redirects' },
    { path: 'DEPLOYMENT.md', name: 'Deployment documentation' }
  ];

  let allValid = true;

  deploymentFiles.forEach(({ path: filePath, name }) => {
    if (fs.existsSync(filePath)) {
      log(`✅ ${name} found`, 'green');
    } else {
      log(`❌ ${name} missing: ${filePath}`, 'red');
      allValid = false;
    }
  });

  return allValid;
}

function main() {
  log(`${colors.bold}🔧 Resume Builder Environment Validation${colors.reset}`, 'blue');
  log('=' .repeat(50), 'blue');

  const projectRoot = process.cwd();
  let overallValid = true;

  // Validate backend environments
  const backendProd = path.join(projectRoot, 'backend/.env.production');
  const backendDev = path.join(projectRoot, 'backend/.env');
  
  if (!validateEnvironment(backendProd, REQUIRED_ENV.backend.production, 'Backend Production')) {
    overallValid = false;
  }
  
  if (fs.existsSync(backendDev)) {
    validateEnvironment(backendDev, REQUIRED_ENV.backend.development, 'Backend Development');
  }

  // Validate frontend environments
  const frontendProd = path.join(projectRoot, 'frontend/.env.production');
  const frontendDev = path.join(projectRoot, 'frontend/.env');
  
  if (!validateEnvironment(frontendProd, REQUIRED_ENV.frontend.production, 'Frontend Production')) {
    overallValid = false;
  }
  
  if (fs.existsSync(frontendDev)) {
    validateEnvironment(frontendDev, REQUIRED_ENV.frontend.development, 'Frontend Development');
  }

  // Validate package.json files
  if (!validatePackageJson('backend/package.json', 'backend')) {
    overallValid = false;
  }
  
  if (!validatePackageJson('frontend/package.json', 'frontend')) {
    overallValid = false;
  }

  // Validate deployment files
  if (!validateDeploymentFiles()) {
    overallValid = false;
  }

  // Final result
  log('\n' + '='.repeat(50), 'blue');
  if (overallValid) {
    log(`${colors.bold}🎉 All validations passed! Ready for deployment.${colors.reset}`, 'green');
    log(`\nNext steps:`, 'blue');
    log(`1. Run: ./deploy.sh`, 'green');
    log(`2. Push to GitHub`, 'green');
    log(`3. Deploy to Vercel and Netlify`, 'green');
    process.exit(0);
  } else {
    log(`${colors.bold}❌ Validation failed. Please fix the issues above before deployment.${colors.reset}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateEnvironment, validatePackageJson, validateDeploymentFiles };