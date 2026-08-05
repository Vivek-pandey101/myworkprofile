/* ------------------------------------------------------------------ *
 *  Beginner walkthrough layer                                          *
 *                                                                      *
 *  skillGuides.js is the *reference* (every command, every flag).      *
 *  This file is the *guide*: a plain-English explanation plus a        *
 *  numbered, do-this-then-that walkthrough that assumes no prior       *
 *  knowledge — including the boring-but-critical parts docs skip, like *
 *  how to actually create and save a .env or an Nginx config file.     *
 *                                                                      *
 *  Merged into each guide by skillGuides.js, keyed by skill name.      *
 *                                                                      *
 *  Shape (every field optional — the UI renders only what exists):     *
 *  {                                                                   *
 *    beginner: { simple, analogy, before: [string] },                  *
 *    diagram: '<key registered in ui/GuideDiagram.jsx>',               *
 *    glossary: [{ term, meaning }],                                    *
 *    walkthrough: { title, intro, steps: [Step] },                     *
 *    troubleshooting: [{ problem, cause, fix }],                       *
 *  }                                                                   *
 *                                                                      *
 *  Step = {                                                            *
 *    title,            // what you are doing                           *
 *    why,              // why it matters, in plain words               *
 *    ui: [string],     // click-path steps when there is no command    *
 *    code,             // terminal commands to run (multi-line ok)     *
 *    explain: [{ part, meaning }],   // decode the command             *
 *    file: {           // a file you must create, with how to save it  *
 *      path, content, save, lines: [{ key, meaning }]                  *
 *    },                                                                *
 *    check,            // how to confirm the step worked               *
 *    note,             // gotcha / tip                                 *
 *  }                                                                   *
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  AWS EC2                                                            */
/* ------------------------------------------------------------------ */
const awsEc2 = {
  beginner: {
    simple:
      'EC2 is a computer you rent from Amazon. It is a real Linux machine sitting in a data centre, except you create it by clicking a button instead of buying hardware. You get a username, a key file, and an IP address — from there it behaves exactly like a laptop you control through a black terminal window.',
    analogy:
      'Think of it as renting a flat instead of building a house: Amazon owns the building, wiring and security guard; you get the keys, decide what furniture (software) goes inside, and pay monthly for as long as you keep it.',
    before: [
      'An AWS account (a credit/debit card is required even for the free tier).',
      'A terminal: Terminal on macOS/Linux, or Git Bash / Windows Terminal on Windows.',
      'Your project pushed to GitHub, so the server can download it.',
    ],
  },
  diagram: 'ec2',
  glossary: [
    { term: 'Instance', meaning: 'One rented virtual machine. "Launching an instance" = creating a server.' },
    { term: 'AMI', meaning: 'Amazon Machine Image — the OS template the server boots from, e.g. Ubuntu 22.04.' },
    { term: 'Instance type', meaning: 'The size: t3.micro = 2 vCPU / 1 GB RAM. Bigger letters and numbers = more power and cost.' },
    { term: 'Key pair (.pem)', meaning: 'Your password-less login key. Amazon keeps half, you download the other half once — losing it means losing SSH access.' },
    { term: 'Security group', meaning: 'The firewall. It decides which ports the outside world may reach (22 = SSH, 80 = HTTP, 443 = HTTPS).' },
    { term: 'Elastic IP', meaning: 'A permanent public IP address. Without one, the IP changes every time you stop and start the server.' },
    { term: 'EBS volume', meaning: 'The virtual hard disk attached to the instance. It survives reboots; it is deleted with the instance unless you say otherwise.' },
    { term: 'Region', meaning: 'The physical location of the data centre, e.g. ap-south-1 = Mumbai. Pick the one closest to your users.' },
  ],
  walkthrough: {
    title: 'From empty AWS account to a live Node.js API',
    intro:
      'Follow these steps in order. Everything after step 4 happens inside the server, so the same commands work whether you are on Windows, macOS or Linux.',
    steps: [
      {
        title: 'Create the server (launch an instance)',
        why: 'This is the one part done by clicking, not typing. You are choosing which operating system to boot, how big the machine is, and which key will unlock it.',
        ui: [
          'Sign in to the AWS Console and search for "EC2" in the top search bar.',
          'Check the region in the top-right corner (e.g. Asia Pacific (Mumbai) ap-south-1) — everything you create lives in that region only.',
          'Click Launch instance and give it a name, e.g. my-api-prod.',
          'Application and OS Images → choose Ubuntu Server 22.04 LTS (free-tier eligible).',
          'Instance type → t3.micro (or t2.micro) for a small app.',
          'Key pair → Create new key pair → name it my-api-key, type RSA, format .pem → Create. The file downloads once and only once.',
          'Network settings → Edit → allow SSH (port 22) from My IP, and tick Allow HTTP and Allow HTTPS traffic.',
          'Click Launch instance, then Instances in the sidebar and wait for the state to become "Running".',
        ],
        check:
          'The instance row shows a Public IPv4 address like 13.235.10.20 — that number is your server address from now on.',
        note:
          'Set SSH to "My IP", never "Anywhere (0.0.0.0/0)". Leaving port 22 open to the whole internet means bots start guessing logins within minutes.',
      },
      {
        title: 'Put the key file somewhere safe and lock it down',
        why: 'SSH refuses to use a key that other users on your computer can read. This is the single most common first-time error.',
        code: `# macOS / Linux / Git Bash on Windows
mkdir -p ~/.ssh
mv ~/Downloads/my-api-key.pem ~/.ssh/
chmod 400 ~/.ssh/my-api-key.pem`,
        explain: [
          { part: 'mkdir -p ~/.ssh', meaning: 'Create the hidden .ssh folder in your home directory if it does not exist yet.' },
          { part: 'mv', meaning: 'Move the downloaded key out of Downloads into that folder.' },
          { part: 'chmod 400', meaning: 'Permissions: read-only for you, nothing for anyone else.' },
        ],
        check: 'ls -l ~/.ssh/my-api-key.pem should start with -r--------',
        note:
          'On Windows PowerShell chmod does not exist. Either use Git Bash (recommended) or run: icacls "C:\\Users\\You\\.ssh\\my-api-key.pem" /inheritance:r /grant:r "%USERNAME%:R"',
      },
      {
        title: 'Log into the server over SSH',
        why: 'SSH gives you a terminal running on the remote machine. Every command you type after this runs on the server, not on your laptop.',
        code: `ssh -i ~/.ssh/my-api-key.pem ubuntu@13.235.10.20`,
        explain: [
          { part: '-i ~/.ssh/my-api-key.pem', meaning: 'Identity file — the private key that proves who you are.' },
          { part: 'ubuntu@', meaning: 'The default username of Ubuntu images. Amazon Linux uses ec2-user, Debian uses admin.' },
          { part: '13.235.10.20', meaning: 'Replace with your own Public IPv4 address from the console.' },
        ],
        check:
          'Your prompt changes to something like ubuntu@ip-172-31-8-4:~$ — you are now inside the server. Type exit to come back to your laptop.',
        note:
          'First connection asks "Are you sure you want to continue connecting?" — type yes. That fingerprint is stored so future connections are silent.',
      },
      {
        title: 'Update the machine and install the basics',
        why: 'A fresh server has outdated package lists and no build tools. This brings it current and installs git so you can pull your code.',
        code: `sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential`,
        explain: [
          { part: 'sudo', meaning: 'Run as administrator (root). Needed for anything that changes the system.' },
          { part: 'apt update', meaning: 'Refresh the catalogue of available packages.' },
          { part: 'apt upgrade -y', meaning: 'Install the newer versions; -y answers "yes" to the prompts automatically.' },
          { part: 'build-essential', meaning: 'Compilers some npm packages need to build native modules.' },
        ],
        check: 'git --version prints a version number.',
      },
      {
        title: 'Install Node.js with nvm',
        why: 'The Node in Ubuntu repositories is usually years old. nvm (Node Version Manager) lets you install any version and switch later without breaking anything.',
        code: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v && npm -v`,
        explain: [
          { part: 'curl … | bash', meaning: 'Download the installer script and run it immediately.' },
          { part: 'source ~/.bashrc', meaning: 'Reload your shell config so the nvm command becomes available without logging out.' },
          { part: 'nvm install 20', meaning: 'Install Node.js 20 (an LTS version) and make it the default.' },
        ],
        check: 'node -v prints v20.x.x',
      },
      {
        title: 'Bring your code onto the server',
        why: 'The server needs a copy of your project. Cloning from GitHub is the cleanest way — later deployments become a one-line git pull.',
        code: `mkdir -p ~/apps && cd ~/apps
git clone https://github.com/your-username/my-api.git
cd my-api
npm ci --omit=dev`,
        explain: [
          { part: 'mkdir -p ~/apps', meaning: 'Keep all deployed projects in one predictable folder.' },
          { part: 'git clone', meaning: 'Download the repository. Private repos will ask for credentials — use a deploy key or a personal access token.' },
          { part: 'npm ci --omit=dev', meaning: 'Install exactly the versions in package-lock.json, skipping development-only packages.' },
        ],
        note:
          'npm ci deletes node_modules and reinstalls from the lock file, so the server gets the same versions your laptop had. npm install can silently drift.',
      },
      {
        title: 'Create the .env file (and save it correctly)',
        why: 'Your app needs secrets — database URL, JWT secret, API keys. They must never live in git, so you create them by hand on the server, once. This file is read by libraries like dotenv when the app boots.',
        code: `cd ~/apps/my-api
nano .env`,
        file: {
          path: '~/apps/my-api/.env',
          content: `NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://appuser:SuperSecret123@cluster0.abcde.mongodb.net/myapp

# Auth
JWT_SECRET=e3b0c44298fc1c149afbf4c8996fb924
JWT_EXPIRES_IN=7d

# Third-party
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
CLIENT_URL=https://myapp.com`,
          save: 'Press Ctrl + O (write out) → Enter to confirm the filename → Ctrl + X to leave nano. The file is now saved at ~/apps/my-api/.env',
          lines: [
            { key: 'NODE_ENV=production', meaning: 'Tells Express and many libraries to switch off debug output and enable caching.' },
            { key: 'PORT=5000', meaning: 'The port your Node app listens on internally. Nginx will forward public traffic to it.' },
            { key: 'MONGODB_URI', meaning: 'Full connection string for your database, including username and password.' },
            { key: 'JWT_SECRET', meaning: 'Random string used to sign login tokens. Generate one with: openssl rand -hex 32' },
            { key: '# comment', meaning: 'Lines starting with # are ignored — use them to group settings.' },
          ],
        },
        check: 'cat .env prints the file back. There must be no spaces around the = sign and no quotes unless the value contains spaces.',
        note:
          'Immediately restrict and ignore it: chmod 600 .env locks it to your user, and .env must be listed in .gitignore so it never reaches GitHub.',
      },
      {
        title: 'Test the app by hand before automating anything',
        why: 'If it cannot run in the foreground, no process manager will fix it. Catch missing env vars and database errors here, where you can see them.',
        code: `node server.js
# in a second SSH window, or after Ctrl+C:
curl http://localhost:5000/health`,
        explain: [
          { part: 'node server.js', meaning: 'Run the app directly. Errors print straight to the screen.' },
          { part: 'curl http://localhost:5000/health', meaning: 'Ask the app for a response from inside the server itself — this proves the app works before firewalls and proxies enter the picture.' },
        ],
        check: 'curl returns your JSON response instead of "Connection refused".',
        note: 'Press Ctrl + C to stop it. The moment you close SSH, a foreground app dies — that is exactly what PM2 solves next.',
      },
      {
        title: 'Keep it running forever with PM2',
        why: 'PM2 restarts the app if it crashes, starts it again after a server reboot, and keeps the logs. Without it, one exception takes your API offline until you notice.',
        code: `npm install -g pm2
pm2 start server.js --name my-api
pm2 save
pm2 startup   # then paste the sudo command it prints`,
        check: 'pm2 list shows my-api with status online.',
        note: 'Full details, including the ecosystem.config.js file, are in the PM2 guide.',
      },
      {
        title: 'Put Nginx in front so the world can reach it',
        why: 'Your app listens on port 5000, but browsers ask for port 80/443. Nginx accepts public traffic, forwards it to your app, and later handles HTTPS.',
        code: `sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/my-api`,
        check:
          'After writing the config (see the Nginx guide for the exact file), sudo nginx -t reports "syntax is ok" and http://your-ip loads your API.',
      },
      {
        title: 'Give it a permanent address and HTTPS',
        why: 'A stop/start changes your public IP and breaks every DNS record pointing at it. An Elastic IP pins it. Certbot then issues a free certificate so the site loads over https.',
        ui: [
          'EC2 Console → Elastic IPs → Allocate Elastic IP address → Associate it with your instance.',
          'In your domain registrar, add an A record pointing api.myapp.com to that Elastic IP.',
        ],
        code: `sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.myapp.com`,
        check: 'https://api.myapp.com loads with a padlock. Certbot also installs a timer that renews the certificate automatically.',
        note: 'DNS changes can take a few minutes to propagate. Certbot fails if the domain does not resolve to this server yet — wait and rerun.',
      },
    ],
  },
  troubleshooting: [
    {
      problem: 'Permission denied (publickey)',
      cause: 'Wrong username, wrong key, or key permissions too open.',
      fix: 'Use ubuntu@ for Ubuntu images (ec2-user@ for Amazon Linux), confirm -i points at the right .pem, and run chmod 400 on it.',
    },
    {
      problem: 'ssh: connect to host … port 22: Connection timed out',
      cause: 'The security group does not allow your current IP, or you are on a different network than when you set the rule.',
      fix: 'EC2 → Security Groups → Inbound rules → edit the SSH rule and re-select "My IP". Home/office IPs change often.',
    },
    {
      problem: 'The API works with curl on the server but not from a browser',
      cause: 'Port 80/443 is closed in the security group, or Nginx is not proxying to the app.',
      fix: 'Add inbound rules for HTTP (80) and HTTPS (443) from 0.0.0.0/0, then check sudo tail -f /var/log/nginx/error.log.',
    },
    {
      problem: 'npm install is killed halfway on a t3.micro',
      cause: 'Out of memory — 1 GB RAM is not enough to build some packages.',
      fix: 'Add swap: sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile',
    },
    {
      problem: 'The bill is higher than expected',
      cause: 'Elastic IPs cost money when not attached, and stopped instances still pay for their disk.',
      fix: 'Release unused Elastic IPs, delete unattached EBS volumes and old snapshots, and set a billing alarm in AWS Budgets.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  AWS SES                                                            */
/* ------------------------------------------------------------------ */
const awsSes = {
  beginner: {
    simple:
      'SES is Amazon\u2019s email post office. Instead of your server trying to deliver mail itself — which almost always lands in spam — you hand the message to SES and it delivers it with Amazon\u2019s reputation behind it. It is used for the emails an app sends automatically: OTPs, password resets, invoices, welcome mails.',
    analogy:
      'Sending mail from your own server is like dropping a handwritten envelope in a random postbox and hoping. SES is a courier with a tracking number, a good reputation, and a report telling you what was delivered, opened, or bounced.',
    before: [
      'An AWS account, and access to the DNS settings of the domain you will send from.',
      'A Node.js app where you want to send email (this guide uses Nodemailer).',
      'Roughly 24 hours of patience for the production-access request.',
    ],
  },
  diagram: 'ses',
  glossary: [
    { term: 'Identity', meaning: 'An email address or domain you have proven you own. SES only sends "from" verified identities.' },
    { term: 'Sandbox', meaning: 'Every new account starts here: you may only send to addresses you also verified, max 200 mails/day. Production access removes both limits.' },
    { term: 'SMTP credentials', meaning: 'A special username/password pair for sending mail. They are NOT your AWS access keys, even though SES derives them from IAM.' },
    { term: 'DKIM', meaning: 'A cryptographic signature added to each mail proving it really came from your domain. Set up via three CNAME records.' },
    { term: 'SPF', meaning: 'A DNS TXT record listing who is allowed to send for your domain.' },
    { term: 'Bounce', meaning: 'The mail could not be delivered (address does not exist). Too many bounces and AWS pauses your account.' },
    { term: 'Complaint', meaning: 'A recipient hit "mark as spam". Keep this under 0.1%.' },
  ],
  walkthrough: {
    title: 'Send your first production email from a Node.js app',
    intro:
      'Steps 1–4 are one-time setup in AWS. Steps 5–7 are the code. Step 8 is what most people forget until their emails silently stop.',
    steps: [
      {
        title: 'Pick your region and understand the sandbox',
        why: 'SES settings are per-region — credentials created in Mumbai do not work in Virginia. And until you leave the sandbox you can only mail addresses you verified yourself, which confuses everyone the first time.',
        ui: [
          'AWS Console → search "SES" → Amazon Simple Email Service.',
          'Set the region (top-right) to the one nearest your users, e.g. ap-south-1 (Mumbai). Remember it — you need it in the SMTP endpoint later.',
          'Look at Account dashboard: it will say "Your account is in the sandbox".',
        ],
        note: 'Everything below works in the sandbox for testing. Do not request production access until a real test email has arrived.',
      },
      {
        title: 'Verify the domain you will send from',
        why: 'Anyone can type a From address; SES makes you prove the domain is yours. Verifying the whole domain lets you send from any address on it (no-reply@, support@, billing@).',
        ui: [
          'SES → Identities → Create identity → Domain.',
          'Enter myapp.com, leave "Easy DKIM" enabled with RSA_2048.',
          'SES shows three CNAME records. Copy each Name/Value pair into your DNS provider (GoDaddy, Cloudflare, Route 53).',
          'Wait — status moves from "Pending" to "Verified", usually within an hour.',
        ],
        code: `# CLI alternative
aws sesv2 create-email-identity --email-identity myapp.com --region ap-south-1
aws sesv2 get-email-identity --email-identity myapp.com --region ap-south-1`,
        check: 'The identity shows Verified, and DKIM status is Successful.',
        note:
          'While in the sandbox also verify the address you will send TO (Create identity → Email address), otherwise every send fails with "Email address is not verified".',
      },
      {
        title: 'Add SPF and DMARC records',
        why: 'DKIM proves the mail was not tampered with; SPF says which servers may send for you; DMARC tells inboxes what to do if either check fails. Without all three, Gmail and Outlook quietly route you to spam.',
        file: {
          path: 'DNS records at your domain provider',
          label: 'add these records',
          content: `; SPF — merge into an existing TXT record if you already have one
myapp.com.            TXT   "v=spf1 include:amazonses.com ~all"

; DMARC — start in monitor mode
_dmarc.myapp.com.     TXT   "v=DMARC1; p=none; rua=mailto:dmarc@myapp.com"`,
          save: 'These are added in your DNS provider\u2019s dashboard (Add record → type TXT), not in a file on your server. Changes take 5 minutes to a few hours to propagate.',
          lines: [
            { key: 'v=spf1', meaning: 'Marks this TXT record as an SPF policy.' },
            { key: 'include:amazonses.com', meaning: 'Authorises Amazon SES servers to send mail for your domain.' },
            { key: '~all', meaning: 'Soft-fail anything else — suspicious but not rejected outright.' },
            { key: 'p=none', meaning: 'DMARC monitor-only. Tighten to p=quarantine once reports look clean.' },
          ],
        },
        check: 'Send a test to a Gmail account, open the mail → three dots → Show original. SPF, DKIM and DMARC should all say PASS.',
        note: 'A domain may only have ONE SPF record. If one exists, add include:amazonses.com to it rather than creating a second.',
      },
      {
        title: 'Create SMTP credentials',
        why: 'This is the username and password your app authenticates with. They look like AWS keys but are generated specifically for SMTP — your normal access key will not work.',
        ui: [
          'SES → SMTP settings. Note the SMTP endpoint shown, e.g. email-smtp.ap-south-1.amazonaws.com.',
          'Click Create SMTP credentials → it opens IAM → give the user a name like ses-smtp-my-api → Create.',
          'Download the CSV or copy the SMTP username and password NOW — the password is shown exactly once.',
        ],
        check: 'You have a username like AKIA… and a long password ending in a random string.',
        note: 'If you lose the password you cannot recover it; delete the IAM user and create fresh credentials.',
      },
      {
        title: 'Put the credentials in your .env file',
        why: 'Credentials in code get committed to GitHub, and bots scan public repos for exactly this. Environment variables keep them out of the codebase.',
        code: `cd ~/apps/my-api
nano .env`,
        file: {
          path: '~/apps/my-api/.env (append to what is already there)',
          content: `# AWS SES
SES_SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SES_SMTP_PORT=587
SES_SMTP_USER=AKIAIOSFODNN7EXAMPLE
SES_SMTP_PASS=BEXAMPLEKEYuLongSmtpPasswordStringHere
MAIL_FROM="MyApp <no-reply@myapp.com>"`,
          save: 'Ctrl + O → Enter → Ctrl + X. Then run chmod 600 .env so only your user can read it, and restart the app: pm2 restart my-api --update-env',
          lines: [
            { key: 'SES_SMTP_HOST', meaning: 'Must match the region you verified the domain in.' },
            { key: 'SES_SMTP_PORT=587', meaning: 'STARTTLS port. Use 465 for implicit TLS. Never 25 — cloud providers block it.' },
            { key: 'SES_SMTP_USER / PASS', meaning: 'The SMTP credentials from the previous step.' },
            { key: 'MAIL_FROM', meaning: 'Display name plus a verified address. Quote it because it contains spaces.' },
          ],
        },
        note: 'pm2 restart alone reuses the old environment — you must add --update-env for new variables to be picked up.',
      },
      {
        title: 'Write the mailer module',
        why: 'One small file that every other part of the app imports, so credentials and transport settings live in exactly one place.',
        code: `npm install nodemailer
nano src/mailer.js`,
        file: {
          path: '~/apps/my-api/src/mailer.js',
          content: `import nodemailer from 'nodemailer'

// One shared transport, reused for every mail (SES allows pooled connections).
const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST,
  port: Number(process.env.SES_SMTP_PORT),
  secure: false,     // true only if you use port 465
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
})

export async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,   // plain-text fallback improves deliverability
    html,
  })
  console.log('Sent', info.messageId)
  return info
}`,
          save: 'Ctrl + O → Enter → Ctrl + X.',
          lines: [
            { key: 'createTransport', meaning: 'Opens the connection settings once, at startup, instead of per email.' },
            { key: 'secure: false', meaning: 'With port 587 the connection starts plain and upgrades to TLS via STARTTLS — this is correct and still encrypted.' },
            { key: 'text + html', meaning: 'Sending both versions is one of the easiest deliverability wins.' },
          ],
        },
      },
      {
        title: 'Send a real test email',
        why: 'Proves credentials, DNS and code all line up before you wire it into signup flows.',
        code: `node --env-file=.env -e "import('./src/mailer.js').then(m => m.sendMail({ to: 'you@gmail.com', subject: 'SES test', text: 'It works', html: '<b>It works</b>' }))"`,
        check: 'The mail arrives (check spam too) and the console prints a messageId ending in @email.amazonses.com.',
        note:
          'In the sandbox, the recipient must also be a verified identity. Error 554 "Message rejected: Email address is not verified" means exactly that.',
      },
      {
        title: 'Request production access',
        why: 'Until you do, you are capped at 200 emails per day and can only mail verified addresses — useless for real users.',
        ui: [
          'SES → Account dashboard → Request production access.',
          'Mail type: Transactional. Website URL: your app.',
          'Describe in plain words what you send (OTP, password reset, order receipts) and how users opt in and unsubscribe.',
          'Submit and wait — usually under 24 hours.',
        ],
        note: 'Vague answers get rejected. Mention that you handle bounces and complaints, and that mail is only sent in response to user action.',
      },
      {
        title: 'Watch bounces and complaints',
        why: 'AWS pauses accounts whose bounce rate goes above ~5%. Knowing early lets you clean your list before that happens.',
        code: `aws sesv2 get-account --region ap-south-1
aws sesv2 get-suppressed-destination --email-address bad@example.com --region ap-south-1`,
        check: 'SES → Reputation metrics shows Bounce rate and Complaint rate well under the red line.',
        note:
          'Set up an SNS topic on a configuration set so bounces hit a webhook, and delete those addresses from your database automatically.',
      },
    ],
  },
  troubleshooting: [
    {
      problem: '554 Message rejected: Email address is not verified',
      cause: 'Still in the sandbox, or sending from an address on an unverified domain.',
      fix: 'Verify both sender and recipient identities, and confirm you are using the same region everywhere.',
    },
    {
      problem: '535 Authentication Credentials Invalid',
      cause: 'Using AWS access keys instead of SES SMTP credentials, or credentials from another region.',
      fix: 'Regenerate via SES → SMTP settings → Create SMTP credentials, and match the host to that region.',
    },
    {
      problem: 'Connection times out on port 25',
      cause: 'EC2 and most clouds block outbound port 25 to fight spam.',
      fix: 'Use port 587 (STARTTLS) or 465 (TLS).',
    },
    {
      problem: 'Emails land in spam',
      cause: 'Missing DKIM/SPF/DMARC, no plain-text part, or a spammy subject line.',
      fix: 'Verify all three DNS checks pass in Gmail\u2019s "Show original", always send a text fallback, and warm up volume gradually.',
    },
    {
      problem: 'Throttling: Maximum sending rate exceeded',
      cause: 'Sending faster than your account\u2019s per-second quota.',
      fix: 'Queue emails (BullMQ, SQS) and send at a steady rate instead of looping over a list.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Nginx                                                              */
/* ------------------------------------------------------------------ */
const nginx = {
  beginner: {
    simple:
      'Nginx is the receptionist of your server. Every visitor arrives at it first, on port 80 (http) or 443 (https). Nginx then decides what to do: hand back a static file like index.html, or quietly pass the request on to your Node app running on an internal port, and return whatever the app answers.',
    analogy:
      'Your Node app is a specialist sitting in a back office with an unlisted number. Nginx is the front desk with the public address: it greets everyone, checks their ID (TLS), and walks the request to the right room.',
    before: [
      'A Linux server you can SSH into (see the AWS EC2 guide).',
      'Your app already running on a local port, e.g. http://localhost:5000.',
      'Optional: a domain name pointed at the server’s IP, needed for HTTPS.',
    ],
  },
  diagram: 'nginx',
  glossary: [
    { term: 'Reverse proxy', meaning: 'A server that receives requests on behalf of another server behind it. Nginx in front of Node is the classic example.' },
    { term: 'Server block', meaning: 'One website’s configuration — its domain, its files, its rules. Apache calls the same thing a virtual host.' },
    { term: 'sites-available', meaning: 'Folder holding every site config you have written, active or not.' },
    { term: 'sites-enabled', meaning: 'Folder of symlinks to the configs that are actually switched on. Nginx only reads these.' },
    { term: 'upstream', meaning: 'The thing Nginx forwards to — your Node app. "502 Bad Gateway" means the upstream did not answer.' },
    { term: 'proxy_pass', meaning: 'The directive that says "send this request over there".' },
    { term: 'root / try_files', meaning: 'Where static files live, and the fallback chain used when a file is not found — the key to single-page-app routing.' },
    { term: 'reload vs restart', meaning: 'Reload applies new config without dropping live connections. Restart kills and starts fresh, briefly refusing traffic.' },
  ],
  walkthrough: {
    title: 'Put Nginx in front of a Node app, then add HTTPS',
    intro:
      'The config file in step 3 is the heart of this guide — every line is explained. Steps 6 and 7 cover the two most common variations: a React build and a real certificate.',
    steps: [
      {
        title: 'Install Nginx and confirm it is alive',
        why: 'Ubuntu starts Nginx automatically after install with a placeholder page, which is a quick way to prove ports and firewalls are fine before any custom config exists.',
        code: `sudo apt update && sudo apt install -y nginx
sudo systemctl status nginx`,
        check:
          'The status output shows active (running) in green, and visiting http://your-server-ip in a browser shows the "Welcome to nginx!" page.',
        note:
          'No welcome page? The port is blocked upstream — on EC2 add an inbound rule for HTTP (80) in the security group.',
      },
      {
        title: 'Learn the four paths that matter',
        why: 'Nginx has a lot of files, but day-to-day you only ever touch these. Knowing which is which prevents editing the wrong one for an hour.',
        code: `/etc/nginx/nginx.conf              # global settings, rarely edited
/etc/nginx/sites-available/       # you WRITE your site configs here
/etc/nginx/sites-enabled/         # symlinks to the ones switched ON
/var/log/nginx/error.log          # the first place to look when anything breaks`,
        explain: [
          { part: 'nginx.conf', meaning: 'Worker counts, gzip defaults, and the include line that pulls in sites-enabled/*.' },
          { part: 'sites-available', meaning: 'Your library of configs. A file here does nothing until it is linked.' },
          { part: 'sites-enabled', meaning: 'The active set. Removing a symlink disables a site without deleting its config.' },
        ],
        note: 'On Amazon Linux / RHEL these folders do not exist — put configs in /etc/nginx/conf.d/myapp.conf instead.',
      },
      {
        title: 'Create the server block file',
        why: 'This single file tells Nginx which domain to answer for and where to forward the request. This is the file most tutorials assume you already know how to write.',
        code: `sudo nano /etc/nginx/sites-available/my-api`,
        file: {
          path: '/etc/nginx/sites-available/my-api',
          content: `server {
    listen 80;
    listen [::]:80;
    server_name api.myapp.com;

    # Requests bigger than 1 MB (file uploads) are rejected by default
    client_max_body_size 10M;

    access_log /var/log/nginx/my-api.access.log;
    error_log  /var/log/nginx/my-api.error.log;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        # Pass the real visitor details through to the Node app
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Required for WebSockets / socket.io
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 60s;
    }
}`,
          save: 'Press Ctrl + O → Enter → Ctrl + X to save and exit nano. Because the file lives in /etc you must have opened nano with sudo, otherwise the save fails with "Permission denied".',
          lines: [
            { key: 'listen 80;', meaning: 'Answer plain HTTP. The [::]:80 line does the same for IPv6.' },
            { key: 'server_name api.myapp.com;', meaning: 'Which domain this block handles. Use _ to match anything (handy before you own a domain).' },
            { key: 'client_max_body_size 10M;', meaning: 'Raise the upload limit. The default 1 MB causes surprise "413 Request Entity Too Large" errors.' },
            { key: 'location / { … }', meaning: 'Rules for every path. You can add more blocks, e.g. location /api/ for a second service.' },
            { key: 'proxy_pass http://127.0.0.1:5000;', meaning: 'Forward to your Node app. 127.0.0.1 keeps the app unreachable from the internet directly.' },
            { key: 'X-Forwarded-For / -Proto', meaning: 'Without these, your app sees every request as coming from the server itself over http — breaking rate limits, logs and secure cookies.' },
            { key: 'Upgrade / Connection', meaning: 'Lets WebSocket connections survive the proxy. Leave them in even if you do not use sockets yet.' },
          ],
        },
        note: 'Do not write configs directly inside sites-enabled — keep the real file in sites-available and link it, so disabling a site is one command.',
      },
      {
        title: 'Enable the site and test the syntax',
        why: 'A typo in an Nginx config takes the whole web server down on reload — including sites that were working. nginx -t catches it while everything is still up.',
        code: `sudo ln -s /etc/nginx/sites-available/my-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t`,
        explain: [
          { part: 'ln -s', meaning: 'Create a symbolic link — a pointer, so you keep editing the original file.' },
          { part: 'rm …/default', meaning: 'Remove the welcome-page site, otherwise it may keep answering requests that have no matching server_name.' },
          { part: 'nginx -t', meaning: 'Parse every config and report errors with the exact file and line number.' },
        ],
        check: 'nginx: configuration file /etc/nginx/nginx.conf test is successful',
        note: 'If the test fails, fix the file before reloading. The running Nginx keeps serving the old config until you reload.',
      },
      {
        title: 'Reload and verify end to end',
        why: 'Reload swaps in the new config gracefully — existing requests finish on the old workers, new ones use the new rules. No visitor sees an error.',
        code: `sudo systemctl reload nginx
curl -I http://api.myapp.com`,
        check: 'curl returns HTTP/1.1 200 OK (or your app’s status) rather than 502.',
        note:
          '502 Bad Gateway means Nginx is fine but your app is not answering on port 5000 — check pm2 list and sudo tail -f /var/log/nginx/my-api.error.log.',
      },
      {
        title: 'Serve a React / Vite build from the same server',
        why: 'A single-page app is just static files, but refreshing /dashboard asks the server for a file that does not exist. try_files fixes that by falling back to index.html so the router can take over.',
        code: `sudo nano /etc/nginx/sites-available/my-frontend`,
        file: {
          path: '/etc/nginx/sites-available/my-frontend',
          content: `server {
    listen 80;
    server_name myapp.com www.myapp.com;

    root /var/www/myapp/dist;
    index index.html;

    # Hashed build assets never change — cache them hard
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Any unknown path falls back to the SPA entry point
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Send API calls to the backend instead
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}`,
          save: 'Ctrl + O → Enter → Ctrl + X, then link and reload: sudo ln -s /etc/nginx/sites-available/my-frontend /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx',
          lines: [
            { key: 'root … /dist;', meaning: 'The folder produced by npm run build. Copy it there with rsync or a deploy script.' },
            { key: 'try_files $uri $uri/ /index.html;', meaning: 'Try the exact file, then a folder, then give the SPA its entry point. This is the fix for "404 on refresh".' },
            { key: 'expires 1y + immutable', meaning: 'Vite adds a content hash to filenames, so old assets can be cached forever and new builds bust the cache automatically.' },
            { key: 'location /api/', meaning: 'Frontend and backend on one domain means no CORS configuration at all.' },
            { key: 'gzip on', meaning: 'Compresses text responses, typically cutting JS/CSS transfer size by ~70%.' },
          ],
        },
        note:
          'Nginx needs read access to the build folder: sudo chown -R www-data:www-data /var/www/myapp. A "403 Forbidden" here is almost always permissions.',
      },
      {
        title: 'Add free HTTPS with Certbot',
        why: 'Browsers mark plain http as "Not secure", and features like clipboard access and service workers refuse to run without TLS. Certbot gets a Let’s Encrypt certificate and rewrites your config for you.',
        code: `sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.myapp.com -d myapp.com -d www.myapp.com
sudo certbot renew --dry-run`,
        explain: [
          { part: '--nginx', meaning: 'Use the Nginx plugin: it proves domain ownership, installs the certificate and edits the server block automatically.' },
          { part: '-d', meaning: 'One flag per domain. Every domain listed must already point at this server.' },
          { part: 'renew --dry-run', meaning: 'Rehearse the automatic renewal so you find problems now, not in 90 days.' },
        ],
        check:
          'The site loads over https with a padlock, and your config now contains listen 443 ssl plus a redirect block from port 80.',
        note: 'Certificates last 90 days. The installed systemd timer renews them automatically — never disable it.',
      },
      {
        title: 'Harden the defaults',
        why: 'Out of the box Nginx announces its exact version and sends no security headers. Two minutes here removes a whole class of easy attacks.',
        code: `sudo nano /etc/nginx/conf.d/security.conf`,
        file: {
          path: '/etc/nginx/conf.d/security.conf',
          content: `# Applied to every site on this server
server_tokens off;

add_header X-Content-Type-Options   "nosniff"        always;
add_header X-Frame-Options          "SAMEORIGIN"     always;
add_header Referrer-Policy          "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Basic rate limit zone — 10 requests/second per IP, burst allowed
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;`,
          save: 'Ctrl + O → Enter → Ctrl + X, then sudo nginx -t && sudo systemctl reload nginx',
          lines: [
            { key: 'server_tokens off', meaning: 'Stops Nginx printing its version in error pages and headers.' },
            { key: 'nosniff', meaning: 'Prevents browsers from guessing a file is JavaScript when you served it as text.' },
            { key: 'SAMEORIGIN', meaning: 'Blocks other sites from embedding yours in an iframe (clickjacking).' },
            { key: 'Strict-Transport-Security', meaning: 'Tells browsers to only ever use https for a year. Add it only after HTTPS works.' },
            { key: 'limit_req_zone', meaning: 'Defines the bucket; activate it inside a location with: limit_req zone=api_limit burst=20 nodelay;' },
          ],
        },
      },
    ],
  },
  troubleshooting: [
    {
      problem: '502 Bad Gateway',
      cause: 'Nginx forwarded the request but nothing answered on the upstream port.',
      fix: 'Confirm the app is up (pm2 list, curl http://localhost:5000) and that proxy_pass points at the same port the app actually binds to.',
    },
    {
      problem: '403 Forbidden on a static site',
      cause: 'The www-data user cannot read the files, or root points at the wrong folder.',
      fix: 'sudo chown -R www-data:www-data /var/www/myapp and make sure every parent folder has execute (x) permission.',
    },
    {
      problem: 'Changes have no effect',
      cause: 'The file was never symlinked into sites-enabled, or Nginx was not reloaded.',
      fix: 'ls -l /etc/nginx/sites-enabled/ to confirm the link exists, then sudo nginx -t && sudo systemctl reload nginx.',
    },
    {
      problem: '404 when refreshing a React route',
      cause: 'Missing SPA fallback — the server looks for a real file at that path.',
      fix: 'Add try_files $uri $uri/ /index.html; inside location /.',
    },
    {
      problem: '413 Request Entity Too Large on upload',
      cause: 'client_max_body_size defaults to 1 MB.',
      fix: 'Raise it in the server block, e.g. client_max_body_size 25M; then reload.',
    },
    {
      problem: 'nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)',
      cause: 'Apache or an older Nginx process already owns port 80.',
      fix: 'sudo ss -tulpn | grep :80 to find it, then stop it (e.g. sudo systemctl stop apache2).',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  PM2                                                                */
/* ------------------------------------------------------------------ */
const pm2 = {
  beginner: {
    simple:
      'When you run node server.js and close your terminal, the app dies. If it throws an unhandled error, it dies. If the server reboots, it stays dead. PM2 is a small program that babysits your app: it runs it in the background, restarts it whenever it crashes, brings it back after a reboot, and keeps all the logs in one place.',
    analogy:
      'node server.js is holding a torch with your hand — let go and the light goes out. PM2 is mounting it on the wall with a battery backup.',
    before: [
      'Node.js and npm installed on the server.',
      'An app that starts correctly in the foreground with node server.js.',
      'A .env file if your app needs secrets.',
    ],
  },
  diagram: 'pm2',
  glossary: [
    { term: 'Process', meaning: 'One running copy of your app. PM2 gives each an id and a name.' },
    { term: 'Cluster mode', meaning: 'PM2 starts several copies of the app and load-balances between them, using all CPU cores instead of one.' },
    { term: 'Ecosystem file', meaning: 'ecosystem.config.cjs — your PM2 settings written down, so a deploy is one command instead of a remembered flag soup.' },
    { term: 'pm2 save', meaning: 'Writes the current process list to disk, so it can be resurrected later.' },
    { term: 'pm2 startup', meaning: 'Generates the system service that runs "pm2 resurrect" on boot.' },
    { term: 'Reload vs restart', meaning: 'Reload replaces cluster workers one by one (zero downtime). Restart stops everything, then starts it.' },
    { term: 'max_memory_restart', meaning: 'A safety net: if the app leaks memory past a limit, PM2 restarts it instead of letting the server run out of RAM.' },
  ],
  walkthrough: {
    title: 'Run a Node app in production and keep it there',
    intro:
      'Steps 1–3 get you running in a minute. Steps 4–6 are what separates a demo from something that survives a reboot at 3 a.m.',
    steps: [
      {
        title: 'Install PM2 globally',
        why: 'PM2 is a command-line tool, not a project dependency — it needs to be available everywhere on the machine, including for the boot service.',
        code: `npm install -g pm2
pm2 --version`,
        check: 'A version number prints, e.g. 5.4.2.',
        note: 'Installed via nvm? Then PM2 lives inside that Node version. If you later switch versions with nvm, reinstall PM2 and rerun pm2 startup.',
      },
      {
        title: 'Start your app',
        why: 'This hands the process to PM2, which detaches it from your terminal. You can now close SSH and the app keeps serving.',
        code: `cd ~/apps/my-api
pm2 start server.js --name my-api
pm2 list`,
        explain: [
          { part: '--name my-api', meaning: 'A readable label. Without it you get "server" and every app looks the same.' },
          { part: 'pm2 list', meaning: 'The dashboard: status, restarts, CPU, memory, uptime for each process.' },
        ],
        check: 'The row for my-api shows status online and restart count 0.',
        note: 'Status "errored" with restarts climbing means the app is crash-looping. Read pm2 logs my-api --lines 100 before changing anything else.',
      },
      {
        title: 'Read the logs',
        why: 'Because the app is detached, console output no longer appears in your terminal. PM2 keeps it, and this is where every production mystery gets solved.',
        code: `pm2 logs my-api           # live stream, Ctrl+C to leave
pm2 logs my-api --lines 200
pm2 logs my-api --err     # only stderr
pm2 flush                 # empty the log files`,
        explain: [
          { part: '--lines 200', meaning: 'Show the last 200 lines before following — enough context to see the crash.' },
          { part: '--err', meaning: 'Filters to error output when normal logs are noisy.' },
          { part: 'pm2 flush', meaning: 'Truncates logs. Useful when a crash loop has filled the disk.' },
        ],
        note: 'Log files live in ~/.pm2/logs/. They grow forever unless you add rotation in step 6.',
      },
      {
        title: 'Write an ecosystem file',
        why: 'Flags typed by hand get forgotten. This file records the app name, cluster size, memory limits, environment and log paths, so any teammate can deploy identically.',
        code: `cd ~/apps/my-api
nano ecosystem.config.cjs`,
        file: {
          path: '~/apps/my-api/ecosystem.config.cjs',
          content: `module.exports = {
  apps: [
    {
      name: 'my-api',
      script: './server.js',
      cwd: '/home/ubuntu/apps/my-api',

      // 'cluster' uses every CPU core; use 'fork' for a single instance
      exec_mode: 'cluster',
      instances: 'max',

      // Restart if the app leaks past 400 MB
      max_memory_restart: '400M',

      // Give up if it crashes 10 times in a row (stops infinite loops)
      max_restarts: 10,
      restart_delay: 4000,

      // Never watch files in production — it restarts on log writes
      watch: false,

      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      error_file: '/home/ubuntu/logs/my-api.err.log',
      out_file: '/home/ubuntu/logs/my-api.out.log',
      time: true,
    },
  ],
}`,
          save: 'Ctrl + O → Enter → Ctrl + X. Then start from it: pm2 delete my-api && pm2 start ecosystem.config.cjs',
          lines: [
            { key: '.cjs extension', meaning: 'Required when your package.json has "type": "module" — PM2 config uses CommonJS.' },
            { key: 'exec_mode: cluster + instances: max', meaning: 'Runs one worker per CPU core with built-in load balancing. Only safe if your app is stateless (no in-memory sessions).' },
            { key: 'max_memory_restart', meaning: 'A leak restarts one worker instead of freezing the whole server.' },
            { key: 'max_restarts / restart_delay', meaning: 'Backs off instead of hammering a broken app thousands of times per minute.' },
            { key: 'env', meaning: 'Variables injected at start. Secrets still belong in .env — keep them out of this committed file.' },
            { key: 'time: true', meaning: 'Prefixes every log line with a timestamp. You will want this.' },
          ],
        },
        note:
          'Loading .env: either import "dotenv/config" at the top of server.js, or start Node with --env-file=.env. PM2 does not read .env by itself.',
      },
      {
        title: 'Survive a reboot',
        why: 'This is the step people skip. Without it, a server restart at any hour leaves your site down until someone SSHs in manually.',
        code: `pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# PM2 prints a sudo env PATH=... command — copy and run it exactly`,
        explain: [
          { part: 'pm2 save', meaning: 'Snapshots the current process list to ~/.pm2/dump.pm2.' },
          { part: 'pm2 startup', meaning: 'Prints the systemd command that registers PM2 as a boot service. It does not run it for you.' },
        ],
        check: 'Reboot with sudo reboot, wait a minute, SSH back in and run pm2 list — the app should already be online.',
        note: 'Every time you change the process list permanently, run pm2 save again, or the reboot will restore the old set.',
      },
      {
        title: 'Add log rotation',
        why: 'Unrotated PM2 logs are a classic cause of "the server suddenly stopped working" — the disk filled with a year of console output.',
        code: `pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true`,
        explain: [
          { part: 'max_size 10M', meaning: 'Start a new file once the current one hits 10 MB.' },
          { part: 'retain 14', meaning: 'Keep 14 old files and delete the rest.' },
          { part: 'compress true', meaning: 'Gzip the rotated files to save space.' },
        ],
        check: 'df -h shows plenty of free space, and ~/.pm2/logs/ contains .gz archives.',
      },
      {
        title: 'Deploy an update with zero downtime',
        why: 'In cluster mode PM2 can replace workers one at a time, so requests are served throughout. This is your normal deploy routine from now on.',
        code: `cd ~/apps/my-api
git pull origin main
npm ci --omit=dev
pm2 reload ecosystem.config.cjs --update-env
pm2 logs my-api --lines 50`,
        explain: [
          { part: 'pm2 reload', meaning: 'Rolling restart — old worker keeps serving until the new one is ready.' },
          { part: '--update-env', meaning: 'Re-reads environment variables. Without it, edits to .env are ignored.' },
          { part: 'pm2 logs … --lines 50', meaning: 'Watch the first moments after deploy so you catch a bad release immediately.' },
        ],
        note: 'In fork mode (single instance) reload behaves like restart — there is a brief gap. Cluster mode is what makes it truly seamless.',
      },
      {
        title: 'Keep an eye on it',
        why: 'A quick habit that catches memory leaks and restart loops long before users complain.',
        code: `pm2 monit             # live CPU/memory dashboard
pm2 show my-api       # everything about one process
pm2 describe my-api   # same, with the resolved config`,
        check: 'Restart count stays flat over days and memory does not climb steadily upward.',
        note: 'A restart count that grows by itself always means unhandled crashes — the reason is in the error log.',
      },
    ],
  },
  troubleshooting: [
    {
      problem: 'App shows "errored" and restarts climb fast',
      cause: 'It crashes at startup — usually a missing env var, an occupied port, or a database it cannot reach.',
      fix: 'pm2 logs my-api --err --lines 100. Fix the cause, then pm2 restart my-api.',
    },
    {
      problem: 'Everything is gone after a reboot',
      cause: 'pm2 startup was never run, or pm2 save was not repeated after the last change.',
      fix: 'Run pm2 startup, execute the sudo command it prints, then pm2 save.',
    },
    {
      problem: 'Environment changes are ignored',
      cause: 'PM2 reuses the environment captured when the process first started.',
      fix: 'pm2 restart my-api --update-env, or pm2 delete my-api && pm2 start ecosystem.config.cjs.',
    },
    {
      problem: 'Port already in use (EADDRINUSE)',
      cause: 'An old instance is still running, or cluster mode is fighting over a hard-coded port.',
      fix: 'pm2 delete all, confirm with sudo ss -tulpn | grep 5000, then start again.',
    },
    {
      problem: 'Disk full on a small instance',
      cause: 'PM2 logs grew without limit.',
      fix: 'pm2 flush now, then install pm2-logrotate so it cannot happen again.',
    },
    {
      problem: 'pm2: command not found (only for root / after reboot)',
      cause: 'PM2 was installed under an nvm Node version that root does not see.',
      fix: 'Use the full path PM2 printed during pm2 startup, or install Node system-wide for the service user.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Linux                                                              */
/* ------------------------------------------------------------------ */
const linux = {
  beginner: {
    simple:
      'Linux is the operating system almost every server runs. There is no desktop — you type commands and press Enter. Each command is a small tool that does one job: list files, copy something, install a program, show what is running. Learning about fifteen of them covers nearly everything you do on a server.',
    analogy:
      'Windows Explorer shows you folders and you click. Linux shows you a prompt and you describe what you want in words. Same filing cabinet, different way of opening the drawers.',
    before: [
      'A server to practise on — an EC2 instance, a VPS, or WSL on Windows.',
      'Nothing else. Everything below runs on a stock Ubuntu machine.',
    ],
  },
  diagram: 'linux',
  glossary: [
    { term: 'Shell / bash', meaning: 'The program reading your commands. The $ (or #) at the start of a line is its prompt.' },
    { term: '~ (tilde)', meaning: 'Shorthand for your home folder, e.g. /home/ubuntu.' },
    { term: 'root', meaning: 'The all-powerful admin account. sudo runs a single command as root.' },
    { term: 'Path', meaning: 'Absolute paths start with / (from the disk root); relative paths start from where you currently are.' },
    { term: 'Permissions (rwx)', meaning: 'Read, write, execute — set separately for the owner, the group and everyone else.' },
    { term: 'Process', meaning: 'A running program, identified by a PID number.' },
    { term: 'systemd / service', meaning: 'The manager that starts programs at boot and restarts them if they die.' },
    { term: 'Pipe |', meaning: 'Sends the output of one command into the next, e.g. ps aux | grep node.' },
  ],
  walkthrough: {
    title: 'The server survival course',
    intro:
      'Work through these in order on a test machine. By the end you can navigate, edit files, control services, manage users and diagnose a server that is misbehaving.',
    steps: [
      {
        title: 'Find your way around',
        why: 'Almost every mistake beginners make comes from running a command in the wrong folder. These four tell you where you are and what is there.',
        code: `pwd                 # print working directory — where am I?
ls -lah             # list everything, human-readable sizes, including hidden files
cd /var/log         # move to a folder
cd ~                # jump back to your home folder
cd ..               # go up one level`,
        explain: [
          { part: '-l', meaning: 'Long format: permissions, owner, size, modified date.' },
          { part: '-a', meaning: 'Show hidden files — anything starting with a dot, like .env or .gitignore.' },
          { part: '-h', meaning: 'Human-readable sizes (4.0K, 12M) instead of raw bytes.' },
        ],
        note: 'Press Tab to auto-complete file names, and the ↑ arrow to bring back previous commands. These two save more time than anything else.',
      },
      {
        title: 'Create, view and edit files',
        why: 'Server work is mostly editing config files. nano is the friendly editor — its shortcuts are printed along the bottom of the screen.',
        code: `touch notes.txt              # create an empty file
nano notes.txt               # open it in the editor
cat notes.txt                # print the whole file
less /var/log/syslog         # scroll a big file (q to quit)
tail -n 50 -f app.log        # last 50 lines, then follow live
cp notes.txt notes.bak       # copy
mv notes.txt archive/        # move or rename
rm notes.bak                 # delete (there is no recycle bin)`,
        explain: [
          { part: 'nano', meaning: 'Type normally. Ctrl + O writes the file, Enter confirms the name, Ctrl + X exits. Ctrl + W searches.' },
          { part: 'tail -f', meaning: 'Keeps printing new lines as they are written — the standard way to watch logs while reproducing a bug.' },
          { part: 'rm', meaning: 'Permanent and immediate. Never run rm -rf on a path you have not double-checked.' },
        ],
        note: 'Editing a file under /etc? Open it with sudo nano, otherwise you will type a full config and only discover at save time that it is read-only.',
      },
      {
        title: 'Create a config file without an editor',
        why: 'In deploy scripts you cannot open nano interactively. A heredoc writes a multi-line file in one command, which is how automated setups create .env files.',
        code: `cat > ~/apps/my-api/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/myapp
JWT_SECRET=replace-me
EOF

chmod 600 ~/apps/my-api/.env
cat ~/apps/my-api/.env`,
        explain: [
          { part: "<< 'EOF'", meaning: 'Everything until the line EOF becomes the file content. The quotes stop the shell from expanding $variables inside.' },
          { part: '>', meaning: 'Overwrites the file. Use >> to append instead.' },
          { part: 'chmod 600', meaning: 'Owner can read and write; nobody else can even read it. Correct for any file holding secrets.' },
        ],
        check: 'cat prints back exactly what you typed, with no shell substitution.',
      },
      {
        title: 'Understand permissions and ownership',
        why: '"Permission denied" and "403 Forbidden" are the same problem wearing different clothes. Reading the rwx block tells you instantly who may do what.',
        code: `ls -l deploy.sh
# -rwxr-xr-- 1 ubuntu www-data 812 Aug  5 10:12 deploy.sh

chmod +x deploy.sh                       # make it executable
chmod 600 .env                           # private to the owner
sudo chown -R www-data:www-data /var/www # hand a folder to the web server`,
        explain: [
          { part: 'First character', meaning: '- is a file, d is a directory, l is a symlink.' },
          { part: 'Next three (rwx)', meaning: 'What the owner may do.' },
          { part: 'Middle three (r-x)', meaning: 'What members of the group may do.' },
          { part: 'Last three (r--)', meaning: 'What everyone else may do.' },
          { part: 'Numbers', meaning: 'r=4, w=2, x=1 added together. 600 = rw-------, 644 = rw-r--r--, 755 = rwxr-xr-x.' },
        ],
        note: 'chmod 777 makes a file writable by anyone on the machine. It "fixes" things by removing all protection — find the real owner instead.',
      },
      {
        title: 'Install and manage software',
        why: 'Package managers handle downloads, dependencies and updates. Compiling from source should be a last resort.',
        code: `sudo apt update                  # refresh the package catalogue
sudo apt upgrade -y              # install available updates
sudo apt install -y htop unzip   # install packages
apt list --installed | grep nginx
sudo apt remove nginx            # uninstall, keep config
sudo apt autoremove              # clean up unused dependencies`,
        explain: [
          { part: 'apt update vs upgrade', meaning: 'update only refreshes the list of what exists; upgrade actually installs. Running upgrade without update installs stale versions.' },
          { part: '-y', meaning: 'Auto-confirm prompts — necessary in scripts.' },
        ],
        note: 'On Amazon Linux, RHEL or Fedora the equivalent is sudo dnf install (older systems: yum).',
      },
      {
        title: 'See what is running and stop it',
        why: 'When the site is slow or a port is taken, you need to identify the culprit process and end it.',
        code: `htop                          # interactive live view (q to quit)
ps aux | grep node            # find node processes
sudo ss -tulpn | grep :5000   # which process owns port 5000
kill 4821                     # ask process 4821 to shut down cleanly
kill -9 4821                  # force it (last resort)`,
        explain: [
          { part: 'ps aux', meaning: 'A snapshot of every process with its PID, CPU and memory use.' },
          { part: '| grep node', meaning: 'Filters that list down to lines containing "node".' },
          { part: 'ss -tulpn', meaning: 'TCP+UDP listening sockets with the owning program — the fastest way to solve "port already in use".' },
          { part: 'kill -9', meaning: 'Cannot be ignored by the process, but gives it no chance to flush data. Try plain kill first.' },
        ],
      },
      {
        title: 'Run your own program as a service',
        why: 'systemd is what keeps things running after a reboot. Even if you use PM2 for Node, you will meet this file format for every other daemon.',
        code: `sudo nano /etc/systemd/system/myworker.service`,
        file: {
          path: '/etc/systemd/system/myworker.service',
          content: `[Unit]
Description=My background worker
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/apps/my-api
EnvironmentFile=/home/ubuntu/apps/my-api/.env
ExecStart=/home/ubuntu/.nvm/versions/node/v20.11.0/bin/node worker.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`,
          save: 'Ctrl + O → Enter → Ctrl + X, then activate it:\nsudo systemctl daemon-reload\nsudo systemctl enable --now myworker\nsudo systemctl status myworker',
          lines: [
            { key: 'After=network.target', meaning: 'Do not start until networking is up.' },
            { key: 'User=ubuntu', meaning: 'Run as a normal user, not root. Services should have the least privilege they can work with.' },
            { key: 'EnvironmentFile', meaning: 'Loads KEY=value lines from your .env. Note: systemd does not support quotes the way bash does.' },
            { key: 'ExecStart', meaning: 'Must be an absolute path — systemd has no PATH like your shell. Find yours with: which node' },
            { key: 'Restart=always', meaning: 'Bring it back whenever it exits, with a 5-second pause between attempts.' },
            { key: 'WantedBy=multi-user.target', meaning: 'What makes "enable" start it at boot.' },
          ],
        },
        check: 'sudo systemctl status myworker shows active (running); sudo journalctl -u myworker -f streams its logs.',
        note: 'Edited the file? You must run sudo systemctl daemon-reload before restarting, or systemd keeps using the old version.',
      },
      {
        title: 'Check disk, memory and add swap',
        why: 'Small servers run out of RAM during npm install and out of disk from logs. These commands diagnose both, and swap prevents the first.',
        code: `df -h                 # free disk space per mount
du -sh ~/apps/*       # what is using space in a folder
free -h               # RAM and swap in use

# Add 2 GB of swap, permanently
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`,
        explain: [
          { part: 'df -h', meaning: 'If the / row shows 100%, that alone explains most "everything is broken" symptoms.' },
          { part: 'du -sh', meaning: 'Summarised size of each item — how you find the folder eating the disk.' },
          { part: 'tee -a /etc/fstab', meaning: 'Appends the line as root so the swap file is remounted after every reboot.' },
        ],
        check: 'free -h now shows a Swap row with 2.0Gi total.',
      },
      {
        title: 'Close the doors: firewall basics',
        why: 'Every open port is a door. ufw is the simple front-end to the Linux firewall, and takes about thirty seconds to set up properly.',
        code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose`,
        explain: [
          { part: 'default deny incoming', meaning: 'Block everything, then allow only what you name — the correct order.' },
          { part: 'allow OpenSSH', meaning: 'Do this BEFORE enable, or you will lock yourself out of your own server.' },
          { part: "'Nginx Full'", meaning: 'A named profile covering both port 80 and 443.' },
        ],
        note: 'On a cloud provider you now have two firewalls (ufw and the security group). Traffic must be allowed by both.',
      },
      {
        title: 'Schedule a job with cron',
        why: 'Backups, cleanups and report emails should run on a timer, not when you remember. cron is the built-in scheduler.',
        code: `crontab -e      # opens your personal schedule (choose nano if asked)`,
        file: {
          path: 'crontab entry (saved automatically when you exit the editor)',
          label: 'your schedule',
          content: `# m  h  dom mon dow   command
  0  2   *   *   *    /home/ubuntu/scripts/backup.sh >> /home/ubuntu/logs/backup.log 2>&1
  */5 *   *   *   *    /usr/bin/curl -fsS https://api.myapp.com/health > /dev/null`,
          save: 'Save in nano with Ctrl + O → Enter → Ctrl + X. cron installs the new schedule immediately and prints "crontab: installing new crontab".',
          lines: [
            { key: 'Five fields', meaning: 'minute, hour, day-of-month, month, day-of-week. An asterisk means "every".' },
            { key: '0 2 * * *', meaning: 'Every day at 02:00.' },
            { key: '*/5 * * * *', meaning: 'Every five minutes.' },
            { key: '>> file 2>&1', meaning: 'Append both normal output and errors to a log — without this, failures are invisible.' },
            { key: 'Absolute paths', meaning: 'cron runs with a minimal PATH, so always write /usr/bin/curl rather than curl.' },
          ],
        },
        check: 'crontab -l lists your jobs; grep CRON /var/log/syslog shows them firing.',
      },
      {
        title: 'Diagnose a misbehaving server',
        why: 'A repeatable order of checks turns panic into a two-minute routine.',
        code: `uptime                          # load average and how long it has been up
df -h                           # is the disk full?
free -h                         # is RAM exhausted?
sudo journalctl -xe             # recent system errors
sudo journalctl -u nginx -n 100 # last 100 lines for one service
sudo tail -f /var/log/nginx/error.log
dmesg -T | tail -20             # kernel messages, e.g. the OOM killer`,
        explain: [
          { part: 'uptime load average', meaning: 'Three numbers = 1, 5 and 15-minute averages. Sustained values above your CPU count mean the machine is saturated.' },
          { part: 'journalctl -u <service>', meaning: 'Logs for exactly one systemd service instead of everything.' },
          { part: 'dmesg | tail', meaning: 'Shows if the kernel killed your process for using too much memory ("Out of memory: Killed process").' },
        ],
      },
    ],
  },
  troubleshooting: [
    {
      problem: 'Permission denied when saving a file',
      cause: 'The file belongs to root and you opened the editor as a normal user.',
      fix: 'Reopen with sudo nano <file>. In vim you can also use :w !sudo tee % to save without reopening.',
    },
    {
      problem: 'command not found after installing something',
      cause: 'It installed to a folder not in your PATH, or the shell has cached the old lookup.',
      fix: 'Run hash -r, or find it with which/whereis and call it by absolute path.',
    },
    {
      problem: 'No space left on device',
      cause: 'Logs, old kernels or Docker images filled the disk.',
      fix: 'df -h to confirm, sudo du -sh /var/* to locate, then clear logs (sudo journalctl --vacuum-time=7d) and sudo apt autoremove.',
    },
    {
      problem: 'The process was killed on its own',
      cause: 'The kernel out-of-memory killer chose the biggest process.',
      fix: 'Confirm with dmesg -T | grep -i oom, then add swap or move to a larger instance.',
    },
    {
      problem: 'Locked out after enabling the firewall',
      cause: 'ufw enable ran before allowing SSH.',
      fix: 'Use the cloud provider’s serial/EC2 Instance Connect console to get in and run sudo ufw allow OpenSSH. Always allow SSH first.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Git                                                                */
/* ------------------------------------------------------------------ */
const git = {
  beginner: {
    simple:
      'Git records the history of your project. Every time you finish a piece of work you take a snapshot (a commit) with a short message. You can look back at any snapshot, compare them, undo one, or work on an experiment in a parallel copy (a branch) without touching the working version.',
    analogy:
      'It is "Save As" with a memory. Instead of report-final.doc, report-final-2.doc, report-FINAL-real.doc, you have one file and a labelled timeline of every version, plus the ability to merge two people’s edits.',
    before: [
      'Git installed: git --version. If missing, sudo apt install git (Linux) or download from git-scm.com (Windows/macOS).',
      'Any project folder — even a single file is enough to practise on.',
    ],
  },
  diagram: 'git',
  glossary: [
    { term: 'Repository (repo)', meaning: 'A project folder with a hidden .git directory holding its entire history.' },
    { term: 'Commit', meaning: 'One saved snapshot plus a message explaining why it changed.' },
    { term: 'Staging area', meaning: 'The waiting room. git add puts changes there; git commit saves whatever is in it — which is how you commit some files but not others.' },
    { term: 'Branch', meaning: 'A movable label on a line of commits. main is the official one; feature branches keep work-in-progress separate.' },
    { term: 'Remote / origin', meaning: 'A copy of the repo somewhere else, usually GitHub. origin is the default nickname for it.' },
    { term: 'Merge vs rebase', meaning: 'Merge joins two branches with a merge commit. Rebase replays your commits on top of the latest main for a straight-line history.' },
    { term: 'HEAD', meaning: 'A pointer to where you currently are — normally the tip of your checked-out branch.' },
    { term: 'Conflict', meaning: 'Two people changed the same lines. Git stops and asks you to choose; nothing is lost.' },
  ],
  walkthrough: {
    title: 'From an untracked folder to a clean team workflow',
    intro:
      'Steps 1–5 are the loop you will repeat daily. Steps 6–8 cover branching and the undo commands you will eventually need in a hurry.',
    steps: [
      {
        title: 'Tell Git who you are',
        why: 'Every commit is stamped with a name and email. Set them once, globally, or your history is signed by "unknown".',
        code: `git config --global user.name "Vivek Kumar Pandey"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --list --show-origin`,
        explain: [
          { part: '--global', meaning: 'Applies to every repo on this machine. Drop it inside a repo to override for that project only.' },
          { part: 'init.defaultBranch main', meaning: 'New repos start on main instead of master, matching GitHub.' },
          { part: 'pull.rebase true', meaning: 'Keeps history linear by replaying your commits on top instead of creating noisy merge commits on every pull.' },
        ],
        check: 'git config --list shows your name and email. These settings live in ~/.gitconfig.',
      },
      {
        title: 'Create the repository',
        why: 'git init creates the hidden .git folder that turns an ordinary directory into a tracked project.',
        code: `cd ~/projects/my-app
git init
git status`,
        check: 'git status prints "On branch main" and lists your files as Untracked.',
        note: 'Cloning an existing project instead? git clone <url> does init, download and remote setup in one step.',
      },
      {
        title: 'Write .gitignore before the first commit',
        why: 'This is the step that prevents disasters. Once secrets or node_modules are committed, removing them from history is painful — and a leaked key stays leaked.',
        code: `nano .gitignore`,
        file: {
          path: '~/projects/my-app/.gitignore',
          content: `# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Secrets — never commit these
.env
.env.*
!.env.example
*.pem
*.key

# Logs
logs/
*.log
npm-debug.log*

# OS / editor noise
.DS_Store
Thumbs.db
.vscode/
.idea/`,
          save: 'Ctrl + O → Enter → Ctrl + X. The file must sit in the repository root, and it is itself committed — everyone on the team shares it.',
          lines: [
            { key: 'node_modules/', meaning: 'Reinstallable from package.json. Committing it bloats the repo by hundreds of megabytes.' },
            { key: '.env', meaning: 'Real secrets. Keep a .env.example with dummy values so teammates know which keys exist.' },
            { key: '!.env.example', meaning: 'The ! un-ignores a file that an earlier pattern matched.' },
            { key: '*.pem / *.key', meaning: 'SSH and TLS private keys. Bots scan public GitHub for these within minutes of a push.' },
            { key: 'Trailing /', meaning: 'Marks a directory. Without it the pattern also matches files of that name.' },
          ],
        },
        check: 'git status no longer lists node_modules or .env.',
        note:
          'Already committed something secret? .gitignore will not remove it. Run git rm --cached .env, commit, and then rotate that credential — assume it is compromised.',
      },
      {
        title: 'The daily loop: status → add → commit',
        why: 'These three commands are 80% of Git. Staging first lets you split messy work into clean, reviewable commits.',
        code: `git status                  # what changed?
git diff                    # exactly which lines changed?
git add src/auth.js         # stage one file
git add .                   # stage everything (check status first!)
git commit -m "Add JWT login with refresh tokens"
git log --oneline -10       # the last ten commits`,
        explain: [
          { part: 'git diff', meaning: 'Unstaged changes. Use git diff --staged to review what is about to be committed.' },
          { part: 'git add .', meaning: 'Stages every change in the current folder — quick, but always run git status first so nothing unexpected slips in.' },
          { part: '-m "…"', meaning: 'The message. Write why, not what: "Fix timezone bug in invoices" beats "update file".' },
        ],
        note: 'Committed too early? git commit --amend folds new changes into the last commit — but only before you have pushed it.',
      },
      {
        title: 'Connect to GitHub and push',
        why: 'A local repo lives on one disk. Pushing gives you an off-site backup, collaboration and a deploy source.',
        code: `# One-time: create an SSH key so you never type a password
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub     # paste into GitHub → Settings → SSH keys
ssh -T git@github.com         # test it

git remote add origin git@github.com:your-username/my-app.git
git branch -M main
git push -u origin main`,
        explain: [
          { part: 'ssh-keygen -t ed25519', meaning: 'Creates a modern key pair. Press Enter three times to accept defaults (a passphrase is optional but wise).' },
          { part: 'remote add origin', meaning: 'Saves the GitHub URL under the nickname origin.' },
          { part: '-u origin main', meaning: 'Links your local main to the remote one, so later you can just type git push.' },
        ],
        check: 'ssh -T git@github.com replies "Hi username! You have successfully authenticated", and your code appears on github.com.',
      },
      {
        title: 'Work on a branch, then merge',
        why: 'Branches let you build a feature without risking the working version. Every team workflow — and every pull request — is built on this.',
        code: `git switch -c feature/payments   # create and move to a new branch
# …edit, add, commit as usual…
git push -u origin feature/payments

git switch main
git pull                          # get the latest main
git merge feature/payments
git branch -d feature/payments    # delete the merged branch`,
        explain: [
          { part: 'switch -c', meaning: 'The modern replacement for git checkout -b — same thing, clearer name.' },
          { part: 'git pull before merge', meaning: 'Merging into a stale main is how you resurrect bugs somebody already fixed.' },
          { part: 'branch -d', meaning: 'Deletes only if merged. -D forces deletion of unmerged work — use carefully.' },
        ],
        note: 'Name branches by intent: feature/…, fix/…, chore/…. Future you will read the branch list like a changelog.',
      },
      {
        title: 'Resolve a merge conflict',
        why: 'Conflicts feel alarming the first time. They are just Git saying "two versions of these lines exist, pick one" — nothing is lost and nothing is broken.',
        code: `git merge feature/payments
# CONFLICT (content): Merge conflict in src/checkout.js

nano src/checkout.js       # edit the marked section, keep what you want
git add src/checkout.js
git commit                 # completes the merge
# or, to abandon it entirely:
git merge --abort`,
        explain: [
          { part: '<<<<<<< HEAD', meaning: 'Everything below this marker is the version already on your branch.' },
          { part: '=======', meaning: 'The dividing line between the two versions.' },
          { part: '>>>>>>> feature/payments', meaning: 'End of the incoming version. Delete all three markers once you have merged the code by hand.' },
        ],
        check: 'git status shows no unmerged paths, and the file contains no <<<<<<< markers left behind.',
      },
      {
        title: 'Undo things safely',
        why: 'Knowing these four before you need them turns a scary moment into a ten-second fix.',
        code: `git restore src/app.js            # discard uncommitted changes in a file
git restore --staged src/app.js   # unstage but keep the edits
git revert a1b2c3d                # new commit that undoes an old one (safe on shared branches)
git reset --soft HEAD~1           # undo the last commit, keep the changes staged
git reflog                        # the safety net: every position HEAD has held`,
        explain: [
          { part: 'revert vs reset', meaning: 'revert adds a commit that reverses another — safe after pushing. reset rewrites history — only for commits nobody else has.' },
          { part: '--soft HEAD~1', meaning: 'Moves the branch back one commit but leaves your files exactly as they are. Perfect for fixing a bad commit message or splitting a commit.' },
          { part: 'git reflog', meaning: 'Even "lost" commits are here for ~90 days. git reset --hard <hash-from-reflog> brings them back.' },
        ],
        note: 'git reset --hard deletes uncommitted work permanently. Stash first (git stash) if you are unsure.',
      },
      {
        title: 'Park work in progress with stash',
        why: 'A production bug always arrives mid-feature. Stash puts your half-finished work aside without committing junk.',
        code: `git stash push -m "half-done payments UI"
git switch main && git pull
# …fix the urgent bug, commit, push…
git switch feature/payments
git stash pop`,
        explain: [
          { part: 'stash push -m', meaning: 'Saves tracked changes with a label and returns the folder to a clean state.' },
          { part: 'stash pop', meaning: 'Reapplies the most recent stash and removes it from the list. Use git stash list to see them all.' },
        ],
        note: 'Stash ignores untracked files by default — add -u if your new files should go along too.',
      },
    ],
  },
  troubleshooting: [
    {
      problem: 'Updates were rejected because the remote contains work you do not have',
      cause: 'Someone pushed while you were working.',
      fix: 'git pull --rebase then push again. Never "fix" it with --force on a shared branch.',
    },
    {
      problem: 'A secret was committed and pushed',
      cause: '.env or a key was added before .gitignore existed.',
      fix: 'Rotate the credential immediately — that matters more than the cleanup. Then git rm --cached the file, commit, and scrub history with git filter-repo if the repo is public.',
    },
    {
      problem: 'node_modules is in every diff',
      cause: 'It was committed before being ignored; .gitignore does not apply to already-tracked files.',
      fix: 'git rm -r --cached node_modules && git commit -m "Stop tracking node_modules".',
    },
    {
      problem: 'Detached HEAD state',
      cause: 'You checked out a commit hash or tag instead of a branch.',
      fix: 'Nothing is broken. git switch main to return; git switch -c newbranch to keep work you did there.',
    },
    {
      problem: 'Wrong author on commits',
      cause: 'user.email was never configured, or a work/personal mix-up.',
      fix: 'Set it, then for the last commit: git commit --amend --reset-author.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  GitHub                                                             */
/* ------------------------------------------------------------------ */
const github = {
  beginner: {
    simple:
      'Git lives on your computer; GitHub is where that history is hosted online. It adds the collaboration layer on top: a page for every project, pull requests where changes are reviewed before merging, issues for tracking work, and Actions — servers that automatically test and deploy your code every time you push.',
    analogy:
      'Git is the track-changes feature in a document. GitHub is the shared drive plus the review meeting, the to-do list and the assistant who publishes the final copy for you.',
    before: [
      'A GitHub account and Git configured locally (see the Git guide).',
      'An SSH key added to your account, so pushes do not ask for a password.',
      'Optional but recommended: the gh CLI — most of this becomes one-liners.',
    ],
  },
  diagram: 'github',
  glossary: [
    { term: 'Repository', meaning: 'One project on GitHub: code, history, issues and settings.' },
    { term: 'Fork', meaning: 'Your own copy of somebody else’s repo, used to contribute to projects you cannot push to.' },
    { term: 'Pull request (PR)', meaning: 'A proposal to merge one branch into another, with a diff, discussion and checks attached.' },
    { term: 'Review / approval', meaning: 'A teammate reading the PR and marking it approved or requesting changes.' },
    { term: 'Actions / workflow', meaning: 'Automation defined in YAML files under .github/workflows/, run by GitHub on their machines.' },
    { term: 'Runner', meaning: 'The virtual machine executing a workflow job, e.g. ubuntu-latest.' },
    { term: 'Secret', meaning: 'An encrypted value (SSH key, token) stored in repo settings and injected into workflows — never written in code.' },
    { term: 'Branch protection', meaning: 'A rule stopping direct pushes to main, requiring a PR and passing checks first.' },
  ],
  walkthrough: {
    title: 'Publish a project, review changes properly, and auto-deploy',
    intro:
      'Steps 1–3 get code online. Steps 4–5 are how teams actually work. Steps 6–8 build the pipeline that deploys to your EC2 server on every push to main.',
    steps: [
      {
        title: 'Authenticate once',
        why: 'GitHub stopped accepting account passwords for Git operations. SSH keys (or the gh CLI) replace them and never expire mid-deploy.',
        code: `# Option A — SSH
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub    # copy into github.com → Settings → SSH and GPG keys → New SSH key
ssh -T git@github.com

# Option B — GitHub CLI (also handles PRs, issues, releases)
gh auth login
gh auth status`,
        check: 'ssh -T prints "Hi <username>! You have successfully authenticated"; gh auth status shows a logged-in account.',
        note: 'On a server, prefer a repository deploy key (read-only) over your personal key — it limits the damage if the server is compromised.',
      },
      {
        title: 'Create the repository and push',
        why: 'This publishes your local history. Do it after .gitignore exists, so secrets never make the trip.',
        code: `gh repo create my-app --private --source=. --remote=origin --push

# Without the CLI: create the repo on github.com, then
git remote add origin git@github.com:your-username/my-app.git
git branch -M main
git push -u origin main`,
        explain: [
          { part: '--private', meaning: 'Start private. You can flip to public later; you cannot un-publish what search engines already indexed.' },
          { part: '--source=.', meaning: 'Use the current folder as the repository content.' },
          { part: '--push', meaning: 'Upload the existing commits immediately.' },
        ],
        check: 'The repo page shows your files and commit history.',
      },
      {
        title: 'Write a README that explains itself',
        why: 'It is the first thing anyone sees — a recruiter, a teammate, or you in six months. A repo without setup instructions is a repo nobody can run.',
        code: `nano README.md`,
        file: {
          path: 'README.md',
          content: `# My App

Short one-line description of what this does and who it is for.

## Tech stack
React (Vite) · Node/Express · MongoDB · Nginx · PM2 on AWS EC2

## Getting started
\`\`\`bash
git clone git@github.com:your-username/my-app.git
cd my-app
npm install
cp .env.example .env     # then fill in the values
npm run dev
\`\`\`

## Environment variables
| Key | Description |
| --- | --- |
| \`PORT\` | Port the API listens on (default 5000) |
| \`MONGODB_URI\` | MongoDB connection string |
| \`JWT_SECRET\` | Secret used to sign auth tokens |

## Deployment
Pushes to \`main\` trigger the GitHub Actions workflow, which SSHes into the
EC2 instance, pulls, installs and reloads PM2.`,
          save: 'Ctrl + O → Enter → Ctrl + X, then: git add README.md && git commit -m "Add README" && git push',
          lines: [
            { key: 'Triple backticks', meaning: 'Wrap commands in a fenced code block so they render with a copy button.' },
            { key: 'Environment table', meaning: 'Documents every key in .env.example without revealing a single real value.' },
            { key: 'Getting started', meaning: 'If someone cannot go from clone to running in four commands, the README is not finished.' },
          ],
        },
      },
      {
        title: 'Protect the main branch',
        why: 'Without this, anyone (including you at midnight) can push broken code straight to production. Protection forces changes through a PR with passing checks.',
        ui: [
          'Repo → Settings → Branches → Add branch protection rule.',
          'Branch name pattern: main.',
          'Tick "Require a pull request before merging" (1 approval for a team).',
          'Tick "Require status checks to pass" and select your CI workflow once it has run at least once.',
          'Tick "Require conversation resolution before merging".',
        ],
        check: 'A direct git push origin main is now rejected with "protected branch hook declined".',
      },
      {
        title: 'The pull request workflow',
        why: 'A PR is where the diff, the discussion, the automated tests and the approval all live together. It is the unit of work in every team.',
        code: `git switch -c feature/invoices
# …commit your work…
git push -u origin feature/invoices

gh pr create --title "Add invoice PDF export" --body "Closes #42" --base main
gh pr checks          # are the CI runs green?
gh pr view --web      # open it in the browser
gh pr merge --squash --delete-branch`,
        explain: [
          { part: '--body "Closes #42"', meaning: 'Linking an issue number closes it automatically when the PR merges.' },
          { part: 'gh pr checks', meaning: 'Shows the status of every workflow attached to the PR from the terminal.' },
          { part: '--squash', meaning: 'Collapses all the PR commits into one tidy commit on main.' },
          { part: '--delete-branch', meaning: 'Cleans up the branch on both remote and local so the branch list stays short.' },
        ],
        note: 'Keep PRs small. A 200-line PR gets a real review; a 2000-line PR gets an "LGTM".',
      },
      {
        title: 'Add CI: test every push automatically',
        why: 'The cheapest way to stop broken code reaching main. GitHub runs this on their machines, for free on public repos and with a generous free tier on private ones.',
        code: `mkdir -p .github/workflows
nano .github/workflows/ci.yml`,
        file: {
          path: '.github/workflows/ci.yml',
          content: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Test
        run: npm test --if-present

      - name: Build
        run: npm run build --if-present`,
          save: 'Ctrl + O → Enter → Ctrl + X, then commit and push. The run appears immediately under the Actions tab.',
          lines: [
            { key: 'on: push / pull_request', meaning: 'When to run: pushes to main, and every PR.' },
            { key: 'runs-on: ubuntu-latest', meaning: 'A clean virtual machine, created fresh for each run and destroyed afterwards.' },
            { key: 'actions/checkout@v4', meaning: 'Downloads your repository onto the runner. Nearly every workflow starts with it.' },
            { key: "cache: 'npm'", meaning: 'Caches the npm download folder between runs, typically halving install time.' },
            { key: 'npm ci', meaning: 'Installs exactly what the lock file says — reproducible, unlike npm install.' },
            { key: 'YAML indentation', meaning: 'Two spaces, never tabs. A tab is the most common reason a workflow refuses to start.' },
          ],
        },
        check: 'The Actions tab shows a green tick next to your commit.',
      },
      {
        title: 'Store deploy secrets',
        why: 'The deploy workflow needs your server’s SSH key. Secrets are encrypted, hidden from logs, and never appear in the codebase.',
        ui: [
          'Repo → Settings → Secrets and variables → Actions → New repository secret.',
          'Add EC2_HOST — your server IP or domain.',
          'Add EC2_USER — usually ubuntu.',
          'Add EC2_SSH_KEY — paste the entire private key including the BEGIN and END lines.',
        ],
        code: `# Generate a deploy-only key on your machine, then authorise it on the server
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "github-actions"
ssh-copy-id -i ~/.ssh/deploy_key.pub ubuntu@13.235.10.20
cat ~/.ssh/deploy_key       # this private half goes into EC2_SSH_KEY`,
        note:
          'Use a dedicated deploy key, not your personal one. If it is ever exposed you revoke a single key instead of re-keying everything you own.',
      },
      {
        title: 'Auto-deploy to your server on merge',
        why: 'This closes the loop: merge a PR, and a minute later the change is live — no SSH, no forgotten step, no "it worked on my machine".',
        code: `nano .github/workflows/deploy.yml`,
        file: {
          path: '.github/workflows/deploy.yml',
          content: `name: Deploy to EC2

on:
  push:
    branches: [main]

# Never run two deploys at once
concurrency:
  group: production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.EC2_HOST }}
          username: \${{ secrets.EC2_USER }}
          key: \${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e
            cd /home/ubuntu/apps/my-api
            git pull origin main
            npm ci --omit=dev
            pm2 reload ecosystem.config.cjs --update-env
            pm2 save`,
          save: 'Ctrl + O → Enter → Ctrl + X, then commit and push to main. Watch it run live in the Actions tab.',
          lines: [
            { key: 'branches: [main]', meaning: 'Only merged code deploys — feature branches just run CI.' },
            { key: 'concurrency', meaning: 'Queues deploys instead of letting two overlap and corrupt the folder mid-install.' },
            { key: '${{ secrets.EC2_HOST }}', meaning: 'Reads the encrypted secret at run time. GitHub masks these values in the logs.' },
            { key: 'set -e', meaning: 'Abort the script at the first failing command, so a failed install never reaches pm2 reload.' },
            { key: 'pm2 reload … --update-env', meaning: 'Zero-downtime restart that also picks up environment changes.' },
          ],
        },
        check: 'Push to main, watch the job go green, then confirm on the server with pm2 list — the uptime resets.',
        note: 'Add "environment: production" to the job and enable required reviewers if you want a human to approve each deploy.',
      },
    ],
  },
  troubleshooting: [
    {
      problem: 'Support for password authentication was removed',
      cause: 'Pushing over HTTPS with an account password.',
      fix: 'Switch the remote to SSH (git remote set-url origin git@github.com:user/repo.git) or use a personal access token.',
    },
    {
      problem: 'Permission denied (publickey) when pushing',
      cause: 'The SSH key is not loaded or not added to your GitHub account.',
      fix: 'ssh-add ~/.ssh/id_ed25519, verify with ssh -T git@github.com, and confirm the public key is listed in Settings → SSH keys.',
    },
    {
      problem: 'The workflow does not run at all',
      cause: 'Wrong path or invalid YAML — the file must be at .github/workflows/*.yml on the default branch.',
      fix: 'Check spelling and indentation (spaces only). The Actions tab shows a parse error if the file was found but is malformed.',
    },
    {
      problem: 'Deploy fails with Host key verification failed',
      cause: 'The runner has never seen your server before.',
      fix: 'Most SSH actions handle this; if not, add a step running ssh-keyscan -H $HOST >> ~/.ssh/known_hosts.',
    },
    {
      problem: 'A secret shows as empty in the logs',
      cause: 'Secrets are not available to workflows triggered by pull requests from forks.',
      fix: 'Deploy only on push to main, and keep fork PRs limited to build/test steps.',
    },
    {
      problem: 'Cannot push to main',
      cause: 'Branch protection is doing exactly its job.',
      fix: 'Create a branch, open a PR, get the checks green and merge from there.',
    },
  ],
}

export const walkthroughs = {
  'AWS EC2': awsEc2,
  'AWS SES': awsSes,
  Nginx: nginx,
  PM2: pm2,
  Linux: linux,
  Git: git,
  GitHub: github,
}

export default walkthroughs
