# Slack Work Queue Bot
 
A Slack bot application built using [Bolt](https://tools.slack.dev/bolt-js/) to help manage questions and pull request (PR) queues within a Slack workspace. The bot processes specific commands to add, list, and remove questions or PRs, and provides a summary of pull requests by fetching details from GitHub.

## Features

- **Command-based queue management**: Users can add questions (`!q`) or pull request links (`!wadd`), and manage their status through the commands.
- **GitHub Integration**: Fetches and displays detailed information for pull requests added via command, including PR number, title, author, creation date, and more.
- **Threaded Responses**: Ensures all responses are in-thread, keeping conversations organized.
- **Customizable channels**: Supports automatic channel creation and question management within dedicated channels.
- **Queue Status Summary**: Lists all pending questions or PRs in the queue upon request.

## Commands

- **Add a Pull Request**: `!wadd <pr_url>`
  - Fetches details of the specified PR from GitHub and adds it to the queue.
- **Add a Question**: `!q <question>`
  - Adds a new question to the queue.
- **Mark Question as Done**: `!wdone <question_id>`
  - Marks the question as completed and removes it from the queue.
- **Bounce a Question**: `!wbounce <question_id>`
  - Marks the question as needing further discussion.
- **List Queue**: `!w`
  - Lists all pending questions and PRs in the current queue.

## Setup and Installation

1. **Create a new Slack App**
- Go to https://api.slack.com/apps
- Click **Create App**
- Choose a workspace
- Enter App Manifest using contents of `manifest.yaml`
- Click **Create**
- Once the app is created click **Install to Workspace** Then scroll down in Basic Info and click **Generate Token and Scopes** with both scopes

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/slack-queue-bot.git
   cd workqueue-slack-bot
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Variables**:
   Configure environment variables by creating a `.env` file in the root directory and setting:
   ```plaintext
   SLACK_BOT_TOKEN=your-slack-bot-token
   SLACK_SIGNING_SECRET=your-slack-signing-secret
   GITHUB_TOKEN=your-github-token
   PORT=3000
   ```

5. **Run the Bot**:
   ```bash
   npm run ngrok
   npm run dev
   ```

## Usage

- **Add a Pull Request**: Use `!wadd <GitHub PR URL>` to add a pull request. The bot will fetch details and confirm the addition.
- **Add a Question**: Use `!q <Your question>` to add a new question.
- **Mark as Done**: Use `!wdone <question_id>` to mark an entry as completed.
- **Bounce for Further Discussion**: Use `!wbounce <question_id>` to keep the entry in the queue but flagged for further discussion.
- **Check Queue Status**: Use `!w` to view the list of all active questions and PRs.

## License

This project is open-source and available under the [MIT License](LICENSE).
