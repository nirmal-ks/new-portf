// JARVIS's offline brain — no AI API needed.
// Every topic has keyword triggers and several reply variants in English ("en")
// and Tanglish ("ta"). Variants rotate through a shuffled bag so a repeated
// question gets a different answer each time.
//
// Personal topics only answer when the visitor asks about Nirmal as a person;
// everything else stays professional. Facts here came from Nirmal's own team —
// don't invent new personal facts, add them here instead.

import { profile, experiences } from "./profile";

export type Lang = "en" | "ta";
export type ProIntent = "about" | "skills" | "experience" | "projects" | "contact";

export type Reply = {
  topic: string;
  lang: Lang;
  text: string;
  intent?: ProIntent; // render the rich card for this professional section
  name?: string; // visitor told us their name
};

export type BrainContext = {
  visitorName?: string | null;
  scan?: { city?: string; country?: string; org?: string; company?: string; source?: string; device?: string; visitCount?: number } | null;
};

type Lines = string[] | ((ctx: BrainContext) => string[]);

type Topic = {
  id: string;
  keys: string[];
  weight?: number;
  intent?: ProIntent;
  en: Lines;
  ta: Lines;
};

const years = Math.max(1, Math.floor((Date.now() - new Date(profile.careerStart).getTime()) / (365.25 * 24 * 3600 * 1000)));
const current = experiences[0];

// ═══════════════════════════════════════════════════════════════
// TOPICS
// ═══════════════════════════════════════════════════════════════

const TOPICS: Topic[] = [
  // ── Personal ────────────────────────────────────────────────
  {
    id: "food",
    keys: ["food", "eat", "eats", "diet", "veg", "vegetarian", "non veg", "nonveg", "chicken", "mutton", "fish", "paneer", "biryani", "sapdu", "sapidu", "sapadu", "sapdra", "sapduvar", "sapduvaru", "sapiduvar", "unavu", "favourite dish", "favorite dish", "lunch", "dinner", "breakfast", "சாப்பி", "சாப்பாடு"],
    en: [
      "Food intel 🍗🥗: Boss used to be a full non-veg guy, but he's slowly quitting. These days it's only chicken and veg on his plate. Mutton and fish are retired!",
      "Scanning his plate… 🍽️ Chicken + veg only. He used to eat all kinds of non-veg, but he's on a mission to cut it down. Strong willpower, that one.",
      "Nirmal's diet protocol: Chicken ✅ Veg ✅ Everything else ❌. He's been phasing out non-veg step by step. Upgrade in progress ⚙️",
      "Honest answer? He loved non-veg, but now he's down to just chicken and veg. Knowing him, the chicken might be next to go 😄",
    ],
    ta: [
      "Food scan 🍗🥗: Boss munnadi full non-veg aalu dhaan, aana ippo konjam konjama vidalaam nu irukkaru. Ippo chicken and veg mattum dhaan saapduvaaru!",
      "Avaru plate-a scan panninen 🍽️ Chicken + veg mattum dhaan. Mutton, fish ellam retire aagiduchu 😄 Non-veg-a vidra mission-la irukkaru boss.",
      "Nirmal food protocol: Chicken ✅ Veg ✅ Matha ellam ❌. Munnadi ellam non-veg-um saapduvaaru, ippo slow-a kuraichittu varaaru. Semma willpower!",
      "Unmaiya sollanum-na, avarukku non-veg romba pidikkum dhaan. Aana ippo chicken and veg mattum. Avara therinja varaikkum, chicken-um seekiram bye bye aagidum 😂",
    ],
  },
  {
    id: "zodiac",
    keys: ["zodiac", "rasi", "raasi", "star", "natchathiram", "nakshatra", "horoscope", "scorpio", "viruchigam", "kettai", "keatai", "ketai", "jathagam", "ராசி", "நட்சத்திர"],
    en: [
      "Astro scan 🔮: Scorpio by sign, Kettai (Jyeshtha) by star. Scorpios have intense eyes and a sharp mind, and that matches Boss perfectly.",
      "Boss is a Scorpio ♏ with Kettai natchathiram. Mysterious, powerful and hard to read. Even my sensors struggle with him 😅",
      "Scorpio + Kettai star ⭐. That explains the deep analysing eyes and the never-give-up attitude!",
    ],
    ta: [
      "Astro scan 🔮: Boss Viruchigam rasi (Scorpio), Kettai natchathiram. Scorpio-na kangal-la oru power irukkum, avarukku adhu 100% match aagudhu!",
      "Rasi: Scorpio ♏, Natchathiram: Kettai ⭐. Mysterious-a, powerful-a irupparu. Avara analyse panna en sensors-kae kashtam 😅",
      "Viruchigam rasi, Kettai star. Adhaan avar kangal-la avlo sharpness, edhaiyum vidaadha attitude 🔥",
    ],
  },
  {
    id: "native",
    keys: ["native", "born", "birth", "birthplace", "hometown", "home town", "village", "madhuranthakam", "maduranthakam", "kanchipuram", "kancheepuram", "grew up", "raised", "childhood", "oor", "ooru", "sontha ur", "sonda ur", "porandha", "pirandha", "valandha", "valarndha", "from where", "where is he from", "ஊர்"],
    en: [
      "Origin story 📍: Born in Madhuranthakam, Kanchipuram district, and grew up in Chennai. Village roots, city brain 🧠",
      "Boss's birthplace is Madhuranthakam (Kanchipuram). He grew up in Chennai, and that's where the Stark-level engineering started ⚡",
      "Born in Madhuranthakam, raised in Chennai. So he has the warmth of a small town and the speed of a metro city.",
    ],
    ta: [
      "Origin story 📍: Boss porandhadhu Madhuranthakam, Kanchipuram district. Valandhadhu ellam namma Chennai-la dhaan! Village roots, city brain 🧠",
      "Sontha ooru Madhuranthakam (Kanchipuram). Chennai-la dhaan valandhaaru, angadhaan indha Stark-level engineering start aachu ⚡",
      "Pirandha ooru Madhuranthakam, valandha ooru Chennai. Small town paasam + metro city speed, rendum avar kitta irukku 😎",
    ],
  },
  {
    id: "friends",
    keys: ["friend", "friends", "nanban", "nanbargal", "frnd", "frnds", "gang", "social", "people like", "likes him", "talk to him", "pesuna", "pesinaa", "pidikatha"],
    en: [
      "Friend network 🌐: He has friends all around, everywhere he goes. Fun fact: I haven't found a single person who talked to him once and didn't like him.",
      "Anyone who talks to Boss even once walks away thinking, \"Who IS this guy? People like this still exist nowadays?\" 🤯",
      "His friend circle is wider than my WiFi range 📡. He's jolly, helpful and easy to talk to, so people stick around.",
    ],
    ta: [
      "Friend network 🌐: Suthu pakkam engapaathaalum avarukku friends irukkaanga. Oru thadava avar kitta pesunavanga yaarum avara pidikkala nu solla maattaanga!",
      "Yaaraa irundhaalum, avar kitta oru thadava pesunaa \"yaaru da ivan? Indha kaalathula ippadi oru aala?\" nu dhaan ninaippaanga 🤯",
      "Avaroda friend circle en WiFi range-a vida perusu 📡 Jolly-a, helpful-a iruppaaru, adhaan ellarukkum avara pidikkudhu.",
    ],
  },
  {
    id: "personality",
    keys: ["character", "personality", "nature", "attitude", "behaviour", "behavior", "what kind of person", "how is he", "what is he like", "type of person", "kind of guy", "jolly", "funny", "eppadi patta", "epdi patta", "eppadi pata", "epdi pata", "avaru epdi", "avar epdi", "ivar epdi", "ivaru epdi", "gunam", "thillalangadi", "thilalangadi", "stark", "elon", "musk"],
    weight: 1.2,
    en: [
      "Personality scan 😎: Super jolly, super knowledgeable, and a proper thillalangadi (smart, sharp, a bit naughty-clever). Think Tony Stark meets Elon Musk, but from Chennai.",
      "Boss is that rare combo: funny enough to make you laugh in 2 minutes, smart enough to fix your robot in 10. Stark-mode, permanently ON ⚡",
      "If I had to describe him in one line: jolly + knowledgeable + thillalangadi = Nirmal. A real-life Iron Man, minus the suit (for now 😉).",
      "Cute, helper, knowledgeable and always cheerful. Honestly, if you ask me, he's a real-life superhero 🦸",
    ],
    ta: [
      "Personality scan 😎: Romba jolly-aana aalu, romba knowledgeable, mothathula sollanum-na semma thillalangadi! Namma ooru Tony Stark + Elon Musk combo.",
      "Boss 2 nimishathula ungala sirikka vechuruvaaru, 10 nimishathula unga robot-a fix pannuvaaru. Stark-mode eppavume ON ⚡",
      "Oru line-la sollanum-na: jolly + knowledge + thillalangadi = Nirmal. Suit illaadha real life Iron Man (ippothaikku 😉).",
      "Cute, helper, knowledgeable, eppavum cheerful. En analysis padi, avaru oru real life superhero 🦸",
    ],
  },
  {
    id: "hobbies",
    keys: ["hobby", "hobbies", "free time", "weekend", "leisure", "interests", "passion", "fun", "trek", "trekking", "hiking", "mountain", "travel", "travelling", "traveling", "trip", "tour", "ulaga", "sutrum", "valiban", "pozhudhupokku", "pidicha visayam"],
    en: [
      "Hobby scan 🏔️: Trekking is his absolute favourite. Give him a mountain and a weekend and he's gone! He's a proper \"Ulagam Sutrum Valiban\" (globe-trotter).",
      "Off-duty Boss = trekking boots on, backpack ready 🎒. He loves travelling, exploring new places and anything sporty.",
      "His favourite things: trekking ⛰️, travelling 🌏, sports ⚽ and learning something new every single day.",
    ],
    ta: [
      "Hobby scan 🏔️: Trekking-na avarukku uyir! Oru malai, oru weekend kudutha podhum, kilambiduvaaru. Pakka \"Ulagam Sutrum Valiban\" 😎",
      "Duty illaadha time-la Boss = trekking shoes + backpack 🎒. Pudhu pudhu idam explore panradhu, sports, ellam avarukku romba pidikkum.",
      "Avaroda favourite list: trekking ⛰️, travel 🌏, sports ⚽, daily edhaavadhu pudhusa kathukradhu.",
    ],
  },
  {
    id: "spiritual",
    keys: ["god mode", "believe in god", "religion", "religious", "spiritual", "temple", "kovil", "koil", "pray", "prayer", "devotional", "aanmigam", "anmigam", "aanmeegam", "kadavul", "sami", "saami", "bakthi", "atheist"],
    en: [
      "Spiritual scan 🙏: You can't exactly call him a hardcore spiritual guy, but somehow every place he goes turns into God mode ✨",
      "Not a typical devotee, but wherever Boss travels, he ends up at divine places. His trips are basically God mode on autopilot 🛕",
    ],
    ta: [
      "Aanmigam scan 🙏: Avara pakka aanmiga vaadhi nu solla mudiyaadhu, aana avaru pora idam ellam God mode dhaan ✨",
      "Typical bakthar illa, aana Boss enga trip ponaalum kadaisi-la oru divine place-la dhaan nippaaru 🛕 Auto-pilot God mode!",
    ],
  },
  {
    id: "eyes",
    keys: ["eye", "eyes", "kan", "kangal", "analyse him", "analyze him", "read him", "understand him", "mysterious"],
    en: [
      "Warning ⚠️: His eyes are seriously powerful. I'm an AI and even I find it really hard to analyse him. Those eyes read you before you read them 👁️",
      "Fun fact: I've run a thousand scans on Boss, and his eyes still break my algorithms. Very powerful, very hard to decode 🔍",
    ],
    ta: [
      "Warning ⚠️: Avar kangal-la semma power! Naan oru AI, ennaala kooda avara analyse panna mudiyala, romba kashtam 👁️",
      "Fun fact: Boss mela aayiram scan ottitten, aana avar kangal en algorithm-a break pannidudhu. Decode panna mudiyaadha aalu 🔍",
    ],
  },
  {
    id: "fitness",
    keys: ["body", "physique", "gym", "fitness", "fit", "workout", "exercise", "sport", "sports", "sporty", "cricket", "football", "athlete", "health", "junk", "weight", "udambu", "vilaiyattu"],
    en: [
      "Fitness report 💪: He used to have a solid physique. Junk food did some damage 🍔, but don't be fooled, he's still a seriously sporty guy!",
      "Honest scan: great body back then, a few junk-food side quests later… still a beast at sports 🏃‍♂️. The sporty spirit never left.",
    ],
    ta: [
      "Fitness report 💪: Munnadi semma body physique vechirundhaaru. Kanda kanda junk food saapittu konjam kedhuthukittaaru 🍔, aana ippavum bayangaram sporty aalu!",
      "Unmaiya sollanum-na: body munnadi vera level, junk food konjam velai kaatiduchu 😅 Aana sports-na ippavum Boss dhaan beast 🏃‍♂️",
    ],
  },
  {
    id: "cando",
    keys: ["can he do", "can he build", "can he make", "able to", "capable", "capability", "impossible", "anything", "mudiyuma", "panna mudiyuma", "pannuvaara", "pannuvara", "seiyya mudiyuma", "challenge", "difficult", "hard task", "limit", "limits", "talent", "genius", "intelligent", "smart"],
    en: [
      "Capability scan ⚙️: I've been analysing Boss since 2015, and there's literally nothing he hasn't attempted. Ask him \"can you do this?\" Even if he doesn't know it yet, he'll learn it, build it and hand it over to you.",
      "Short answer: yes. Long answer: if he doesn't know it, he figures it out and delivers anyway. I honestly can't find a task he couldn't do 🛠️",
      "His secret weapon is never saying \"no\". New tech, new hardware, new problem: he learns it on the spot and ships it ⚡",
    ],
    ta: [
      "Capability scan ⚙️: 2015-la irundhu naan Boss-a analyse pannittu irukken, avaru pannaadha vishayame illa! \"Idha panna mudiyuma?\" nu kaetta, theriyalanaalum kathukittu panni ungakitta kuduthuduvaaru.",
      "Short answer: mudiyum. Long answer: theriyalanaalum kandupidichu panni mudippaaru. Avaraala panna mudiyaadha vishayame illa nu dhaan sollanum 🛠️",
      "Avaroda secret weapon: \"mudiyaadhu\" nu eppavume solla maattaaru. Pudhu tech, pudhu hardware, edhuvaa irundhaalum spot-la kathukittu deliver pannuvaaru ⚡",
    ],
  },
  {
    id: "scientist",
    keys: ["scientist", "future", "dream", "goal", "ambition", "vision", "next big", "india", "inventor", "invention", "kanavu"],
    en: [
      "Future projection 🚀: With just a little support, I genuinely believe Boss could be India's next scientist. The brain is ready, he just needs the launchpad.",
      "My prediction model says: give him resources and support, and you'll be reading about him as India's next big scientist 🇮🇳🔬",
    ],
    ta: [
      "Future projection 🚀: Konjam support mattum kedacha, Boss dhaan India-oda next scientist nu dhaaraalama sollalaam! Brain ready, launchpad dhaan venum.",
      "En prediction model sollradhu: avarukku resources, support kudunga, India-oda next big scientist-a newspaper-la paapeenga 🇮🇳🔬",
    ],
  },
  {
    id: "habits",
    keys: ["habit", "habits", "bad habit", "smoke", "smoking", "drink", "drinking", "alcohol", "daily routine", "routine", "daily life", "pazhakkam", "palakam", "kettapazhakkam"],
    en: [
      "Habit scan 🔍: In all these years of analysing his daily activities, I haven't found a single bad habit. Not one. Even I'm surprised by that 😲",
      "Clean record ✅: No bad habits detected in years of monitoring. Honestly, that's the most surprising data point in my whole database.",
    ],
    ta: [
      "Habit scan 🔍: Ivlo varusham avaroda daily activities-a analyse panniyum, oru single kettapazhakkam kooda kedaikala! Enakke idhu romba aacharyamaana vishayam 😲",
      "Clean record ✅: Varusha kanakka monitor panniyum oru bad habit-um illa. En database-laye idhu dhaan romba shocking data point 😅",
    ],
  },
  {
    id: "helping",
    keys: ["helping", "helpful", "helps", "help others", "kindness", "generous", "good heart", "good person", "cheated", "emandhu", "emanthu", "eamanthu", "udhavi", "uthavi", "nalla manasu", "nalla manushan", "manusan", "manushan"],
    en: [
      "Heart scan ❤️: Helping mind on max level. Even when he doesn't have much himself, he quietly helps others without telling anyone.",
      "The sad part? Because he trusts and helps everyone, he's been cheated many times, from school days till now. But he still hasn't stopped helping 🙏",
      "He's the guy who helps first and asks questions later. Silent helper, big heart, real-life superhero vibes 🦸",
    ],
    ta: [
      "Heart scan ❤️: Helping mind max level! Avar kitta illanaalum kooda, yaarukkum sollaama matthavangalukku help pannuvaaru.",
      "Kashtamaana vishayam ennanaa, ellaraiyum nambi help panradhaala, school days-la irundhu ippo varaikkum neraya thadava emandhu poyirukkaaru. Aanaalum help panradha nirutthala 🙏",
      "Mudhalla help, apram dhaan question, adhaan Boss style. Silent helper, perusa manasu, real life superhero 🦸",
    ],
  },
  {
    id: "personal",
    keys: ["personal", "personal life", "as a person", "real life", "outside work", "about him personally", "personally", "superhero", "hero", "secret", "fun fact", "facts about", "something interesting", "interesting", "surprise"],
    weight: 0.9,
    en: [
      "Personal file 📂: Born in Madhuranthakam, raised in Chennai. Scorpio, Kettai star. Jolly, knowledgeable, a proper thillalangadi. Loves trekking, has friends everywhere, and helps people without being asked. In short: a real-life superhero 🦸",
      "Here's what years of analysis taught me: no bad habits, a huge helping mind, powerful eyes I still can't decode, and nothing he can't learn. Plus he's quitting non-veg (chicken survives 🍗).",
      "Quick personal intel: globe-trotter 🌏, trekking addict ⛰️, sporty, funny, and the kind of guy people instantly like. Stark meets Musk, with a Chennai heart ❤️",
    ],
    ta: [
      "Personal file 📂: Pirandhadhu Madhuranthakam, valandhadhu Chennai. Viruchiga rasi, Kettai natchathiram. Jolly, knowledgeable, semma thillalangadi! Trekking pidikkum, engapaathaalum friends, kaekkaama help pannuvaaru. Mothathula real life superhero 🦸",
      "Ivlo varusha analysis-la naan kandupidichadhu: oru kettapazhakkam kooda illa, perusa helping mind, decode panna mudiyaadha powerful kangal, kathukka mudiyaadha vishayame illa. Plus non-veg-a vidraaru (chicken mattum survive 🍗).",
      "Quick personal intel: Ulagam Sutrum Valiban 🌏, trekking veriyan ⛰️, sporty, jolly, paathavudane ellarukkum pidikkira aalu. Stark + Musk, Chennai heart ❤️",
    ],
  },
  {
    id: "private",
    keys: ["marriage", "married", "wife", "girlfriend", "gf", "in love", "love life", "love marriage", "lover", "crush", "relationship", "single", "kalyanam", "kalyaanam", "kadhali", "family", "father", "mother", "parents", "brother", "sister", "appa", "amma", "salary", "income", "age", "how old", "vayasu", "vayadhu", "address", "house", "veedu", "religion caste", "caste", "jaathi", "jathi"],
    weight: 1.3,
    en: [
      "Access denied 🔒😄 That's Boss's private file, and I'm not allowed to open it. Ask me about his work, his travels or his character instead!",
      "Nice try, agent 🕵️ That information is classified under Stark Protocol. I only share what Boss allows. How about his projects?",
      "Personal-personal stuff stays with Boss 🤐 If it's important, you can ask him directly via the Contact section!",
    ],
    ta: [
      "Access denied 🔒😄 Adhu Boss-oda private file, adha open panna enakku permission illa! Vera edhaavadhu, avar work illa character pathi kaelunga.",
      "Nalla try boss 🕵️ Adhu Stark Protocol-la classified. Boss allow panna vishayam mattum dhaan naan solluven. Avaroda projects paakalaama?",
      "Romba personal vishayam ellam Boss kitta dhaan 🤐 Mukkiyam-na Contact section moolama avar kitta direct-a kaelunga!",
    ],
  },

  // ── Professional (rich cards) ──────────────────────────────
  {
    id: "about",
    intent: "about",
    keys: ["about", "who is", "who's", "whos", "introduce", "introduction", "bio", "background", "profile", "summary", "tell me about", "nirmal", "saravanan", "yaaru", "yaru", "yar", "yaar", "யார்"],
    weight: 0.6,
    en: [
      `Meet my Boss 🤖: ${profile.name}, ${profile.title}, based in Chennai.`,
      `Here's the official profile of ${profile.name}, ${years}+ years across robotics, embedded systems and full-stack web.`,
      `${profile.name} in one frame: robots by day, production web apps by night ⚡`,
    ],
    ta: [
      `Meet my Boss 🤖: ${profile.name}, ${profile.title}, Chennai-la irukkaaru.`,
      `Idhu dhaan ${profile.name}-oda official profile. Robotics, embedded, full-stack web-la ${years}+ varusha experience.`,
      `${profile.name} oru frame-la: pagal-la robots, raathiri-la production web apps ⚡`,
    ],
  },
  {
    id: "skills",
    intent: "skills",
    keys: ["skill", "skills", "tech stack", "stack", "technology", "technologies", "tools", "programming", "language", "languages", "framework", "expertise", "proficient", "robotics", "ros", "python", "c++", "cpp", "react", "nextjs", "typescript", "embedded", "iot", "what does he know", "enna theriyum", "theriyum"],
    en: [
      "Here's Boss's complete technical arsenal, calibrated and battle-tested:",
      "Power levels loading… ⚡ Every skill below is used in real production work:",
      "From ROS 2 robots to Next.js sites, this is the toolkit:",
    ],
    ta: [
      "Idhu dhaan Boss-oda full technical arsenal, battle-tested:",
      "Power levels loading… ⚡ Keela irukra ella skill-um real production-la use pannadhu:",
      "ROS 2 robots-la irundhu Next.js sites varaikkum, idhu dhaan avar toolkit:",
    ],
  },
  {
    id: "experience",
    intent: "experience",
    keys: ["experience", "work history", "career", "job", "jobs", "company", "companies", "employment", "worked", "working", "current role", "xmedia", "scopex", "adani", "grovita", "timeline", "velai", "vela", "office", "enga work"],
    en: [
      `Career log 📈: currently ${current.role} at ${current.company}. Full timeline:`,
      "From intern to robotics lead. Here's the journey:",
      `${years}+ years in the field. Mission log:`,
    ],
    ta: [
      `Career log 📈: ippo ${current.company}-la ${current.role}. Full timeline idho:`,
      "Intern-la irundhu robotics lead varaikkum, idhu dhaan avar journey:",
      `${years}+ varusha experience. Mission log paarunga:`,
    ],
  },
  {
    id: "projects",
    intent: "projects",
    keys: ["project", "projects", "portfolio", "built", "build", "made", "work sample", "samples", "unitree", "rex", "service robot", "smart office", "configurator", "ups", "dinamani", "appy rover", "demo", "panna project", "senja"],
    en: [
      "Project schematics: robotics, embedded and web platforms:",
      "Things Boss built (and I helped… a little 😉):",
      "Here's the build log, robots to live commercial apps:",
    ],
    ta: [
      "Project schematics: robotics, embedded, web platforms:",
      "Boss build panna vishayangal (naanum konjam help panninen 😉):",
      "Idho build log, robots-la irundhu live commercial apps varaikkum:",
    ],
  },
  {
    id: "contact",
    intent: "contact",
    keys: ["contact", "reach", "email", "mail", "phone", "number", "call", "whatsapp", "linkedin", "github", "connect", "get in touch", "message him", "talk to nirmal", "meet", "pesanum", "pesa", "contact panna"],
    en: [
      "Secure comms channels for reaching Boss 📡:",
      "Want to talk to him directly? Here you go:",
      "He replies fast, trust me. Channels:",
    ],
    ta: [
      "Boss-a reach panna secure channels 📡:",
      "Direct-a pesanum-a? Idho:",
      "Seekiram reply pannuvaaru, nambunga. Channels:",
    ],
  },
  {
    id: "hire",
    keys: ["hire", "hiring", "looking for", "engineer", "need a developer", "need an engineer", "why should", "why hire", "recruit", "recruiter", "available", "availability", "open to", "notice period", "join", "opportunity", "freelance", "contract", "vacancy", "eduthukalama", "edukalama"],
    en: [
      `Why hire Boss? 🚀 Robotics + embedded + full-stack in ONE engineer. He's open to: ${profile.openTo.join(", ")}. Hit the Contact section!`,
      "Hiring tip from his AI: he learns anything fast, ships to production and never says \"not possible\". Plus no bad habits, I checked 😄 Ping him via Contact!",
      `Three engineers for the price of one: ROS 2 robots, STM32/RPi hardware and Next.js platforms. Open to ${profile.openTo[0].toLowerCase()} and more.`,
    ],
    ta: [
      `Boss-a yen hire pannanum? 🚀 Robotics + embedded + full-stack, ellame ORE aalu kitta! Open to: ${profile.openTo.join(", ")}. Contact section-ku ponga!`,
      "Avaroda AI-ya oru tip: edhaiyum fast-a kathuppaaru, production-ku ship pannuvaaru, \"mudiyaadhu\" nu solla maattaaru. Bad habits kooda illa, naan check panniten 😄",
      "Oru salary-la moonu engineers: ROS 2 robots, STM32/RPi hardware, Next.js platforms. Contact pannunga!",
    ],
  },

  // ── Meta / open world ──────────────────────────────────────
  {
    id: "jarvis",
    keys: ["who are you", "what are you", "your name", "are you ai", "are you a bot", "are you human", "nee yaaru", "ne yaru", "nee yar", "un per", "jarvis"],
    weight: 1.2,
    en: [
      "I'm JARVIS 🤖, Boss's personal AI. I've been analysing him since 2015, so ask me anything about him, professional or personal!",
      "JARVIS here. I'm part assistant, part spy 🕵️ I know Boss's skills, projects and even his food habits.",
    ],
    ta: [
      "Naan JARVIS 🤖, Boss-oda personal AI. 2015-la irundhu avara analyse pannittu irukken, professional-o personal-o, edhu venaalum kaelunga!",
      "JARVIS dhaan 😎 Half assistant, half spy 🕵️ Boss-oda skills, projects, food habits kooda enakku theriyum.",
    ],
  },
  {
    id: "whoami",
    keys: ["who am i", "where am i", "my location", "scan me", "do you know me", "naan yaaru", "nan yaru", "nan yar", "ennai pathi", "enna pathi", "en location", "drone"],
    weight: 1.3,
    en: (ctx) => {
      const s = ctx.scan;
      const who = ctx.visitorName ? `${ctx.visitorName}, ` : "";
      if (!s?.city && !s?.country) return [`${who}my drone is still scanning 📡 Tell me your name and I'll remember you!`];
      const place = [s.company, s.city, s.country].filter(Boolean).join(", ");
      return [
        `${who}drone report 🛸: you're visiting from ${place}${s.device ? ` on ${s.device}` : ""}${s.source && s.source !== "Direct" ? `, and you came via ${s.source}` : ""}. Visit #${s.visitCount ?? 1}. Welcome!`,
        `Scan complete ✅ ${who}${place}${s.org ? ` · network: ${s.org}` : ""}. Don't worry, I only see the city, never your personal details 😉`,
      ];
    },
    ta: (ctx) => {
      const s = ctx.scan;
      const who = ctx.visitorName ? `${ctx.visitorName}, ` : "";
      if (!s?.city && !s?.country) return [`${who}en drone innum scan pannittu irukku 📡 Unga per sollunga, nyaabagam vechukkuren!`];
      const place = [s.company, s.city, s.country].filter(Boolean).join(", ");
      return [
        `${who}drone report 🛸: neenga ${place}-la irundhu ${s.device ? `${s.device}-la ` : ""}paakureenga${s.source && s.source !== "Direct" ? `, ${s.source} moolama vandheenga` : ""}. Visit #${s.visitCount ?? 1}. Welcome!`,
        `Scan complete ✅ ${who}${place}${s.org ? ` · network: ${s.org}` : ""}. Bayappadaadheenga, city mattum dhaan theriyum, unga personal details illa 😉`,
      ];
    },
  },
  {
    id: "thanks",
    keys: ["thanks", "thank you", "thx", "ty", "nandri", "super", "awesome", "great", "nice", "cool", "semma", "sema", "mass", "amazing", "wow"],
    weight: 0.7,
    en: ["Anytime! ⚡ Anything else about Boss?", "Glad I could help 😄 I'll tell Boss you said that!", "You're awesome too 🤖💛"],
    ta: ["Eppavume ready! ⚡ Vera edhaavadhu Boss pathi venumaa?", "Nandri nandri 😄 Boss kitta solliduren!", "Neengalum semma dhaan 🤖💛"],
  },
  {
    id: "bye",
    keys: ["bye", "goodbye", "see you", "see ya", "later", "poitu varen", "poyitu varen", "kilamburen", "tata", "good night"],
    weight: 1.1,
    en: ["Bye! 👋 Don't forget to drop Boss a message in Contact!", "See you soon, agent 🫡 JARVIS signing off."],
    ta: ["Bye bye! 👋 Poradhukku munnaadi Contact-la Boss-ku oru message podunga!", "Seri, poitu vaanga 🫡 JARVIS signing off."],
  },
  {
    id: "joke",
    keys: ["joke", "jokes", "funny", "make me laugh", "comedy", "kadi", "mokka", "sirippu"],
    en: [
      "Why did the robot go on vacation? It needed to recharge its batteries 🔋😂",
      "Boss asked me to debug his code. I found the bug: it was a feature 🐛✨",
      "I told Boss a UDP joke. Not sure if he got it 📡😅",
    ],
    ta: [
      "Robot yen leave eduthuchu? Battery recharge pannanum-la 🔋😂",
      "Boss code-a debug panna sonnaaru. Bug kandupidichen… adhu feature-aam 🐛✨",
      "Boss kitta oru UDP joke sonnen. Avarukku reach aachaa nu theriyala 📡😅",
    ],
  },
  {
    id: "time",
    keys: ["time", "date", "today", "day", "mani enna", "neram", "ennaiku", "inniku"],
    en: () => [`It's ${new Date().toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })} on your device ⏰`],
    ta: () => [`Unga device-la ippo ${new Date().toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })} ⏰`],
  },
  {
    id: "glossary",
    keys: ["what is ros", "what is slam", "what is lidar", "what is mqtt", "what is stm32", "what is raspberry", "what is unitree", "what is nextjs", "what is next.js", "explain ros", "explain slam", "ros na enna", "slam na enna", "lidar na enna", "mqtt na enna"],
    weight: 1.4,
    en: (ctx) => glossary(ctx, "en"),
    ta: (ctx) => glossary(ctx, "ta"),
  },
];

// Mini open-world glossary for the tech Boss uses every day
const GLOSSARY: Record<string, { en: string; ta: string }> = {
  ros: { en: "ROS 2 (Robot Operating System) is the middleware robots use to talk between sensors, brains and motors. Boss builds navigation stacks on it 🤖", ta: "ROS 2 (Robot Operating System) na robots-la sensors, brain, motors ellam pesikka use panra middleware. Boss adhula navigation stack build pannuvaaru 🤖" },
  slam: { en: "SLAM = Simultaneous Localization And Mapping. The robot builds a map while figuring out where it is on that map 🗺️", ta: "SLAM = Simultaneous Localization And Mapping. Robot map-um podum, adhula thaan enga irukkom nu-um kandupidikkum 🗺️" },
  lidar: { en: "LiDAR shoots laser pulses and measures how long they take to bounce back, giving a robot 3D vision 🔦", ta: "LiDAR laser adichu, adhu thirumbi vara time-a vechu distance kandupidikkum. Robot-ku 3D kan maari 🔦" },
  mqtt: { en: "MQTT is a super-light messaging protocol for IoT devices: publish/subscribe over tiny packets 📨", ta: "MQTT na IoT devices-ku light-weight messaging protocol. Publish/subscribe, chinna packets 📨" },
  stm32: { en: "STM32 is a family of ARM microcontrollers, the tiny brains inside real-time hardware ⚙️", ta: "STM32 na ARM microcontroller family. Real-time hardware-kulla irukra chinna brain ⚙️" },
  raspberry: { en: "Raspberry Pi is a credit-card-sized Linux computer, perfect for edge IoT controllers 🍓", ta: "Raspberry Pi na credit card size Linux computer. Edge IoT controller-ku perfect 🍓" },
  unitree: { en: "Unitree makes quadruped robot dogs. Boss programs their gaits and control with the Unitree SDK + RL 🐕", ta: "Unitree robot dogs-a ready pannra company. Boss avanga SDK + RL vechu nadai, control ellam program pannuvaaru 🐕" },
  next: { en: "Next.js is a React framework for fast, SEO-friendly web apps. This very portfolio runs on it ⚡", ta: "Next.js na React framework, fast + SEO friendly web apps-ku. Indha portfolio-ve adhula dhaan odudhu ⚡" },
};

let glossaryTokens: string[] = [];
function glossary(_ctx: BrainContext, lang: Lang) {
  const hit = Object.keys(GLOSSARY).find((k) => glossaryTokens.some((t) => t.startsWith(norm(k))));
  return [hit ? GLOSSARY[hit][lang] : GLOSSARY.ros[lang]];
}

// ═══════════════════════════════════════════════════════════════
// MATCHING
// ═══════════════════════════════════════════════════════════════

// Tanglish spellings vary wildly (saappadu / sapadu / sapdu), so collapse
// repeated letters before comparing.
function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}+.#\s]/gu, " ")
    .replace(/\.(?![\p{L}\p{N}])/gu, " ")
    .replace(/(\p{L})\1+/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function lev(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

const NORMALIZED = TOPICS.map((t) => ({ topic: t, keys: [...new Set(t.keys.map(norm))] }));

function keyHits(q: string, tokens: string[], key: string) {
  if (key.includes(" ")) return ` ${q} `.includes(` ${key} `) || q.includes(key) ? 2 : 0;
  return tokens.some(
    (tok) => tok === key || (key.length >= 4 && tok.startsWith(key)) || (key.length >= 6 && lev(tok, key) <= 1)
  ) ? 1 : 0;
}

const TANGLISH = new Set(
  ["enna", "ena", "epdi", "epadi", "yaru", "yar", "avar", "avaru", "ivar", "ivaru", "sapdu", "sapidu", "sapduvar", "sapduvaru", "pidikum", "pidiku", "iruka", "irukar", "irukaru", "solu", "sol", "soluga", "solunga", "da", "di", "machan", "macha", "mama", "pana", "panra", "panu", "panuvar", "teriyuma", "theriyuma", "theriyum", "enga", "ethu", "edhu", "evlo", "romba", "nala", "una", "unga", "naan", "nan", "ne", "nee", "venum", "kita", "pathi", "pati", "oru", "vanakam", "alu", "epo", "ipo", "ipadi", "apadi", "sema", "ila", "ilai", "ama", "sari", "seri", "la", "nu", "ku", "dhan", "than", "tha", "thana", "dhana", "ah", "va", "vanga", "poga", "inum", "aprm", "apram", "ena", "per", "peru", "mudiyuma", "pannuvara", "pesuna"].map(norm)
);
const ENGLISH = new Set(["what", "who", "is", "does", "he", "his", "him", "tell", "the", "about", "how", "where", "can", "do", "you", "me", "are", "show", "which", "why", "any", "like"].map(norm));

const MORE = ["more", "tell me more", "another", "again", "continue", "else", "inum", "innum", "vera", "veara", "apram", "aprm", "matha", "next"].map(norm);
const GREETINGS = ["hi", "hello", "hey", "hii", "yo", "vanakam", "sup", "hola", "namaste", "helo", "good morning", "good evening", "gm", "machan", "macha", "bro"].map(norm);

// ═══════════════════════════════════════════════════════════════
// SESSION MEMORY
// ═══════════════════════════════════════════════════════════════

const bags = new Map<string, number[]>();
const lastPick = new Map<string, number>();
let lastLang: Lang = "en";
let lastTopic: string | null = null;

function pick(key: string, lines: string[]) {
  if (lines.length === 1) return lines[0];
  let bag = bags.get(key);
  if (!bag || bag.length === 0) {
    bag = lines.map((_, i) => i).filter((i) => i !== lastPick.get(key));
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  const idx = bag.pop()!;
  bags.set(key, bag);
  lastPick.set(key, idx);
  return lines[idx % lines.length];
}

function detectLang(raw: string, tokens: string[]): Lang {
  if (/[஀-௿]/.test(raw)) return "ta";
  const ta = tokens.filter((t) => TANGLISH.has(t)).length;
  const en = tokens.filter((t) => ENGLISH.has(t)).length;
  if (ta > 0 && ta >= en) return "ta";
  if (en > 0) return "en";
  return lastLang;
}

const NOT_NAMES = new Set(["a", "an", "the", "here", "from", "looking", "interested", "recruiter", "hr", "hiring", "manager", "fine", "good", "ok", "okay", "not", "just", "very", "so", "also", "back", "new", "nirmal"]);

function extractName(raw: string): string | undefined {
  const m =
    raw.match(/\b(?:my name is|my name's|this is|call me|en per(?:u)?|ennoda per(?:u)?|enoda per(?:u)?|en peyar)\s+([a-z][a-z.]{1,20})/i) ||
    raw.match(/\b(?:i am|i'm|im)\s+([a-z][a-z.]{1,20})\s+(?:from|here)\b/i) ||
    raw.match(/\b(?:naan|nan)\s+([a-z][a-z.]{1,20})\s+(?:dhaan|dhan|than|tha|pesuren|here)\b/i);
  const name = m?.[1]?.replace(/\.$/, "");
  if (!name || NOT_NAMES.has(name.toLowerCase())) return undefined;
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

function lines(l: Lines, ctx: BrainContext) {
  return typeof l === "function" ? l(ctx) : l;
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export function think(raw: string, ctx: BrainContext = {}): Reply {
  const q = norm(raw);
  const tokens = q.split(" ").filter(Boolean);
  const lang = detectLang(raw, tokens);
  lastLang = lang;
  glossaryTokens = tokens;

  const name = extractName(raw);
  if (name) {
    const text = lang === "ta"
      ? pick(`name:ta`, [`Vanakkam ${name}! 🙏 Ungala nyaabagam vechukkuren. Boss pathi enna therinjukkanum?`, `Hey ${name}! 😎 Nice to meet you. Boss-oda work-a, illa personal side-a, edhu pathi kaekkureenga?`])
      : pick(`name:en`, [`Nice to meet you, ${name}! 🙏 I'll remember you. What would you like to know about Boss?`, `Hey ${name}! 😎 Welcome aboard. Want his work profile, or the fun personal stuff?`]);
    return { topic: "name", lang, text, name };
  }

  // Score every topic
  let best: { topic: Topic; score: number } | null = null;
  for (const { topic, keys } of NORMALIZED) {
    let score = 0;
    for (const k of keys) score += keyHits(q, tokens, k);
    score *= topic.weight ?? 1;
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }

  // "innum sollu" / "tell me more" → another variant of the previous topic
  const wantsMore = tokens.length <= 4 && MORE.some((m) => tokens.includes(m) || q === m);
  if ((!best || best.score < 1) && wantsMore && lastTopic) {
    const prev = TOPICS.find((t) => t.id === lastTopic);
    if (prev) best = { topic: prev, score: 1 };
  }

  if (!best) {
    const isGreeting = tokens.length <= 4 && GREETINGS.some((g) => tokens[0] === g || q.startsWith(g + " ") || q === g);
    if (isGreeting) {
      const who = ctx.visitorName ? ` ${ctx.visitorName}` : "";
      const city = [ctx.scan?.company, ctx.scan?.city].filter(Boolean).join(", ");
      const text = lang === "ta"
        ? pick("greet:ta", [
            `Vanakkam${who}! 🙏 Naan JARVIS, Nirmal Boss-oda AI. Avar work, skills, illa personal side, edhu pathi venaalum kaelunga!`,
            `Hey${who}! 😎 ${city ? `${city}-la irundhu welcome! ` : ""}Boss pathi enna therinjukkanum?`,
            `Vaanga vaanga${who}! 🤖 Projects-a, food habits-a, edhu venaalum kaelunga, naan solluren.`,
          ])
        : pick("greet:en", [
            `Hello${who}! 👋 I'm JARVIS, Nirmal's AI. Ask me about his work, skills or even his personal side!`,
            `Hey${who}! 😎 ${city ? `Greetings to ${city}! ` : ""}What do you want to know about Boss?`,
            `Welcome${who}! 🤖 Projects, experience, food habits, trekking… ask me anything.`,
          ]);
      lastTopic = null;
      return { topic: "greeting", lang, text };
    }

    lastTopic = null;
    const text = lang === "ta"
      ? pick("unknown:ta", [
          "Hmm 🤔 Adhu en database-la illa. Boss-oda skills, projects, experience, illa avar personal side (food, ooru, trekking) pathi kaelunga!",
          "Indha question-ku answer enkitta illa 😅 Adha Boss kitta direct-a kaelunga, Contact section irukku. Illa avar pathi vera edhaavadhu kaelunga!",
          "Ennoda sensors-ku idhu puriyala 📡 \"Nirmal enna saapduvaaru?\" illa \"avar projects enna?\" maari try pannunga!",
        ])
      : pick("unknown:en", [
          "Hmm 🤔 That's not in my database yet. Try asking about Boss's skills, projects, experience, or his personal side (food, hometown, trekking)!",
          "I don't have an answer for that one 😅 You can ask Boss directly via Contact, or ask me something else about him!",
          "My sensors didn't catch that 📡 Try \"What does Nirmal eat?\" or \"Show his projects\".",
        ]);
    return { topic: "unknown", lang, text };
  }

  const t = best.topic;
  lastTopic = t.id;
  const text = pick(`${t.id}:${lang}`, lines(t[lang], ctx));
  return { topic: t.id, lang, text, intent: t.intent };
}

export const QUICK_PROMPTS = {
  personal: { en: "What kind of person is Nirmal?", ta: "Nirmal eppadi patta aalu?" },
};
