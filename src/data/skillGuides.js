/* ------------------------------------------------------------------ *
 *  Skill technical reference guides                                    *
 *                                                                      *
 *  Shown in a modal when a skill card is clicked. Every command below  *
 *  is a real, currently-supported command from the official tooling    *
 *  (AWS CLI v2, Nginx, PM2, coreutils/systemd, Git, GitHub CLI).       *
 *                                                                      *
 *  Shape per skill:                                                    *
 *    { name, tagline, overview:{ what, why, useCases[] },              *
 *      categories:[{ name, commands:[                                  *
 *        { cmd, purpose, flags:[{flag,desc}], example, output, mistake }*
 *      ]}],                                                             *
 *      scenarios:[{ title, steps[] }],                                 *
 *      bestPractices:[{ group, items[] }] }                            *
 * ------------------------------------------------------------------ */

import { walkthroughs } from './skillWalkthroughs'
import { walkthroughsHi } from './skillWalkthroughs.hi'
import { overlay } from '../lib/overlay'

const awsEc2 = {
  name: 'AWS EC2',
  tagline: 'Elastic Compute Cloud — resizable virtual servers in the cloud',
  overview: {
    what: 'Amazon EC2 provides on-demand, resizable virtual machines (instances) running in AWS data centers. You choose the OS, CPU/RAM (instance type), storage, and networking, and pay only for what you use.',
    why: 'It removes the need to own physical hardware, scales up or down in minutes, and gives full root/SSH control of a production server — ideal for hosting Node.js APIs, databases, and full stack apps.',
    useCases: [
      'Hosting Node.js/Express backends and React frontends behind Nginx',
      'Running background jobs, cron tasks, and worker processes',
      'Self-managed databases (MongoDB) and cache servers',
      'Staging and production environments with reproducible configs',
    ],
  },
  categories: [
    {
      name: 'Installation & Configuration',
      commands: [
        {
          cmd: 'aws configure',
          purpose:
            'Set up the AWS CLI with your credentials, default region, and output format.',
          flags: [
            { flag: '--profile <name>', desc: 'Store settings under a named profile instead of default.' },
          ],
          example: 'aws configure --profile prod',
          output:
            'Prompts for Access Key ID, Secret Access Key, region (e.g. ap-south-1), and output format (json). Saved to ~/.aws/credentials and ~/.aws/config.',
          mistake:
            'Committing credentials to git. Never hard-code keys — use ~/.aws or IAM roles attached to the instance instead.',
        },
        {
          cmd: 'aws ec2 create-key-pair --key-name MyKey --query "KeyMaterial" --output text > MyKey.pem',
          purpose: 'Generate an SSH key pair used to log into instances.',
          flags: [
            { flag: '--key-name', desc: 'Name AWS stores the public key under.' },
            { flag: '--query "KeyMaterial"', desc: 'Extract just the private-key body from the JSON response.' },
            { flag: '--output text', desc: 'Print raw text (no quotes/JSON) so the .pem file is valid.' },
          ],
          example: 'aws ec2 create-key-pair --key-name MyKey --query "KeyMaterial" --output text > MyKey.pem',
          output: 'A private key is written to MyKey.pem. AWS keeps the matching public key.',
          mistake:
            'Forgetting to restrict the file: SSH refuses keys that are too open. Run chmod 400 MyKey.pem afterward.',
        },
      ],
    },
    {
      name: 'Process Management (Instances)',
      commands: [
        {
          cmd: 'aws ec2 run-instances --image-id <ami-id> --instance-type t3.micro --key-name MyKey --security-group-ids <sg-id>',
          purpose: 'Launch a new EC2 instance.',
          flags: [
            { flag: '--image-id', desc: 'The AMI (OS image) to boot, e.g. an Ubuntu or Amazon Linux AMI.' },
            { flag: '--instance-type', desc: 'Hardware size, e.g. t3.micro (free-tier eligible on t2/t3.micro).' },
            { flag: '--key-name', desc: 'Key pair used for SSH access.' },
            { flag: '--security-group-ids', desc: 'Firewall rules to attach.' },
          ],
          example: 'aws ec2 run-instances --image-id ami-0abcdef1234567890 --instance-type t3.micro --key-name MyKey --security-group-ids sg-0123456789',
          output: 'Returns JSON describing the new instance, including its InstanceId (i-xxxx).',
          mistake:
            'Using an AMI ID from another region — AMI IDs are region-specific and will fail if the region does not match.',
        },
        {
          cmd: 'aws ec2 start-instances --instance-ids <i-id>',
          purpose: 'Start a stopped instance.',
          flags: [{ flag: '--instance-ids', desc: 'One or more instance IDs, space-separated.' }],
          example: 'aws ec2 start-instances --instance-ids i-0123456789abcdef0',
          output: 'Shows the previous ("stopped") and current ("pending") state of each instance.',
          mistake:
            'Expecting the public IP to stay the same — a non-Elastic public IP changes on every stop/start.',
        },
        {
          cmd: 'aws ec2 stop-instances --instance-ids <i-id>',
          purpose: 'Stop a running instance (halts billing for compute, keeps the disk).',
          flags: [{ flag: '--instance-ids', desc: 'Instance IDs to stop.' }],
          example: 'aws ec2 stop-instances --instance-ids i-0123456789abcdef0',
          output: 'Reports transition from "running" to "stopping".',
          mistake:
            'Confusing stop with terminate — terminate deletes the instance and its default volume permanently.',
        },
        {
          cmd: 'aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"',
          purpose: 'List instances and their details.',
          flags: [
            { flag: '--filters', desc: 'Narrow results (by state, tag, type, etc.).' },
            { flag: '--instance-ids', desc: 'Query specific instances instead of all.' },
          ],
          example: 'aws ec2 describe-instances --instance-ids i-0123456789abcdef0',
          output: 'Detailed JSON: public/private IPs, state, tags, security groups, volumes.',
          mistake:
            'Piping huge JSON output and reading it by eye — add --query for the fields you need, e.g. --query "Reservations[].Instances[].PublicIpAddress".',
        },
      ],
    },
    {
      name: 'Deployment (SSH Access)',
      commands: [
        {
          cmd: 'chmod 400 MyKey.pem',
          purpose: 'Lock the private key so only you can read it (required by SSH).',
          flags: [{ flag: '400', desc: 'Read-only for the owner, no access for others.' }],
          example: 'chmod 400 MyKey.pem',
          output: 'No output on success.',
          mistake: 'Skipping this — SSH aborts with an "UNPROTECTED PRIVATE KEY FILE" error.',
        },
        {
          cmd: 'ssh -i MyKey.pem ubuntu@<public-ip>',
          purpose: 'Open a remote shell on the instance.',
          flags: [
            { flag: '-i', desc: 'Path to the private key.' },
            { flag: 'ubuntu@', desc: 'Default user for Ubuntu AMIs (use ec2-user for Amazon Linux).' },
          ],
          example: 'ssh -i MyKey.pem ubuntu@13.235.10.20',
          output: 'A shell prompt on the server, e.g. ubuntu@ip-172-31-x-x:~$.',
          mistake:
            'Using the wrong default user (ec2-user vs ubuntu vs admin) — it varies by AMI and causes "Permission denied".',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Deploy a Node.js API to a fresh instance',
      steps: [
        'Launch an instance with run-instances (or the console) and attach a security group allowing 22, 80, 443.',
        'chmod 400 the key, then SSH in with ssh -i key.pem ubuntu@<ip>.',
        'Install Node, clone the repo, npm install, then run the app under PM2.',
        'Put Nginx in front as a reverse proxy and add HTTPS with Certbot.',
      ],
    },
    {
      title: 'Reduce cost on non-production servers',
      steps: [
        'Stop staging instances overnight with aws ec2 stop-instances.',
        'Attach an Elastic IP if you need a stable address across restarts.',
        'Right-size: switch oversized instance types to t3.micro/small.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Never open port 22 to 0.0.0.0/0 — restrict SSH to your IP (x.x.x.x/32).',
        'Prefer IAM roles on the instance over storing AWS keys on disk.',
        'Keep the OS patched: sudo apt update && sudo apt upgrade regularly.',
      ],
    },
    {
      group: 'Performance',
      items: [
        'Choose the right instance family (t3 for burstable, c-series for CPU-bound).',
        'Use gp3 EBS volumes for a better price/performance ratio than gp2.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Use an Elastic IP or a load balancer so your address never changes.',
        'Enable automated EBS snapshots for backups.',
        'Tag instances (Name, Environment) so describe-instances stays readable.',
      ],
    },
  ],
}

const awsSes = {
  name: 'AWS SES',
  tagline: 'Simple Email Service — scalable transactional & bulk email',
  overview: {
    what: 'Amazon SES is a cloud email service for sending transactional and marketing email at scale using the AWS CLI, SDKs, or SMTP.',
    why: 'It delivers email reliably and cheaply without running your own mail server, with built-in deliverability tooling (DKIM, bounce/complaint handling).',
    useCases: [
      'Account verification, password reset, and OTP emails',
      'Order/enrollment confirmations from a CRM or EdTech platform',
      'Bulk notifications and newsletters',
    ],
  },
  categories: [
    {
      name: 'Configuration (Identities)',
      commands: [
        {
          cmd: 'aws ses verify-email-identity --email-address sender@example.com',
          purpose: 'Ask SES to verify a single sender email address.',
          flags: [{ flag: '--email-address', desc: 'The address to verify.' }],
          example: 'aws ses verify-email-identity --email-address noreply@myapp.com',
          output: 'No output on success; AWS emails a verification link to that address.',
          mistake:
            'Trying to send before clicking the link — unverified identities cannot send while in the sandbox.',
        },
        {
          cmd: 'aws sesv2 create-email-identity --email-identity example.com',
          purpose: 'Register a domain (or email) as a sending identity in SES v2.',
          flags: [{ flag: '--email-identity', desc: 'A domain or email address to verify.' }],
          example: 'aws sesv2 create-email-identity --email-identity myapp.com',
          output: 'Returns DKIM tokens/records you add to DNS to complete domain verification.',
          mistake:
            'Mixing up the APIs: aws ses is SES v1, aws sesv2 is the newer v2. v2 is preferred for new work and covers domains, config sets, and dedicated IPs more fully.',
        },
        {
          cmd: 'aws ses list-identities --identity-type EmailAddress',
          purpose: 'List verified emails or domains.',
          flags: [{ flag: '--identity-type', desc: 'Filter by EmailAddress or Domain.' }],
          example: 'aws ses list-identities',
          output: 'JSON array of identities, e.g. ["myapp.com", "noreply@myapp.com"].',
          mistake: 'Assuming a verified domain also verifies the sandbox recipient — in sandbox, recipients must be verified too.',
        },
      ],
    },
    {
      name: 'Deployment (Sending)',
      commands: [
        {
          cmd: 'aws ses send-email --from sender@example.com --destination "ToAddresses=to@example.com" --message "Subject={Data=Hi},Body={Text={Data=Hello}}"',
          purpose: 'Send a formatted email through SES v1.',
          flags: [
            { flag: '--from', desc: 'A verified sender address.' },
            { flag: '--destination', desc: 'ToAddresses / CcAddresses / BccAddresses.' },
            { flag: '--message', desc: 'Subject and Body (Text and/or Html).' },
          ],
          example: 'aws ses send-email --from noreply@myapp.com --destination "ToAddresses=user@test.com" --message "Subject={Data=Welcome},Body={Html={Data=<h1>Hi</h1>}}"',
          output: 'Returns a MessageId confirming SES accepted the message for delivery.',
          mistake:
            'Wrong shorthand syntax — the nested {Data=...} structure is strict; a missing brace makes the CLI reject it. Consider --cli-input-json for complex mails.',
        },
        {
          cmd: 'aws sesv2 send-email --from-email-address sender@example.com --destination ToAddresses=to@example.com --content "Simple={Subject={Data=Hi},Body={Text={Data=Hello}}}"',
          purpose: 'Send an email using the SES v2 API.',
          flags: [
            { flag: '--from-email-address', desc: 'Verified sender (v2 naming).' },
            { flag: '--destination', desc: 'Recipient addresses.' },
            { flag: '--content', desc: 'Simple or Raw or Template message content.' },
          ],
          example: 'aws sesv2 send-email --from-email-address noreply@myapp.com --destination ToAddresses=user@test.com --content "Simple={Subject={Data=Hi},Body={Text={Data=Hello}}}"',
          output: 'Returns a MessageId.',
          mistake: 'Using v1 flag names (--from) with the v2 command — v2 renames several parameters.',
        },
      ],
    },
    {
      name: 'Monitoring',
      commands: [
        {
          cmd: 'aws ses get-send-quota',
          purpose: 'Check your daily sending limit and current usage.',
          flags: [],
          example: 'aws ses get-send-quota',
          output: 'Max24HourSend, MaxSendRate (emails/sec), and SentLast24Hours.',
          mistake: 'Assuming unlimited sends — new accounts start in a sandbox with a low quota; request production access to lift it.',
        },
        {
          cmd: 'aws ses get-send-statistics',
          purpose: 'Retrieve delivery, bounce, complaint, and reject metrics.',
          flags: [],
          example: 'aws ses get-send-statistics',
          output: 'Time-bucketed data points with Bounces, Complaints, DeliveryAttempts, Rejects.',
          mistake: 'Ignoring bounce/complaint rates — high rates can get your account paused.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Wire SES into a Node.js backend',
      steps: [
        'Verify your domain with create-email-identity and add the DKIM DNS records.',
        'Request production access to leave the sandbox.',
        'Use the AWS SDK (or SMTP credentials) in the app to send transactional emails.',
        'Watch get-send-statistics and set up an SNS topic for bounces/complaints.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Authenticate mail with SPF, DKIM, and DMARC to improve deliverability and prevent spoofing.',
        'Scope IAM permissions to ses:SendEmail only, not full SES access.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Handle bounces and complaints via SNS and suppress bad addresses.',
        'Use configuration sets to track opens/clicks and route event data.',
        'Stay under your send rate — throttle bulk sends to MaxSendRate.',
      ],
    },
  ],
}

const nginx = {
  name: 'Nginx',
  tagline: 'High-performance web server, reverse proxy, and load balancer',
  overview: {
    what: 'Nginx is a fast web server that also acts as a reverse proxy, load balancer, and static-file server.',
    why: 'It sits in front of app servers (like Node.js) to terminate TLS, serve static assets, compress responses, and distribute traffic — all with low memory use.',
    useCases: [
      'Reverse-proxying a Node.js/Express app on port 3000 to ports 80/443',
      'Serving a built React/Vite SPA with client-side routing fallback',
      'HTTPS termination with Let’s Encrypt certificates',
      'Load balancing across multiple app instances',
    ],
  },
  categories: [
    {
      name: 'Installation',
      commands: [
        {
          cmd: 'sudo apt update && sudo apt install nginx',
          purpose: 'Install Nginx on Debian/Ubuntu.',
          flags: [{ flag: 'apt install', desc: 'Installs the package and its dependencies.' }],
          example: 'sudo apt update && sudo apt install nginx',
          output: 'Nginx is installed and typically started/enabled automatically.',
          mistake: 'On RHEL/Amazon Linux use sudo yum install nginx (or dnf) instead of apt.',
        },
        {
          cmd: 'nginx -v',
          purpose: 'Print the installed Nginx version.',
          flags: [
            { flag: '-v', desc: 'Version only.' },
            { flag: '-V', desc: 'Version plus compile-time configure options and modules.' },
          ],
          example: 'nginx -V',
          output: 'e.g. nginx version: nginx/1.24.0 (plus build details with -V).',
          mistake: 'Confusing -v (lowercase, brief) with -V (uppercase, verbose build info).',
        },
      ],
    },
    {
      name: 'Configuration',
      commands: [
        {
          cmd: 'sudo nginx -t',
          purpose: 'Test configuration files for syntax errors before applying them.',
          flags: [{ flag: '-t', desc: 'Test config and exit without running.' }],
          example: 'sudo nginx -t',
          output: 'nginx: configuration file /etc/nginx/nginx.conf test is successful.',
          mistake: 'Reloading without testing — a broken config can take the site down. Always run -t first.',
        },
        {
          cmd: 'sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/',
          purpose: 'Enable a site by symlinking its config into sites-enabled.',
          flags: [{ flag: '-s', desc: 'Create a symbolic link.' }],
          example: 'sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/',
          output: 'No output; the site is now included on the next reload.',
          mistake: 'Editing files in sites-enabled directly — edit in sites-available and symlink, so config stays organized.',
        },
      ],
    },
    {
      name: 'Process Management',
      commands: [
        {
          cmd: 'sudo systemctl reload nginx',
          purpose: 'Apply new config with zero downtime (graceful reload).',
          flags: [{ flag: 'reload', desc: 'Re-reads config without dropping active connections.' }],
          example: 'sudo systemctl reload nginx',
          output: 'No output on success.',
          mistake: 'Using restart when reload suffices — restart briefly drops connections; reload does not.',
        },
        {
          cmd: 'sudo systemctl status nginx',
          purpose: 'Show whether Nginx is running and recent log lines.',
          flags: [{ flag: 'status', desc: 'Active state, PID, and recent journal output.' }],
          example: 'sudo systemctl status nginx',
          output: 'active (running) in green, plus the main PID and last log entries.',
          mistake: 'Forgetting sudo systemctl enable nginx so it does not auto-start after a reboot.',
        },
      ],
    },
    {
      name: 'Logs & Troubleshooting',
      commands: [
        {
          cmd: 'sudo tail -f /var/log/nginx/error.log',
          purpose: 'Stream the error log live while reproducing an issue.',
          flags: [{ flag: '-f', desc: 'Follow — keep printing new lines as they arrive.' }],
          example: 'sudo tail -f /var/log/nginx/error.log',
          output: 'Live error entries (e.g. upstream connection refused, permission denied).',
          mistake: 'Debugging a 502 by guessing — the error log usually names the exact upstream problem.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Reverse-proxy a Node.js app with HTTPS',
      steps: [
        'Create /etc/nginx/sites-available/myapp with a server block that proxy_pass to http://localhost:3000.',
        'Symlink it into sites-enabled and run sudo nginx -t.',
        'Reload with sudo systemctl reload nginx.',
        'Add TLS with sudo certbot --nginx to obtain and auto-configure a certificate.',
      ],
    },
    {
      title: 'Serve a React SPA',
      steps: [
        'Point root to the dist/ build folder.',
        'Add try_files $uri $uri/ /index.html; so client-side routes resolve.',
        'Enable gzip and long cache headers for hashed assets.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Terminate TLS at Nginx and redirect all HTTP to HTTPS.',
        'Hide the version with server_tokens off;.',
        'Add security headers (HSTS, X-Content-Type-Options).',
      ],
    },
    {
      group: 'Performance',
      items: [
        'Enable gzip (or brotli) compression and asset caching.',
        'Tune worker_processes auto; and keepalive connections.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Always nginx -t before reload.',
        'Keep per-site configs in sites-available and symlink to enable.',
      ],
    },
  ],
}

const pm2 = {
  name: 'PM2',
  tagline: 'Production process manager for Node.js applications',
  overview: {
    what: 'PM2 is a process manager for Node.js that keeps apps alive, restarts them on crash, enables clustering, and manages logs.',
    why: 'It turns node app.js into a resilient background service with auto-restart, zero-downtime reloads, startup-on-boot, and built-in monitoring.',
    useCases: [
      'Running Express/Node APIs 24/7 in production',
      'Scaling across all CPU cores with cluster mode',
      'Auto-restarting apps after crashes or server reboots',
      'Centralizing and rotating application logs',
    ],
  },
  categories: [
    {
      name: 'Installation',
      commands: [
        {
          cmd: 'npm install -g pm2',
          purpose: 'Install PM2 globally so the pm2 command is available everywhere.',
          flags: [{ flag: '-g', desc: 'Install globally rather than into a project.' }],
          example: 'npm install -g pm2',
          output: 'Adds the pm2 binary to your global npm bin path.',
          mistake: 'Installing without -g, so pm2 is not on PATH. On Linux you may need sudo depending on your Node setup.',
        },
      ],
    },
    {
      name: 'Deployment',
      commands: [
        {
          cmd: 'pm2 start app.js --name api',
          purpose: 'Start an app and give it a friendly name.',
          flags: [
            { flag: '--name', desc: 'Label used in pm2 list, logs, restart, etc.' },
            { flag: '-i <n|max>', desc: 'Run n instances in cluster mode (max = one per CPU core).' },
            { flag: '--watch', desc: 'Restart automatically when files change (dev only).' },
          ],
          example: 'pm2 start app.js --name api -i max',
          output: 'A table showing the app id, name, mode, status (online), and CPU/memory.',
          mistake: 'Using --watch in production — it restarts on any file change and can cause instability.',
        },
        {
          cmd: 'pm2 start npm --name api -- start',
          purpose: 'Run an npm script (e.g. "start") under PM2.',
          flags: [{ flag: '-- start', desc: 'Everything after -- is passed to npm as its arguments.' }],
          example: 'pm2 start npm --name api -- run start:prod',
          output: 'PM2 launches the npm script as a managed process.',
          mistake: 'Omitting the -- separator, so PM2 mis-parses the script name.',
        },
        {
          cmd: 'pm2 reload api',
          purpose: 'Zero-downtime reload — replaces workers one by one.',
          flags: [{ flag: 'reload', desc: 'Graceful; keeps serving during the swap (cluster mode).' }],
          example: 'pm2 reload api',
          output: 'Status stays online while workers are recycled.',
          mistake: 'Using restart for user-facing apps — restart kills then restarts, briefly dropping requests; reload avoids that.',
        },
      ],
    },
    {
      name: 'Process Management',
      commands: [
        {
          cmd: 'pm2 list',
          purpose: 'Show all managed processes and their status.',
          flags: [{ flag: 'list / ls / status', desc: 'Aliases for the same overview table.' }],
          example: 'pm2 list',
          output: 'Table of id, name, mode, pid, uptime, restarts, status, cpu, memory.',
          mistake: 'Confusing restart count spikes as normal — repeated restarts usually mean the app is crash-looping.',
        },
        {
          cmd: 'pm2 restart api',
          purpose: 'Restart a process (or all with "all").',
          flags: [{ flag: 'all', desc: 'Target every managed process.' }],
          example: 'pm2 restart all',
          output: 'The targeted apps flip to online with an incremented restart count.',
          mistake: 'Restarting when you meant reload (see above).',
        },
        {
          cmd: 'pm2 delete api',
          purpose: 'Stop and remove a process from PM2’s list.',
          flags: [{ flag: 'all', desc: 'Remove every process.' }],
          example: 'pm2 delete api',
          output: 'The process is stopped and disappears from pm2 list.',
          mistake: 'Running pm2 delete then forgetting pm2 save — the old process list is restored on reboot.',
        },
      ],
    },
    {
      name: 'Monitoring & Logs',
      commands: [
        {
          cmd: 'pm2 logs api',
          purpose: 'Stream combined stdout/stderr logs for an app.',
          flags: [
            { flag: '--lines <n>', desc: 'Show the last n lines first.' },
            { flag: '--err', desc: 'Only the error stream.' },
          ],
          example: 'pm2 logs api --lines 100',
          output: 'Live, tailing log output prefixed with the app name.',
          mistake: 'Letting logs grow forever — install pm2-logrotate to cap and rotate them.',
        },
        {
          cmd: 'pm2 monit',
          purpose: 'Open a live dashboard of CPU and memory per process.',
          flags: [],
          example: 'pm2 monit',
          output: 'A terminal UI with real-time metrics and log panes.',
          mistake: 'Expecting historical graphs — monit is real-time only; use PM2 Plus for history.',
        },
      ],
    },
    {
      name: 'Startup & Persistence',
      commands: [
        {
          cmd: 'pm2 startup',
          purpose: 'Generate and install a service so PM2 relaunches apps on boot.',
          flags: [],
          example: 'pm2 startup',
          output: 'Prints a sudo command to run once; that registers the systemd service.',
          mistake: 'Running startup but never running pm2 save — nothing is resurrected without a saved list.',
        },
        {
          cmd: 'pm2 save',
          purpose: 'Snapshot the current process list so it can be restored on reboot.',
          flags: [],
          example: 'pm2 save',
          output: 'Writes the current apps to ~/.pm2/dump.pm2.',
          mistake: 'Forgetting to re-run pm2 save after changing which apps run.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Run a Node API in production',
      steps: [
        'pm2 start app.js --name api -i max to use all cores.',
        'pm2 startup then run the printed sudo command.',
        'pm2 save to persist the list across reboots.',
        'Deploy updates with git pull && npm ci && pm2 reload api for zero downtime.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Performance',
      items: [
        'Use -i max (cluster mode) to utilize every CPU core.',
        'Set max_memory_restart in an ecosystem file to auto-recycle leaky processes.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Prefer reload over restart for zero-downtime deploys.',
        'Always pair pm2 startup with pm2 save.',
        'Add pm2-logrotate so disk does not fill with logs.',
      ],
    },
  ],
}

const linux = {
  name: 'Linux',
  tagline: 'The operating system that powers most servers and the cloud',
  overview: {
    what: 'Linux is an open-source, Unix-like operating system. On servers you interact with it through the shell (bash) and command-line tools.',
    why: 'Nearly all production servers, containers, and cloud instances run Linux, so a developer needs the shell to deploy, monitor, and troubleshoot apps.',
    useCases: [
      'Administering EC2 servers over SSH',
      'Managing files, permissions, users, and services',
      'Inspecting processes, ports, disk, and memory',
      'Tailing logs and diagnosing production issues',
    ],
  },
  categories: [
    {
      name: 'Navigation & Files',
      commands: [
        {
          cmd: 'ls -lah',
          purpose: 'List directory contents with details.',
          flags: [
            { flag: '-l', desc: 'Long format (permissions, owner, size, date).' },
            { flag: '-a', desc: 'Include hidden dotfiles.' },
            { flag: '-h', desc: 'Human-readable sizes (K, M, G).' },
          ],
          example: 'ls -lah /var/www',
          output: 'One row per entry with permissions, owner, size, and modified time.',
          mistake: 'Forgetting -a and missing hidden files like .env or .gitignore.',
        },
        {
          cmd: 'grep -rn "searchTerm" .',
          purpose: 'Recursively search files for text.',
          flags: [
            { flag: '-r', desc: 'Recurse into subdirectories.' },
            { flag: '-n', desc: 'Show line numbers.' },
            { flag: '-i', desc: 'Case-insensitive match.' },
          ],
          example: 'grep -rni "TODO" ./src',
          output: 'Matching lines prefixed with file path and line number.',
          mistake: 'Searching node_modules by accident — add --exclude-dir=node_modules.',
        },
      ],
    },
    {
      name: 'Permissions & Security',
      commands: [
        {
          cmd: 'chmod 600 .env',
          purpose: 'Change file permissions.',
          flags: [{ flag: '600', desc: 'Owner read/write; no access for group or others.' }],
          example: 'chmod 600 .env',
          output: 'No output; permissions updated.',
          mistake: 'Using chmod 777 to "fix" permission errors — it makes files world-writable and is a security risk.',
        },
        {
          cmd: 'sudo chown -R ubuntu:ubuntu /var/www/myapp',
          purpose: 'Change file owner (and group) recursively.',
          flags: [
            { flag: '-R', desc: 'Apply recursively to all files/folders.' },
            { flag: 'user:group', desc: 'New owner and group.' },
          ],
          example: 'sudo chown -R ubuntu:ubuntu /var/www/myapp',
          output: 'No output; ownership changed.',
          mistake: 'Running chown on system paths like / — it can break the OS. Target only your app directory.',
        },
      ],
    },
    {
      name: 'Process Management',
      commands: [
        {
          cmd: 'ps aux | grep node',
          purpose: 'Find running processes matching a name.',
          flags: [
            { flag: 'a/u/x', desc: 'All users, user-oriented format, incl. processes without a TTY.' },
          ],
          example: 'ps aux | grep node',
          output: 'Rows with USER, PID, %CPU, %MEM, and the command line.',
          mistake: 'Killing the wrong PID — confirm the command column before running kill.',
        },
        {
          cmd: 'kill -9 <pid>',
          purpose: 'Force-terminate a process by PID.',
          flags: [
            { flag: '-9 (SIGKILL)', desc: 'Cannot be caught/ignored — last resort.' },
            { flag: '-15 (SIGTERM)', desc: 'Polite shutdown; the default, lets the app clean up.' },
          ],
          example: 'kill -15 4821',
          output: 'No output; the process receives the signal.',
          mistake: 'Reaching for -9 first — try SIGTERM (-15) so the app can shut down gracefully.',
        },
      ],
    },
    {
      name: 'Monitoring',
      commands: [
        {
          cmd: 'df -h',
          purpose: 'Show disk space per filesystem.',
          flags: [{ flag: '-h', desc: 'Human-readable sizes.' }],
          example: 'df -h',
          output: 'Filesystem, Size, Used, Avail, Use%, Mounted on.',
          mistake: 'Ignoring a full / partition — a 100% disk silently breaks builds, logs, and databases.',
        },
        {
          cmd: 'free -h',
          purpose: 'Show memory and swap usage.',
          flags: [{ flag: '-h', desc: 'Human-readable units.' }],
          example: 'free -h',
          output: 'total / used / free / available for RAM and swap.',
          mistake: 'Panicking at low "free" — Linux uses spare RAM for cache; watch the "available" column instead.',
        },
      ],
    },
    {
      name: 'Logs & Troubleshooting',
      commands: [
        {
          cmd: 'sudo journalctl -u nginx -n 100 --no-pager',
          purpose: 'Read logs for a systemd service.',
          flags: [
            { flag: '-u', desc: 'Filter by unit (service) name.' },
            { flag: '-n', desc: 'Show the last n lines.' },
            { flag: '-f', desc: 'Follow live output.' },
          ],
          example: 'sudo journalctl -u nginx -f',
          output: 'Timestamped log lines for that service.',
          mistake: 'Scrolling endless output — use -n or -f to bound it.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Diagnose a server running out of space',
      steps: [
        'Run df -h to confirm which partition is full.',
        'Find big directories with du -sh /var/* | sort -h.',
        'Clear or rotate large logs and old build artifacts.',
      ],
    },
    {
      title: 'Set up a deploy directory',
      steps: [
        'sudo mkdir -p /var/www/myapp and clone the repo.',
        'sudo chown -R $USER:$USER /var/www/myapp so you can write to it.',
        'chmod 600 the .env file with secrets.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Use least-privilege permissions; avoid chmod 777.',
        'Log in as a non-root user and use sudo for admin tasks.',
        'Keep packages updated: sudo apt update && sudo apt upgrade.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Monitor disk (df -h) and memory (free -h) proactively.',
        'Prefer SIGTERM over SIGKILL to allow graceful shutdown.',
        'Use journalctl/systemctl to manage and inspect services.',
      ],
    },
  ],
}

const git = {
  name: 'Git',
  tagline: 'Distributed version control for tracking code changes',
  overview: {
    what: 'Git is a distributed version-control system that records snapshots of your project so you can branch, merge, and collaborate safely.',
    why: 'It lets teams work in parallel, review history, revert mistakes, and manage releases — the foundation of modern software collaboration.',
    useCases: [
      'Tracking and reviewing changes across a codebase',
      'Feature branching and merging in a team',
      'Rolling back a bad change or hotfixing production',
      'Pushing to GitHub/GitLab and opening pull requests',
    ],
  },
  categories: [
    {
      name: 'Configuration',
      commands: [
        {
          cmd: 'git config --global user.name "Your Name"',
          purpose: 'Set the identity attached to your commits.',
          flags: [
            { flag: '--global', desc: 'Applies to all repos for your user.' },
            { flag: '--local', desc: 'Applies only to the current repo (the default).' },
          ],
          example: 'git config --global user.email "you@example.com"',
          output: 'No output; written to ~/.gitconfig (global).',
          mistake: 'Forgetting to set these, so commits are attributed to the wrong or missing author.',
        },
      ],
    },
    {
      name: 'Everyday Workflow',
      commands: [
        {
          cmd: 'git status',
          purpose: 'Show staged, unstaged, and untracked changes.',
          flags: [{ flag: '-s', desc: 'Short, compact format.' }],
          example: 'git status -s',
          output: 'Lists modified/new files and the current branch.',
          mistake: 'Committing before checking status and accidentally including unwanted files.',
        },
        {
          cmd: 'git add <file>',
          purpose: 'Stage changes for the next commit.',
          flags: [
            { flag: '.', desc: 'Stage everything in the current directory tree.' },
            { flag: '-p', desc: 'Interactively stage selected hunks.' },
          ],
          example: 'git add -p',
          output: 'No output; files move to the staging area.',
          mistake: 'git add . blindly — you may stage secrets or build artifacts. Keep a good .gitignore.',
        },
        {
          cmd: 'git commit -m "message"',
          purpose: 'Record staged changes as a commit.',
          flags: [
            { flag: '-m', desc: 'Inline commit message.' },
            { flag: '--amend', desc: 'Replace the previous commit (before pushing).' },
          ],
          example: 'git commit -m "Add contact form validation"',
          output: 'Shows the branch, short hash, and files/lines changed.',
          mistake: 'Using --amend on commits already pushed to a shared branch — it rewrites history others may have.',
        },
        {
          cmd: 'git push origin main',
          purpose: 'Upload local commits to the remote branch.',
          flags: [
            { flag: '-u', desc: 'Set upstream so future git push needs no args.' },
            { flag: '--force-with-lease', desc: 'Safer forced push that refuses to clobber others’ work.' },
          ],
          example: 'git push -u origin feature/login',
          output: 'Transfers objects and updates the remote branch.',
          mistake: 'Using --force on shared branches — prefer --force-with-lease, or avoid force entirely.',
        },
      ],
    },
    {
      name: 'Branching & Merging',
      commands: [
        {
          cmd: 'git switch -c feature/login',
          purpose: 'Create and switch to a new branch.',
          flags: [
            { flag: '-c', desc: 'Create the branch, then switch to it.' },
          ],
          example: 'git switch -c feature/login',
          output: 'Switched to a new branch "feature/login".',
          mistake: 'Working directly on main — always branch for features. (git checkout -b does the same thing.)',
        },
        {
          cmd: 'git merge feature/login',
          purpose: 'Merge another branch into the current one.',
          flags: [
            { flag: '--no-ff', desc: 'Always create a merge commit to preserve branch history.' },
          ],
          example: 'git merge --no-ff feature/login',
          output: 'Fast-forward or a merge commit; may report conflicts to resolve.',
          mistake: 'Not pulling latest before merging, leading to avoidable conflicts.',
        },
      ],
    },
    {
      name: 'Undo & Recovery',
      commands: [
        {
          cmd: 'git restore <file>',
          purpose: 'Discard uncommitted changes to a file.',
          flags: [
            { flag: '--staged', desc: 'Unstage a file (keep the edits).' },
          ],
          example: 'git restore --staged src/App.jsx',
          output: 'No output; the file is reverted or unstaged.',
          mistake: 'git restore <file> permanently discards edits — there is no undo for that. Use --staged to only unstage.',
        },
        {
          cmd: 'git revert <commit>',
          purpose: 'Create a new commit that undoes a previous one.',
          flags: [{ flag: '--no-edit', desc: 'Use the default revert message.' }],
          example: 'git revert 1a2b3c4',
          output: 'A new "Revert ..." commit that reverses the target.',
          mistake: 'Confusing revert (safe, adds a commit) with reset (rewrites history).',
        },
        {
          cmd: 'git reset --hard <commit>',
          purpose: 'Move the branch and working tree back to a commit.',
          flags: [
            { flag: '--hard', desc: 'Discard all changes after that commit.' },
            { flag: '--soft', desc: 'Keep changes staged; only move the pointer.' },
          ],
          example: 'git reset --soft HEAD~1',
          output: 'HEAD moves; --hard also wipes local changes.',
          mistake: '--hard destroys uncommitted work irreversibly — commit or stash first.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Ship a feature safely',
      steps: [
        'git switch -c feature/x to branch off main.',
        'Commit in small steps with clear messages.',
        'git push -u origin feature/x and open a pull request.',
        'After review, merge and delete the branch.',
      ],
    },
    {
      title: 'Recover from a bad commit',
      steps: [
        'If not pushed: git reset --soft HEAD~1 to keep the changes staged.',
        'If already pushed/shared: git revert <commit> to undo without rewriting history.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Never commit secrets; keep .env in .gitignore.',
        'Use signed commits and protected branches on important repos.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Write small, focused commits with meaningful messages.',
        'Prefer --force-with-lease over --force, and avoid force on shared branches.',
        'Pull/rebase frequently to minimize conflicts.',
      ],
    },
  ],
}

const github = {
  name: 'GitHub',
  tagline: 'Cloud Git hosting + collaboration, driven from the gh CLI',
  overview: {
    what: 'GitHub hosts Git repositories in the cloud and adds pull requests, issues, Actions (CI/CD), and releases. The official GitHub CLI (gh) drives all of it from the terminal.',
    why: 'It centralizes collaboration — code review, automation, and project management — and gh lets you do repo/PR/issue work without leaving the shell.',
    useCases: [
      'Hosting repos and reviewing pull requests',
      'Automating builds and deploys with GitHub Actions',
      'Filing and triaging issues',
      'Publishing versioned releases',
    ],
  },
  categories: [
    {
      name: 'Installation & Auth',
      commands: [
        {
          cmd: 'gh auth login',
          purpose: 'Authenticate the GitHub CLI with your account.',
          flags: [
            { flag: '--web', desc: 'Authenticate via the browser flow.' },
            { flag: '--with-token', desc: 'Read a personal access token from stdin.' },
          ],
          example: 'gh auth login',
          output: 'Interactive prompts for host, protocol (HTTPS/SSH), and login method.',
          mistake: 'Confusing gh (GitHub CLI) with git — gh talks to GitHub’s API; git manages the local repo.',
        },
        {
          cmd: 'gh auth status',
          purpose: 'Show which account/token gh is using.',
          flags: [],
          example: 'gh auth status',
          output: 'Logged-in host, account, and token scopes.',
          mistake: 'Debugging permission errors without checking token scopes here first.',
        },
      ],
    },
    {
      name: 'Repositories',
      commands: [
        {
          cmd: 'gh repo create myapp --public --source=. --push',
          purpose: 'Create a GitHub repo, optionally from the current folder.',
          flags: [
            { flag: '--public / --private', desc: 'Repo visibility.' },
            { flag: '--source=.', desc: 'Use the current directory as the repo source.' },
            { flag: '--push', desc: 'Push the local commits after creating.' },
          ],
          example: 'gh repo create myapp --private --source=. --push',
          output: 'Creates the remote repo and (with --push) uploads your code.',
          mistake: 'Running --source=. with no commits yet — commit at least once first.',
        },
        {
          cmd: 'gh repo clone owner/repo',
          purpose: 'Clone a repository (accepts owner/repo shorthand).',
          flags: [],
          example: 'gh repo clone Vivek-pandey101/portfolio',
          output: 'Clones the repo into a local folder.',
          mistake: 'Typing the full URL is fine too, but owner/repo shorthand is quicker with gh.',
        },
      ],
    },
    {
      name: 'Pull Requests',
      commands: [
        {
          cmd: 'gh pr create --title "Add login" --body "Implements auth"',
          purpose: 'Open a pull request from your current branch.',
          flags: [
            { flag: '--fill', desc: 'Auto-fill title/body from commits.' },
            { flag: '--base', desc: 'Target branch to merge into (e.g. main).' },
            { flag: '--draft', desc: 'Open as a draft PR.' },
          ],
          example: 'gh pr create --fill --base main',
          output: 'Creates the PR and prints its URL.',
          mistake: 'Forgetting to push the branch first — gh will prompt, but the branch must exist on the remote.',
        },
        {
          cmd: 'gh pr checkout <number>',
          purpose: 'Check out a PR branch locally to test it.',
          flags: [],
          example: 'gh pr checkout 42',
          output: 'Fetches and switches to the PR’s branch.',
          mistake: 'Reviewing large PRs only in the browser — checking out lets you run the code.',
        },
        {
          cmd: 'gh pr merge <number> --squash --delete-branch',
          purpose: 'Merge a PR and clean up the branch.',
          flags: [
            { flag: '--squash', desc: 'Combine commits into one.' },
            { flag: '--merge / --rebase', desc: 'Alternative merge strategies.' },
            { flag: '--delete-branch', desc: 'Delete the head branch after merge.' },
          ],
          example: 'gh pr merge 42 --squash --delete-branch',
          output: 'Merges the PR and removes the merged branch.',
          mistake: 'Merging without required reviews/checks — branch protection may reject it.',
        },
      ],
    },
    {
      name: 'Issues & Actions',
      commands: [
        {
          cmd: 'gh issue create --title "Bug: 500 on login" --body "Steps..."',
          purpose: 'File a new issue from the terminal.',
          flags: [
            { flag: '--label', desc: 'Attach labels.' },
            { flag: '--assignee', desc: 'Assign a user (@me for yourself).' },
          ],
          example: 'gh issue create --title "Bug" --assignee @me --label bug',
          output: 'Creates the issue and prints its URL.',
          mistake: 'Duplicating issues — run gh issue list first to check.',
        },
        {
          cmd: 'gh run list',
          purpose: 'List recent GitHub Actions workflow runs.',
          flags: [
            { flag: '--workflow', desc: 'Filter by a specific workflow file.' },
            { flag: '--limit', desc: 'Cap the number of results.' },
          ],
          example: 'gh run watch',
          output: 'A table of runs with status, workflow, branch, and event.',
          mistake: 'Refreshing the browser to watch CI — gh run watch streams status live in the terminal.',
        },
      ],
    },
  ],
  scenarios: [
    {
      title: 'Ship a change end-to-end',
      steps: [
        'Branch, commit, and git push your feature.',
        'gh pr create --fill --base main to open the PR.',
        'Reviewers comment; CI runs via gh run list / gh run watch.',
        'gh pr merge --squash --delete-branch once approved.',
      ],
    },
    {
      title: 'Automate deploys with Actions',
      steps: [
        'Add a workflow in .github/workflows/deploy.yml.',
        'On push to main, build and deploy (e.g. to an EC2 host).',
        'Track runs with gh run list and inspect failures with gh run view <id> --log.',
      ],
    },
  ],
  bestPractices: [
    {
      group: 'Security',
      items: [
        'Use fine-grained personal access tokens with minimal scopes.',
        'Store secrets in GitHub Actions secrets, never in the repo.',
        'Enable branch protection and required reviews on main.',
      ],
    },
    {
      group: 'Production',
      items: [
        'Require passing CI checks before merge.',
        'Use squash merges for a clean, linear history.',
        'Automate releases and changelogs with gh release create.',
      ],
    },
  ],
}

/*
 * Each guide is the command *reference*. skillWalkthroughs.js adds the
 * beginner layer on top (plain-English intro, diagram, glossary, numbered
 * walkthrough with the config files spelled out, troubleshooting table).
 * Merging here means consumers keep reading a single guide object.
 */
const withWalkthrough = (guide) => ({
  ...guide,
  ...(walkthroughs[guide.name] || {}),
})

/* Keyed by the exact skill `name` used in content.js so lookups are trivial. */
export const skillGuides = {
  'AWS EC2': withWalkthrough(awsEc2),
  'AWS SES': withWalkthrough(awsSes),
  Nginx: withWalkthrough(nginx),
  PM2: withWalkthrough(pm2),
  Linux: withWalkthrough(linux),
  Git: withWalkthrough(git),
  GitHub: withWalkthrough(github),
}

/*
 * The हिंदी set is the same guides with the translation laid over them, so a
 * missing translation shows the English sentence instead of a hole. Commands
 * and file contents are never translated — they are code.
 */
const skillGuidesHi = Object.fromEntries(
  Object.entries(skillGuides).map(([name, guide]) => [
    name,
    overlay(guide, walkthroughsHi[name]),
  ]),
)

export const guidesByLang = { en: skillGuides, hi: skillGuidesHi }

/** Every guide for one language, in tab order. */
export const getGuides = (lang) => guidesByLang[lang] || skillGuides

export default skillGuides
