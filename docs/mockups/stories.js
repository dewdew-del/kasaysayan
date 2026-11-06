// Long-form story drafts for the prototype. DRAFTS: written from widely documented facts,
// but not yet put through the fact-check workflow (spec section 6). Each [n] marks where a source citation goes.
// Chapters are separated so photos can sit between them.
const STORIES = {
mactan: { read: 4, sources: ["Antonio Pigafetta, eyewitness account of the Magellan expedition (1520s)", "National Historical Commission of the Philippines, materials on Lapulapu", "Historians' assessments of Pigafetta as a source (to be confirmed in research)"], chapters: [
 { h: "Five ships looking for spice", p: [
  "In September 1519, five ships left Spain under the Portuguese navigator Ferdinand Magellan. The Spanish crown wanted a western sea route to the Spice Islands, the source of cloves and nutmeg that were worth more than their weight in silver.[1]",
  "The voyage was brutal. One ship was wrecked, another turned back, and the crossing of the Pacific took months, with sailors eating leather and sawdust to survive. In March 1521 the remaining ships reached the islands of what is now Eastern Samar, and soon after sailed west toward Cebu.[1]" ]},
 { h: "An alliance in Cebu", p: [
  "Cebu was a busy trading port ruled by Rajah Humabon. He received the Spaniards, made a blood compact with Magellan, and in mid-April 1521 was baptized along with hundreds of his people. Magellan now saw himself as the ally and protector of a Christian ruler.[1]",
  "He went further. He demanded that the other chiefs of the area accept Humabon's authority and the Spanish king's. Most agreed. On the small island of Mactan, across the channel from Cebu, a chief named Lapulapu refused.[1][2]" ]},
 { h: "Dawn on the reef", p: [
  "Before sunrise on 27 April 1521, Magellan crossed to Mactan with a small force. The reef and low tide kept the ships far from shore, so his men had to wade a long way through the water, out of range of their own cannons.[1]",
  "The expedition's chronicler, Antonio Pigafetta, wrote that around fifty men went ashore and faced more than a thousand warriors. These numbers come from one eyewitness on the losing side, so historians treat them with care.[1][3] What is not in doubt is the result. Magellan was wounded and killed in the shallows, and his men retreated to the boats." ]},
 { h: "What Mactan left behind", p: [
  "Within days the alliance in Cebu collapsed, and the surviving crews fled. Only one ship, the Victoria, made it back to Spain in September 1522, completing the first voyage around the world with a small fraction of the men who had set out.[1]",
  "Lapulapu himself left no writings, and much about him, including his age and origins, is still debated.[2] But the battle made him the first remembered figure to resist foreign rule in the islands. Today a shrine stands near the shore at Mactan, and the city on the island carries his name." ]}
]},
kawit: { read: 4, sources: ["National Historical Commission of the Philippines, on the Declaration of Independence", "Accounts of the Battle of Manila Bay, 1 May 1898 (to be confirmed in research)", "Text of the Acta de la Proclamación de Independencia, 12 June 1898", "Republic Act No. 4166 (1964), Official Gazette"], chapters: [
 { h: "A leader in exile", p: [
  "By the end of 1897, the revolution against Spain had stalled. Under the Pact of Biak-na-Bato, Emilio Aguinaldo and other revolutionary leaders agreed to leave the country, and they sailed to Hong Kong.[1]",
  "Then the world changed around them. In April 1898, the United States and Spain went to war over Cuba. On 1 May, an American squadron under Commodore George Dewey destroyed the Spanish fleet in Manila Bay in a single morning.[2]" ]},
 { h: "The return", p: [
  "Aguinaldo came home on 19 May 1898, aboard an American ship. Revolutionary forces quickly took control of much of Luzon as Spanish garrisons fell or surrendered.[1]",
  "Aguinaldo believed independence had to be declared before the Americans and Spaniards settled the islands' future without Filipinos. He chose his own family home in Kawit, Cavite, for the ceremony." ]},
 { h: "Twelve June, 1898", p: [
  "On the afternoon of 12 June, a crowd gathered at the house in Kawit. The declaration, written by the lawyer Ambrosio Rianzares Bautista, was read aloud. It named the Philippines free and independent of Spain.[1][3]",
  "For the first time, the Philippine flag was formally unfurled. It had been sewn in Hong Kong by Marcela Agoncillo, her daughter Lorenza, and Delfina Herbosa de Natividad. A band from San Francisco de Malabon played the march composed by Julián Felipe, which later became the national anthem.[3]" ]},
 { h: "Independence that waited", p: [
  "Neither Spain nor the United States recognized the declaration. In December 1898, under the Treaty of Paris, Spain ceded the islands to the United States, and within months the two former allies were at war.[2]",
  "For decades, the country marked independence on 4 July, the date the United States recognized it in 1946. In 1962, President Diosdado Macapagal moved Independence Day to 12 June, and a 1964 law made the change permanent.[4] The house in Kawit is now the Aguinaldo Shrine." ]}
]},
edsa: { read: 5, sources: ["Accounts of the Aquino assassination, 21 August 1983 (to be confirmed in research)", "Official Gazette, chronology of the EDSA People Power Revolution", "CBCP post-election statement, February 1986, and published crowd estimates (to be confirmed in research)"], chapters: [
 { h: "A death on the tarmac", p: [
  "On 21 August 1983, opposition leader Benigno \"Ninoy\" Aquino Jr. came home from exile in the United States. Minutes after stepping off his plane at the Manila airport, he was shot dead.[1]",
  "His funeral drew enormous crowds. For many Filipinos, the killing turned years of quiet discontent with the Marcos government into open anger.[1]" ]},
 { h: "A disputed election", p: [
  "In late 1985, President Ferdinand Marcos called a snap presidential election for 7 February 1986. Ninoy's widow, Corazon Aquino, ran against him.[2]",
  "The official count and the count of the citizens' watchdog NAMFREL told different stories. Computer workers at the election commission walked out, saying the results were being altered. The legislature still proclaimed Marcos the winner, and the Catholic bishops issued a statement condemning the election.[2][3]" ]},
 { h: "Four days in February", p: [
  "On 22 February, Defense Minister Juan Ponce Enrile and Lieutenant General Fidel V. Ramos broke with Marcos and took over Camp Aguinaldo and Camp Crame, on either side of Epifanio de los Santos Avenue, or EDSA.[2]",
  "That night, Cardinal Jaime Sin went on Radio Veritas and asked people to go to EDSA to protect them. They came: families, students, nuns with rosaries, priests, workers. Estimates of the crowd range from hundreds of thousands to more than a million.[3] When tanks and marines approached, people blocked them with their bodies, offering soldiers food and flowers." ]},
 { h: "Two inaugurations, one departure", p: [
  "On the morning of 25 February, Corazon Aquino took her oath as president at Club Filipino in San Juan. At noon, Marcos held his own inauguration at Malacañang Palace.[2]",
  "That night, Marcos, his family and close associates left the palace on American helicopters and were flown to Clark Air Base, then to Hawaii.[2] The revolution had ended without a full-scale battle. It is remembered as People Power, and it is still argued over, studied and commemorated every February." ]}
]},

tabon: { read: 4, sources: ["National Museum of the Philippines, Tabon Cave Complex", "Robert B. Fox, reports on the Tabon Caves excavations (1960s)", "Published uranium-series dating of the Tabon skullcap (to be confirmed in research)"], chapters: [
 { h: "A cave above the sea", p: [
  "On Lipuun Point, a limestone headland on the west coast of Palawan, dozens of caves open onto the South China Sea. The largest is Tabon Cave, its wide mouth high above the water, cool and dry even in the heat of the day.[1]",
  "For thousands of years people used these caves to shelter, to make tools and, later, to bury their dead. They left behind stone flakes, animal bones, ash from old fires and pottery, layer upon layer in the cave floor.[1]" ]},
 { h: "The dig", p: [
  "In 1962, a team from the National Museum led by the American anthropologist Robert B. Fox began careful excavations at Tabon. Digging through the layers was like reading a calendar backwards: the deeper they went, the older the finds.[2]",
  "Among the bones they recovered was a fragment of a human skull, the top of the head, or skullcap. It became known as Tabon Man, although later study suggests it may have belonged to a young woman.[2][3]" ]},
 { h: "How old is it?", p: [
  "Early estimates placed the skullcap at around 22,000 years old. Later tests on the bone itself gave a much older date, roughly 47,000 years, with a wide margin of error.[3] Scientists still debate the exact age, which is why this site shows it as approximate.",
  "Either way, the find showed that modern humans lived in the islands tens of thousands of years before the first written records, during the Ice Age, when lower seas made Palawan far easier to reach.[1]" ]},
 { h: "Jars for the dead", p: [
  "Nearby Manunggul Cave held a later treasure: a burial jar made around 3,000 years ago. Its lid shows two figures in a boat, thought to be a soul being ferried to the afterlife.[1] The Manunggul Jar is now a National Cultural Treasure and once appeared on the thousand-peso bill.",
  "Today the Tabon Cave Complex is a protected site. Visitors climb the steps to the cave mouth and look out at the same sea the first islanders saw." ]}
]},

lci: { read: 4, sources: ["National Museum of the Philippines, Laguna Copperplate Inscription", "Antoon Postma, \"The Laguna Copper-Plate Inscription: Text and Commentary\", Philippine Studies (1992)", "Later scholarly readings of the inscription (to be confirmed in research)"], chapters: [
 { h: "Found in the sand", p: [
  "In 1989, a man dredging sand near the mouth of the Lumbang River in Laguna pulled up a thin, folded sheet of copper covered in strange writing. He sold it, and it eventually reached the National Museum in Manila.[1]",
  "Nobody there could read it at first. The plate sat in the museum for a few years, a small object with a large question attached." ]},
 { h: "Reading the plate", p: [
  "The Dutch scholar Antoon Postma, who had spent years studying the old scripts of Mindoro, recognized the writing as Kawi, a script used in Java and other parts of island Southeast Asia. In 1992 he published the first full reading.[2]",
  "The plate opens with a date in the Saka calendar, year 822, which works out to 900 AD. That made it the oldest known written document from the Philippines, more than 600 years older than the arrival of Magellan.[2]" ]},
 { h: "A debt is cleared", p: [
  "The text is a legal record. It states that a woman named Angkatan and her brother Bukah, children of Namwaran, are released from a debt of gold owed by their father. Officials and witnesses are named, so no one could claim the debt again.[2]",
  "The language is mostly Old Malay, mixed with words from Sanskrit, Old Javanese and Old Tagalog. It names places such as Tundun and Pailah, which scholars link to Tondo and Pila.[2][3]" ]},
 { h: "What it tells us", p: [
  "Before the plate was found, many textbooks described the pre-colonial islands as a world without writing or government. The inscription shows something different: rulers with titles, a system of debt and law, measures of gold and ties to kingdoms across the sea.[3]",
  "The original plate is kept at the National Museum of Anthropology in Manila, where anyone can stand in front of it and see the oldest words written on these islands." ]}
]},

gomburza: { read: 4, sources: ["National Historical Commission of the Philippines, on Gomez, Burgos and Zamora", "Trinidad Pardo de Tavera, account of the Cavite Mutiny (Filipino perspective)", "Spanish official accounts of the 1872 mutiny (Izquierdo, Montero y Vidal)", "José Rizal, dedication of El Filibusterismo (1891)"], chapters: [
 { h: "Priests without parishes", p: [
  "In the 1800s, the richest parishes in the Philippines were held by Spanish friars. Filipino secular priests, trained and ordained in the islands, were often given only the smaller ones. Many of them pushed for the right to lead parishes of their own, a cause known as secularization.[1]",
  "Among the leaders of that movement was Father José Burgos, a young scholar from Vigan with degrees in theology and law. Fathers Mariano Gómez and Jacinto Zamora were among the priests who supported the cause.[1]" ]},
 { h: "The night at the arsenal", p: [
  "On 20 January 1872, about two hundred Filipino soldiers and workers at the Spanish arsenal in Cavite rose up. They had just lost their exemption from tribute and forced labor. The revolt was crushed within days.[2][3]",
  "What the mutiny meant is still argued over. Spanish officials described it as part of a plot to overthrow Spanish rule. Filipino accounts, such as Trinidad Pardo de Tavera's, described it as a local protest that the authorities used as an excuse to crush the reformers.[2][3]" ]},
 { h: "Bagumbayan", p: [
  "The colonial government arrested many priests, lawyers and businessmen. Gómez, Burgos and Zamora were tried by a military court and sentenced to death. The Archbishop of Manila refused to strip them of their priesthood.[1]",
  "On the morning of 17 February 1872, the three were executed by garrote on the field of Bagumbayan, in front of a large crowd. Many of the people watching knelt and prayed.[1]" ]},
 { h: "A spark", p: [
  "The executions shocked a generation. José Rizal, who was ten at the time, later dedicated his novel El Filibusterismo to the three priests.[4] The reform movement that followed grew into the revolution of 1896.",
  "The priests are remembered together as Gomburza. A marker stands near the place of their execution, close to today's Rizal Park." ]}
]},

pugadlawin: { read: 4, sources: ["National Historical Commission of the Philippines, on the Cry of Pugad Lawin", "Memoirs of Pío Valenzuela and other Katipunan members (accounts differ)", "Teodoro Agoncillo, The Revolt of the Masses (1956)"], chapters: [
 { h: "A secret society", p: [
  "On 7 July 1892, days after José Rizal was arrested and sent into exile, a group of Manila men met in secret and founded the Katipunan. Its full name meant the Highest and Most Respected Society of the Children of the Nation. One of its founders was Andrés Bonifacio, a warehouse worker who read widely and believed reform would never come peacefully.[1]",
  "Members signed their oath in blood and used code names. The society grew quietly for four years, spreading from Manila into the nearby provinces.[3]" ]},
 { h: "Discovered", p: [
  "In August 1896, the secret leaked. A member's sister told a priest, and Spanish authorities began raiding homes and arresting suspects.[3]",
  "Bonifacio and hundreds of Katipuneros slipped out of the city into the hills north of Manila, in what was then Caloocan. They knew there was no going back." ]},
 { h: "Torn papers", p: [
  "In those last days of August, Bonifacio asked the gathered members whether they were ready to fight. In reply, they tore up their cédulas, the tax certificates every colonial subject had to carry. It was a public break with Spain.[1]",
  "Exactly where and when this happened is one of the great debates of Philippine history. Different eyewitnesses later named different places, including Pugad Lawin, Balintawak and Bahay Toro, and dates from 23 to 26 August.[2] The government officially recognizes Pugad Lawin on 23 August, but this site shows each version and who supports it." ]},
 { h: "The revolution begins", p: [
  "Within days the Katipunan attacked Spanish positions around Manila, including a powder magazine in San Juan on 30 August. The fighting spread to Cavite and other provinces.[3]",
  "Bonifacio would not live to see independence. He died in 1897 after a power struggle within the revolution. But the moment the papers were torn is remembered as the start of the fight for a nation." ]}
]},

commonwealth: { read: 4, sources: ["Tydings–McDuffie Act (1934), US Congress", "Official Gazette, inauguration of the Commonwealth, 15 November 1935", "Presidential Museum and Library, on Manuel L. Quezon"], chapters: [
 { h: "A promise with a date", p: [
  "After decades of lobbying by Filipino leaders, the United States Congress passed the Tydings–McDuffie Act in 1934. It promised full independence after a ten-year transition, under a Filipino government called the Commonwealth.[1]",
  "Filipino delegates drafted a constitution, which was signed in Washington in March 1935 and approved by voters in May." ]},
 { h: "The first election", p: [
  "In September 1935, Filipinos chose their first president. Manuel L. Quezon, long the most powerful figure in the legislature, won easily over Emilio Aguinaldo and Bishop Gregorio Aglipay. Sergio Osmeña became vice president.[3]",
  "On 15 November 1935, a huge crowd gathered at the Legislative Building in Manila to watch Quezon take his oath.[2]" ]},
 { h: "Building a nation", p: [
  "The new government moved quickly. It created a national defense plan, started work on a national language based on Tagalog, and held a vote in 1937 in which women won the right to vote.[3]",
  "Quezon spoke often of social justice, but the Commonwealth also faced poverty, land conflict and the limits of a country still under American control." ]},
 { h: "Cut short", p: [
  "The ten years were never completed in peace. In December 1941, Japan invaded. Quezon left for the United States, where he led a government in exile, and died there in August 1944, before the islands were freed.[3]",
  "Independence finally came on 4 July 1946, a little more than ten years after that November morning in Manila." ]}
]},

bataan: { read: 5, sources: ["US Army Center of Military History, The Fall of the Philippines", "National Historical Commission of the Philippines, Fall of Bataan marker", "Historians' estimates of Death March casualties (to be confirmed in research)"], chapters: [
 { h: "War comes to the islands", p: [
  "Hours after the attack on Pearl Harbor, Japanese planes struck American bases in the Philippines, in December 1941. Japanese troops landed soon after and moved toward Manila.[1]",
  "The combined Filipino and American army under General Douglas MacArthur pulled back to the Bataan Peninsula, west of Manila Bay, to hold out until help arrived. Help never came.[1]" ]},
 { h: "The siege", p: [
  "For three months, the defenders held their lines in the jungle. Food ran out and soldiers lived on a fraction of normal rations. Malaria and dysentery spread.[1]",
  "In March 1942, MacArthur was ordered to Australia. On 9 April, with his men starving and outnumbered, Major General Edward King surrendered the forces on Bataan. Tens of thousands became prisoners.[1][2]" ]},
 { h: "The march", p: [
  "The prisoners were forced to walk north from Mariveles to San Fernando, Pampanga, a distance of over a hundred kilometers, in the April heat. Many were already sick. Those who fell behind were often beaten or killed.[1]",
  "From San Fernando they were packed into railway cars to Capas, Tarlac, then marched again to Camp O'Donnell. How many died on the march is uncertain. Estimates range from several thousand to more than ten thousand Filipinos and hundreds of Americans, with many more dying later in the camp.[3]" ]},
 { h: "Remembering", p: [
  "Corregidor, the island fortress at the mouth of the bay, fell a month later. The Philippines remained under Japanese occupation until 1945.[1]",
  "Today, 9 April is Araw ng Kagitingan, the Day of Valor. Kilometer markers line the route of the march, and a memorial cross stands on Mount Samat." ]}
]},

leyte: { read: 4, sources: ["US Army Center of Military History, Leyte: The Return to the Philippines", "Official Gazette, MacArthur's landing speech, 20 October 1944", "Naval histories of the Battle of Leyte Gulf (to be confirmed in research)"], chapters: [
 { h: "A promise to return", p: [
  "When he left the Philippines in 1942, General Douglas MacArthur promised he would return. For two and a half years, Filipino guerrilla groups fought on in the hills, passing information to the Allies by radio.[1]",
  "By late 1944, the Allies were ready. They chose Leyte, in the central Philippines, to cut the islands in two." ]},
 { h: "Red Beach", p: [
  "On 20 October 1944, after a heavy naval bombardment, American troops landed on the beaches near Palo and Dulag. That afternoon, MacArthur waded ashore with President Sergio Osmeña and General Carlos P. Romulo.[1]",
  "Standing in the rain, MacArthur spoke into a radio microphone: \"People of the Philippines, I have returned.\"[2] A monument at Palo now shows the group walking through the surf." ]},
 { h: "The battle at sea", p: [
  "Japan answered with nearly all of its remaining navy. From 23 to 26 October, the Battle of Leyte Gulf was fought across the waters around the Visayas. It is often called the largest naval battle in history.[3]",
  "Japan lost much of its fleet. In those days, Japanese pilots also carried out the first organized kamikaze attacks, deliberately crashing into Allied ships.[3]" ]},
 { h: "The long road to liberation", p: [
  "Fighting on Leyte lasted until the end of the year, with Filipino guerrillas helping the Allied advance.[1] Landings on Luzon followed in January 1945.",
  "The Battle of Manila in February and March 1945 destroyed much of the capital and killed tens of thousands of civilians. When the war ended in August, the country was free but badly scarred." ]}
]},

y1946: { read: 4, sources: ["Treaty of General Relations between the US and the Philippines (Treaty of Manila), 1946", "Proclamation 2695, President Harry S. Truman, 4 July 1946", "Official Gazette, on Manuel Roxas and the Third Republic"], chapters: [
 { h: "A country in ruins", p: [
  "The Philippines came out of the Second World War devastated. Manila was one of the most heavily damaged cities of the war. Roads, bridges, farms and schools had been destroyed.[3]",
  "Still, the date set in 1934 held. Independence would come on 4 July 1946." ]},
 { h: "The first president of the Republic", p: [
  "In April 1946, Filipinos voted for a president. Manuel Roxas, a former senator, defeated Sergio Osmeña, who had led the Commonwealth after Quezon's death.[3]" ]},
 { h: "Fourth of July at the Luneta", p: [
  "On the morning of 4 July 1946, crowds filled the Luneta in Manila. The American flag was lowered and the Philippine flag raised in its place. Roxas took his oath as President of the Republic of the Philippines.[3]",
  "That same day, the two countries signed the Treaty of Manila, in which the United States gave up sovereignty over the islands, and President Truman issued a proclamation recognizing Philippine independence.[1][2]" ]},
 { h: "Independence with conditions", p: [
  "Independence came with strings attached. The Bell Trade Act gave Americans equal rights with Filipinos to use the country's natural resources, a change that required amending the constitution. A 1947 agreement allowed the United States to keep military bases in the islands.[3]",
  "For years, the Philippines celebrated independence on 4 July. In 1962 the holiday moved to 12 June, honoring the 1898 declaration, and 4 July became Philippine–American Friendship Day." ]}
]},

pd1081: { read: 5, sources: ["Proclamation No. 1081, Official Gazette, 1972", "Human Rights Victims' Claims Board, under Republic Act No. 10368 (2013)", "Historians and journalists on the 1972 ambush and martial law (accounts differ; to be confirmed in research)"], chapters: [
 { h: "A restless country", p: [
  "Ferdinand Marcos was elected president in 1965 and re-elected in 1969, the first president to win a second full term. His second term began amid student protests, inflation and growing unrest, including the demonstrations of early 1970 known as the First Quarter Storm.[3]",
  "In August 1971, grenades exploded at an opposition rally at Plaza Miranda, killing and wounding many. Bombings in Manila followed in 1972. Who was behind them is still disputed.[3]" ]},
 { h: "The proclamation", p: [
  "Proclamation No. 1081, placing the whole country under martial law, is dated 21 September 1972.[1] Marcos announced it on television on the evening of 23 September.",
  "The night before, Defense Secretary Juan Ponce Enrile's car had been fired on. The government presented the ambush as a reason for martial law. Enrile later said in 1986 that it was staged, then disputed that account years later.[3]" ]},
 { h: "Rule by decree", p: [
  "Congress was closed. Newspapers, radio and television stations were shut down or taken over. Opposition leaders such as Senator Benigno Aquino Jr. were arrested, along with journalists, students and activists. A curfew was imposed.[3]",
  "A new constitution was approved in 1973 through citizens' assemblies, and Marcos governed by decree. Supporters pointed to new roads, buildings and public order. Critics pointed to corruption, debt and the silencing of dissent.[3]" ]},
 { h: "Counting the cost", p: [
  "Martial law was formally lifted in January 1981, although Marcos kept wide powers until 1986. Human rights groups documented arrests, torture, disappearances and killings during these years.[3]",
  "In 2013, Republic Act No. 10368 recognized the victims and created a board to compensate them. The board approved more than eleven thousand claims.[2] How martial law is remembered remains one of the most debated questions in the country today." ]}
]},

bohol: { read: 4, sources: ["PHIVOLCS reports on the 15 October 2013 Bohol earthquake", "NDRRMC situation reports, October–November 2013", "National Museum and NHCP, on the damaged heritage churches"], chapters: [
 { h: "A holiday morning", p: [
  "Tuesday, 15 October 2013, was a national holiday, Eid al-Adha. Schools and many offices in Bohol were closed. At 8:12 in the morning, the ground began to shake.[1]",
  "The magnitude 7.2 earthquake was centered near the town of Sagbayan, at a shallow depth. It lasted less than a minute, but it was felt across the Visayas.[1]" ]},
 { h: "Churches fall", p: [
  "Bohol is famous for its stone churches, many built by Spanish missionaries in the 1700s and 1800s. In minutes, some of the oldest were cracked or brought down. The church of Loon collapsed almost completely. Bell towers fell in Loboc and Baclayon.[3]",
  "Roads split, bridges broke and landslides covered hillsides. More than two hundred people died, and hundreds more were injured.[2]" ]},
 { h: "A fault no one had mapped", p: [
  "Scientists from PHIVOLCS traced the quake to a fault that had not been known before. They named it the North Bohol Fault. In places, the ground had been pushed up by several meters, leaving a long wall of rock across fields.[1]",
  "Three weeks later, Typhoon Yolanda struck the Visayas, and attention and aid were stretched even further." ]},
 { h: "Rebuilding", p: [
  "The National Museum, the National Historical Commission and the Church began the slow work of restoring the damaged churches, sorting the fallen stones so they could be put back.[3]",
  "Over the following years, several churches reopened. The quake changed how the country thinks about heritage buildings, earthquake safety and faults hidden beneath quiet towns." ]}
]},

yolanda: { read: 4, sources: ["PAGASA, Typhoon Yolanda (Haiyan) reports", "NDRRMC final report on Typhoon Yolanda (2014)", "Studies and reporting on the Tacloban storm surge (to be confirmed in research)"], chapters: [
 { h: "Warnings", p: [
  "In early November 2013, a powerful typhoon crossed the Pacific toward the Philippines. PAGASA named it Yolanda. International agencies called it Haiyan. Forecasters warned it could be one of the strongest storms ever to make landfall.[1]",
  "Hundreds of thousands of people were evacuated. But many did not understand the warning about a \"storm surge\", a term that was new to many people living along the coast.[3]" ]},
 { h: "Landfall", p: [
  "Before dawn on 8 November 2013, Yolanda made landfall at Guiuan, Eastern Samar. It then swept across Leyte, Cebu, Panay and other islands of the Visayas.[1]",
  "In Tacloban, the sea rose several meters in minutes and rushed inland like a wave. It destroyed homes, schools and evacuation centers that had been thought safe.[3]" ]},
 { h: "The aftermath", p: [
  "When the storm passed, Tacloban and towns across Eastern Visayas were in ruins. Power, water and communications were gone. Bodies lay in the streets for days.[3]",
  "More than six thousand people were confirmed dead, with many more missing, and millions lost their homes.[2] Help came from across the country and around the world, from volunteers, ships, planes and aid groups." ]},
 { h: "Lessons", p: [
  "Yolanda changed how the Philippines prepares for disasters. Warnings now describe storm surges in plain words, such as how high the water may reach. Evacuation planning and building rules were reviewed.[3]",
  "Rebuilding took years and was uneven. Each November, survivors in Tacloban and the other towns hit by the storm light candles for the people they lost." ]}
]}
};

// Reading time from the actual word count (220 words a minute), same rule as the real site.
for (const s of Object.values(STORIES)) s.read = Math.max(1, Math.ceil(s.chapters.flatMap(c => c.p).join(" ").split(/\s+/).length / 220));
