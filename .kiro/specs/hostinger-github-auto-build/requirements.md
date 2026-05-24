# Requirements Document

## Introduction

This feature establishes an automated CI/CD pipeline that builds the Luxeholic React + Vite application on every push to the `main` branch and deploys the compiled output (`dist/`) to Hostinger shared hosting. The pipeline replaces the existing GitHub Pages workflow with a Hostinger-targeted deployment, handles all required environment variables securely via GitHub Secrets, and ensures the deployed site functions correctly as a single-page application (SPA) on Hostinger's Apache-based hosting environment.

## Glossary

- **CI/CD_Pipeline**: The GitHub Actions workflow responsible for building and deploying the application automatically.
- **Build_Step**: The execution of `vite build` that compiles TypeScript/React source into static assets in the `dist/` directory.
- **Dist_Artifact**: The compiled static files produced by the Build_Step, located in the `dist/` directory.
- **Hostinger_Server**: The Hostinger shared hosting environment where the application is deployed, accessible via FTP/SFTP.
- **GitHub_Secrets**: Encrypted repository-level secrets stored in GitHub used to inject sensitive values into the CI/CD_Pipeline at runtime.
- **Environment_Variable**: A `VITE_`-prefixed variable required at build time to configure Supabase, Firebase, and BrandsGateway integrations.
- **FTP_Deployer**: The GitHub Actions step that transfers the Dist_Artifact to the Hostinger_Server via FTP/SFTP.
- **SPA_Routing**: Client-side routing handled by TanStack Router, which requires all 404 responses to serve `index.html`.
- **htaccess_File**: An Apache configuration file placed in the `dist/` directory to enable SPA_Routing on the Hostinger_Server.
- **Deployment_Notification**: A status report emitted by the CI/CD_Pipeline indicating success or failure of a deployment run.

## Requirements

### Requirement 1: Automated Build Trigger

**User Story:** As a developer, I want the build and deployment process to start automatically when I push code to `main`, so that I never need to deploy manually.

#### Acceptance Criteria

1. WHEN a commit is pushed to the `main` branch, THE CI/CD_Pipeline SHALL start a new workflow run within 60 seconds of the push event.
2. WHEN a pull request targets the `main` branch, THE CI/CD_Pipeline SHALL execute the Build_Step without executing the FTP_Deployer, to validate the build succeeds.
3. WHEN a commit is pushed to any branch other than `main`, THE CI/CD_Pipeline SHALL not trigger a deployment run.

---

### Requirement 2: Dependency Installation and Build

**User Story:** As a developer, I want the CI/CD pipeline to install dependencies and build the Vite app correctly, so that the Dist_Artifact is always up to date with the latest source code.

#### Acceptance Criteria

1. WHEN the CI/CD_Pipeline starts, THE Build_Step SHALL install all dependencies using `npm ci` to ensure a clean, reproducible install.
2. WHEN dependencies are installed, THE Build_Step SHALL execute `vite build` and produce a `dist/` directory containing `index.html` and all compiled assets.
3. IF the `vite build` command exits with a non-zero code, THEN THE CI/CD_Pipeline SHALL mark the workflow run as failed and SHALL NOT proceed to the FTP_Deployer.
4. THE Build_Step SHALL use Node.js version 20 or later to ensure compatibility with the project's dependencies.

---

### Requirement 3: Secure Environment Variable Injection

**User Story:** As a developer, I want all sensitive API keys and configuration values to be injected securely at build time, so that secrets are never committed to the repository.

#### Acceptance Criteria

1. THE CI/CD_Pipeline SHALL read each required Environment_Variable exclusively from GitHub_Secrets during the Build_Step.
2. THE CI/CD_Pipeline SHALL inject the following Environment_Variables into the build environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`, `VITE_BRANDSGATEWAY_API_KEY`, and `VITE_BRANDSGATEWAY_API_SECRET`.
3. IF any required Environment_Variable is absent from GitHub_Secrets, THEN THE Build_Step SHALL fail with a descriptive error message identifying the missing variable name.
4. THE CI/CD_Pipeline SHALL never write Environment_Variable values to workflow logs or to any file committed to the repository.

---

### Requirement 4: SPA Routing Support on Hostinger

**User Story:** As a developer, I want the deployed site to handle client-side routes correctly on Hostinger, so that users who navigate directly to a deep URL or refresh the page do not receive a 404 error.

#### Acceptance Criteria

1. WHEN the Build_Step completes, THE CI/CD_Pipeline SHALL place an `htaccess_File` named `.htaccess` in the `dist/` directory before the FTP_Deployer runs.
2. THE htaccess_File SHALL contain Apache rewrite rules that redirect all requests for non-existent files and directories to `index.html`.
3. THE htaccess_File SHALL preserve direct access to existing static assets such as `.js`, `.css`, and image files without redirection.

---

### Requirement 5: Deployment to Hostinger via FTP

**User Story:** As a developer, I want the compiled Dist_Artifact to be uploaded to Hostinger automatically after a successful build, so that the live site reflects the latest code on every push to `main`.

#### Acceptance Criteria

1. WHEN the Build_Step succeeds, THE FTP_Deployer SHALL upload all files from the `dist/` directory to the configured remote directory on the Hostinger_Server.
2. THE FTP_Deployer SHALL authenticate using FTP credentials stored exclusively in GitHub_Secrets (`HOSTINGER_FTP_SERVER`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`).
3. THE FTP_Deployer SHALL delete files on the Hostinger_Server that are no longer present in the Dist_Artifact, so that stale files do not accumulate.
4. IF the FTP connection or file transfer fails, THEN THE CI/CD_Pipeline SHALL mark the workflow run as failed and SHALL emit a Deployment_Notification indicating failure.
5. THE FTP_Deployer SHALL transfer files over a secure connection (FTPS or SFTP) to protect credentials and file contents in transit.

---

### Requirement 6: Deployment Status Notification

**User Story:** As a developer, I want to know immediately whether a deployment succeeded or failed, so that I can act on failures before users are affected.

#### Acceptance Criteria

1. WHEN a workflow run completes successfully, THE CI/CD_Pipeline SHALL emit a Deployment_Notification with status `success` visible in the GitHub Actions run summary.
2. WHEN a workflow run fails at any step, THE CI/CD_Pipeline SHALL emit a Deployment_Notification with status `failure` and the name of the step that failed, visible in the GitHub Actions run summary.
3. THE CI/CD_Pipeline SHALL retain workflow run logs for a minimum of 30 days to support post-deployment debugging.

---

### Requirement 7: Coexistence with Existing GitHub Pages Workflow

**User Story:** As a developer, I want the new Hostinger deployment workflow to operate independently of the existing GitHub Pages workflow, so that I can disable or remove the GitHub Pages workflow without affecting Hostinger deployments.

#### Acceptance Criteria

1. THE CI/CD_Pipeline SHALL be defined in a separate workflow file named `deploy-hostinger.yml` and SHALL NOT modify the existing `deploy-gh-pages.yml` file.
2. WHEN both workflow files are present in the repository, THE CI/CD_Pipeline SHALL run independently without dependency on or interference with the GitHub Pages workflow.
3. WHERE the GitHub Pages deployment is no longer needed, THE CI/CD_Pipeline SHALL continue to function correctly after `deploy-gh-pages.yml` is deleted.
