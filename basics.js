// 한글 학교: the basics course. First building on the map.
// Card: big = what's shown large, say = what the voice reads, sound = romanization, note = explanation, ex = example word.
// Quiz types: "pick" (choose an option; speak:true plays the prompt as audio instead of showing it),
//             "build" (make a syllable block from a consonant + vowel; target = the syllable).
window.BASICS={
 code:"한글",ko:"한글 학교",en:"Hangul school",kind:"basics",scene:"school",sub:"Start here · the basics",
 who:"선생님",whoEn:"teacher",
 char:{skin:"#F1CBA6",hair:"#2A211D",style:"bob",top:"#7A5C9E",acc:"glasses"},
 culture:"Hangul was designed in 1443 to be easy to learn. Most people can read it after a few hours. Every block is one syllable, built from letters.",
 units:[
  {id:"vowels",ko:"모음",en:"Vowels",
   intro:"모음부터 배워요!",introEn:"Let's start with vowels!",
   cards:[
    {big:"ㅏ",say:"아",sound:"a",note:"Like 'a' in father. The short stroke points right.",ex:"아이 (child)"},
    {big:"ㅓ",say:"어",sound:"eo",note:"Like 'u' in up. The short stroke points left.",ex:"어디 (where)"},
    {big:"ㅗ",say:"오",sound:"o",note:"Like 'o' in go, lips round. Stroke points up.",ex:"오이 (cucumber)"},
    {big:"ㅜ",say:"우",sound:"u",note:"Like 'oo' in moon. Stroke points down.",ex:"우유 (milk)"},
    {big:"ㅡ",say:"으",sound:"eu",note:"Smile flat and say 'uh'. No English match.",ex:"으 (ugh)"},
    {big:"ㅣ",say:"이",sound:"i",note:"Like 'ee' in see.",ex:"이 (two / this)"},
    {big:"ㅐ ㅔ",say:"애 에",sound:"ae / e",note:"Like 'e' in bed. Koreans pronounce these two almost the same.",ex:"게 (crab)"},
    {big:"ㅑ ㅕ ㅛ ㅠ",say:"야 여 요 유",sound:"ya yeo yo yu",note:"Add a second stroke and you add a 'y' sound.",ex:"우유 (milk)"}],
   quiz:[
    {type:"pick",prompt:"ㅏ",options:["a","eo","o","i"],answer:0},
    {type:"pick",prompt:"ㅓ",options:["eo","a","u","eu"],answer:0},
    {type:"pick",prompt:"ㅜ",options:["u","o","i","a"],answer:0},
    {type:"pick",prompt:"Which vowel do you hear?",speak:"오",options:["ㅗ","ㅜ","ㅓ","ㅏ"],answer:0},
    {type:"pick",prompt:"ㅠ",options:["yu","yo","ya","u"],answer:0},
    {type:"pick",prompt:"Which vowel do you hear?",speak:"이",options:["ㅣ","ㅡ","ㅐ","ㅓ"],answer:0}]},

  {id:"consonants",ko:"자음",en:"Consonants",
   intro:"자음은 입 모양을 보고 만들었어요!",introEn:"Consonants were made from the shape of your mouth!",
   cards:[
    {big:"ㄱ",say:"가",sound:"g / k",note:"The shape of your tongue touching the back of your mouth.",ex:"가방 (bag)"},
    {big:"ㄴ",say:"나",sound:"n",note:"Your tongue touching behind your top teeth.",ex:"나 (me)"},
    {big:"ㄷ",say:"다",sound:"d / t",note:"ㄴ with a lid on top. Same tongue spot, harder sound.",ex:"다리 (leg / bridge)"},
    {big:"ㄹ",say:"라",sound:"r / l",note:"Between r and l. A quick flick of the tongue.",ex:"라면 (ramen)"},
    {big:"ㅁ",say:"마",sound:"m",note:"A closed square, like closed lips.",ex:"물 (water)"},
    {big:"ㅂ",say:"바",sound:"b / p",note:"ㅁ with ears. Lips pop open.",ex:"밥 (rice / meal)"},
    {big:"ㅅ",say:"사",sound:"s",note:"Shaped like a tooth.",ex:"사과 (apple)"},
    {big:"ㅇ",say:"아",sound:"silent / ng",note:"At the start of a block it's silent. At the bottom it's 'ng'.",ex:"영어 (English)"},
    {big:"ㅈ",say:"자",sound:"j",note:"ㅅ with a line on top.",ex:"자리 (seat)"},
    {big:"ㅎ",say:"하",sound:"h",note:"A little hat on ㅇ.",ex:"하나 (one)"},
    {big:"ㅋ ㅌ ㅍ ㅊ",say:"카 타 파 차",sound:"k t p ch",note:"Add a stroke and you add a puff of air. Hold your hand in front of your mouth to feel it.",ex:"카드 (card)"},
    {big:"ㄲ ㄸ ㅃ ㅆ ㅉ",say:"까 따 빠 싸 짜",sound:"kk tt pp ss jj",note:"Double letters are tense: no air, tight throat.",ex:"빵 (bread)"}],
   quiz:[
    {type:"pick",prompt:"ㄴ",options:["n","m","r","g"],answer:0},
    {type:"pick",prompt:"ㅁ",options:["m","b","n","h"],answer:0},
    {type:"pick",prompt:"ㄹ",options:["r / l","d","n","s"],answer:0},
    {type:"pick",prompt:"Which one is silent at the start?",options:["ㅇ","ㅎ","ㅅ","ㄱ"],answer:0},
    {type:"pick",prompt:"Which consonant do you hear?",speak:"카",options:["ㅋ","ㄱ","ㄲ","ㅎ"],answer:0},
    {type:"pick",prompt:"ㅊ",options:["ch","j","s","t"],answer:0}]},

  {id:"reading",ko:"읽기",en:"Reading syllables",
   intro:"이제 읽어 봐요!",introEn:"Now let's read!",
   cards:[
    {big:"ㄱ + ㅏ = 가",say:"가",sound:"ga",note:"Every block starts with a consonant, then a vowel. Tall vowels (ㅏㅓㅣ) go on the right.",ex:"가다 (to go)"},
    {big:"ㅁ + ㅗ = 모",say:"모",sound:"mo",note:"Flat vowels (ㅗㅜㅡ) go underneath.",ex:"모자 (hat)"},
    {big:"ㅇ + ㅏ = 아",say:"아",sound:"a",note:"No consonant sound? Use silent ㅇ as a placeholder.",ex:"아이 (child)"},
    {big:"ㅂ + ㅏ + ㅂ = 밥",say:"밥",sound:"bap",note:"A third letter at the bottom is called 받침 (batchim).",ex:"밥 (rice)"},
    {big:"라면",say:"라면",sound:"ra-myeon",note:"Two blocks: 라 + 면. Read block by block.",ex:"라면 (ramen)"},
    {big:"버스 · 카드 · 커피",say:"버스, 카드, 커피",sound:"beo-seu · ka-deu · keo-pi",note:"Many words are English! Read them aloud and guess.",ex:"bus · card · coffee"}],
   quiz:[
    {type:"build",prompt:"Build the sound 'na'",target:"나"},
    {type:"build",prompt:"Build the sound 'mo'",target:"모"},
    {type:"build",prompt:"Build the sound 'su'",target:"수"},
    {type:"pick",prompt:"버스",options:["bus","bread","beer","pass"],answer:0},
    {type:"pick",prompt:"카드",options:["card","cart","code","guide"],answer:0},
    {type:"pick",prompt:"커피",options:["coffee","copy","cup","coupon"],answer:0},
    {type:"pick",prompt:"택시",options:["taxi","text","tax","tissue"],answer:0},
    {type:"pick",prompt:"Which word do you hear?",speak:"라면",options:["라면","나면","라민","다면"],answer:0}]},

  {id:"greetings",ko:"인사 · 자기소개",en:"Greetings & introducing yourself",
   intro:"이제 자기소개를 해 봐요!",introEn:"Now let's introduce ourselves!",
   cards:[
    {big:"안녕하세요",say:"안녕하세요",sound:"annyeonghaseyo",note:"Hello. Any time of day, with anyone. Add a small bow.",ex:""},
    {big:"처음 뵙겠습니다",say:"처음 뵙겠습니다",sound:"cheoeum boepgetseumnida",note:"'Nice to meet you' for a first meeting with a professor, boss or older person. Polite and set.",ex:""},
    {big:"만나서 반가워요",say:"만나서 반가워요",sound:"mannaseo bangawoyo",note:"'Nice to meet you' with classmates and people your age. The everyday one.",ex:""},
    {big:"저는 ○○이에요 · 예요",say:"저는 민준이에요. 저는 지수예요.",sound:"jeoneun ○○ieyo · yeyo",note:"I'm ○○. Name ends in a consonant → 이에요 (민준이에요). Ends in a vowel → 예요 (지수예요).",ex:"저는 지수예요 (I'm Jisu)"},
    {big:"○○에서 왔어요",say:"베트남에서 왔어요",sound:"○○eseo wasseoyo",note:"I'm from ○○. Put your country first: 우즈베키스탄에서 왔어요, 중국에서 왔어요.",ex:"베트남에서 왔어요 (I'm from Vietnam)"},
    {big:"유학생이에요",say:"유학생이에요",sound:"yuhaksaengieyo",note:"I'm an international student. Working? Say 회사원이에요 (I'm an office worker).",ex:"세종대 유학생이에요"},
    {big:"잘 부탁드려요",say:"잘 부탁드려요",sound:"jal butakdeuryeoyo",note:"How Koreans end an introduction: 'please be good to me / I look forward to working with you.'",ex:""},
    {big:"안녕히 가세요 · 계세요",say:"안녕히 가세요. 안녕히 계세요.",sound:"annyeonghi gaseyo · gyeseyo",note:"Goodbye. 가세요 to the person leaving, 계세요 to the person staying. Leaving a shop? 안녕히 계세요.",ex:""}],
   quiz:[
    {type:"pick",prompt:"You meet a new classmate for the first time.",options:["만나서 반가워요","잘 먹었습니다","안녕히 계세요","수고하세요"],answer:0,notes:{1:"You say that after a meal.",2:"That's goodbye when you are the one leaving.",3:"That's what you say leaving a shop."}},
    {type:"pick",prompt:"Your name is 지수. Introduce yourself.",options:["저는 지수예요","저는 지수이에요","저는 지수 있어요","저는 지수 해요"],answer:0,notes:{1:"지수 ends in a vowel (수), so it's 예요, not 이에요.",2:"있어요 means 'there is / I have'.",3:"해요 means 'I do'."}},
    {type:"pick",prompt:"Say you're from Vietnam.",options:["베트남에서 왔어요","베트남에 가요","베트남에 있어요","베트남을 좋아해요"],answer:0,notes:{1:"That means 'I'm going to Vietnam'.",2:"That means 'I'm in Vietnam (now)'.",3:"That means 'I like Vietnam'."}},
    {type:"pick",prompt:"You leave a shop. The clerk stays.",options:["안녕히 계세요","안녕히 가세요","처음 뵙겠습니다","잘 부탁드려요"],answer:0,notes:{1:"가세요 is for the person who leaves. You are leaving, so say 계세요 to the one staying.",2:"That's for meeting someone for the first time.",3:"That ends an introduction, not a visit to a shop."}},
    {type:"pick",prompt:"Which phrase do you hear?",speak:"잘 부탁드려요",options:["잘 부탁드려요","잘 먹었습니다","잘 지내요","잘 가요"],answer:0,notes:{1:"잘 먹었습니다 is 'I ate well'. Listen for 부탁.",2:"잘 지내요 is 'I'm doing well'.",3:"잘 가요 is a casual 'bye'."}},
    {type:"say",prompt:"Introduce yourself out loud.",intro:true}]},

  {id:"numbers",ko:"숫자",en:"Numbers",
   intro:"한국어에는 숫자를 읽는 방법이 두 가지 있어요!",introEn:"There are two ways to read numbers in Korean!",
   cards:[
    {big:"일 이 삼 사 오",say:"일, 이, 삼, 사, 오",sound:"il i sam sa o",note:"Sino-Korean numbers 1–5. Used for money, floors, minutes, phone numbers.",ex:"오 층 (5th floor)"},
    {big:"육 칠 팔 구 십",say:"육, 칠, 팔, 구, 십",sound:"yuk chil pal gu sip",note:"6–10. Then 백 = 100, 천 = 1,000, 만 = 10,000.",ex:"십 분 (10 minutes)"},
    {big:"천 원 · 만 원",say:"천 원, 만 원",sound:"cheon won · man won",note:"Prices! 10,000원 is just 만 원, never 일만 원. 3,500원 = 삼천오백 원.",ex:"이만 원 (20,000 won)"},
    {big:"하나 둘 셋 넷 다섯",say:"하나, 둘, 셋, 넷, 다섯",sound:"hana dul set net daseot",note:"Native Korean numbers. Used for counting things, people, hours and age.",ex:"하나 주세요 (one, please)"},
    {big:"한 개 · 두 명 · 세 시",say:"한 개, 두 명, 세 시",sound:"han gae · du myeong · se si",note:"Before a counter, 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네.",ex:"두 명이요 (two people)"},
    {big:"공일공",say:"공일공",sound:"gong-il-gong",note:"Phone numbers: 0 is 공. Korean mobile numbers start with 010.",ex:"공일공… (010…)"}],
   quiz:[
    {type:"pick",prompt:"3,000원",options:["삼천 원","셋천 원","삼백 원","세 천 원"],answer:0,notes:{1:"셋 is a native number. Money uses Sino numbers: 삼.",2:"삼백 is 300. 천 = 1,000, so 3,000 is 삼천.",3:"세 is native. Prices always use Sino numbers: 삼천 원."}},
    {type:"pick",prompt:"10,000원",options:["만 원","일만 원","십천 원","열 천 원"],answer:0,notes:{1:"Possible on paper, but nobody says it. 10,000 is just 만.",2:"Korean counts big numbers in 만 (10,000), so it's 만 원.",3:"열 is native, and Korean groups by 만: 만 원."}},
    {type:"pick",prompt:"Two people (at a restaurant)",options:["두 명이요","이 명이요","둘 명이요","두 개요"],answer:0,notes:{1:"People are counted with native numbers: 두 명.",2:"Before a counter word, 둘 shortens to 두.",3:"개 counts things, not people. People use 명."}},
    {type:"pick",prompt:"5th floor",options:["오 층","다섯 층","오 개","다섯 시"],answer:0,notes:{1:"Floors use Sino numbers: 오 층.",2:"개 counts things. Floors use 층.",3:"시 means o'clock. Floors use 층."}},
    {type:"pick",prompt:"3 o'clock",options:["세 시","삼 시","셋 시","삼 분"],answer:0,notes:{1:"Hours use native numbers: 세 시.",2:"Before 시, 셋 shortens to 세.",3:"분 means minutes. 3 o'clock is 세 시."}},
    {type:"pick",prompt:"Which price do you hear?",speak:"오천 원",options:["5,000원","500원","50,000원","4,000원"],answer:0,notes:{1:"500 is 오백. You heard 천 (1,000).",2:"50,000 is 오만. You heard 천 (1,000), not 만.",3:"4 is 사 (사천). You heard 오, which is 5."}}]},

  {id:"phrases",ko:"기본 표현",en:"Survival phrases",
   intro:"어디서나 사용해 봐요!",introEn:"Use these everywhere!",
   cards:[
    {big:"감사합니다",say:"감사합니다",sound:"gamsahamnida",note:"Thank you. Always safe.",ex:""},
    {big:"네 · 아니요",say:"네, 아니요",sound:"ne · aniyo",note:"Yes · No. 네 also means 'okay, I'm listening.'",ex:""},
    {big:"저기요",say:"저기요",sound:"jeogiyo",note:"Excuse me! To get someone's attention.",ex:""},
    {big:"이거 얼마예요?",say:"이거 얼마예요?",sound:"igeo eolmayeyo?",note:"How much is this? Point and ask.",ex:""},
    {big:"화장실 어디예요?",say:"화장실 어디예요?",sound:"hwajangsil eodiyeyo?",note:"Where's the bathroom? Swap 화장실 for any place.",ex:""},
    {big:"한국어 잘 못해요",say:"한국어 잘 못해요",sound:"hangugeo jal motaeyo",note:"I don't speak Korean well. People will slow down or switch to simple words.",ex:""},
    {big:"죄송합니다 · 잠깐만요",say:"죄송합니다, 잠깐만요",sound:"joesonghamnida · jamkkanmanyo",note:"Sorry · Just a moment (also: 'excuse me, let me pass' on the subway).",ex:""}],
   quiz:[
    {type:"pick",prompt:"You want to get a staff member's attention.",options:["저기요!","안녕히 가세요","잘 먹었습니다","괜찮아요"],answer:0,notes:{1:"That's 'goodbye' to someone who is leaving.",2:"You say that after eating, not to call someone.",3:"That means 'it's okay' or 'no thanks'."}},
    {type:"pick",prompt:"You want to know the price.",options:["이거 얼마예요?","이거 뭐예요?","어디예요?","몇 시예요?"],answer:0,notes:{1:"That asks 'what is this?'",2:"That asks 'where is it?'",3:"That asks 'what time is it?'"}},
    {type:"pick",prompt:"Someone speaks too fast.",options:["한국어 잘 못해요","감사합니다","네, 맞아요","잠깐만요"],answer:0,notes:{1:"That means 'thank you'.",2:"That means 'yes, that's right'. They'll keep talking fast!",3:"'Just a moment' is close, but it doesn't tell them you need simpler Korean."}},
    {type:"pick",prompt:"You need to squeeze past people on the subway.",options:["잠깐만요","저기요","얼마예요?","안녕하세요"],answer:0,notes:{1:"저기요 calls someone over. To get past, say 잠깐만요.",2:"That asks a price.",3:"That's a greeting, not 'excuse me'."}},
    {type:"pick",prompt:"Which phrase do you hear?",speak:"감사합니다",options:["감사합니다","죄송합니다","안녕하세요","괜찮습니다"],answer:0,notes:{1:"죄송합니다 means 'I'm sorry'. Listen for 감사 at the start.",2:"안녕하세요 means 'hello'.",3:"괜찮습니다 means 'it's fine'."}}]}
 ]
};

// 한글 학교 is the first stop in every city, with one shared progress.
window.CITIES.filter(c=>!c.soon).forEach(c=>c.places.unshift(window.BASICS));
window.BASICS.photo="";
window.BASICS.words=[{ko:"커피",en:"coffee",emo:"☕"},{ko:"라면",en:"ramen",emo:"🍜"},{ko:"사과",en:"apple",emo:"🍎"},{ko:"우유",en:"milk",emo:"🥛"},{ko:"빵",en:"bread",emo:"🍞"},{ko:"모자",en:"hat",emo:"🧢"}];
