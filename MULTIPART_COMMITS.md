# Multipart Commits Guide

## What are Multipart Commits?

Multipart commits (also called atomic commits) are a Git best practice where you break down your work into small, logical, and independent commits instead of making one large commit with many unrelated changes.

## Why Use Multipart Commits?

### Benefits:
- **Better Code Review**: Easier for others to review and understand changes
- **Clearer History**: Git history tells a clear story of project evolution
- **Easier Debugging**: Can identify which specific change introduced a bug
- **Simple Reverts**: Can revert specific features without affecting other changes
- **Better Collaboration**: Team members can understand changes more easily

### Example: Bad vs Good

❌ **Bad (One Large Commit):**
```bash
git commit -m "Added users, tasks, categories, fixed bugs, updated readme"
```

✅ **Good (Multipart Commits):**
```bash
git commit -m "Add User model and database schema"
git commit -m "Add User controller with CRUD operations"
git commit -m "Add User routes and integrate with Express"
git commit -m "Add Task model with foreign key to Users"
git commit -m "Add Task controller with CRUD operations"
```

## Best Practices for Commit Messages

### The Seven Rules:
1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. how

### Commit Message Format:

```
<type>: <subject>

<body>

<footer>
```

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples:

```bash
# Simple commit
git commit -m "feat: Add user authentication endpoint"

# Commit with body
git commit -m "fix: Resolve database connection timeout

The connection pool was exhausted during high traffic.
Increased pool size from 10 to 20 connections.

Closes #123"
```

## Workflow for Multipart Commits

### Step 1: Make Small, Logical Changes

Work on one feature or fix at a time. Complete that work before moving to the next task.

```bash
# Edit files for User model only
# Test the changes
git add models/User.js
git commit -m "feat: Add User model with validation"
```

### Step 2: Stage Related Changes Together

Use `git add` to stage only related files:

```bash
# Stage specific files
git add models/Task.js controllers/taskController.js
git commit -m "feat: Add Task model and controller"

# Stage files by pattern
git add routes/*.js
git commit -m "feat: Add all route files"

# Stage parts of a file (interactive)
git add -p server.js
```

### Step 3: Review Before Committing

Always review what you're about to commit:

```bash
# See what files are staged
git status

# See the actual changes staged
git diff --staged

# Review and edit your staged changes
git add -i
```

### Step 4: Write Descriptive Commit Messages

```bash
# Good commit messages
git commit -m "feat: Add password hashing to User model"
git commit -m "fix: Correct task status validation logic"
git commit -m "docs: Update API documentation for task endpoints"
git commit -m "refactor: Extract database config into separate file"
```

## Common Scenarios

### Scenario 1: You Made Multiple Changes

If you've made several changes across different files:

```bash
# Check what changed
git status

# Stage and commit one logical change at a time
git add models/User.js
git commit -m "feat: Add User model"

git add controllers/userController.js
git commit -m "feat: Add User controller"

git add routes/userRoutes.js
git commit -m "feat: Add User routes"
```

### Scenario 2: Splitting Changes in One File

Use interactive staging to commit parts of a file separately:

```bash
# Start interactive staging
git add -p filename.js

# For each change, choose:
# y - stage this hunk
# n - don't stage this hunk
# s - split this hunk into smaller hunks
# e - manually edit the hunk

# After staging what you want
git commit -m "feat: Add specific functionality"

# Stage and commit remaining changes
git add filename.js
git commit -m "fix: Fix related bug"
```

### Scenario 3: You Committed Too Early

Use `git reset` to uncommit and split properly:

```bash
# Undo last commit but keep changes
git reset HEAD~1

# Now stage and commit properly
git add file1.js
git commit -m "feat: Add feature A"

git add file2.js
git commit -m "feat: Add feature B"
```

### Scenario 4: Amending the Last Commit

If you forgot to include something in your last commit:

```bash
# Make your changes
git add forgotten-file.js

# Amend the previous commit
git commit --amend --no-edit

# Or amend with new message
git commit --amend -m "Updated commit message"
```

## Sprint 1 Backend - Recommended Commit Structure

Here's how you could structure commits for this project:

### Phase 1: Project Setup
```bash
git commit -m "chore: Initialize Node.js project with dependencies"
git commit -m "chore: Add .gitignore and environment configuration"
git commit -m "docs: Add README with project overview"
```

### Phase 2: Database Setup
```bash
git commit -m "feat: Add database configuration and connection pool"
git commit -m "feat: Add database initialization script"
git commit -m "feat: Create Users table schema"
git commit -m "feat: Create Categories table schema"
git commit -m "feat: Create Tasks table schema with foreign keys"
```

### Phase 3: Models
```bash
git commit -m "feat: Add User model with CRUD methods"
git commit -m "feat: Add Category model with CRUD methods"
git commit -m "feat: Add Task model with CRUD methods"
```

### Phase 4: Controllers
```bash
git commit -m "feat: Add User controller with all endpoints"
git commit -m "feat: Add Category controller with all endpoints"
git commit -m "feat: Add Task controller with all endpoints"
```

### Phase 5: Routes
```bash
git commit -m "feat: Add User routes"
git commit -m "feat: Add Category routes"
git commit -m "feat: Add Task routes"
```

### Phase 6: Middleware & Server
```bash
git commit -m "feat: Add error handling middleware"
git commit -m "feat: Configure Express server with middleware"
git commit -m "feat: Integrate all routes in server.js"
```

### Phase 7: Testing & Documentation
```bash
git commit -m "test: Add sample data for testing"
git commit -m "docs: Add API documentation"
git commit -m "docs: Add deployment guide"
```

### Phase 8: Bug Fixes & Improvements
```bash
git commit -m "fix: Correct task validation in controller"
git commit -m "fix: Handle database connection errors properly"
git commit -m "refactor: Improve error messages"
```

## Checking Your Commit History

View your commit history to ensure good practices:

```bash
# View commit history
git log

# View compact history
git log --oneline

# View history with graph
git log --oneline --graph --all

# View last 5 commits
git log -5

# View commits by author
git log --author="Your Name"

# View commits with file changes
git log --stat
```

## Tools to Help

### Git Aliases

Add these to your `~/.gitconfig`:

```ini
[alias]
    st = status
    co = commit
    br = branch
    lg = log --oneline --graph --all
    last = log -1 HEAD
    unstage = reset HEAD --
```

### Visual Tools

- **GitKraken**: Visual Git client
- **GitHub Desktop**: Simple Git GUI
- **VS Code Git**: Built-in Git integration
- **SourceTree**: Free Git GUI

## Common Mistakes to Avoid

❌ **Don't**:
- Commit unrelated changes together
- Use vague commit messages like "fix stuff" or "update"
- Commit commented-out code
- Commit sensitive data (passwords, API keys)
- Make commits too large
- Forget to test before committing

✅ **Do**:
- Make commits small and focused
- Write clear, descriptive commit messages
- Test your changes before committing
- Review staged changes before committing
- Commit related changes together
- Use meaningful commit types

## Pre-Commit Checklist

Before every commit, ask yourself:

- [ ] Does this commit do one thing?
- [ ] Have I tested these changes?
- [ ] Is my commit message clear?
- [ ] Did I stage only related files?
- [ ] Are there any console.logs or debug code?
- [ ] Did I check for sensitive data?
- [ ] Would someone understand this in 6 months?

## Summary

**Key Takeaways**:
1. Make small, logical commits
2. Write clear commit messages
3. Use git add selectively
4. Review before committing
5. Keep commits focused on one thing
6. Tell a story with your commit history

**Remember**: Good commit practices make you a better developer and a better team member!

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Git Best Practices](https://sethrobertson.github.io/GitBestPractices/)
