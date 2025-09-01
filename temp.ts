// (() => {
//   // Helpers
//   const randInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1)) + min;
//   const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
//   const clean = (s) => (s || "").toString().replace(/\s+/g, " ").trim();
//   const slugify = (s) =>
//     clean(s)
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   const ensureSixDigit = () => String(randInt(100000, 999999));
//   const ensurePhone = (nameSeed) => {
//     // produce +91xxxxxxxxxx (12 chars including +) which matches /^\+?\d{10,15}$/
//     const base = String(randInt(6000000000, 9999999999)); // 10-digit starting from 6..9 (India style)
//     return "+91" + base;
//   };
//   const ensureEmail = (name) => {
//     const base = slugify(name).slice(0, 30) || "school";
//     const num = randInt(1, 9999);
//     return `${base}${num}@example.com`;
//   };
//   const ensureWebsite = (href, name) => {
//     if (!href) {
//       return `https://www.${slugify(name || "school")}.example`;
//     }
//     if (href.startsWith("http://") || href.startsWith("https://")) return href;
//     // if href looks like 'slug' or 'slug?enq=1', use uniformapp.in as seen on page
//     return `https://uniformapp.in/${href.replace(/^\//, "")}`;
//   };
//   const ensureImageURL = (src) => {
//     if (!src) return "https://via.placeholder.com/400x300?text=No+Image";
//     if (/^https?:\/\//i.test(src)) return src;
//     // build absolute URL from current location
//     try {
//       const base = location.origin.replace(/\/$/, "");
//       return base + "/" + src.replace(/^\//, "");
//     } catch (e) {
//       return src;
//     }
//   };
//   const pickStateForCity = (city) => {
//     const map = {
//       gurgaon: "Haryana",
//       gurugram: "Haryana",
//       hyderabad: "Telangana",
//       mumbai: "Maharashtra",
//       delhi: "Delhi",
//       bangalore: "Karnataka",
//       bengaluru: "Karnataka",
//       chennai: "Tamil Nadu",
//       kolkata: "West Bengal",
//       noida: "Uttar Pradesh",
//       gaziabad: "Uttar Pradesh",
//     };
//     if (!city)
//       return pick([
//         "Haryana",
//         "Telangana",
//         "Maharashtra",
//         "Karnataka",
//         "Delhi",
//         "Tamil Nadu",
//         "Uttar Pradesh",
//       ]);
//     const key = city.toString().toLowerCase();
//     return (
//       map[key] ||
//       pick([
//         "Haryana",
//         "Telangana",
//         "Maharashtra",
//         "Karnataka",
//         "Delhi",
//         "Tamil Nadu",
//         "Uttar Pradesh",
//         "Rajasthan",
//         "Kerala",
//       ])
//     );
//   };

//   // Main extraction
//   const container = document.querySelector("#post-data");
//   if (!container) {
//     console.error("No #post-data element found on the page.");
//     return;
//   }

//   const cards = Array.from(container.querySelectorAll(".course-box"));
//   const results = cards.map((card, idx) => {
//     // 1) Name: prefer hidden input.get_sch_name, else h4 text
//     let name = "";
//     const inputName = card.querySelector("input.get_sch_name");
//     if (inputName && inputName.value) name = clean(inputName.value);
//     if (!name) {
//       const h4 = card.querySelector("h4");
//       if (h4) name = clean(h4.textContent);
//     }

//     // 2) Board: try to look for 'CBSE' or 'State Board' text inside card
//     let board = "";
//     const boardSpan = Array.from(card.querySelectorAll("span,div")).find(
//       (el) => {
//         const t = (el.textContent || "").toLowerCase();
//         return (
//           t.includes("cbse") ||
//           t.includes("state board") ||
//           t.includes("isc") ||
//           t.includes("icse")
//         );
//       }
//     );
//     if (boardSpan) {
//       const t = clean(boardSpan.textContent);
//       if (/cbse/i.test(t)) board = "CBSE";
//       else if (/state board/i.test(t)) board = "State Board";
//       else if (/icse/i.test(t)) board = "ICSE";
//       else if (/isc/i.test(t)) board = "ISC";
//       else board = t;
//     }
//     if (!board) board = pick(["CBSE", "State Board", "ICSE", "IB"]); // fallback

//     // 3) Medium: not present in HTML — pick based on board or default
//     let medium = "";
//     if (/cbse|icse|ib/i.test(board)) medium = "English";
//     else medium = pick(["English", "English & Hindi", "Hindi"]);

//     // 4) Type: choose a sensible default (Private/Public/Aided)
//     const type = pick(["Private", "Public", "Aided", "Government"]);

//     // 5) City: from small tag or get_sch_city input
//     let city = "";
//     const cityInput = card.querySelector("input.get_sch_city");
//     if (cityInput && cityInput.value) city = clean(cityInput.value);
//     if (!city) {
//       const small = card.querySelector("small");
//       if (small) city = clean(small.textContent);
//     }
//     if (!city) city = pick(["Hyderabad", "Gurgaon", "Delhi", "Mumbai"]);

//     // 6) State: map from city, fallback random
//     const state = pickStateForCity(city);

//     // 7) Pin code (6-digit): if there's any digit sequence of 6 in text, use it; else random
//     let pinCode = "";
//     const anyText =
//       (card.textContent || "") + " " + (card.querySelector("img")?.src || "");
//     const foundPin = (anyText.match(/\b(\d{6})\b/) || [])[1];
//     pinCode = foundPin || ensureSixDigit();

//     // 8) Address: prefer a <p> inside card else build one
//     let address = "";
//     const p =
//       card.querySelector(".course-details p") || card.querySelector("p");
//     if (p && clean(p.textContent).length >= 5) address = clean(p.textContent);
//     if (!address) {
//       // try to use h4 + city
//       address =
//         (name ? `${name}, ` : "") + (city ? `${city}` : "Address not provided");
//       if (address.length < 5) address = `${city} - Address not provided`;
//     }

//     // 9) Fees: try to find numbers inside card text; else random between 10k - 2L
//     let feesMin = null,
//       feesMax = null;
//     const nums = (card.textContent || "").match(/(\d{4,7})/g) || [];
//     if (nums.length >= 2) {
//       feesMin = Number(nums[0]);
//       feesMax = Number(nums[1]);
//     } else if (nums.length === 1) {
//       feesMin = Number(nums[0]);
//       feesMax = feesMin + randInt(1000, 50000);
//     } else {
//       feesMin = randInt(5000, 50000);
//       feesMax = feesMin + randInt(1000, 150000);
//     }
//     // sanitize non-negative, integers
//     feesMin = Math.max(0, Math.round(feesMin));
//     feesMax = Math.max(feesMin, Math.round(feesMax));

//     // 10) Phone: try to find phone-like pattern, else generate
//     let phone = "";
//     const phoneMatch = (card.textContent || "").match(/(\+?\d[\d\-\s]{8,}\d)/);
//     if (phoneMatch) {
//       phone = phoneMatch[1].replace(/[\s\-()]/g, "");
//       // ensure digits-only except optional leading +
//       if (!/^\+?\d{10,15}$/.test(phone)) phone = ensurePhone(name);
//     } else {
//       phone = ensurePhone(name);
//     }

//     // 11) Email: try to find email otherwise synthesize
//     let email = "";
//     const emailMatch = (card.textContent || "").match(
//       /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
//     );
//     if (emailMatch) email = emailMatch[0].toLowerCase();
//     else email = ensureEmail(name || city);

//     // 12) Website: from anchor href inside the main image link or fallback
//     let website = "";
//     const mainLink = card.querySelector("a[href]");
//     if (mainLink) {
//       website = ensureWebsite(mainLink.getAttribute("href"), name || city);
//     } else {
//       website = ensureWebsite(null, name || city);
//     }

//     // 13) Image: prefer img.sch src
//     let imgSrc = "";
//     const img = card.querySelector("img.sch, img");
//     if (img && (img.getAttribute("src") || img.dataset?.src)) {
//       imgSrc = img.getAttribute("src") || img.dataset.src;
//       imgSrc = ensureImageURL(imgSrc);
//     } else {
//       imgSrc = ensureImageURL(null);
//     }

//     // ensure all strings are cleaned
//     const cleanName = clean(name || `School ${idx + 1}`);
//     const cleanBoard = clean(board);
//     const cleanMedium = clean(medium);
//     const cleanType = clean(type);
//     const cleanCity = clean(city);
//     const cleanState = clean(state);
//     const cleanPin = String(pinCode).padStart(6, "0");
//     const cleanAddress = clean(address);
//     const cleanPhone = String(phone);
//     const cleanEmail = clean(email);
//     const cleanWebsite = clean(website);
//     const cleanImage = clean(imgSrc);

//     return {
//       name: cleanName,
//       board: cleanBoard,
//       medium: cleanMedium,
//       type: cleanType,
//       city: cleanCity,
//       state: cleanState,
//       pinCode: cleanPin,
//       address: cleanAddress,
//       feesMin: Number(feesMin),
//       feesMax: Number(feesMax),
//       phone: cleanPhone,
//       email: cleanEmail,
//       website: cleanWebsite,
//       image: cleanImage,
//     };
//   });

//   // Output: log and copy to clipboard (if permitted)
//   console.log("Extracted schools:", JSON.stringify(results, null, 2));
//   // try {
//   //   if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
//   //     navigator.clipboard
//   //       .writeText(JSON.stringify(results, null, 2))
//   //       .then(() => {
//   //         console.log("JSON copied to clipboard.");
//   //       })
//   //       .catch(() => {
//   //         console.warn("Could not copy to clipboard (permission denied).");
//   //       });
//   //   } else {
//   //     console.warn("Clipboard API not available; JSON not copied.");
//   //   }
//   // } catch (e) {
//   //   console.warn("Clipboard write failed:", e);
//   // }

//   // return the array so you can inspect it directly in console
//   return results;
// })();
