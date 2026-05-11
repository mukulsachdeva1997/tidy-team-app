# 🧹 Tidy Team

> A playful, polished household chore game for roommates. Real-time sync between phones, savage monthly roasts, in-app rock-paper-scissors tie-breakers, and a built-in pizza punishment for the laziest housemate. Free forever on the Firebase Spark plan.

---

## ⚠️ Important — use your own Firebase project

The instance hosted at **`https://tidy-team-c729a.web.app`** is the maintainer's personal Firebase project, set up for one specific household. **Do not use it for your own house** — if you do:

- Your data lands in someone else's database (no privacy guarantee)
- You count against their free-tier quotas
- The maintainer can see, edit, or delete your household at any time
- You could be blocked or removed without notice

**To use Tidy Team for your household:** fork this repo and [set up your own Firebase project](#self-hosting-your-own-instance). It's **free** (no credit card needed) and takes about **30 minutes**. Full step-by-step guide below. The code is open source — clone it, plug in your own Firebase credentials, deploy. You then own and control everything: your data, your URL, your roommates' access.

If you only want to **try the app to see if you like it before setting up**, the live demo is fine for that — but anything you create there is throwaway / temporary.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture overview](#architecture-overview)
- [How it was built — from scratch](#how-it-was-built--from-scratch)
- [Self-hosting your own instance](#self-hosting-your-own-instance)
- [Local development](#local-development)
- [Deploying changes](#deploying-changes)
- [Configuration & customization](#configuration--customization)
- [Security model](#security-model)
- [Cost & scale](#cost--scale)
- [Roadmap](#roadmap)
- [License](#license)

---

## Why this exists

Shared apartments hit the same wall every month: someone forgets the trash, two people swear they did the kitchen "last time," nobody remembers whose turn the bathrooms are. Existing apps are either over-engineered SaaS products or 90s-era spreadsheets.

**Tidy Team** is the version your group chat would actually use:

- Auto-rotating weekly schedule (set it once, forget forever)
- Real-time sync — mark a chore done on your phone, your roommates see it instantly
- Honest social pressure: snooze your chore, everyone sees the 💤 pill on your row
- A real consequence: lowest scorer of the month buys treats 🍕
- Brutal but bonded-roommate-energy roasts (English + German), randomized so they stay fresh
- Rock-Paper-Scissors mini-game when there's a tie for last
- Light + dark mode, 3D emojis, mobile-first, installable as a PWA

No subscription. No ads. No data shared with anyone outside your household.

---

## Features

### 📅 Weekly chore rotation

- Configurable list of chores (1 to 10)
- Configurable list of housemates (1 to 8)
- **Deterministic rotation** anchored to a Monday — every device computes the same assignments without needing sync
- Past, current, and future weeks all browsable via week navigation
- Live progress bar shows how much of the week is done

### ✅ Mark done / undo

- Tap a chore → bottom action sheet opens with **Done · Snooze · Nudge** as appropriate
- Marking done is instant — sync hits all roommates' devices in milliseconds
- Anyone can undo their own completion (or the assignee can override)

### 💤 Snooze with deadline shift

- 24h or 48h snooze options
- **Cap of 48h per chore per week** — can't dodge forever
- Snoozing actually shifts your deadline (real grace period, not just hiding the reminder)
- Roommates see "💤 snoozed until Wed 9 AM" on your row — full transparency
- Past the snooze deadline without finishing → −5 pts

### 🎯 Scoring & competition

| Outcome | Points |
|---|---|
| Done by deadline (incl. snooze extension) | **+10** |
| Done after deadline | **+5** |
| Missed (never done past deadline) | **−5** |

- Live-computed all-time leaderboard with 👑 winner / 🍕 loser
- 🔥 Streaks for consecutive on-time weeks
- Achievements (Reliable / On fire / Punctual / Slacker / Snoozer)

### 🍕 Monthly treat banner

At the start of each month, the app auto-detects last month's lowest scorer and slaps a treat banner at the top:

> 🍕 **Iliana's treat!**
>
> Iliana, 8 pts. The dust bunnies have a Slack channel about you.
> *Iliana, 8 Punkte. Die Staubmäuse haben eine Slack-Gruppe über dich.*

- Loser locked in deterministically the first time anyone opens the app on/after the 1st
- "Mark paid" toggle so the loser can confirm settlement
- Past months archived in the Stats tab with their roast lines preserved forever

### 🪨📄✂️ Tie-breaker mini-game

When two people tie for last:

- "Tie for last!" banner with both contenders
- Tap **Play RPS** → in-app pass-and-tap mini-game
- Best of 3, hidden choices between turns
- Loser gets locked in, treat assigned

For 3+ way ties (rare): everyone tied chips in collectively.

### 😂 Brutal bilingual roast lines

- **15 brutal roasts** for losers with negative/zero scores
- **7 milder roasts** for losers with positive scores
- **12 winner celebrations**
- **10 mid-pack one-liners**
- Every line in English **and** German
- Treat banner: locked in for the month (same line shows all month)
- Leaderboard taglines: refresh daily for variety

### 📣 WhatsApp nudge

- When a chore is overdue, roommates see a **📣 Nudge** button on the action sheet
- Tap → opens WhatsApp with pre-filled message (uses `wa.me/<number>` deep link)
- Falls back to copying the message to clipboard if no phone number is set

### 🏠 Multi-household support

- Each household has a unique ID (e.g. `tidy-bf3p9q2`)
- One Firebase project hosts unlimited households — totally isolated from each other
- **Create** a household: name + emoji + chores + optional roommate emails
- **Join** a household via invite link (`https://…?h=tidy-…`)
- **Add member**: enter email + name + emoji → adds to allowlist
- **Remove member**: confirmation prompt; past completions stay in the records
- **Leave household**: cleanly removes you; if you're the last member, household auto-deletes

### 🔔 Notifications

- Local browser/PWA notifications when reminders fire (Wed = "due soon", Thu = "overdue", missed = "−5 pts")
- Notifications fire while the app is open (or installed as PWA on home screen)
- True background push planned for Phase 2 via Apps Script backend

### 🎨 Polish

- **Light + dark mode toggle** with smooth color transitions
- Auto-detects system theme preference on first load
- **3D Microsoft Fluent emojis** for all icons (loaded from jsDelivr, browser-cached)
- iPhone safe-area aware (no notch overlap)
- Persistent sign-in (indexedDB)
- Auto-syncs Google display name on first join (so roommates see "Iliana Pakos" not "iliana.pakos@gmail.com")
- Tap-to-act UX (cleaner chore rows, bigger touch targets)
- Smooth bottom-sheet transitions
- Toast notifications

### 📊 Reporting

- Live monthly stats: chores done, on-time %, total points, days left
- Per-person breakdown
- Past months archive
- "Copy report" / "Email report" buttons (opens mail app pre-filled)

---

## Tech stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Plain HTML/CSS/JS (no build, no framework) | Single-file simplicity, instant load, no toolchain |
| Auth | Firebase Authentication (Google sign-in) | Free, unlimited users, Google-native |
| Database | Cloud Firestore (real-time) | Free tier covers ~1000 households, real-time listeners |
| Push | Firebase Cloud Messaging | Free, unlimited (full backend integration in Phase 2) |
| Hosting | Firebase Hosting | Free 10 GB storage / 360 MB daily transfer, HTTPS automatic |
| Icons | Microsoft Fluent Emoji 3D via jsDelivr CDN | Beautiful 3D emojis, zero hosting cost |
| PWA | Web App Manifest + service worker | Install to home screen, offline-friendly |

**No build step. No bundler. No dependencies in `package.json`.** The entire frontend is a single `index.html` (~1700 lines) that imports Firebase modules from Google's CDN at runtime.

---

## Architecture overview

### Data model (Firestore)

```
households/{householdId}
  ├─ name: string
  ├─ memberEmails: string[]      ← lowercase, used for security rule checks
  ├─ people: [{ email, name, emoji, phone }]
  ├─ chores: string[]
  ├─ anchor: "YYYY-MM-DD"        ← rotation start (a Monday)
  ├─ history: {
  │    "2026-W19-c0": {
  │      completedAt: timestamp,
  │      byUid: string,
  │      byIdx: number,
  │      byEmail: string,
  │      shiftHours: number,     ← cumulative snooze, 0–48
  │      snoozedUntil: timestamp ← when reminders resume
  │    },
  │    ...
  │  }
  ├─ treats: {
  │    "2026-04": {
  │      monthKey, loserPts, loserIdx, tied[], paid, paidAt, settledAt
  │    },
  │    ...
  │  }
  └─ emailTo: string             ← optional report recipients

users/{uid}
  ├─ email: string
  ├─ name: string
  ├─ householdId: string         ← which household this user is in
  ├─ fcmToken: string            ← for push (Phase 2)
  └─ lastSeen: timestamp
```

### Security rules

```javascript
match /households/{id} {
  allow create: if signedIn() && emailLower() in request.resource.data.memberEmails;
  allow read, update: if signedIn() && emailLower() in resource.data.memberEmails;
  allow delete: if signedIn() && resource.data.memberEmails.size() <= 1
                  && emailLower() in resource.data.memberEmails;
}

match /users/{uid} {
  allow read, write: if signedIn() && request.auth.uid == uid;
}
```

**Result:** Every household is fully isolated. A user can only read/write a household if their authenticated email is in that household's `memberEmails`. Users can only access their own user doc. Households can only be deleted by the last remaining member.

### Auth & routing flow

1. App loads → spinner shown
2. `onAuthStateChanged` resolves
3. If signed out → sign-in splash with Google button
4. If signed in:
   - Check URL for `?h=<householdId>` — if present, set as user's household
   - Else, check `users/{uid}.householdId`
   - If neither, show **"Welcome — Create or Join"** screen
5. If user has a household ID, attach a real-time listener to `households/{id}`
6. Listener fires → check membership → render app or show "blocked" screen

### Real-time sync

The app uses Firestore's `onSnapshot` listener. Any change to the household document (a chore marked done, a snooze, a settings edit) propagates to all 4 connected devices in milliseconds. No manual refresh needed.

### Deterministic rotation

The chore rotation uses a pure function:

```javascript
function personForChore(monday, choreIdx) {
  const weeksSinceAnchor = floor((monday - anchorDate) / (7 days));
  const offset = ((weeksSinceAnchor % numPeople) + numPeople) % numPeople;
  return (choreIdx + offset) % numPeople;
}
```

Every device computes the same assignments without coordination. Adding/removing members re-computes future weeks correctly; past completions stay valid because they're stored with the assignee's UID, not their array index.

---

## How it was built — from scratch

Here's the literal sequence of things you'd do to recreate this from a blank slate:

### 1. Plan the data model

Decided on a single household doc per group with embedded `history` and `treats` maps. No subcollections needed for the scale of 4–8 person households over multiple years.

### 2. Create the Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Add project** → name it (e.g. `tidy-team-c729a`)
3. Skip Google Analytics (optional)
4. Project created — note the project ID

### 3. Enable Firestore

1. Console → **Build → Firestore Database**
2. **Create database** → location `eur3 (europe-west)` (or your nearest region)
3. **Start in production mode** (we'll add rules in step 6)

### 4. Enable Authentication

1. Console → **Build → Authentication**
2. **Get started** → **Sign-in method** tab
3. Enable **Google** provider → set support email → **Save**

### 5. Enable Cloud Messaging (for future push)

1. Console → ⚙️ **Project Settings** → **Cloud Messaging** tab
2. Scroll to **Web Push certificates** → **Generate key pair**
3. Save the VAPID key (long string) — you'll embed it in the frontend

### 6. Register a web app + get Firebase config

1. Console → ⚙️ **Project Settings** → **General** tab
2. Scroll to **Your apps** → click `</>` (web)
3. App nickname: `Tidy Team`
4. Check **Also set up Firebase Hosting**
5. Click **Register app** → copy the `firebaseConfig` object
6. Skip the rest of the setup pages

### 7. Write the Firestore security rules

Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function emailLower() { return request.auth.token.email.lower(); }

    match /households/{id} {
      allow create: if signedIn() && request.resource.data.memberEmails is list
        && emailLower() in request.resource.data.memberEmails;
      allow read, update: if signedIn() && emailLower() in resource.data.memberEmails;
      allow delete: if signedIn() && resource.data.memberEmails.size() <= 1
                      && emailLower() in resource.data.memberEmails;
    }
    match /users/{uid} {
      allow read, write: if signedIn() && request.auth.uid == uid;
    }
  }
}
```

### 8. Build the frontend

The whole app is a single `public/index.html` file. It imports Firebase from Google's CDN, sets up auth + Firestore listeners, and renders a mobile-first SPA. No build step, no `npm install`, just open and edit.

Key files:

```
tidy-team/
├── firebase.json              ← hosting + Firestore config for CLI
├── firestore.rules            ← security rules
├── .firebaserc                ← links to your Firebase project ID
└── public/
    ├── index.html             ← the entire app (HTML + CSS + JS)
    ├── firebase-messaging-sw.js ← FCM service worker (Phase 2)
    └── manifest.json          ← PWA manifest (broom icon)
```

### 9. Install Firebase CLI

```bash
# macOS (no Node required)
curl -sL https://firebase.tools | bash

# Or with Node/npm
npm install -g firebase-tools
```

### 10. Deploy

```bash
firebase login
firebase deploy
```

Firebase pushes the security rules and uploads the `public/` folder to Hosting. ~30 seconds. You get a live URL like `https://your-project-id.web.app`.

### 11. Onboard your roommates

1. You visit the URL → sign in with Google → create the household, fill in the 4 emails
2. Settings → copy invite link
3. WhatsApp it to roommates
4. They open the link → sign in → land in the household

That's the whole setup. Real time from blank Firebase project to working app: ~30 minutes.

---

## Self-hosting your own instance

**This is the recommended path for everyone.** Don't share a Firebase project with another household — set up your own. Here's the full guide.

### Prerequisites

- A Google account (for Firebase + Google sign-in)
- A terminal (macOS / Linux / WSL on Windows)
- ~30 minutes

### Step 1 — Create your Firebase project

Follow steps 2–6 in the [How it was built](#how-it-was-built--from-scratch) section above. You'll end up with:

- A Firebase project ID
- A `firebaseConfig` object (apiKey, authDomain, projectId, etc.)
- A VAPID web push key

### Step 2 — Clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/tidy-team.git
cd tidy-team
```

### Step 3 — Plug in your Firebase credentials

Edit `public/index.html`. Find the `firebaseConfig` block and replace with yours:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const VAPID_KEY = "YOUR_VAPID_KEY";
```

Also update `public/firebase-messaging-sw.js` with the same `firebaseConfig`.

Update `.firebaserc` with your project ID:

```json
{
  "projects": { "default": "YOUR_PROJECT_ID" }
}
```

### Step 4 — Install Firebase CLI

```bash
curl -sL https://firebase.tools | bash
firebase login
```

> ⚠️ **Apple Silicon Macs:** if you get `bad CPU type in executable`, install Rosetta first:
> ```bash
> softwareupdate --install-rosetta --agree-to-license
> ```

### Step 5 — Deploy

```bash
firebase deploy
```

Wait ~30 seconds. You'll see:

```
✔ Deploy complete!
Hosting URL: https://YOUR_PROJECT.web.app
```

### Step 6 — First sign-in

1. Open the URL on your phone
2. Sign in with Google
3. Tap **Create a household** → fill in the form
4. Go to Settings → copy the invite link
5. Send it to your roommates

You're live. Total cost: €0.

---

## Local development

To preview the app locally without deploying:

```bash
firebase serve --only hosting
```

Opens `http://localhost:5000`. Google sign-in works because `localhost` is in Firebase's default authorized domains list.

> ⚠️ The local server reads/writes the **live** Firestore database. Don't delete things you don't want to lose. For full isolation, use the Firebase Emulator Suite (more setup).

---

## Deploying changes

Whenever you edit code:

```bash
firebase deploy
```

Or to deploy only specific parts:

```bash
firebase deploy --only hosting       # just frontend
firebase deploy --only firestore     # just security rules
```

After deploying, hard-refresh on your phone (or close + reopen the home-screen icon) to bypass service-worker cache.

---

## Configuration & customization

### Change the chores

In Settings → Chores section. Edit, add, remove. Changes sync instantly.

### Change roast lines

Edit the `LINES` constant in `public/index.html`:

```javascript
const LINES = {
  loser_savage: [
    { en: "Your line {name} {pts}", de: "Deine Zeile {name} {pts}" },
    ...
  ],
  loser_mild: [...],
  winner: [...],
  mid: [...],
};
```

`{name}` and `{pts}` are interpolated automatically. Add as many lines as you want — picks are deterministic by month/day, so more variety = better.

### Change the snooze cap

Edit `SNOOZE_CAP_HOURS` near the top of the script:

```javascript
const SNOOZE_CAP_HOURS = 48;  // change to 24, 72, etc.
```

### Change the points

Inside `computeScores()`:

```javascript
if (st.onTime) { totals[idx].pts += 10; ... }   // on-time points
else { totals[idx].pts += 5; ... }              // late points
...
totals[idx].pts -= 5;                           // missed penalty
```

### Change the theme colors

Edit the CSS variables at the top of the `<style>` block. Two themes: `:root` (light) and `:root[data-theme="dark"]`.

### Add a new emoji to the picker

1. Add the emoji character to the `EMOJIS` array
2. Add a corresponding entry to `EMOJI_MAP` with the [Microsoft Fluent Emoji folder name](https://github.com/microsoft/fluentui-emoji/tree/main/assets) and snake_case file name

---

## Security model

### What's private

- Your name, email, phone, scores, history → only readable by your household members (Firestore rules enforce this)
- FCM push token → only readable by you
- Other households → completely invisible to you, and yours to them

### What's exposed (and why it's safe)

- The `firebaseConfig` (including `apiKey`) is in the HTML source. **This is by design and safe** — Firebase API keys identify the project, not authenticate. Real access is controlled server-side by the Firestore security rules.
- The VAPID key is also in source. Safe by design (web push standard).
- Source code is fully visible. Anyone can view it.

### What you should NOT commit

- Firebase service account JSON files (`*-firebase-adminsdk-*.json`) — these have private keys and can read/write any data
- Anything labeled "private key" or "secret"

### Abuse prevention

For a small private app: not needed. If you ever scale to public:

- Enable [Firebase App Check](https://firebase.google.com/docs/app-check) (free, ~30 min) to ensure requests come from your real app
- Consider rate-limiting at the rules level
- Set Blaze plan billing alerts (€5 cap, etc.)

---

## Cost & scale

Tidy Team runs entirely on the **Firebase Spark plan (free, no credit card required)**.

### Free tier limits

| Resource | Daily quota |
|---|---|
| Firestore reads | 50,000 |
| Firestore writes | 20,000 |
| Firestore storage | 1 GiB total |
| Hosting transfer | 360 MB |
| Hosting storage | 10 GB total |
| Authentication | unlimited |
| Cloud Messaging | unlimited |

### Estimated capacity

Per active household per day: ~20 reads, ~1.5 writes, ~50 KB storage growth/year.

| Bottleneck | Capacity |
|---|---|
| Firestore reads | ~2,500 households |
| Hosting transfer | ~900 households |
| Firestore storage | ~20,000 households (multi-year) |

**Realistic ceiling on the free tier: 500–1000 active households.**

If you exceed: Firebase doesn't surprise-bill you. The Spark plan simply pauses for the day. Optionally upgrade to Blaze (pay-as-you-go) for ~€2-5/month at small commercial scale.

---

## Roadmap

### Phase 1 — Done ✅

- [x] Multi-household support with invite codes
- [x] Real-time Firestore sync
- [x] Snooze with deadline shift, 48h/week cap
- [x] −5 missed penalty + auto-detection
- [x] Monthly treat banner with savage roast
- [x] In-app Rock-Paper-Scissors tie-breaker
- [x] Bilingual (EN + DE) randomized roast lines
- [x] Microsoft Fluent 3D emojis
- [x] Light + dark mode
- [x] PWA install
- [x] Auto-sync Google display name
- [x] Tap-to-act chore actions

### Phase 2 — Planned

- [ ] **Apps Script backend** for true background push notifications
- [ ] Auto-scheduled daily reminders (Wed self-reminder, Thu nudge alert)
- [ ] Auto-sent monthly email reports (Apps Script time trigger)
- [ ] Cross-device push for the "Nudge" button (no more manual WhatsApp)

### Future ideas

- [ ] AI-personalized roasts via Claude API
- [ ] Photo evidence for completed chores
- [ ] Chore swap requests
- [ ] Reactions on completions (👍 ❤️ 😂)
- [ ] iCal feed export
- [ ] House messages / pinned notes
- [ ] Per-chore weighting
- [ ] More languages (FR, IT, ES)
- [ ] Apple Watch / WearOS complication

---

## Contributing

Issues and PRs welcome. The whole app is one HTML file — there's nothing to build, just edit and refresh.

1. Fork the repo
2. Make your change in `public/index.html`
3. Test locally with `firebase serve`
4. Submit a PR

Bug reports: include a screenshot, your browser/OS, and (if relevant) the household ID.

---

## License

MIT — do whatever you want with it. Credit appreciated but not required.

---

## Credits

- 🎨 [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) — 3D emoji set, MIT licensed, served via [jsDelivr](https://www.jsdelivr.com/)
- 🔥 [Firebase](https://firebase.google.com) — auth, database, hosting, push
- 🤖 Built with [Claude](https://claude.com)

---

**Built for ABSORA WG. Roast responsibly.** 🧹
