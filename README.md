### GITHUB CODE COLLABORATIVE PLATFORM
       
## Features:
 - User authentication & profiles
 - Create and manage repositories
 - Upload / edit project files
 - Commit history tracking
 - Pull requests for proposing code changes
 - Issue tracking system for bugs or feature requests
 - Code review comments on specific lines
 - Team collaboration & permissions (owner, collaborator, viewer)
 - Real-time notifications for PR updates and comments
 
 # Tech Stack:
  - React 
  - Node.js 
  - Express.js 
  - MongoDB 
  - JWT Authentication
  - Git API integration
  - WebSockets / Socket.io
  - Cloud storage (AWS S3 / Cloudinary)

# ENTITY:
    USER, REPOSITORIES, PROJECT FILES, COMMENTS, NOTIFICATIONS, COLLABORATORS, COMMITS, PULL REQUESTS, ISSUES

# SCHEMA:
    
    USER:
    - user_id
    - name
    - email 
    - password
    - isActive
    - userProfilePic
    - timestamp
    
    REPOSITORY:
    - repo_id
    - name
    - description
    - visibility
    - owner(user_id)
    - collaborators(user_id)
    - isActive
    - comments
    - timestamps

    FILES:
    - file_id
    - repository(repo_id)
    - name
    - commits(commit model)
    - content(code)
    - createdBy(user_id)

    COMMENTS:
    - comment_id
    - user(user_id)
    - text
    - parent_type
    - parent_id
    - timestamp

    NOTIFICATIONS:
    - notification_id
    - timestamp
    - isSeen
    - type
    - user(user_id)
    - message

    COLLABORATOR:
    - collab_id
    - user(user_id)
    - repo(repo_id)
    - role(owner,collaborator,viewer)
    - addedAt(timestamp)

    COMMIT:
    - commit_id
    - repo_id
    - author(user_id)
    - message
    - changedFiles
    - createdAt(timestamps)

    PR:
    - pr_id
    - repo_id
    - title
    - description
    - createdBy(user_id,timestamp)
    - status(open,closed,merged)
    - commit(model)
    - reviewers(user)
    - createdAt(timestamp)
    
    ISSUES:
    - issue_id
    - repo_id
    - title
    - description
    - createdBy(user_id)
    - status(open,close)
    - assignees(user_id)
    - timestamp

    






