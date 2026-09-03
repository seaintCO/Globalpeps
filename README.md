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

## V14 logo + image update
- Added the supplied PEPS GLOBAL globe/vial logo to header, footer, age gate, and favicon.
- Replaced main vial photography with the newly generated PEPS GLOBAL branded product photos.
- Uses dedicated branded images for BPC-157, Tirzepatide, Semaglutide, GHK-Cu, CJC/Ipamorelin, Wolverine/BPC+TB, GLOW, MOTS-c, Epithalon, and Tesamorelin.
- Product families without a dedicated photo use a neutral PEPS GLOBAL branded research-compound visual so an incorrect compound name is never shown.
- Rebuilt the group/catalog imagery using the new branded vial photography.

## V15 grouped catalog + procurement wording
- One card per product family instead of repeated variants.
- Shows 10 Vials, dosage/volume options, starting price per vial, and honest kit-total range.
- Added new product families and pricing.
- Reworded quote buttons for procurement/research quote requests.
- Added wishlist and first institutional quote popup.
- Changed Start Your Own / Sell Your Own to Become a Supplier.


## V16 catalog dropdown fix
- Rebuilt catalog controls with safe dropdowns.
- Fixed issue where Featured / Low-to-High / High-to-Low or Category clicks could open the first Bac.water product.
- Dropdowns now sit above the catalog grid with proper z-index and event handling.
- Old duplicate dropdowns are hidden.


## V20 hyper-real product imagery
- Replaced catalog/product images for Bac.water, Tirzepatide, Semaglutide, BPC-157, Retatrutide, and Tesamorelin with the new integrated PEPS GLOBAL product photography.

## V21 hyper-real image refresh
- Replaced GHK-Cu image.
- Replaced BPC-157 + TB500 blend image.
- Replaced 70MG and 80MG blend images.
- Replaced IGF-1 LR3, MOTS-c, Epithalon, 5-AMINO-1MQ, AOD9604, and Lemon Bottle images.
- Added image cache-busting so the live catalog reloads the new product photography.


## V22 image refresh
Replaced remaining catalog images with realistic PEPS GLOBAL vial renders and added v22 cache-busting to product imagery.

## V23
- Rebuilt the remaining catalog images that still looked pasted-on or unfinished.
- Replaced: Melanotan II, FOXO4-DRI, L-Carnitine, AHK-CU, Glutathione, Lipo-C, MIC (Lipo-C + B12), VIP, B12, PT141, Thymosin Alpha 1, Snap-8, ARA 290, KPV, Selank, Semax, SS-31, Thymalin / Thymulin, and Kisspeptin.
- Image cache bumped to v23.

## V24
Replaced the first 10 remaining catalog images with new PEPS GLOBAL hyper-real vial renders:
Melanotan II, FOXO4-DRI, L-Carnitine, AHK-CU, Glutathione, Lipo-C, MIC (Lipo-C + B12), VIP, B12, and PT141.
Image cache bumped to v24.


## V25
Added/replaced the next 9 PEPS GLOBAL catalog product images:
Thymosin Alpha 1, Snap-8, ARA 290, KPV, Selank, Semax, SS-31, Thymalin / Thymulin, and Kisspeptin.
Image cache bumped to v25.


## V26 — DSIP
Added DSIP as the final grouped catalog product.
- DS5: 5MG — $176 kit total ($17.60/vial)
- DS10: 10MG — $305 kit total ($30.50/vial)
- New PEPS GLOBAL DSIP product image
- Image/cache version bumped to v26


## V28 — DSIP image correction
- Replaced DSIP image with the corrected hyper-real PEPS GLOBAL vial render.
- DSIP remains one grouped catalog product:
  - DS5: 5MG — $176 kit total
  - DS10: 10MG — $305 kit total
- Cache version bumped to v28.
