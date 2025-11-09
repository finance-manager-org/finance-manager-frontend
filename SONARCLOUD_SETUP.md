# SonarCloud Setup Guide

## Prerequisites

- GitHub repository: `IvanAusechaS/finance-manager-frontend`
- SonarCloud account linked to GitHub organization
- SonarCloud token already generated

## GitHub Secrets Configuration

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: https://github.com/IvanAusechaS/finance-manager-frontend
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**

### Step 2: Add SONAR_TOKEN Secret

1. Click the **New repository secret** button
2. Fill in the following:
   - **Name**: `SONAR_TOKEN`
   - **Secret**: `4bf0682db4ad376dae879031e96fc4eb1321a8e7`
3. Click **Add secret**

### Verification

After adding the secret, your GitHub Actions workflows will have access to `${{ secrets.SONAR_TOKEN }}`.

The `GITHUB_TOKEN` is automatically provided by GitHub Actions and doesn't need manual configuration.

## SonarCloud Project Configuration

The project is already configured with these details:

- **Project Key**: `IvanAusechaS_finance-manager-frontend`
- **Organization**: `ivanausechas`
- **Coverage Report Path**: `coverage/lcov.info`
- **Source Directory**: `src/`
- **Coverage Exclusions**: `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `**/*.spec.tsx`

## CI/CD Integration

The CI pipeline (`.github/workflows/ci.yml`) includes:

1. **Lint & Type Check** - Validates code quality
2. **Unit Tests & Coverage** - Runs tests and generates coverage report (96.15%)
3. **SonarCloud Scan** - Analyzes code quality metrics:
   - Code coverage (target: >60%)
   - Cyclomatic complexity
   - Code duplication
   - Technical debt
   - Code smells
   - Security vulnerabilities
4. **Build Validation** - Ensures production build succeeds
5. **Security Audit** - Checks for vulnerable dependencies

## Required Node.js Version

The CI pipeline uses **Node.js 18.x** to ensure compatibility with:
- Vitest 4.0.8
- V8 coverage provider
- Modern JavaScript features (node:inspector/promises)

## Next Steps

1. ✅ Add `SONAR_TOKEN` secret to GitHub repository
2. ✅ Push changes to `feature/authentication` branch
3. ✅ Create Pull Request to `develop` branch
4. ✅ Wait for CI pipeline to pass (all 5 jobs must succeed)
5. ✅ Review SonarCloud dashboard for quality metrics
6. ✅ Merge PR after approval

## SonarCloud Dashboard

Once configured, view metrics at:
https://sonarcloud.io/dashboard?id=IvanAusechaS_finance-manager-frontend

## Troubleshooting

### CI Fails with "No such built-in module: node:inspector/promises"

**Solution**: Updated all CI jobs to explicitly use Node.js 18.x instead of using environment variable interpolation. This ensures the GitHub Actions runner uses the correct version.

### Coverage Report Not Found

**Solution**: Ensure tests are run with coverage before SonarCloud scan:
```bash
npm run test:coverage
```

### SonarCloud Scan Fails with 401 Unauthorized

**Solution**: Verify `SONAR_TOKEN` secret is correctly added to GitHub repository settings.

## Quality Gates

The project must pass these quality gates:

- ✅ Code Coverage: >60% (current: 96.15%)
- ✅ No Critical/Blocker vulnerabilities
- ✅ Maintainability rating: A or B
- ✅ Reliability rating: A or B
- ✅ Security rating: A or B

---

## SonarCloud Project Configuration

Your SonarCloud project is configured with:
- **Project Key:** `IvanAusechaS_finance-manager-frontend`
- **Organization:** `ivanausechas`

### Metrics Being Tracked:

✅ **Code Coverage** - Currently at 96.15% (Required: >60%)
✅ **Cyclomatic Complexity** - Measure of code complexity
✅ **Code Duplication** - Identifies duplicate code blocks
✅ **Technical Debt** - Estimated time to fix code issues
✅ **Code Smells** - Maintainability issues
✅ **Security Vulnerabilities** - Security hotspots and vulnerabilities

---

## Creating a Pull Request

After adding the secrets, create a Pull Request from `feature/authentication` to `develop`:

1. Go to: https://github.com/IvanAusechaS/finance-manager-frontend/compare
2. Set base: `develop`
3. Set compare: `feature/authentication`
4. Click **Create pull request**
5. Add title: `feat: Add SonarCloud integration for code quality metrics`
6. Add description with the checklist below

### PR Description Template:

```markdown
## 🎯 Overview
This PR integrates SonarCloud for automated code quality analysis and metrics tracking.

## ✅ Changes
- ✅ Configure SonarCloud GitHub Action in CI pipeline
- ✅ Add sonar-project.properties configuration
- ✅ Update CI to use Node.js 18
- ✅ Integrate test coverage upload
- ✅ Set 60% minimum coverage threshold

## 📊 Metrics
- **Test Coverage:** 96.15% (>60% required)
- **Tests:** 26/26 passing
- **Build:** ✅ Successful
- **TypeScript:** ✅ No errors

## 🔍 Quality Gates
SonarCloud will automatically check:
- Code coverage >60%
- Cyclomatic complexity
- Code duplication
- Technical debt
- Code smells
- Security vulnerabilities

## 📝 Acceptance Criteria
- [x] Unit tests with >60% coverage
- [x] SonarCloud integration configured
- [x] CI pipeline runs on Node.js 18
- [x] All tests passing locally
- [x] Build successful
```

---

## Testing the CI Pipeline

Once the secrets are added and the PR is created, the CI pipeline will:

1. **Lint & Format Check** - Verify code quality
2. **Unit Tests & Coverage** - Run all tests with coverage report
3. **SonarCloud Scan** - Upload metrics to SonarCloud
4. **Build Verification** - Ensure production build works
5. **Security Audit** - Check for vulnerabilities
6. **Acceptance Criteria Validation** - Verify all requirements

---

## Expected Results

After the pipeline runs successfully, you should see:

✅ All CI checks passing
✅ SonarCloud quality gate: PASSED
✅ Coverage report available in SonarCloud dashboard
✅ Detailed metrics visible at: https://sonarcloud.io/project/overview?id=IvanAusechaS_finance-manager-frontend

---

## Next Steps

1. Add `SONAR_TOKEN` secret to GitHub repository
2. Create Pull Request from `feature/authentication` to `develop`
3. Wait for CI pipeline to complete
4. Review SonarCloud metrics
5. Merge PR if all checks pass

---

## SonarCloud Dashboard

Access your project metrics at:
https://sonarcloud.io/project/overview?id=IvanAusechaS_finance-manager-frontend

Login with your GitHub account to view detailed analysis.
