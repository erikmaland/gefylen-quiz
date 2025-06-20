# GitHub Repository Setup

## Prerequisites
- Git installed on your machine
- GitHub account
- GitHub CLI (optional, but recommended)

## Method 1: Using GitHub CLI (Recommended)

### 1. Install GitHub CLI
```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
sudo apt install gh
```

### 2. Login to GitHub
```bash
gh auth login
```

### 3. Create Repository and Push Code
```bash
# Navigate to your project root
cd /path/to/your/gefylen-quiz

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Gefylen Quiz application"

# Create repository on GitHub and push
gh repo create gefylen-quiz --public --source=. --remote=origin --push
```

## Method 2: Manual GitHub Setup

### 1. Create Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Repository name: `gefylen-quiz`
4. Description: `A virtual café with recipes and quizzes`
5. Make it Public or Private
6. **Don't** initialize with README, .gitignore, or license
7. Click "Create repository"

### 2. Push Code to Repository
```bash
# Navigate to your project root
cd /path/to/your/gefylen-quiz

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Gefylen Quiz application"

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gefylen-quiz.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Method 3: Using GitHub Desktop

### 1. Install GitHub Desktop
Download from: https://desktop.github.com/

### 2. Create Repository
1. Open GitHub Desktop
2. File → New Repository
3. Fill in:
   - Name: `gefylen-quiz`
   - Description: `A virtual café with recipes and quizzes`
   - Local path: Choose your project folder
   - Check "Initialize with README"
4. Click "Create Repository"

### 3. Publish to GitHub
1. Click "Publish repository"
2. Choose visibility (Public/Private)
3. Click "Publish Repository"

## Verify Setup

After pushing, verify your repository:
1. Go to `https://github.com/YOUR_USERNAME/gefylen-quiz`
2. Check that all files are present
3. Verify the repository structure matches your local project

## Next Steps

After setting up the GitHub repository:
1. Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Connect your GitHub repository to Render
3. Deploy your application

## Troubleshooting

### Common Issues
- **Authentication**: Use GitHub CLI or set up SSH keys
- **Large Files**: Check `.gitignore` excludes `node_modules` and build files
- **Permission Denied**: Ensure you have write access to the repository

### Useful Commands
```bash
# Check git status
git status

# Check remote origin
git remote -v

# View commit history
git log --oneline

# Check branch
git branch
``` 