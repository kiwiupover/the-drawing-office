# Resend setup — contact form email delivery

## What we're doing

Setting up the email service that delivers contact-form submissions on the new site to `info@thedrawingoffice.com`. When someone fills out the form on `thedrawingoffice.com/contact`, the message needs to land in your inbox — that requires a small third-party service to actually send the email.

We're using **Resend** (resend.com). It's free for what we need (3,000 emails/month, 100/day — the form will use maybe one a week), modern, and reliable. No credit card required.

**Why your account, not mine:** the account needs to belong to you so that (a) it survives long after I'm out of the picture, and (b) the domain `thedrawingoffice.com` is verified under your ownership, not mine.

The whole thing takes about 15 minutes of clicks on your end, then you send me one API key and I do the rest.

---

## Step 1 — Sign up at resend.com

1. Go to **https://resend.com** and click **Sign Up**.
2. Use the email address you want tied to the business — `info@thedrawingoffice.com` if you can log into it, otherwise your personal email is fine.
3. Confirm the email Resend sends you and finish setup.
4. **Skip** anything that asks for a credit card or a paid plan — the free tier covers us comfortably.

---

## Step 2 — Add and verify the domain `thedrawingoffice.com`

This tells Resend "yes, I own this domain and you're allowed to send email on its behalf." It does **not** change where your website goes or where your existing email is delivered.

1. In the Resend dashboard, go to **Domains → Add Domain**.
2. Enter `thedrawingoffice.com` and submit.
3. Resend will show you **3 DNS records** to add — typically one `MX` and two `TXT` records (one for SPF, one for DKIM). Each has a Name/Host, Type, and Value. Leave that page open.
4. Log in to wherever DNS is managed for `thedrawingoffice.com` (likely Squarespace still, same place we'll be doing the DNS cutover — see `dns-cutover.md`).
5. Add each of the 3 records exactly as Resend shows them. Copy/paste — don't retype, the values are long and easy to fat-finger.
6. Wait 5–30 minutes for DNS to propagate, then click **Verify** back in the Resend dashboard. The status should flip to green.

**Important notes:**

- **These records are safe to add right now**, even before the DNS cutover. They only affect outbound email *from* the domain — they don't change where the website lives or where your `info@` inbox receives mail.
- **If you've already done the DNS cutover by the time you do this**, same process, just done in the new DNS panel (Vercel or wherever) instead of Squarespace.
- **Don't delete any existing MX or TXT records.** Add Resend's records alongside whatever's already there. If Resend's MX record conflicts with an existing one for your inbox, stop and ping me — we'll sort it without breaking your email.

---

## Step 3 — Create an API key

1. In the Resend dashboard, go to **API Keys → Create API Key**.
2. **Name:** `the-drawing-office-prod` (or anything memorable — this just helps us recognise it later).
3. **Permission:** choose **Sending access** (not "Full access" — we want this key to only be able to send email, nothing else, in case it ever leaks).
4. **Domain:** restrict it to `thedrawingoffice.com` (so it can't send from anything else).
5. Click **Create**.
6. **Copy the key.** It starts with `re_` followed by a long string. Resend only shows it to you **once** — if you close the dialog without copying it, you have to create a new one. No big deal if you do, just delete the old one.

---

## Step 4 — Send the key to me securely

The API key is a password. Anyone who has it can send email pretending to be `thedrawingoffice.com`. So we don't want it floating around in regular email or chat.

Pick one:

- **Best:** a one-time-view link via **https://onetimesecret.com** — paste the key, get a link, send me the link. After I open it once, it's gone forever.
- **Also fine:** **1Password Send** or **Bitwarden Send** if you use either.
- **Acceptable:** Signal or iMessage, and delete the message after I confirm I have it.
- **Please don't:** regular email, SMS, or pasting it into a shared doc.

---

## Step 5 — What I do on my end (just so you know)

Once I have the key:

1. I add it to the site's hosting config (Vercel) as a secret env var called `RESEND_API_KEY`.
2. I redeploy the site.
3. I submit a test message through the contact form and confirm it lands in `info@thedrawingoffice.com`.
4. I'll send you a "✅ tested, live" message so you know it's working.

After that, the form just works. Every submission goes straight to your inbox with the sender's email as the reply-to address — so you can hit "Reply" and it goes back to the person who filled out the form.

---

## Rollback / safety

If anything ever feels off — the key got leaked, you want to shut it down, whatever — log into Resend, find the API key, and click **Revoke**. The contact form stops working immediately. Nothing else is affected (the website still loads, your existing email still works). Tell me and I'll generate a fresh key with you and we're back online in 5 minutes.

You can also delete the whole Resend account at any time. It's a single tool doing a single job; no lock-in.

---

## Summary for you — TL;DR

1. Sign up at **resend.com** (free, no card).
2. Add `thedrawingoffice.com` as a domain → add the 3 DNS records Resend shows you → click Verify.
3. Create an API key (Sending access, scoped to `thedrawingoffice.com`).
4. Send the key to me via **onetimesecret.com** (or 1Password Send / Signal).
5. I'll wire it up and confirm the form works.

Shout if any step is unclear or if Resend's UI doesn't match what I described — they tweak it occasionally.
