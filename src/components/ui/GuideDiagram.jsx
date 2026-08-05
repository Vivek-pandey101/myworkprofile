/* ------------------------------------------------------------------ *
 *  Hand-drawn (well, hand-coded) diagrams for the skill guides.        *
 *                                                                      *
 *  Inline SVG rather than images: they stay sharp at any size, inherit  *
 *  the site palette, weigh a few hundred bytes, and need no network.    *
 *  Each diagram is keyed by the `diagram` field in skillWalkthroughs.js *
 * ------------------------------------------------------------------ */

const BLUE = '#3b82f6'
const TEAL = '#14b8a6'
const AMBER = '#f59e0b'
const VIOLET = '#8b5cf6'
const MUTED = '#94a3b8'

/* A rounded node with a title and an optional subtitle. */
function Box({ x, y, w = 150, h = 56, title, sub, color = BLUE, dashed }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill={`${color}14`}
        stroke={color}
        strokeWidth="1.25"
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="12.5"
        fontWeight="600"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fill={MUTED}
          fontSize="10.5"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

/* A straight arrow with an optional label floating above it. */
function Arrow({ x1, y1, x2, y2, label, color = MUTED, dashed }) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="1.25"
        strokeDasharray={dashed ? '4 4' : undefined}
        markerEnd="url(#arrowhead)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={y1 === y2 ? y1 - 8 : (y1 + y2) / 2 - 6}
          textAnchor="middle"
          fill={MUTED}
          fontSize="10"
        >
          {label}
        </text>
      )}
    </g>
  )
}

function Caption({ x, y, text, color = MUTED, anchor = 'middle' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize="10.5">
      {text}
    </text>
  )
}

/* ------------------------------ EC2 ------------------------------ */
function Ec2Diagram() {
  return (
    <>
      <Caption x={360} y={16} text="What actually sits inside a rented server" />

      {/* the instance */}
      <rect
        x={232}
        y={30}
        width={330}
        height={150}
        rx="14"
        fill="#f59e0b0d"
        stroke={AMBER}
        strokeDasharray="6 5"
        strokeWidth="1.25"
      />
      <text x={248} y={50} fill={AMBER} fontSize="11" fontWeight="600">
        EC2 instance · Ubuntu · t3.micro
      </text>

      <Box x={252} y={62} w={130} h={50} title="Nginx" sub="ports 80 / 443" color={TEAL} />
      <Box x={412} y={62} w={130} h={50} title="Node app" sub="localhost:5000" color={BLUE} />
      <Box x={252} y={124} w={130} h={44} title="PM2" sub="keeps it alive" color={VIOLET} />
      <Box x={412} y={124} w={130} h={44} title=".env" sub="secrets, chmod 600" color={MUTED} />

      <Arrow x1={384} y1={87} x2={410} y2={87} />

      {/* outside world */}
      <Box x={30} y={40} w={150} h={50} title="Browser" sub="https://myapp.com" color={TEAL} />
      <Box x={30} y={118} w={150} h={50} title="You" sub="ssh -i key.pem" color={MUTED} />

      <Arrow x1={182} y1={65} x2={250} y2={72} label="443" />
      <Arrow x1={182} y1={143} x2={250} y2={140} label="22" />

      <Caption
        x={360}
        y={200}
        text="Security group = the firewall deciding which of those ports the internet may reach"
      />
    </>
  )
}

/* ----------------------------- Nginx ----------------------------- */
function NginxDiagram() {
  return (
    <>
      <Caption x={360} y={16} text="One request, two possible destinations" />

      <Box x={20} y={70} w={140} h={56} title="Browser" sub="GET /dashboard" color={TEAL} />
      <Arrow x1={162} y1={98} x2={228} y2={98} label="port 443" />

      <Box x={230} y={62} w={150} h={72} title="Nginx" sub="reverse proxy" color={AMBER} />

      <Arrow x1={382} y1={82} x2={468} y2={54} label="try_files" />
      <Arrow x1={382} y1={114} x2={468} y2={144} label="proxy_pass" />

      <Box x={470} y={28} w={190} h={52} title="Static files" sub="/var/www/myapp/dist" color={VIOLET} />
      <Box x={470} y={118} w={190} h={52} title="Node app" sub="127.0.0.1:5000" color={BLUE} />

      <Caption
        x={360}
        y={196}
        text="502 Bad Gateway = Nginx is fine, the app behind it did not answer"
      />
    </>
  )
}

/* ------------------------------ PM2 ------------------------------ */
function Pm2Diagram() {
  return (
    <>
      <Caption x={360} y={16} text="Why the app survives crashes and reboots" />

      <Box x={40} y={78} w={150} h={58} title="pm2 start" sub="you, once" color={MUTED} />
      <Arrow x1={192} y1={107} x2={252} y2={107} />

      <Box x={254} y={62} w={160} h={90} title="PM2 daemon" sub="watches everything" color={VIOLET} />

      <Box x={470} y={30} w={180} h={46} title="worker 1" sub="cluster mode" color={BLUE} />
      <Box x={470} y={84} w={180} h={46} title="worker 2" sub="one per CPU core" color={BLUE} />
      <Box x={470} y={138} w={180} h={46} title="worker 3" sub="load balanced" color={BLUE} />

      <Arrow x1={416} y1={95} x2={466} y2={53} />
      <Arrow x1={416} y1={107} x2={466} y2={107} />
      <Arrow x1={416} y1={119} x2={466} y2={161} />

      <path
        d="M 560 184 C 560 206, 300 206, 300 156"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.25"
        strokeDasharray="4 4"
        markerEnd="url(#arrowhead)"
      />
      <Caption x={430} y={205} text="crash → restarted automatically" color={TEAL} />
    </>
  )
}

/* ------------------------------ SES ------------------------------ */
function SesDiagram() {
  return (
    <>
      <Caption x={360} y={16} text="The path of one transactional email" />

      <Box x={20} y={72} w={140} h={56} title="Your app" sub="nodemailer" color={BLUE} />
      <Arrow x1={162} y1={100} x2={218} y2={100} label="SMTP 587" />

      <Box x={220} y={64} w={160} h={72} title="Amazon SES" sub="signs with DKIM" color={AMBER} />
      <Arrow x1={382} y1={88} x2={458} y2={68} label="delivered" />
      <Arrow x1={382} y1={118} x2={458} y2={152} label="bounce" dashed color={AMBER} />

      <Box x={460} y={40} w={200} h={52} title="Inbox" sub="SPF · DKIM · DMARC pass" color={TEAL} />
      <Box x={460} y={126} w={200} h={52} title="Suppression list" sub="clean it from your DB" color={AMBER} dashed />

      <Caption
        x={360}
        y={200}
        text="Sandbox = only verified recipients, 200/day · production access lifts both"
      />
    </>
  )
}

/* ----------------------------- Linux ----------------------------- */
function LinuxDiagram() {
  return (
    <>
      <Caption x={360} y={16} text="The folders you will actually open" />

      <Box x={280} y={30} w={120} h={40} title="/" sub="root of the disk" color={MUTED} />

      <Arrow x1={310} y1={72} x2={150} y2={100} />
      <Arrow x1={340} y1={72} x2={340} y2={100} />
      <Arrow x1={370} y1={72} x2={545} y2={100} />

      <Box x={40} y={102} w={200} h={50} title="/etc" sub="configuration files" color={AMBER} />
      <Box x={250} y={102} w={190} h={50} title="/home/ubuntu" sub="your apps and keys" color={BLUE} />
      <Box x={450} y={102} w={200} h={50} title="/var/log" sub="every log lives here" color={TEAL} />

      <Caption x={140} y={172} text="nginx/, systemd/, hosts" />
      <Caption x={345} y={172} text="~/apps, ~/.ssh, .env" />
      <Caption x={550} y={172} text="nginx/error.log, syslog" />

      <Caption
        x={360}
        y={200}
        text="sudo is needed to write anywhere outside your home folder"
      />
    </>
  )
}

/* ------------------------------ Git ------------------------------ */
function GitDiagram() {
  return (
    <>
      <Caption x={360} y={16} text="Where your changes live at each stage" />

      <Box x={16} y={72} w={150} h={60} title="Working dir" sub="files you edit" color={MUTED} />
      <Box x={196} y={72} w={150} h={60} title="Staging area" sub="chosen for next commit" color={AMBER} />
      <Box x={376} y={72} w={150} h={60} title="Local repo" sub="your history" color={VIOLET} />
      <Box x={556} y={72} w={148} h={60} title="GitHub" sub="origin/main" color={TEAL} />

      <Arrow x1={168} y1={92} x2={194} y2={92} label="git add" />
      <Arrow x1={348} y1={92} x2={374} y2={92} label="git commit" />
      <Arrow x1={528} y1={92} x2={554} y2={92} label="git push" />

      <path
        d="M 630 138 C 630 176, 90 176, 90 136"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.25"
        strokeDasharray="4 4"
        markerEnd="url(#arrowhead)"
      />
      <Caption x={360} y={190} text="git pull — brings everyone else's commits back down" color={BLUE} />
    </>
  )
}

/* ---------------------------- GitHub ----------------------------- */
function GithubDiagram() {
  return (
    <>
      <Caption x={360} y={16} text="From a branch to a live deploy, automatically" />

      <Box x={16} y={74} w={140} h={56} title="feature branch" sub="git push" color={MUTED} />
      <Arrow x1={158} y1={102} x2={198} y2={102} />

      <Box x={200} y={74} w={140} h={56} title="Pull request" sub="review + diff" color={BLUE} />
      <Arrow x1={342} y1={102} x2={382} y2={102} />

      <Box x={384} y={74} w={140} h={56} title="Actions CI" sub="lint · test · build" color={VIOLET} />
      <Arrow x1={526} y1={102} x2={566} y2={102} label="merge" />

      <Box x={568} y={74} w={136} h={56} title="main" sub="protected branch" color={TEAL} />

      <path
        d="M 636 132 C 636 170, 454 176, 454 176"
        fill="none"
        stroke={AMBER}
        strokeWidth="1.25"
        markerEnd="url(#arrowhead)"
      />
      <Box x={230} y={156} w={224} h={44} title="Deploy workflow → EC2" sub="git pull · npm ci · pm2 reload" color={AMBER} />
    </>
  )
}

const diagrams = {
  ec2: Ec2Diagram,
  nginx: NginxDiagram,
  pm2: Pm2Diagram,
  ses: SesDiagram,
  linux: LinuxDiagram,
  git: GitDiagram,
  github: GithubDiagram,
}

/**
 * Renders the diagram registered under `name`, or nothing if there is none.
 * Wrapped in a horizontally scrollable box so the fixed 720-wide viewBox
 * never forces the page itself to scroll sideways on a phone.
 */
export default function GuideDiagram({ name }) {
  const Diagram = diagrams[name]
  if (!Diagram) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-background/40 p-3">
      <svg
        viewBox="0 0 720 215"
        role="img"
        aria-label={`Diagram explaining how ${name} fits together`}
        className="h-auto w-full min-w-[560px]"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={MUTED} />
          </marker>
        </defs>
        <Diagram />
      </svg>
    </div>
  )
}
