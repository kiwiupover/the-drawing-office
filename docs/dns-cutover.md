# DNS cutover — thedrawingoffice.com → Vercel

## What we're doing

Pointing `thedrawingoffice.com` away from Squarespace and at the new site hosted on Vercel. The new site is already live and testable at **https://the-drawing-office.vercel.app** — we're just changing where the domain sends people.

---

## Before we start — what I need from you

Can you tell me (or check in the Squarespace admin):

1. **Where is the domain registered?** (Squarespace-registered, or an external registrar like GoDaddy / Namecheap / Crazy Domains / etc.)
2. **Where is DNS managed?** Often the same place as the registrar, but Squarespace sometimes manages it separately. If you log in to your registrar and see records like `A`, `CNAME`, `MX` listed there, that's where DNS lives.
3. **Email** — do you use `info@thedrawingoffice.com` through Squarespace, Google Workspace, or something else? This is important because we don't want to break email during the cutover.
4. **Access** — whoever needs to make the DNS changes (you, or whoever set the site up originally) should have login access to wherever DNS is managed.

Send me screenshots of the **current DNS records** once you find the admin panel and I'll tell you exactly which ones to keep, change, or delete.

---

## The plan (once I have the info above)

### Step 1 — I add the domain to Vercel (my end, takes 2 minutes)

I'll tell Vercel that `thedrawingoffice.com` should be served by the new site. Vercel will then give me two DNS records to hand to you.

### Step 2 — You change two DNS records

You'll log in to wherever DNS is managed (registrar or Squarespace) and make these changes. Expect roughly:

| Record type | Host / Name | Current value (Squarespace) | New value (Vercel) |
| --- | --- | --- | --- |
| **A** | `@` (the root, thedrawingoffice.com) | Squarespace IP | `76.76.21.21` |
| **CNAME** | `www` | `ext-cust.squarespace.com` or similar | `cname.vercel-dns.com` |

I'll give you the exact values when Vercel generates them — they may be slightly different.

### Step 3 — Leave MX records alone

Your email records (anything with **MX** in the type column, and usually a couple of `TXT` records for email authentication with names like `_dmarc` or `_domainkey`) **must not change**. Leave them exactly as they are. That keeps `info@thedrawingoffice.com` working through the cutover.

### Step 4 — Wait 10 minutes to a few hours

DNS changes propagate. Vercel will automatically issue a free SSL certificate (so `https://` works) once it sees the new records — usually within a couple of minutes.

### Step 5 — Verify

Visit `https://thedrawingoffice.com` in a private/incognito window. You should see the new site with the padlock icon.

You can also send someone in a different location/network a quick "does this load for you?" message, since your local browser/ISP may cache the old site for a while.

### Step 6 — Cancel the Squarespace subscription

Once the new site has been live and healthy for **a week or two** (give yourself a buffer in case we need to roll back), you can cancel Squarespace. Don't cancel the day-of — cancelling Squarespace before DNS has fully propagated for everyone could leave some visitors with no site.

---

## Rollback (if something goes wrong)

DNS is reversible. If anything breaks, log back in to the DNS panel and change the two records back to their previous Squarespace values. Within an hour, everyone is back on the old Squarespace site. No data is lost.

---

## Things I'll take care of after the cutover

- Flip the hardcoded site URL in the code from the Vercel preview domain back to `thedrawingoffice.com` so all share-links, sitemaps, and search-engine signals point at the real domain.
- Confirm Google is indexing the new site (Google Search Console — I'll set this up).
- Add redirects from any legacy Squarespace URLs (e.g. old `/projects` → new homepage) so nobody lands on a 404 if they click an old bookmark.
- Monitor for a few days.

---

## Summary for you — TL;DR

1. Send me info on **where DNS is managed** + a screenshot of the current records.
2. Make sure you have **login access** to that panel.
3. Confirm **where your email is hosted** so we don't touch MX records.
4. Once you've done (1)–(3), I'll give you the two exact DNS values to change.
5. The whole cutover takes about 30 minutes of clicks, plus a few hours of propagation.

Shout if any of that's unclear.
