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
   intro:"자음은 입 모양이에요!",introEn:"Consonants are shaped like your mouth!",
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

  {id:"numbers",ko:"숫자",en:"Numbers",
   intro:"한국어는 숫자가 두 개 있어요!",introEn:"Korean has two number systems!",
   cards:[
    {big:"일 이 삼 사 오",say:"일, 이, 삼, 사, 오",sound:"il i sam sa o",note:"Sino-Korean numbers 1–5. Used for money, floors, minutes, phone numbers.",ex:"오 층 (5th floor)"},
    {big:"육 칠 팔 구 십",say:"육, 칠, 팔, 구, 십",sound:"yuk chil pal gu sip",note:"6–10. Then 백 = 100, 천 = 1,000, 만 = 10,000.",ex:"십 분 (10 minutes)"},
    {big:"천 원 · 만 원",say:"천 원, 만 원",sound:"cheon won · man won",note:"Prices! 10,000원 is just 만 원, never 일만 원. 3,500원 = 삼천오백 원.",ex:"이만 원 (20,000 won)"},
    {big:"하나 둘 셋 넷 다섯",say:"하나, 둘, 셋, 넷, 다섯",sound:"hana dul set net daseot",note:"Native Korean numbers. Used for counting things, people, hours and age.",ex:"하나 주세요 (one, please)"},
    {big:"한 개 · 두 명 · 세 시",say:"한 개, 두 명, 세 시",sound:"han gae · du myeong · se si",note:"Before a counter, 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네.",ex:"두 명이요 (two people)"},
    {big:"공일공",say:"공일공",sound:"gong-il-gong",note:"Phone numbers: 0 is 공. Korean mobile numbers start with 010.",ex:"공일공… (010…)"}],
   quiz:[
    {type:"pick",prompt:"3,000원",options:["삼천 원","셋천 원","삼백 원","세 천 원"],answer:0},
    {type:"pick",prompt:"10,000원",options:["만 원","일만 원","십천 원","열 천 원"],answer:0},
    {type:"pick",prompt:"Two people (at a restaurant)",options:["두 명이요","이 명이요","둘 명이요","두 개요"],answer:0},
    {type:"pick",prompt:"5th floor",options:["오 층","다섯 층","오 개","다섯 시"],answer:0},
    {type:"pick",prompt:"3 o'clock",options:["세 시","삼 시","셋 시","삼 분"],answer:0},
    {type:"pick",prompt:"Which price do you hear?",speak:"오천 원",options:["5,000원","500원","50,000원","4,000원"],answer:0}]},

  {id:"phrases",ko:"기본 표현",en:"Survival phrases",
   intro:"이거 알면 어디든 갈 수 있어요!",introEn:"Know these and you can go anywhere!",
   cards:[
    {big:"안녕하세요",say:"안녕하세요",sound:"annyeonghaseyo",note:"Hello. Works any time of day, with anyone.",ex:""},
    {big:"감사합니다",say:"감사합니다",sound:"gamsahamnida",note:"Thank you. Always safe.",ex:""},
    {big:"네 · 아니요",say:"네, 아니요",sound:"ne · aniyo",note:"Yes · No. 네 also means 'okay, I'm listening.'",ex:""},
    {big:"저기요",say:"저기요",sound:"jeogiyo",note:"Excuse me! To get someone's attention.",ex:""},
    {big:"이거 얼마예요?",say:"이거 얼마예요?",sound:"igeo eolmayeyo?",note:"How much is this? Point and ask.",ex:""},
    {big:"화장실 어디예요?",say:"화장실 어디예요?",sound:"hwajangsil eodiyeyo?",note:"Where's the bathroom? Swap 화장실 for any place.",ex:""},
    {big:"한국어 잘 못해요",say:"한국어 잘 못해요",sound:"hangugeo jal motaeyo",note:"I don't speak Korean well. People will slow down or switch to simple words.",ex:""},
    {big:"죄송합니다 · 잠깐만요",say:"죄송합니다, 잠깐만요",sound:"joesonghamnida · jamkkanmanyo",note:"Sorry · Just a moment (also: 'excuse me, let me pass' on the subway).",ex:""}],
   quiz:[
    {type:"pick",prompt:"You want to get a staff member's attention.",options:["저기요!","안녕히 가세요","잘 먹었습니다","괜찮아요"],answer:0},
    {type:"pick",prompt:"You want to know the price.",options:["이거 얼마예요?","이거 뭐예요?","어디예요?","몇 시예요?"],answer:0},
    {type:"pick",prompt:"Someone speaks too fast.",options:["한국어 잘 못해요","감사합니다","네, 맞아요","잠깐만요"],answer:0},
    {type:"pick",prompt:"You need to squeeze past people on the subway.",options:["잠깐만요","저기요","얼마예요?","안녕하세요"],answer:0},
    {type:"pick",prompt:"Which phrase do you hear?",speak:"감사합니다",options:["감사합니다","죄송합니다","안녕하세요","괜찮습니다"],answer:0}]}
 ]
};

window.PLACES.unshift(window.BASICS);
window.PLACES.forEach((p,i)=>p.state=i===0?"open":"locked");
