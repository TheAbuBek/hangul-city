// All lesson content lives here. Your Korean teammate can edit lines in this file only.
// who:"them" = the character speaks. who:"me" = the learner's turn.
//   type:"build" -> arrange word tiles (answer = correct order, extra = distractors)
//   type:"pick"  -> choose a reply (answer = index of the right option; notes/kinds explain wrong ones)
//   type:"say"   -> say it out loud
// kinds are used for statistics: formal | casual | rude | meaning
const BASE=[
 {code:"편의점",photo:"photos/convenience.jpg",ko:"편의점",en:"Convenience store",brands:"GS25 · CU · 7-Eleven",
  scene:"store",sub:"After class, 18:40",who:"알바생",whoEn:"part-time clerk",
  char:{skin:"#F2C9A0",hair:"#2B211C",style:"short",top:"#3C8D5A",acc:"vest"},
  culture:"Clerks rattle off the same fast questions in every store: 봉투? 데워 드릴까요? 적립? 영수증? Learn this pattern once and you'll understand most shops. Say 수고하세요 when you leave.",
  lesson:[
   {ko:"봉투 필요하세요?",ro:"bongtu piryohaseyo?",en:"Do you need a bag?",note:"Bags cost money, so they always ask. Answer 네 or 아뇨, 괜찮아요."},
   {ko:"데워 드릴까요?",ro:"dewo deurilkkayo?",en:"Shall I heat it up?",note:"For lunch boxes (도시락) and 삼각김밥. Say 네, 데워 주세요."},
   {ko:"아뇨, 괜찮아요",ro:"anyo, gwaenchanayo",en:"No thanks",note:"The polite way to say no to almost anything. Never 싫어요, which sounds like 'I don't want to.'"},
   {ko:"수고하세요",ro:"sugohaseyo",en:"(Bye,) keep up the good work",note:"What Koreans say leaving a shop. Sounds natural and friendly."}],
  script:[
   {who:"them",ko:"어서오세요~",en:"Welcome~"},
   {who:"them",ko:"봉투 필요하세요?",en:"Need a bag?"},
   {who:"me",type:"pick",en:"No thanks, you'll carry it.",options:["아뇨, 괜찮아요","봉투가 필요하지 않습니다","싫어요"],answer:0,
    notes:{1:"Textbook. Real people just say 아뇨, 괜찮아요.",2:"싫어요 means 'I don't want to,' which sounds blunt here."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"이거 데워 드릴까요?",en:"Want this heated?"},
   {who:"me",type:"build",en:"Yes, heat it please.",answer:["네,","데워","주세요"],extra:["봉투","없어요"]},
   {who:"them",ko:"포인트 적립하세요?",en:"Collecting points?"},
   {who:"me",type:"pick",en:"You don't have a points card.",options:["아뇨, 없어요","네, 데워 주세요","포인트 카드를 소지하고 있지 않습니다"],answer:0,
    notes:{1:"She asked about points, not heating.",2:"Nobody says this. 아뇨, 없어요 is enough."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"영수증 드릴까요?",en:"Receipt?"},
   {who:"me",type:"pick",en:"No receipt.",options:["아뇨, 괜찮아요","네, 카드요","몇 번이요?"],answer:0},
   {who:"them",ko:"감사합니다~",en:"Thank you~"},
   {who:"me",type:"say",ko:"감사합니다. 수고하세요!",en:"Thank her and leave the way Koreans do."}],
  words:[{ko:"봉투",en:"plastic bag",emo:"🛍️"},{ko:"도시락",en:"lunch box",emo:"🍱"},{ko:"삼각김밥",en:"triangle rice ball",emo:"🍙"},{ko:"영수증",en:"receipt",emo:"🧾"},{ko:"컵라면",en:"cup noodles",emo:"🍜"}],
  mission:{title:"Buy something at a GS25, CU or 7-Eleven and get it heated, in Korean.",say:"네, 데워 주세요.",tip:"On your way out: 수고하세요."}},

 {code:"식당",photo:"photos/restaurant.jpg",ko:"식당",en:"Korean restaurant",brands:"김치찌개 · 백반집",
  scene:"restaurant",sub:"Lunch near campus, 12:30",who:"이모",whoEn:"restaurant auntie",
  char:{skin:"#EBC19B",hair:"#3A2A24",style:"perm",top:"#C0473A",acc:"apron"},
  culture:"Staff won't come to your table on their own. Call them with 여기요! or 사장님!, which is normal, not rude. (이모 only fits an older woman, so 사장님 is the safe choice.) Water is often self-service (물은 셀프), and you pay at the counter on the way out. No tipping.",
  lesson:[
   {ko:"여기요!",ro:"yeogiyo!",en:"Excuse me! (calling staff)",note:"Raise your hand and say it loudly. Waiting quietly means nobody comes."},
   {ko:"○○ 두 개 주세요",ro:"du gae juseyo",en:"Two ○○, please",note:"Food + number + 주세요. 한 개, 두 개, 세 개."},
   {ko:"덜 맵게 해 주세요",ro:"deol maepge hae juseyo",en:"Less spicy, please",note:"The most useful sentence in a Korean restaurant."},
   {ko:"잘 먹었습니다",ro:"jal meogeotseumnida",en:"I ate well (thank you)",note:"Say it to the staff when you pay or leave. They love hearing it from foreigners."}],
  script:[
   {who:"them",ko:"어서 오세요~ 몇 분이세요?",en:"Welcome~ How many people?"},
   {who:"me",type:"pick",en:"Two people.",options:["두 명이요","두 사람입니다","둘이야"],answer:0,
    notes:{1:"Understandable, but stiff. Just 두 명이요.",2:"반말. Too casual with staff."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"편한 데 앉으세요~",en:"Sit anywhere you like~"},
   {who:"me",type:"pick",en:"You're ready to order. Call her over.",options:["여기요! 주문할게요","주문을 하고 싶습니다","저기... 죄송한데..."],answer:0,
    notes:{1:"Correct, but sounds like a script. 여기요! 주문할게요.",2:"Too quiet and hesitant. In a busy 식당 she won't come."},kinds:{1:"formal",2:"meaning"}},
   {who:"them",ko:"네~ 뭐 드릴까요?",en:"Yes~ What can I get you?"},
   {who:"me",type:"build",en:"Two kimchi stews, please.",answer:["김치찌개","두 개","주세요"],extra:["하나","있어요"]},
   {who:"them",ko:"많이 매운데 괜찮아요?",en:"It's pretty spicy. Is that okay?"},
   {who:"me",type:"pick",en:"Ask for it less spicy.",options:["덜 맵게 해 주세요","매운 음식을 잘 먹지 못합니다","안 매워?"],answer:0,
    notes:{1:"Textbook. 덜 맵게 해 주세요 is what people actually say.",2:"That asks 'it's not spicy?' and in 반말."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"네~ 물은 셀프예요!",en:"Okay~ Water is self-service!"},
   {who:"them",ko:"맛있게 드셨어요? 이만 원이요.",en:"Did you enjoy it? That's 20,000 won."},
   {who:"me",type:"say",ko:"잘 먹었습니다. 진짜 맛있었어요!",en:"Thank her as you pay, and say it was really good."}],
  words:[{ko:"김치찌개",en:"kimchi stew",emo:"🍲"},{ko:"물",en:"water",emo:"💧"},{ko:"숟가락",en:"spoon",emo:"🥄"},{ko:"젓가락",en:"chopsticks",emo:"🥢"},{ko:"밥",en:"rice",emo:"🍚"}],
  mission:{title:"Order at a Korean restaurant and ask for it less spicy.",say:"여기요! 김치찌개 하나 주세요. 덜 맵게 해 주세요.",tip:"Leaving: 잘 먹었습니다."}},

 {code:"대학교",photo:"photos/university.jpg",ko:"대학교",en:"University office",brands:"학과 사무실",
  scene:"office",sub:"Department office, 14:00",who:"조교",whoEn:"department assistant",
  char:{skin:"#F4D2B0",hair:"#1E1A18",style:"bob",top:"#3E5C9A",acc:"glasses"},
  culture:"Offices open with 어떻게 오셨어요? It means 'how can I help,' not 'how did you get here.' Say what you need with -려고 왔는데요 (I came to…).",
  lesson:[
   {ko:"어떻게 오셨어요?",ro:"eotteoke osyeosseoyo?",en:"How can I help you?",note:"Literally 'how did you come,' but it means 'what do you need.'"},
   {ko:"○○ 떼려고 왔는데요",ro:"ttaeryeogo wanneundeyo",en:"I came to get ○○ (a document)",note:"떼다 is the everyday verb for getting an official document."},
   {ko:"재학증명서",ro:"jaehak jeungmyeongseo",en:"Enrollment certificate",note:"You'll need it for visas, banks and scholarships."},
   {ko:"아 네, 알겠습니다!",ro:"a ne, algetseumnida!",en:"Oh, got it!",note:"Polite reaction for school staff. 알겠어요 is fine with classmates. 이해했습니다 sounds like a soldier reporting."}],
  script:[
   {who:"them",ko:"네, 어떻게 오셨어요?",en:"Yes, how can I help you?"},
   {who:"me",type:"build",en:"Say you came to get an enrollment certificate.",answer:["재학증명서","떼려고","왔는데요"],extra:["주세요","어디"]},
   {who:"them",ko:"아, 그거 발급기에서 바로 뽑으시면 돼요.",en:"Oh, you can just print that at the kiosk."},
   {who:"me",type:"pick",en:"Ask where the kiosk is.",options:["발급기 어디 있어요?","발급기의 위치를 알려 주시겠습니까?","발급기 어디야?"],answer:0,
    notes:{1:"Polite, but stiff. Spoken Korean is shorter.",2:"반말. Too casual with office staff."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"학생회관 1층에 있어요. 학생증만 있으면 돼요.",en:"First floor of the Student Center. You just need your student ID."},
   {who:"me",type:"pick",en:"React naturally: oh, got it.",options:["아 네, 알겠습니다!","이해했습니다","오케이"],answer:0,
    notes:{1:"Sounds like a soldier reporting. 아 네, 알겠습니다 is what people say to staff.",2:"Too casual for an office."},kinds:{1:"formal",2:"casual"}},
   {who:"me",type:"say",ko:"학생회관 1층이요? 알겠습니다, 감사합니다!",ro:"haksaenghoegwan il-cheungiyo? algetseumnida, gamsahamnida!",en:"Repeat the place to check you heard it right, then thank her."}],
  words:[{ko:"학생증",en:"student ID card",emo:"🪪"},{ko:"도서관",en:"library",emo:"📚"},{ko:"책",en:"book",emo:"📖"},{ko:"노트북",en:"laptop",emo:"💻"},{ko:"가방",en:"bag (backpack)",emo:"🎒"}],
  mission:{title:"Get one thing done at your department office in Korean.",say:"재학증명서 떼려고 왔는데요.",tip:"Pointed elsewhere? 그거 어디 있어요?"}},

 {code:"버스",photo:"photos/bus.jpg",ko:"버스 정류장",en:"Bus stop",brands:"시내버스",
  scene:"bus",sub:"Evening, 19:15",who:"기사님",whoEn:"bus driver",
  char:{skin:"#E2B48C",hair:"#2A2522",style:"short",top:"#5B6F8A",acc:"cap"},
  culture:"Drivers answer in two words or a nod. That's normal, not rude. Call them 기사님, point at the bus with 이거, and tap your card when you get on and off.",
  lesson:[
   {ko:"기사님",ro:"gisanim",en:"Driver (polite)",note:"How everyone addresses bus and taxi drivers."},
   {ko:"이거 ○○ 가요?",ro:"igeo ○○ gayo?",en:"Does this go to ○○?",note:"Point at the bus. Short and completely natural."},
   {ko:"몇 정거장 가야 돼요?",ro:"myeot jeonggeojang gaya dwaeyo?",en:"How many stops?",note:"정거장 = stop. Then listen for the announcement."}],
  script:[
   {who:"me",type:"build",en:"Ask the driver if this bus goes to 강남역.",answer:["기사님,","이거","강남역","가요?"],extra:["주세요","몇"]},
   {who:"them",ko:"네, 가요.",en:"Yes, it does."},
   {who:"me",type:"pick",en:"Ask how many stops.",options:["몇 정거장 가야 돼요?","몇 층이에요?","정거장이 몇 개 남았습니까?"],answer:0,
    notes:{1:"That asks which floor.",2:"Understandable, but it sounds like a news anchor."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"세 정거장이요. 방송 나오면 내려요.",en:"Three stops. Get off when you hear the announcement."},
   {who:"me",type:"say",ko:"네, 감사합니다. 방송 나오면 내릴게요.",en:"Thank him and say you'll get off at the announcement."}],
  words:[{ko:"버스",en:"bus",emo:"🚌"},{ko:"교통카드",en:"transit card",emo:"💳"},{ko:"정류장",en:"bus stop",emo:"🚏"},{ko:"지하철",en:"subway",emo:"🚇"},{ko:"자전거",en:"bicycle",emo:"🚲"}],
  mission:{title:"Ask a bus driver if the bus goes where you need.",say:"기사님, 이거 강남역 가요?",tip:"Then: 몇 정거장 가야 돼요?"}},

 {code:"병원",photo:"photos/hospital.jpg",ko:"병원",en:"Hospital reception",brands:"동네 의원",
  scene:"hospital",sub:"Clinic reception, 10:00",who:"간호사",whoEn:"reception nurse",
  char:{skin:"#F1CDAA",hair:"#2E2420",style:"bun",top:"#E9F1F3",acc:"nursecap"},
  culture:"Bring your 외국인등록증 (residence card) to register. Reception asks the same three things: why you came, since when, and whether you have a fever. Describe pain with ○○이/가 아파요.",
  lesson:[
   {ko:"목이 아파요",ro:"mogi apayo",en:"My throat hurts",note:"Swap the body part: 머리 (head), 배 (stomach), 목 (throat)."},
   {ko:"처음이에요",ro:"cheoeumieyo",en:"It's my first visit",note:"They'll ask for your ID to register you."},
   {ko:"어제부터요",ro:"eojebuteoyo",en:"Since yesterday",note:"-부터 = since. 오늘 아침부터요 = since this morning."},
   {ko:"열은 없어요",ro:"yeoreun eopseoyo",en:"No fever",note:"열 = fever. 열이 있어요 = I have a fever."}],
  script:[
   {who:"them",ko:"안녕하세요, 어떻게 오셨어요?",en:"Hello, what brings you in?"},
   {who:"me",type:"build",en:"Say you came because your throat hurts.",answer:["목이","아파서","왔어요"],extra:["배가","주세요"]},
   {who:"them",ko:"처음 오셨어요? 신분증 주세요.",en:"First time here? Your ID, please."},
   {who:"me",type:"pick",en:"Yes, first time. Hand over your residence card.",options:["네, 처음이에요. 여기요","본 병원 방문은 처음입니다","응, 처음"],answer:0,
    notes:{1:"Sounds like a written form. 네, 처음이에요 is enough.",2:"반말. Never with a nurse."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"언제부터 아프셨어요?",en:"Since when has it hurt?"},
   {who:"me",type:"pick",en:"Since yesterday.",options:["어제부터요","내일부터요","어제부터 고통이 시작되었습니다"],answer:0,
    notes:{1:"내일 = tomorrow.",2:"Way too dramatic and formal."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"열은 있어요?",en:"Any fever?"},
   {who:"me",type:"pick",en:"No fever.",options:["열은 없어요","열 주세요","발열 증상은 없습니다"],answer:0,
    notes:{1:"That's 'give me a fever.'",2:"Medical-report Korean. Just 열은 없어요."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"앉아서 기다리세요. 이름 부르면 들어가시면 돼요.",en:"Have a seat. Go in when we call your name."},
   {who:"me",type:"say",ko:"네, 감사합니다. 혹시 얼마나 기다려야 돼요?",en:"Thank her and ask how long you'll have to wait."},
   {who:"them",ko:"한 십 분 정도요. 조금만 기다려 주세요.",en:"About ten minutes. Please wait a little."}],
  words:[{ko:"약",en:"medicine",emo:"💊"},{ko:"마스크",en:"face mask",emo:"😷"},{ko:"체온계",en:"thermometer",emo:"🌡️"},{ko:"주사",en:"injection",emo:"💉"},{ko:"병원",en:"hospital",emo:"🏥"}],
  mission:{title:"Next time you need a clinic, check in at reception in Korean.",say:"목이 아파서 왔어요. 어제부터요.",tip:"Bring your 외국인등록증."}},

 {code:"공항",photo:"photos/airport.jpg",ko:"공항",en:"Airport",brands:"인천공항",
  scene:"airport",sub:"Arrivals hall, picking up a friend",who:"안내 직원",whoEn:"information desk",
  char:{skin:"#F0C8A4",hair:"#3B2B22",style:"bun",top:"#2F4A7A",acc:"scarf"},
  culture:"Airport staff speak very polite Korean to everyone (무엇을 도와드릴까요?). You don't need to match it. Simple -요 sentences are perfect. If you have a T-money card, you can tap it on the airport train.",
  lesson:[
   {ko:"○○ 가는 ○○ 어디서 타요?",ro:"eodiseo tayo?",en:"Where do I take the ○○ to ○○?",note:"Works for trains, buses and taxis anywhere."},
   {ko:"공항철도",ro:"gonghang cheoldo",en:"Airport railroad (AREX)",note:"The train from the airport to Seoul Station."},
   {ko:"표는 어디서 사요?",ro:"pyoneun eodiseo sayo?",en:"Where do I buy a ticket?",note:"Or skip it: a T-money card works on most trains."}],
  script:[
   {who:"them",ko:"안녕하세요, 무엇을 도와드릴까요?",en:"Hello, how may I help you?"},
   {who:"me",type:"build",en:"Ask where to take the airport train to Seoul Station.",answer:["서울역 가는","공항철도","어디서","타요?"],extra:["주세요","몇 층"]},
   {who:"them",ko:"지하 1층으로 내려가시면 돼요.",en:"Go down to basement level 1."},
   {who:"me",type:"pick",en:"Ask where to buy a ticket.",options:["표는 어디서 사요?","승차권 구매처가 어디입니까?","표 줘"],answer:0,
    notes:{1:"Sounds like a sign, not a person.",2:"반말 and a command. Rude."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"교통카드 있으면 그냥 찍고 타셔도 돼요.",en:"If you have a transit card, you can just tap and ride."},
   {who:"me",type:"pick",en:"React: oh, I see!",options:["아, 그렇구나! 감사합니다","이해했습니다","ㅇㅋ"],answer:0,
    notes:{1:"Stiff. 아, 그렇구나 sounds natural.",2:"Text slang. Never say it out loud."},kinds:{1:"formal",2:"casual"}},
   {who:"me",type:"say",ko:"감사합니다. 그런데 서울역까지 얼마나 걸려요?",en:"Thank her, then ask how long it takes to Seoul Station."},
   {who:"them",ko:"직통열차는 사십삼 분, 일반열차는 한 시간 정도 걸려요.",en:"The express takes 43 minutes, the regular train about an hour."},
   {who:"me",type:"say",ko:"아, 그렇구나. 그럼 일반열차 타고 갈게요. 감사합니다!",en:"React, say you'll take the regular train, and thank her."}],
  words:[{ko:"비행기",en:"airplane",emo:"✈️"},{ko:"여권",en:"passport",emo:"🛂"},{ko:"짐",en:"luggage",emo:"🧳"},{ko:"기차",en:"train",emo:"🚆"},{ko:"택시",en:"taxi",emo:"🚕"}]
  ,mission:{title:"Ask an airport or station staff member for directions in Korean.",say:"서울역 가는 공항철도 어디서 타요?",tip:"Ticket? 표는 어디서 사요?"}}
];

// ---------- Life in Korea: new Seoul places ----------
const LIFE=[
 {code:"은행",photo:"photos/bank.jpg",ko:"은행",en:"Bank",brands:"계좌 개설",
  scene:"bank",sub:"Opening an account, 10:30",who:"은행 직원",whoEn:"bank teller",
  char:{skin:"#F3CDA8",hair:"#24201D",style:"bun",top:"#2D4F7C",acc:"scarf"},
  culture:"Take a number ticket (번호표) at the entrance and wait. To open an account, bring your 외국인등록증 and passport. Many banks also ask why you need the account, so a student ID or work contract helps.",
  lesson:[
   {ko:"번호표",ro:"beonhopyo",en:"Number ticket",note:"Pull one from the machine by the door, then wait for your number on the screen."},
   {ko:"통장 만들러 왔어요",ro:"tongjang mandeulleo wasseoyo",en:"I came to open an account",note:"통장 = bankbook / account. -러 왔어요 = I came to…"},
   {ko:"체크카드",ro:"chekeu kadeu",en:"Debit card",note:"Most foreigners get a 체크카드 first. Credit cards are harder to get."},
   {ko:"비밀번호",ro:"bimilbeonho",en:"PIN / password",note:"They'll ask you to type a 4-digit 비밀번호 on a keypad."}],
  script:[
   {who:"them",ko:"번호표 뽑고 잠시만 기다려 주세요~",en:"Please take a number and wait a moment~"},
   {who:"them",ko:"23번 고객님, 이쪽으로 오세요. 어떤 거 도와드릴까요?",en:"Customer 23, this way please. How can I help?"},
   {who:"me",type:"build",en:"Say you came to open an account.",answer:["통장","만들러","왔어요"],extra:["주세요","어디"]},
   {who:"them",ko:"외국인등록증이랑 여권 있으세요?",en:"Do you have your residence card and passport?"},
   {who:"me",type:"pick",en:"Yes, here they are.",options:["네, 여기 있어요","네, 소지하고 있습니다","있어"],answer:0,
    notes:{1:"Correct, but sounds like a police report. 네, 여기 있어요.",2:"반말. Too casual with a bank teller."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"체크카드도 같이 만들어 드릴까요?",en:"Shall I make a debit card too?"},
   {who:"me",type:"pick",en:"Yes, please do both.",options:["네, 같이 해 주세요","체크카드 발급을 희망합니다","카드 줘"],answer:0,
    notes:{1:"Sounds like a written form.",2:"반말 command. Rude."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"여기 비밀번호 네 자리 눌러 주세요.",en:"Please enter a 4-digit PIN here."},
   {who:"them",ko:"다 됐습니다. 카드는 바로 드릴게요.",en:"All done. I'll give you the card right away."},
   {who:"me",type:"say",ko:"감사합니다. 카드는 오늘부터 쓸 수 있어요?",en:"Thank her and ask if you can use the card from today."},
   {who:"them",ko:"네, 지금 바로 쓰실 수 있어요.",en:"Yes, you can use it right away."}],
  words:[{ko:"돈",en:"money",emo:"💵"},{ko:"통장",en:"bankbook",emo:"📒"},{ko:"동전",en:"coin",emo:"🪙"},{ko:"지갑",en:"wallet",emo:"👛"},{ko:"번호표",en:"number ticket",emo:"🎫"}]
  ,mission:{title:"Open an account, or ask one question at a bank, in Korean.",say:"통장 만들러 왔어요.",tip:"Take a 번호표 first."}},

 {code:"휴대폰",photo:"photos/phone.jpg",ko:"휴대폰 매장",en:"Phone shop",brands:"유심 · 요금제",
  scene:"phone",sub:"Getting a SIM, 17:00",who:"매장 직원",whoEn:"phone shop staff",
  char:{skin:"#EDC39D",hair:"#1C1A19",style:"short",top:"#23272E",acc:"lanyard"},
  culture:"A prepaid SIM (선불 유심) usually needs only your passport. Monthly plans (후불) usually need a 외국인등록증. Staff often suggest expensive plans first. Asking 좀 더 싼 거 있어요? is normal.",
  lesson:[
   {ko:"유심",ro:"yusim",en:"SIM card",note:"From USIM. Everyone says 유심, not SIM."},
   {ko:"선불 · 후불",ro:"seonbul · hubul",en:"Prepaid · Postpaid",note:"선 = before, 후 = after. 불 = payment."},
   {ko:"데이터 무제한",ro:"deiteo mujehan",en:"Unlimited data",note:"무제한 = no limit."},
   {ko:"좀 더 싼 거 있어요?",ro:"jom deo ssan geo isseoyo?",en:"Is there something cheaper?",note:"Works in any shop in Korea."}],
  script:[
   {who:"them",ko:"어서 오세요~ 뭐 보러 오셨어요?",en:"Welcome~ What are you looking for?"},
   {who:"me",type:"build",en:"Say you want to buy a SIM.",answer:["유심","사려고","하는데요"],extra:["주세요","몇 개"]},
   {who:"them",ko:"선불이요, 후불이요?",en:"Prepaid or postpaid?"},
   {who:"me",type:"pick",en:"Prepaid.",options:["선불이요","선불 요금제를 원합니다","선불"],answer:0,
    notes:{1:"Too stiff for a shop.",2:"Just the word sounds blunt. Add -이요."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"데이터 많이 쓰세요?",en:"Do you use a lot of data?"},
   {who:"me",type:"pick",en:"Yes, a lot. Ask if there's unlimited.",options:["네, 많이 써요. 무제한 있어요?","데이터를 많이 사용합니다","몰라"],answer:0,
    notes:{1:"Correct, but nobody talks like that.",2:"반말 'I don't know.' Rude here."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"무제한은 한 달에 삼만 삼천 원이에요.",en:"Unlimited is 33,000 won a month."},
   {who:"me",type:"pick",en:"Ask if there's something cheaper.",options:["좀 더 싼 거 있어요?","더 저렴한 요금제가 존재합니까?","비싸!"],answer:0,
    notes:{1:"Sounds like a textbook.",2:"Blunt. 'Expensive!' won't make friends."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"그럼 이거 있어요. 이만 원짜리. 여권 주시겠어요?",en:"Then there's this one. 20,000 won. May I have your passport?"},
   {who:"me",type:"say",ko:"네, 여기 있어요. 그럼 이걸로 할게요.",en:"Hand it over and say you'll take that one."}],
  words:[{ko:"휴대폰",en:"cell phone",emo:"📱"},{ko:"충전기",en:"charger",emo:"🔌"},{ko:"이어폰",en:"earphones",emo:"🎧"},{ko:"배터리",en:"battery",emo:"🔋"},{ko:"와이파이",en:"Wi-Fi",emo:"📶"}],
  mission:{title:"Ask a phone shop about a cheaper plan, in Korean.",say:"좀 더 싼 거 있어요?",tip:"Prepaid = 선불."}},

 {code:"부동산",photo:"photos/realestate.jpg",ko:"부동산",en:"Real estate office",brands:"원룸 · 월세",
  scene:"realestate",sub:"Looking for a room, 15:00",who:"사장님",whoEn:"agent",
  char:{skin:"#E6B994",hair:"#8E8A86",style:"short",top:"#6B5A48",acc:"glasses"},
  culture:"Rent has two parts: 보증금 (deposit, returned at the end) and 월세 (monthly rent). People say amounts in 만 원 units, so 오백 means 5,000,000 won. Ask about 관리비 (maintenance fee), which is extra. Have someone you trust read the contract before signing.",
  lesson:[
   {ko:"원룸",ro:"wollum",en:"Studio apartment",note:"From 'one room'. The standard student home."},
   {ko:"보증금 · 월세",ro:"bojeunggeum · wolse",en:"Deposit · Monthly rent",note:"보증금 오백에 월세 오십 = 5,000,000 deposit, 500,000 a month."},
   {ko:"관리비",ro:"gwallibi",en:"Maintenance fee",note:"Paid on top of rent. Ask what it includes."},
   {ko:"괜찮아요",ro:"gwaenchanayo",en:"It's fine / No thanks",note:"Careful: as an answer to an offer, it usually means NO."}],
  script:[
   {who:"them",ko:"어서 오세요. 집 보러 오셨어요?",en:"Welcome. Here to look for a place?"},
   {who:"me",type:"build",en:"Say you're looking for a studio.",answer:["원룸","구하고","있어요"],extra:["주세요","몇"]},
   {who:"them",ko:"보증금이랑 월세는 얼마 생각하세요?",en:"What deposit and monthly rent are you thinking?"},
   {who:"me",type:"pick",en:"About 5,000,000 deposit and 500,000 a month.",options:["보증금 오백에 월세 오십 정도요","보증금 오백만 원과 월세 오십만 원을 희망합니다","싸게 해 줘"],answer:0,
    notes:{1:"Correct numbers, but people don't say the full amounts. 오백, 오십.",2:"반말 command. Rude."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"이 방 괜찮아요. 관리비는 오만 원 따로 있어요.",en:"This room is good. Maintenance is 50,000 won extra."},
   {who:"me",type:"pick",en:"Ask what the maintenance fee includes.",options:["관리비에 뭐 포함돼요?","관리비 주세요","관리비의 포함 항목을 알려 주십시오"],answer:0,
    notes:{1:"That's 'give me the maintenance fee.'",2:"Way too formal for talking."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"인터넷이랑 수도요. 지금 한번 보러 가실래요?",en:"Internet and water. Want to go see it now?"},
   {who:"me",type:"pick",en:"Yes, you want to see it now.",options:["네, 지금 볼 수 있어요?","괜찮아요","봐"],answer:0,
    notes:{1:"Here 괜찮아요 means 'no thanks'. He'll think you're not interested.",2:"반말. Too casual."},kinds:{1:"meaning",2:"casual"}},
   {who:"me",type:"say",ko:"좋아요. 지금 같이 보러 가요. 혹시 바로 들어갈 수 있어요?",en:"Agree to go now, and ask if you can move in right away."},
   {who:"them",ko:"네, 다음 주부터 들어갈 수 있어요.",en:"Yes, you can move in from next week."}],
  words:[{ko:"집",en:"house, home",emo:"🏠"},{ko:"열쇠",en:"key",emo:"🔑"},{ko:"침대",en:"bed",emo:"🛏️"},{ko:"계약서",en:"contract",emo:"📝"},{ko:"세탁기",en:"washing machine",emo:"🧺"}]
  ,mission:{title:"Ask a 부동산 about a 원룸 and its 관리비, even if you aren't moving.",say:"원룸 구하고 있어요.",tip:"Then: 관리비에 뭐 포함돼요?"}}
];

// ---------- Busan ----------
const BUSAN=[
 {code:"자갈치",photo:"photos/market.jpg",ko:"자갈치시장",en:"Jagalchi fish market",brands:"회 · 시장",travel:true,
  scene:"market",sub:"Busan · Jagalchi, 12:00",who:"이모",whoEn:"fish seller (Busan dialect)",
  char:{skin:"#E3B48C",hair:"#3A2B26",style:"perm",top:"#2F6E8F",acc:"apron"},
  culture:"Pick your fish downstairs, then eat it upstairs. They slice it and you pay a small table fee. At traditional markets, asking 좀 깎아 주세요 for a small discount is normal. Don't try it in shops. Sellers here speak Busan dialect: 뭐 찾노? = 뭐 찾아요?",
  lesson:[
   {ko:"이거 얼마예요?",ro:"igeo eolmayeyo?",en:"How much is this?",note:"Point and ask. Works at every stall."},
   {ko:"좀 깎아 주세요",ro:"jom kkakka juseyo",en:"A little discount, please",note:"Fine at markets. Smile when you say it."},
   {ko:"회",ro:"hoe",en:"Raw fish (sliced)",note:"광어 (flatfish) and 우럭 (rockfish) are common choices."},
   {ko:"뭐 찾노?",ro:"mwo channo?",en:"What are you looking for? (Busan)",note:"Busan questions often end in -노 or -나. Standard: 뭐 찾아요?"}],
  script:[
   {who:"them",ko:"학생, 뭐 찾노?",en:"What're you looking for? (Busan dialect)"},
   {who:"me",type:"pick",en:"Ask if she has flatfish (광어).",options:["광어 있어요?","광어를 구매하고 싶습니다","광어 줘"],answer:0,
    notes:{1:"Sounds like a written order.",2:"반말 command. Rude."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"있다 아이가~ 이거 억수로 싱싱하다. 삼만 원.",en:"Of course I do~ This one's really fresh. 30,000 won."},
   {who:"me",type:"pick",en:"Ask for a small discount.",options:["좀 깎아 주세요","가격 인하를 요청합니다","비싸!"],answer:0,
    notes:{1:"Nobody bargains in this voice.",2:"Blunt. She won't give you a discount now."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"아이고, 그라믄 이만 오천 원 해 주께.",en:"Oh my, okay then, I'll do 25,000."},
   {who:"me",type:"build",en:"Say you'll eat it here.",answer:["여기서","먹을게요"],extra:["포장","주세요"]},
   {who:"them",ko:"위층 올라가믄 된다~",en:"Just go upstairs~"},
   {who:"me",type:"say",ko:"감사합니다. 맛있게 먹을게요!",en:"Thank her and say you'll enjoy it."}],
  words:[{ko:"생선",en:"fish (food)",emo:"🐟"},{ko:"회",en:"sliced raw fish",emo:"🍣"},{ko:"새우",en:"shrimp",emo:"🦐"},{ko:"문어",en:"octopus",emo:"🐙"},{ko:"게",en:"crab",emo:"🦀"}]
  ,mission:{title:"Next time you travel: buy something at a traditional market and ask for a small discount.",say:"좀 깎아 주세요.",tip:"Smile. It's a game, not a fight."}},

 {code:"찜질방",photo:"photos/jjimjilbang.jpg",ko:"찜질방",en:"Jjimjilbang (bathhouse)",brands:"해운대",travel:true,
  scene:"jjimjil",sub:"Busan · Haeundae, 21:00",who:"직원",whoEn:"front desk",
  char:{skin:"#F0C9A2",hair:"#2B2320",style:"short",top:"#D97A8A",acc:"vest"},
  culture:"Pay at the counter and you get clothes, a towel and a locker key band. Shoes go in the shoe locker first. Baths are separated by gender, the common rooms are shared. You can sleep there overnight, cheaper than a hotel.",
  lesson:[
   {ko:"한 명이요",ro:"han myeongiyo",en:"One person",note:"People use native numbers: 한 명, 두 명."},
   {ko:"수건",ro:"sugeon",en:"Towel",note:"수건 하나 더 주세요 = one more towel, please."},
   {ko:"신발장 · 사물함",ro:"sinbaljang · samulham",en:"Shoe locker · Locker",note:"The key band opens your locker."},
   {ko:"몇 시까지 해요?",ro:"myeot sikkaji haeyo?",en:"Until what time are you open?",note:"Many are open 24 hours."}],
  script:[
   {who:"them",ko:"어서 오세요~ 몇 분이세요?",en:"Welcome~ How many?"},
   {who:"me",type:"pick",en:"One person.",options:["한 명이요","일 명이요","혼자 왔습니다"],answer:0,
    notes:{1:"Wrong number system. For people use native numbers: 한 명.",2:"Understandable, but stiff."},kinds:{1:"meaning",2:"formal"}},
   {who:"them",ko:"만 오천 원이에요. 주무시고 가세요?",en:"15,000 won. Staying overnight?"},
   {who:"me",type:"pick",en:"No, just a few hours.",options:["아니요, 몇 시간만요","숙박하지 않을 예정입니다","아니, 잠깐"],answer:0,
    notes:{1:"Sounds like a hotel form.",2:"반말. Too casual."},kinds:{1:"formal",2:"casual"}},
   {who:"them",ko:"옷이랑 수건 여기 있어요. 신발은 저기 신발장에 넣으세요.",en:"Here are clothes and a towel. Shoes go in the shoe locker over there."},
   {who:"me",type:"build",en:"Ask for one more towel.",answer:["수건","하나","더","주세요"],extra:["몇","있어요"]},
   {who:"them",ko:"네, 여기요~",en:"Sure, here~"},
   {who:"me",type:"say",ko:"감사합니다. 혹시 식혜는 어디서 사요?",en:"Thank her and ask where to buy sikhye (sweet rice drink)."},
   {who:"them",ko:"이층 매점에 있어요~ 계란도 같이 드셔 보세요!",en:"At the snack bar on the 2nd floor~ Try the eggs too!"}],
  words:[{ko:"계란",en:"egg",emo:"🥚"},{ko:"땀",en:"sweat",emo:"💦"},{ko:"신발",en:"shoes",emo:"👟"},{ko:"식혜",en:"sweet rice drink",emo:"🥤"},{ko:"목욕",en:"bath",emo:"🛁"}]
  ,mission:{title:"Next time you go to a 찜질방, check in in Korean.",say:"한 명이요. 수건 하나 더 주세요.",tip:"Shoes first, then the counter."}},

 {code:"부산택시",photo:"photos/busan-taxi.jpg",ko:"부산 택시",en:"Busan taxi (dialect)",brands:"사투리",travel:true,
  scene:"taxi",sub:"Busan · 사투리 corner",who:"기사님",whoEn:"taxi driver (Busan dialect)",
  char:{skin:"#DDAA82",hair:"#4A4440",style:"short",top:"#3B4A5E",acc:"cap"},
  culture:"Busan speech sounds strong, even angry, to Seoul ears. It isn't. Questions often end in -노/-나 (뭐 하노? 맞나?), 아이가 means 'isn't it / of course', and 억수로 means 'very'. You don't need to speak it, just understand it.",
  lesson:[
   {ko:"어데 가는교?",ro:"eode ganeungyo?",en:"Where are you going? (Busan)",note:"Standard: 어디 가세요?"},
   {ko:"억수로",ro:"eoksuro",en:"Very, really (Busan)",note:"Standard: 아주, 진짜."},
   {ko:"맞나?",ro:"manna?",en:"Really? (Busan)",note:"Standard: 진짜요? / 그래요?"},
   {ko:"아이다",ro:"aida",en:"No / It's not (Busan)",note:"Standard: 아니에요."}],
  script:[
   {who:"them",ko:"어데 가는교?",en:"Where are you going? (Busan dialect)"},
   {who:"me",type:"build",en:"Ask him to go to Haeundae.",answer:["해운대","가","주세요"],extra:["어데","있어요"]},
   {who:"them",ko:"해운대? 지금 차 억수로 막히는데 괜찮나?",en:"Haeundae? Traffic's really bad now. Is that okay?"},
   {who:"me",type:"pick",en:"He asked if heavy traffic is okay. Say it's fine.",options:["네, 괜찮아요","아이다, 해운대요","억수로 주세요"],answer:0,
    notes:{1:"아이다 means 'no'. He'll think you want somewhere else.",2:"That means 'give me very.' 억수로 = very."},kinds:{1:"meaning",2:"meaning"}},
   {who:"them",ko:"외국인이가? 한국말 억수로 잘하네!",en:"You're a foreigner? Your Korean's really good!"},
   {who:"me",type:"pick",en:"Be modest, the Korean way.",options:["아니에요, 아직 잘 못해요","네, 저는 한국어를 잘합니다","알아"],answer:0,
    notes:{1:"Agreeing with a compliment sounds proud. Koreans deflect it.",2:"반말 'I know.' Rude."},kinds:{1:"formal",2:"rude"}},
   {who:"them",ko:"맞나? 다 왔다. 만 이천 원.",en:"Really? We're here. 12,000 won."},
   {who:"me",type:"say",ko:"카드로 할게요. 덕분에 빨리 왔어요, 감사합니다!",en:"Pay by card and thank him for the quick ride."}],
  words:[{ko:"바다",en:"sea",emo:"🌊"},{ko:"다리",en:"bridge",emo:"🌉"},{ko:"해변",en:"beach",emo:"🏖️"},{ko:"갈매기",en:"seagull",emo:"🕊️"},{ko:"산",en:"mountain",emo:"⛰️"}],
  mission:{title:"Next time you're in Busan, catch one dialect word and ask what it means.",say:"그게 무슨 뜻이에요?",tip:"Locals love explaining their dialect."}}
];

const B=code=>BASE.find(p=>p.code===code);
window.CITIES=[
 {id:"seoul",ko:"서울",en:"Seoul",places:[B("편의점"),B("식당"),B("버스"),B("대학교"),LIFE[0],LIFE[1],B("병원"),LIFE[2],B("공항")]},
 {id:"busan",ko:"부산",en:"Busan",places:BUSAN},
 {id:"jeju",ko:"제주",en:"Jeju",soon:true},
 {id:"gyeongju",ko:"경주",en:"Gyeongju",soon:true},
 {id:"jeonju",ko:"전주",en:"Jeonju",soon:true}
];
