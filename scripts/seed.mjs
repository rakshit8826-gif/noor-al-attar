// Regenerates /data/*.json seed files.  Run: npm run seed
import fs from 'fs';
const out = (n, v) => fs.writeFileSync(new URL(`../data/${n}.json`, import.meta.url), JSON.stringify(v, null, 2));
const NOW = '2026-09-01T10:00:00.000Z';

// ── Categories ────────────────────────────────────────────────
const cats = [
  ['oud', 'Oud', 'عود', 'ऊद', '🪵', 'Deep, resinous oud from Assam and Cambodian agarwood.'],
  ['musk', 'Musk', 'مسك', 'मस्क', '🤍', 'Soft, skin-close white musks — the scent of clean prayer robes.'],
  ['rose', 'Rose', 'ورد', 'गुलाब', '🌹', 'Taifi and Damask rose, distilled the traditional way.'],
  ['amber', 'Amber', 'عنبر', 'अंबर', '🍯', 'Warm, honeyed amber and mukhallat blends.'],
  ['sandal-khus', 'Sandal & Khus', 'صندل وخس', 'चंदन व खस', '🌿', 'Cooling Mysore sandalwood and Kannauj khus.'],
  ['bakhoor', 'Bakhoor', 'بخور', 'बखूर', '🔥', 'Scented wood chips to perfume homes and gatherings.'],
  ['dhoop', 'Dhoop', 'دخون', 'धूप', '🪔', 'Dhoop cones and sticks — arriving soon.'],
  ['gift-sets', 'Gift Sets', 'أطقم الهدايا', 'उपहार सेट', '🎁', 'Hand-packed gift boxes for weddings, Eid and Diwali.'],
].map(([slug, en, ar, hi, icon, description], i) => ({ id: `c${i + 1}`, slug, name: { en, ar, hi }, icon, image: '', description, order: i + 1, visible: true }));
out('categories', cats);

// ── Products ──────────────────────────────────────────────────
// [id, slug, en, ar, hi, cat, family, gender, occasions, intensity, [top],[heart],[base], variants[[size,price,mrp,stock]], tags, featured, best, rating, reviews, short, long]
const P = [
  ['p1', 'royal-oud-al-malaki', 'Royal Oud Al Malaki', 'عود الملكي', 'रॉयल ऊद अल मलिकी', 'oud', 'oriental', 'unisex', ['wedding', 'festive'], 'strong', ['Saffron', 'Bergamot'], ['Agarwood', 'Rose'], ['Amber', 'Musk', 'Sandalwood'], [['6ml', 1399, 1699, 14], ['12ml', 2499, 2999, 9], ['30ml', 5499, 6499, 4]], ['bestseller', 'festive'], true, true, 4.9, 214, 'A regal Assam oud, aged for two winters, wrapped in saffron and rose.', 'Royal Oud Al Malaki is our signature — a slow-aged agarwood attar with the warmth of saffron and the quiet sweetness of Taifi rose. It opens boldly and settles into a resinous amber that lingers on clothes for days. Worn at weddings and Eid gatherings across Hyderabad and Lucknow.'],
  ['p2', 'musk-al-haram', 'Musk Al Haram', 'مسك الحرم', 'मस्क अल हरम', 'musk', 'fresh', 'unisex', ['prayer', 'daily'], 'light', ['White Tea', 'Cotton Flower'], ['White Musk', 'Jasmine'], ['Soft Amber'], [['3ml', 499, 599, 40], ['6ml', 899, 1099, 25], ['12ml', 1599, 1899, 12]], ['bestseller'], true, true, 4.8, 356, 'Clean, alcohol-free white musk — soft enough for the masjid, lasting through Jumu\'ah.', 'A quiet, skin-close musk in the tradition of the Haramain. Alcohol-free and gentle, it is the attar to reach for before prayer, or when you simply want to smell freshly bathed and cared for.'],
  ['p3', 'rose-taifi-attar', 'Rose Taifi Attar', 'عطر الورد الطائفي', 'रोज़ ताइफ़ी अत्तर', 'rose', 'floral', 'women', ['daily', 'wedding'], 'medium', ['Rose Petals', 'Lychee'], ['Taifi Rose', 'Peony'], ['Sandalwood', 'Musk'], [['6ml', 999, 1199, 20], ['12ml', 1799, 2199, 15]], ['bestseller', 'new'], true, true, 4.9, 187, 'Dewy Taifi rose in a sandalwood base — romantic, never sharp.', 'Hand-distilled rose in copper degs, then rested in sandalwood oil. Fresh at first, then a deep, velvety rose that feels like a garden after rain.'],
  ['p4', 'amber-al-qadeem', 'Amber Al Qadeem', 'عنبر القديم', 'अंबर अल क़दीम', 'amber', 'oriental', 'unisex', ['daily', 'festive'], 'medium', ['Cardamom'], ['Labdanum', 'Honey'], ['Amber', 'Vanilla'], [['6ml', 849, 999, 22], ['12ml', 1499, 1799, 18]], ['festive'], false, false, 4.7, 98, 'Honeyed old-world amber with a whisper of cardamom.', 'The scent of an old perfumer\'s shop — resin, honey and warm spice. Cozy in winter and beautiful over a plain cotton kurta.'],
  ['p5', 'white-oud', 'White Oud', 'العود الأبيض', 'व्हाइट ऊद', 'oud', 'woody', 'men', ['office', 'daily'], 'medium', ['Citrus', 'Green Cardamom'], ['Light Oud', 'Cedar'], ['White Musk'], [['3ml', 749, 899, 30], ['6ml', 1299, 1599, 16], ['12ml', 2299, 2699, 8]], ['new'], true, false, 4.6, 74, 'A lighter, modern oud made for the office and everyday wear.', 'An easy-to-wear oud without the heaviness — bright citrus over pale woods. Ideal for people meeting oud for the first time.'],
  ['p6', 'bakhoor-al-noor-50g', 'Bakhoor Al Noor (50g)', 'بخور النور', 'बखूर अल नूर', 'bakhoor', 'oriental', 'unisex', ['festive', 'prayer'], 'strong', ['Oud Smoke'], ['Rose', 'Frankincense'], ['Amber', 'Sandal'], [['50g', 699, 849, 35], ['100g', 1299, 1599, 20]], ['festive', 'bestseller'], true, true, 4.8, 141, 'Oud-soaked wood chips for charcoal burners — fills a room in minutes.', 'Place a small chip on a lit charcoal disc and let the smoke drift through the room. Traditional bakhoor for Eid mornings, Diwali evenings and welcoming guests.'],
  ['p7', 'sandal-safeed-attar', 'Sandal Safeed Attar', 'صندل سفيد', 'सैंडल सफ़ीद अत्तर', 'sandal-khus', 'woody', 'unisex', ['daily', 'prayer'], 'light', ['Milky Sandal'], ['Mysore Sandalwood'], ['Cedar', 'Musk'], [['6ml', 799, 949, 24], ['12ml', 1199, 1449, 20]], [], false, false, 4.7, 66, 'Creamy Mysore sandalwood — calm, meditative, lasts all day.', 'Distilled from aged Mysore sandalwood. A buttery, cooling attar that pairs with everything and never shouts.'],
  ['p8', 'jannatul-firdaus', 'Jannatul Firdaus', 'جنة الفردوس', 'जन्नतुल फ़िरदौस', 'rose', 'floral', 'unisex', ['daily'], 'light', ['Jasmine', 'Green Leaves'], ['Rose', 'Lily'], ['White Musk'], [['6ml', 599, 749, 30], ['12ml', 999, 1249, 28]], [], false, false, 4.5, 52, 'A garden-in-bloom floral: jasmine, rose and lily over soft musk.', 'Named for the gardens of paradise — bright, floral and gentle. A gift-worthy everyday attar.'],
  ['p9', 'mukhallat-dubai', 'Mukhallat Dubai', 'مخلط دبي', 'मुखल्लत दुबई', 'amber', 'oriental', 'unisex', ['wedding', 'festive'], 'strong', ['Saffron', 'Rose'], ['Oud', 'Ambergris'], ['Leather', 'Musk'], [['6ml', 1199, 1449, 12], ['12ml', 2199, 2599, 10]], ['limited', 'festive'], true, false, 4.8, 89, 'A Gulf-style mukhallat — oud, rose and amber blended into one rich sillage.', 'Inspired by the perfume souks of Dubai. Dense, luxurious and long-lasting — a statement for weddings and Eid nights.'],
  ['p10', 'khus-vetiver-attar', 'Khus (Vetiver) Attar', 'خس (فيتيفر)', 'खस अत्तर', 'sandal-khus', 'woody', 'men', ['daily', 'office'], 'medium', ['Green Grass'], ['Vetiver Root'], ['Mitti', 'Woods'], [['6ml', 649, 799, 26], ['12ml', 1099, 1349, 21]], ['new'], false, false, 4.6, 61, 'Cooling Kannauj khus — the smell of wet earth after the first monsoon rain.', 'Distilled from vetiver roots in Kannauj. A summer classic: earthy, green and wonderfully cooling.'],
  ['p11', 'oud-mubakhar', 'Oud Mubakhar', 'عود مبخّر', 'ऊद मुबख़्खर', 'oud', 'woody', 'men', ['wedding', 'festive'], 'strong', ['Smoke', 'Incense'], ['Cambodian Oud'], ['Leather', 'Resin', 'Amber'], [['3ml', 1699, 1999, 3], ['6ml', 2999, 3499, 5]], ['limited'], false, false, 4.9, 43, 'Smoked Cambodian oud — dark, resinous and unforgettable.', 'Our most collectible attar. Cambodian oud smoked over bakhoor chips, then rested for months. Made in small batches.'],
  ['p12', 'noor-gift-set', 'Noor Gift Set (3 × 6ml)', 'طقم نور الهدية', 'नूर गिफ़्ट सेट', 'gift-sets', 'oriental', 'unisex', ['festive', 'wedding'], 'medium', ['Rose', 'Saffron'], ['Musk', 'Oud'], ['Amber'], [['3 × 6ml', 2499, 3199, 18], ['5 × 6ml', 3999, 4999, 9]], ['bestseller', 'festive'], true, true, 4.9, 129, 'Musk, Rose and Oud in a hand-packed keepsake box — our most gifted set.', 'Three of our most loved attars in a velvet-lined box with a handwritten card. Ideal for Eid, Diwali, nikah and anniversaries.'],
];
const colls = { 'diwali-gifting': ['p12', 'p6', 'p9', 'p1'], 'wedding-favours': ['p1', 'p3', 'p9', 'p12', 'p11'], 'eid-collection': ['p2', 'p6', 'p9', 'p1', 'p12'], bestsellers: ['p1', 'p2', 'p3', 'p6', 'p12'], 'new-arrivals': ['p3', 'p5', 'p10'] };
const products = P.map(([id, slug, en, ar, hi, category, fam, gender, occ, intensity, top, heart, base, vars, tags, featured, best, rating, reviewCount, short, long], i) => ({
  id, slug, name: { en, ar, hi }, sku: `NAA-${String(i + 1).padStart(3, '0')}`, category,
  collections: Object.entries(colls).filter(([, ids]) => ids.includes(id)).map(([s]) => s),
  tags, shortDescription: { en: short }, longDescription: { en: long },
  fragranceFamily: fam, gender, occasions: occ, intensity, notes: { top, heart, base },
  variants: vars.map(([size, price, mrp, stock]) => ({ size, price, mrp, stock })), currency: 'INR',
  images: [{ url: '/images/placeholder.svg', alt: `${en} attar bottle` }],
  seo: { title: `${en} | Authentic Attar | Noor Al Attar`, description: short },
  status: 'published', featured, bestseller: best, giftWrapAvailable: true, codAvailable: true,
  rating, reviewCount, createdAt: NOW, updatedAt: NOW,
}));
out('products', products);

out('collections', [
  ['diwali-gifting', 'Diwali Gifting', 'هدايا ديوالي', 'दीवाली उपहार', 'Light up the festival with attars that feel like a celebration.'],
  ['wedding-favours', 'Wedding Favours', 'هدايا الأعراس', 'शादी के उपहार', 'Nikah, shaadi, sangeet — attars for the couple, family and guests.'],
  ['eid-collection', 'Eid Collection', 'مجموعة العيد', 'ईद कलेक्शन', 'Musk, oud and bakhoor for Eid mornings.'],
  ['bestsellers', 'Bestsellers', 'الأكثر مبيعاً', 'बेस्टसेलर', 'The attars our customers reorder again and again.'],
  ['new-arrivals', 'New Arrivals', 'وصل حديثاً', 'नए आगमन', 'Fresh from the distillery.'],
].map(([slug, en, ar, hi, description], i) => ({ id: `col${i + 1}`, slug, name: { en, ar, hi }, description, banner: '', productIds: colls[slug], order: i + 1, visible: true })));

out('banners', [
  { id: 'b1', title: 'Diwali Sale — Flat 20% off', subtitle: 'Gift the fragrance of tradition. Use code DIWALI20 on WhatsApp.', image: '', ctaText: 'Shop Diwali gifts', ctaLink: '/diwali', position: 'hero', startDate: '2026-09-01T00:00:00.000Z', endDate: '2026-11-08T23:59:00.000Z', active: true, tone: 'amber' },
  { id: 'b2', title: 'Wedding season, perfumed', subtitle: 'Bulk & favour orders for nikah and shaadi. Custom boxes available.', image: '', ctaText: 'Wedding favours', ctaLink: '/wedding', position: 'hero', startDate: '2026-09-01T00:00:00.000Z', endDate: '2027-02-28T23:59:00.000Z', active: true, tone: 'rose' },
  { id: 'b3', title: 'Oud, from our hands to yours', subtitle: 'Kannauj distillation meets Arabian agarwood — small batches, honest oils.', image: '', ctaText: 'Explore oud', ctaLink: '/shop/oud', position: 'hero', startDate: '2026-01-01T00:00:00.000Z', endDate: '2027-12-31T23:59:00.000Z', active: true, tone: 'oud' },
]);

out('testimonials', [
  ['Ayesha Khan', 'Hyderabad', 5, 'Musk Al Haram is exactly what I wear to Jumu\'ah. Soft, clean, and lasts the whole day. The packing was beautiful too.'],
  ['Rohit Malhotra', 'Delhi', 5, 'Bought the Noor Gift Set for my brother\'s wedding. Everyone asked where it was from. Shukriya for the quick WhatsApp support!'],
  ['Farhan Siddiqui', 'Lucknow', 5, 'Finally an oud that smells real. Royal Oud Al Malaki reminds me of my grandfather\'s attar box.'],
  ['Meera Nair', 'Bengaluru', 4, 'Rose Taifi is gorgeous — not sharp like store perfumes. Delivery took 3 days.'],
  ['Zainab Patel', 'Mumbai', 5, 'Ordered bakhoor for Eid and the whole house smelled divine. Will reorder for Diwali.'],
  ['Imran Qureshi', 'Dubai (NRI)', 5, 'Sent gifts to my parents in Bhopal via WhatsApp — smooth and trustworthy.'],
].map(([name, city, rating, text], i) => ({ id: `t${i + 1}`, name, city, rating, text, avatar: '', verified: true, order: i + 1, visible: true })));

const post = (id, slug, title, excerpt, tags, date, content) => ({ id, slug, title, cover: '', excerpt, content, author: 'Noor Al Attar Editorial', tags, publishedAt: date, status: 'published', seoTitle: `${title} | Noor Al Attar`, seoDescription: excerpt });
out('blog', [
  post('bl1', '5-attars-every-indian-groom-should-own', '5 Attars Every Indian Groom Should Own', 'From nikah morning to sangeet night — five attars that complete a groom\'s wardrobe.', ['Attar Guide', 'Gifting'], '2026-08-20T09:00:00.000Z',
    'A wedding is a week of moments, and each deserves its own scent. Here are the five attars we recommend to grooms — and the people who shop for them.\n\n## 1. Royal Oud Al Malaki for the ceremony\nDeep and regal, it photographs well and lasts through long rituals. Apply a small dab behind the ears and on the wrists.\n\n## 2. Musk Al Haram for the nikah morning\nSoft and clean. Musk is traditionally worn for prayer, and it stays gentle in close company.\n\n## 3. Sandal Safeed for the mehendi\nCooling and calm, perfect for a hot, crowded afternoon.\n\n## 4. Amber Al Qadeem for the reception\nWarm and inviting for the evening, especially in winter weddings.\n\n## 5. Khus for the day after\nThe cooling scent of khus is a gift after days of celebration.\n\nStill choosing? Message us on WhatsApp and we will build a wedding set for you.'),
  post('bl2', 'oud-101-understanding-agarwood', 'Oud 101: Understanding Agarwood', 'What makes oud so precious, and how to choose one you\'ll love.', ['Oud', 'Attar Guide'], '2026-08-05T09:00:00.000Z',
    'Oud is the resin-rich heartwood of the agarwood tree, formed when the tree responds to a fungal infection. It takes decades — which is why real oud is expensive.\n\n## Assam vs Cambodian oud\nAssam oud is animalic, earthy and deep. Cambodian oud is sweeter, with fruity and leathery notes.\n\n## Oud vs musk\nOud is bold and woody; musk is soft and skin-like. Many people wear musk daily and save oud for occasions.\n\n## How to wear oud\nStart with one dab. A little goes a long way — oud blooms on skin over an hour.'),
  post('bl3', 'how-to-layer-attar', 'How to Layer Attar Like a Pro', 'Simple pairings that make your attar last longer and smell uniquely yours.', ['DIY', 'Attar Guide'], '2026-07-15T09:00:00.000Z',
    'Layering is an old tradition: a light musk base, a floral heart and a dab of oud on top.\n\n## Start with a base\nApply unscented oil or a light musk to pulse points after a shower.\n\n## Add your heart\nRose or amber over musk gives sweetness and depth.\n\n## Finish with oud\nA very small dab of oud on the wrists or on your clothes\' inner fold makes it last for days.\n\n## Where to apply\nWrists, behind the ears, base of the throat. Do not rub — let the oils settle.\n\n## How to store\nKeep bottles tightly closed, away from sunlight and heat.'),
]);

out('coupons', [
  { id: 'cp1', code: 'DIWALI20', type: 'percent', value: 20, minOrder: 1499, expiry: '2026-11-10', usageLimit: 500, active: true },
  { id: 'cp2', code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, expiry: '2027-12-31', usageLimit: 0, active: true },
]);

out('settings', {
  brand: { name: { en: 'Noor Al Attar', ar: 'نور العطار', hi: 'नूर अल अत्तर' }, tagline: { en: 'The Essence of the Orient', ar: 'عطر الشرق الأصيل', hi: 'पूरब की खुशबू' }, logo: '', favicon: '' },
  contact: { whatsapp: '919876543210', phone: '+91 98765 43210', email: 'hello@nooralattar.in', address: 'Shop 12, Attar Bazaar, Kannauj, Uttar Pradesh 209725', mapEmbed: 'https://www.google.com/maps?q=Kannauj,Uttar+Pradesh&output=embed', hours: 'Mon–Sat 10:00 am – 8:00 pm IST' },
  business: { legalName: 'Noor Al Attar Traders', gstin: '09XXXXXXXXXXXZX', pan: 'XXXXXXXXXX' },
  shipping: { freeThreshold: 1499, flatRate: 79, deliveryText: 'Metros 2–3 working days · Rest of India 4–7 working days', codNote: 'Cash on Delivery available on orders up to ₹10,000 (₹49 COD handling on orders below ₹1,499).',
    table: [{ zone: 'Metros (Delhi NCR, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad)', time: '2–3 days', charge: '₹79 · Free above ₹1,499' }, { zone: 'Rest of India', time: '4–7 days', charge: '₹79 · Free above ₹1,499' }, { zone: 'International (USA / UK / UAE)', time: '7–12 days', charge: 'On request via WhatsApp' }] },
  social: { instagram: 'https://instagram.com/nooralattar', facebook: 'https://facebook.com/nooralattar', youtube: 'https://youtube.com/@nooralattar', x: 'https://x.com/nooralattar', pinterest: '' },
  seo: { title: 'Noor Al Attar — Authentic Arabic Attar, Oud & Bakhoor in India', description: 'Shop alcohol-free attars, oud, musk and bakhoor from Kannauj and Arabia. Order on WhatsApp. Free shipping above ₹1,499. COD available.', ogImage: '', keywords: 'attar, ittar, oud, bakhoor, musk, Kannauj, Arabic perfume India' },
  analytics: { ga4: '', metaPixel: '' },
  announcements: ['🚚 Free shipping across India on orders above ₹1,499', '🎁 Free gift wrap on all orders', '🪔 Diwali Sale — Flat 20% off · Code: DIWALI20'],
  currencyRates: { USD: 0.012, AED: 0.044 },
  features: { darkMode: true, wishlist: true, compare: true, blog: true, quiz: true, instagram: true, exitIntent: true },
});
out('inquiries', []);
out('activity', []);
console.log('Seed data written to /data');
