# PEPS GLOBAL Website

Static bilingual research-supply storefront ready for GitHub, Vercel, Netlify, or ordinary static hosting.

## Included
- Home, catalog, product detail, COA lookup, quality, shipping, wholesale, about, contact, account, start-company, terms, and privacy pages
- English / Español switching
- Product search
- Quote/cart drawer using browser storage
- Product quantity controls
- COA lookup demo
- Wholesale and contact inquiry demo forms
- Start-your-company guided inquiry
- Mobile navigation
- 21+ research-use access gate
- PEPS GLOBAL branding layer on product imagery

## Run locally
```powershell
python -m http.server 3000
```
Open `http://localhost:3000`.

## Push an existing repo
Copy these files into your existing website repository, then run:
```powershell
git add .
git commit -m "Launch PEPS GLOBAL website"
git push origin main
```

## New GitHub repository
```powershell
git init
git add .
git commit -m "Launch PEPS GLOBAL website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Production connections still required
The static website works as a front-end. Before accepting real transactions, connect your production authentication, database/inventory, email/CRM endpoints, actual COA PDFs, shipping logic, approved payment processor, analytics, and legal/compliance review.

## V7 PEPS GLOBAL image integration
This package has the latest PEPS GLOBAL vial renders wired into the existing asset filenames used by the site. No manual image-path changes are required after extraction.

Updated visuals include BPC-157, GHK-Cu, CJC-1295/Ipamorelin, Wolverine, Glow, MOTS-c, MK-677, Enclomiphene, the DNA hero visual, and a multi-vial group image.


## V8 fixes
- Removed fake product label overlays
- Homepage sections are no longer hidden
- Rebuilt homepage into Oath-style editorial flow
- Functional catalog sorting/category/max-price filtering
- Replaced key product assets with PEPS GLOBAL product photography
- Added cache-busting and stale service-worker cleanup


## V9 SMS workflow
- COA page opens a pre-filled SMS to 305-449-1784.
- Product detail pages include a Text Product Inquiry button.
- Cart/quote drawer includes Text Selected Items with all selected products pre-filled.
- Browsers cannot silently send an SMS; the customer reviews and sends it from their messaging app.
- Added additional homepage and COA imagery.

## V10 additions
- New page: become-wholesaler.html
- Full pricing table with +$20 added to each provided base price.
- Text selected order to 305-449-1784.
- COA page now focuses on text-to-request.
- Cart drawer adds a text-selected-items button.
- Payment link placeholder in app.js: PASTE_PAYMENT_LINK_HERE. Replace it with the real pay link when available.


## V11 fixes
- Product size buttons now update active state, selected size, displayed price, cart payload, and text inquiry payload.
- Quote drawer cleaned up with one clear Text Selected Items button and one Continue Shopping button.
- Removed overlapping/duplicate quote buttons from older versions.
- Fixed top navigation label issue where Sell Your Own could display as About.

## V12 fixes
- Pricing/package display now emphasizes Vials first, then MG.
- Primary order/sales rep number remains 305-449-1784.
- Added human Global Agent in English/Spanish: 305-315-7577.
- Added email inquiry: Globalpepsorg@gmail.com.
- Emphasized every order goes through a human sales rep, not AI/chatbot.
- Updated SMS order messages to request human sales rep review.

## V13 pricing correction
- Catalog now uses only the real product list and real 10-vial prices.
- Removed Enclomiphene and MK-677 from the live dynamic catalog.
- Product cards show 10 Vials first, MG each second.
- Main price includes ($/vial) next to it.
- Product detail variants, quote drawer, and SMS order text use the same real pricing.
