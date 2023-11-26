const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const https = require("https");

const { dirname } = require("path");
//const { abort } = require('node:process');
const appDir = dirname(require.main.filename);

//const { compare } = require('libsodium-wrappers');

const words = [
  "a",
  "ability",
  "able",
  "about",
  "above",
  "accept",
  "according",
  "account",
  "across",
  "act",
  "action",
  "activity",
  "actually",
  "add",
  "address",
  "administration",
  "admit",
  "adult",
  "affect",
  "after",
  "again",
  "against",
  "age",
  "agency",
  "agent",
  "ago",
  "agree",
  "agreement",
  "ahead",
  "air",
  "all",
  "allow",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "although",
  "always",
  "American",
  "among",
  "amount",
  "analysis",
  "and",
  "animal",
  "another",
  "answer",
  "any",
  "anyone",
  "anything",
  "appear",
  "apply",
  "approach",
  "area",
  "argue",
  "arm",
  "around",
  "arrive",
  "art",
  "article",
  "artist",
  "as",
  "ask",
  "assume",
  "at",
  "attack",
  "attention",
  "attorney",
  "audience",
  "author",
  "authority",
  "available",
  "avoid",
  "away",
  "baby",
  "back",
  "bad",
  "bag",
  "ball",
  "bank",
  "bar",
  "base",
  "be",
  "beat",
  "beautiful",
  "because",
  "become",
  "bed",
  "before",
  "begin",
  "behavior",
  "behind",
  "believe",
  "benefit",
  "best",
  "better",
  "between",
  "beyond",
  "big",
  "bill",
  "billion",
  "bit",
  "black",
  "blood",
  "blue",
  "board",
  "body",
  "book",
  "born",
  "both",
  "box",
  "boy",
  "break",
  "bring",
  "brother",
  "budget",
  "build",
  "building",
  "business",
  "but",
  "buy",
  "by",
  "call",
  "camera",
  "campaign",
  "can",
  "cancer",
  "candidate",
  "capital",
  "car",
  "card",
  "care",
  "career",
  "carry",
  "case",
  "catch",
  "cause",
  "cell",
  "center",
  "central",
  "century",
  "certain",
  "certainly",
  "chair",
  "challenge",
  "chance",
  "change",
  "character",
  "charge",
  "check",
  "child",
  "choice",
  "choose",
  "church",
  "citizen",
  "city",
  "civil",
  "claim",
  "class",
  "clear",
  "clearly",
  "close",
  "coach",
  "cold",
  "collection",
  "college",
  "color",
  "come",
  "commercial",
  "common",
  "community",
  "company",
  "compare",
  "computer",
  "concern",
  "condition",
  "conference",
  "Congress",
  "consider",
  "consumer",
  "contain",
  "continue",
  "control",
  "cost",
  "could",
  "country",
  "couple",
  "course",
  "court",
  "cover",
  "create",
  "crime",
  "cultural",
  "culture",
  "cup",
  "current",
  "customer",
  "cut",
  "dark",
  "data",
  "daughter",
  "day",
  "dead",
  "deal",
  "death",
  "debate",
  "decade",
  "decide",
  "decision",
  "deep",
  "defense",
  "degree",
  "Democrat",
  "democratic",
  "describe",
  "design",
  "despite",
  "detail",
  "determine",
  "develop",
  "development",
  "die",
  "difference",
  "different",
  "difficult",
  "dinner",
  "direction",
  "director",
  "discover",
  "discuss",
  "discussion",
  "disease",
  "do",
  "doctor",
  "dog",
  "door",
  "down",
  "draw",
  "dream",
  "drive",
  "drop",
  "drug",
  "during",
  "each",
  "early",
  "east",
  "easy",
  "eat",
  "economic",
  "economy",
  "edge",
  "education",
  "effect",
  "effort",
  "eight",
  "either",
  "election",
  "else",
  "employee",
  "end",
  "energy",
  "enjoy",
  "enough",
  "enter",
  "entire",
  "environment",
  "environmental",
  "especially",
  "establish",
  "even",
  "evening",
  "event",
  "ever",
  "every",
  "everybody",
  "everyone",
  "everything",
  "evidence",
  "exactly",
  "example",
  "executive",
  "exist",
  "expect",
  "experience",
  "expert",
  "explain",
  "eye",
  "face",
  "fact",
  "factor",
  "fail",
  "fall",
  "family",
  "far",
  "fast",
  "father",
  "fear",
  "federal",
  "feel",
  "feeling",
  "few",
  "field",
  "fight",
  "figure",
  "fill",
  "film",
  "final",
  "finally",
  "financial",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fish",
  "five",
  "floor",
  "fly",
  "focus",
  "follow",
  "food",
  "foot",
  "for",
  "force",
  "foreign",
  "forget",
  "form",
  "former",
  "forward",
  "four",
  "free",
  "friend",
  "from",
  "front",
  "full",
  "fund",
  "future",
  "game",
  "garden",
  "gas",
  "general",
  "generation",
  "get",
  "girl",
  "give",
  "glass",
  "go",
  "goal",
  "good",
  "government",
  "great",
  "green",
  "ground",
  "group",
  "grow",
  "growth",
  "guess",
  "gun",
  "guy",
  "hair",
  "half",
  "hand",
  "hang",
  "happen",
  "happy",
  "hard",
  "have",
  "he",
  "head",
  "health",
  "hear",
  "heart",
  "heat",
  "heavy",
  "help",
  "her",
  "here",
  "herself",
  "high",
  "him",
  "himself",
  "his",
  "history",
  "hit",
  "hold",
  "home",
  "hope",
  "hospital",
  "hot",
  "hotel",
  "hour",
  "house",
  "how",
  "however",
  "huge",
  "human",
  "hundred",
  "husband",
  "I",
  "idea",
  "identify",
  "if",
  "image",
  "imagine",
  "impact",
  "important",
  "improve",
  "in",
  "include",
  "including",
  "increase",
  "indeed",
  "indicate",
  "individual",
  "industry",
  "information",
  "inside",
  "instead",
  "institution",
  "interest",
  "interesting",
  "international",
  "interview",
  "into",
  "investment",
  "involve",
  "issue",
  "it",
  "item",
  "its",
  "itself",
  "job",
  "join",
  "just",
  "keep",
  "key",
  "kid",
  "kill",
  "kind",
  "kitchen",
  "know",
  "knowledge",
  "land",
  "language",
  "large",
  "last",
  "late",
  "later",
  "laugh",
  "law",
  "lawyer",
  "lay",
  "lead",
  "leader",
  "learn",
  "least",
  "leave",
  "left",
  "leg",
  "legal",
  "less",
  "let",
  "letter",
  "level",
  "lie",
  "life",
  "light",
  "like",
  "likely",
  "line",
  "list",
  "listen",
  "little",
  "live",
  "local",
  "long",
  "look",
  "lose",
  "loss",
  "lot",
  "love",
  "low",
  "machine",
  "magazine",
  "main",
  "maintain",
  "major",
  "majority",
  "make",
  "man",
  "manage",
  "management",
  "manager",
  "many",
  "market",
  "marriage",
  "material",
  "matter",
  "may",
  "maybe",
  "me",
  "mean",
  "measure",
  "media",
  "medical",
  "meet",
  "meeting",
  "member",
  "memory",
  "mention",
  "message",
  "method",
  "middle",
  "might",
  "military",
  "million",
  "mind",
  "minute",
  "miss",
  "mission",
  "model",
  "modern",
  "moment",
  "money",
  "month",
  "more",
  "morning",
  "most",
  "mother",
  "mouth",
  "move",
  "movement",
  "movie",
  "Mr",
  "Mrs",
  "much",
  "music",
  "must",
  "my",
  "myself",
  "name",
  "nation",
  "national",
  "natural",
  "nature",
  "near",
  "nearly",
  "necessary",
  "need",
  "network",
  "never",
  "new",
  "news",
  "newspaper",
  "next",
  "nice",
  "night",
  "no",
  "none",
  "nor",
  "north",
  "not",
  "note",
  "nothing",
  "notice",
  "now",
  "n't",
  "number",
  "occur",
  "of",
  "off",
  "offer",
  "office",
  "officer",
  "official",
  "often",
  "oh",
  "oil",
  "ok",
  "old",
  "on",
  "once",
  "one",
  "only",
  "onto",
  "open",
  "operation",
  "opportunity",
  "option",
  "or",
  "order",
  "organization",
  "other",
  "others",
  "our",
  "out",
  "outside",
  "over",
  "own",
  "owner",
  "page",
  "pain",
  "painting",
  "paper",
  "parent",
  "part",
  "participant",
  "particular",
  "particularly",
  "partner",
  "party",
  "pass",
  "past",
  "patient",
  "pattern",
  "pay",
  "peace",
  "people",
  "per",
  "perform",
  "performance",
  "perhaps",
  "period",
  "person",
  "personal",
  "phone",
  "physical",
  "pick",
  "picture",
  "piece",
  "place",
  "plan",
  "plant",
  "play",
  "player",
  "PM",
  "point",
  "police",
  "policy",
  "political",
  "politics",
  "poor",
  "popular",
  "population",
  "position",
  "positive",
  "possible",
  "power",
  "practice",
  "prepare",
  "present",
  "president",
  "pressure",
  "pretty",
  "prevent",
  "price",
  "private",
  "probably",
  "problem",
  "process",
  "produce",
  "product",
  "production",
  "professional",
  "professor",
  "program",
  "project",
  "property",
  "protect",
  "prove",
  "provide",
  "public",
  "pull",
  "purpose",
  "push",
  "put",
  "quality",
  "question",
  "quickly",
  "quite",
  "race",
  "radio",
  "raise",
  "range",
  "rate",
  "rather",
  "reach",
  "read",
  "ready",
  "real",
  "reality",
  "realize",
  "really",
  "reason",
  "receive",
  "recent",
  "recently",
  "recognize",
  "record",
  "red",
  "reduce",
  "reflect",
  "region",
  "relate",
  "relationship",
  "religious",
  "remain",
  "remember",
  "remove",
  "report",
  "represent",
  "Republican",
  "require",
  "research",
  "resource",
  "respond",
  "response",
  "responsibility",
  "rest",
  "result",
  "return",
  "reveal",
  "rich",
  "right",
  "rise",
  "risk",
  "road",
  "rock",
  "role",
  "room",
  "rule",
  "run",
  "safe",
  "same",
  "save",
  "say",
  "scene",
  "school",
  "science",
  "scientist",
  "score",
  "sea",
  "season",
  "seat",
  "second",
  "section",
  "security",
  "see",
  "seek",
  "seem",
  "sell",
  "send",
  "senior",
  "sense",
  "series",
  "serious",
  "serve",
  "service",
  "set",
  "seven",
  "several",
  "sex",
  "sexual",
  "shake",
  "share",
  "she",
  "shoot",
  "short",
  "shot",
  "should",
  "shoulder",
  "show",
  "side",
  "sign",
  "significant",
  "similar",
  "simple",
  "simply",
  "since",
  "sing",
  "single",
  "sister",
  "sit",
  "site",
  "situation",
  "six",
  "size",
  "skill",
  "skin",
  "small",
  "smile",
  "so",
  "social",
  "society",
  "soldier",
  "some",
  "somebody",
  "someone",
  "something",
  "sometimes",
  "son",
  "song",
  "soon",
  "sort",
  "sound",
  "source",
  "south",
  "southern",
  "space",
  "speak",
  "special",
  "specific",
  "speech",
  "spend",
  "sport",
  "spring",
  "staff",
  "stage",
  "stand",
  "standard",
  "star",
  "start",
  "state",
  "statement",
  "station",
  "stay",
  "step",
  "still",
  "stock",
  "stop",
  "store",
  "story",
  "strategy",
  "street",
  "strong",
  "structure",
  "student",
  "study",
  "stuff",
  "style",
  "subject",
  "success",
  "successful",
  "such",
  "suddenly",
  "suffer",
  "suggest",
  "summer",
  "support",
  "sure",
  "surface",
  "system",
  "table",
  "take",
  "talk",
  "task",
  "tax",
  "teach",
  "teacher",
  "team",
  "technology",
  "television",
  "tell",
  "ten",
  "tend",
  "term",
  "test",
  "than",
  "thank",
  "that",
  "the",
  "their",
  "them",
  "themselves",
  "then",
  "theory",
  "there",
  "these",
  "they",
  "thing",
  "think",
  "third",
  "this",
  "those",
  "though",
  "thought",
  "thousand",
  "threat",
  "three",
  "through",
  "throughout",
  "throw",
  "thus",
  "time",
  "to",
  "today",
  "together",
  "tonight",
  "too",
  "top",
  "total",
  "tough",
  "toward",
  "town",
  "trade",
  "traditional",
  "training",
  "travel",
  "treat",
  "treatment",
  "tree",
  "trial",
  "trip",
  "trouble",
  "true",
  "truth",
  "try",
  "turn",
  "TV",
  "two",
  "type",
  "under",
  "understand",
  "unit",
  "until",
  "up",
  "upon",
  "us",
  "use",
  "usually",
  "value",
  "various",
  "very",
  "victim",
  "view",
  "violence",
  "visit",
  "voice",
  "vote",
  "wait",
  "walk",
  "wall",
  "want",
  "war",
  "watch",
  "water",
  "way",
  "we",
  "weapon",
  "wear",
  "week",
  "weight",
  "well",
  "west",
  "western",
  "what",
  "whatever",
  "when",
  "where",
  "whether",
  "which",
  "while",
  "white",
  "who",
  "whole",
  "whom",
  "whose",
  "why",
  "wide",
  "wife",
  "will",
  "win",
  "wind",
  "window",
  "wish",
  "with",
  "within",
  "without",
  "woman",
  "wonder",
  "word",
  "work",
  "worker",
  "world",
  "worry",
  "would",
  "write",
  "writer",
  "wrong",
  "yard",
  "yeah",
  "year",
  "yes",
  "yet",
  "you",
  "young",
  "your",
  "yourself",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define-random")
    .setDescription(
      "returns the definition of a random word (uses a free dictionary API from https://dictionaryapi.dev/)",
    ),
  async execute(interaction) {
    //give the bot time to think! we need to make sure we get all the data
    //console.log(appDir)
    await interaction.deferReply();

    var word = words[Math.floor(Math.random() * words.length)];
    word = word.toLowerCase();
    console.log(" ");
    console.log(`Attempting to get definition for "${word}"`);

    //DaniBot now goes "Hey man, can I have the information for [WORD]?" to the API
    //then the API should respond with "Sure thing, just gimmie a sec"

    if (word != "ohio") {
      https
        .get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
          (resp) => {
            let data = "";

            // Cue DaniBot waiting patiently for her data
            resp.on("data", (chunk) => {
              console.log(" ");
              console.log("received chunk of data!");
              data += chunk;
            });
            //Now the API hands the data over
            resp.on("end", async () => {
              console.log(" ");
              console.log("finished receiving definition!");
              // console.log(data)
              //Gotta check if we got a valid definition responce
              if (
                data !=
                `{"title":"No Definitions Found","message":"Sorry pal, we couldn't find definitions for the word you were looking for.","resolution":"You can try the search again at later time or head to the web instead."}`
              ) {
                //If so, DaniBot will interpret the data
                const result = JSON.parse(data)["0"].meanings;
                const sources = JSON.parse(data)["0"].sourceUrls;
                const partOfSpeech = result["0"].partOfSpeech;
                const definition = result["0"].definitions["0"].definition;
                const example = result["0"].definitions["0"].example;
                const synonyms = result["0"].synonyms;
                const antonyms = result["0"].antonyms;

                let partOfSpeech2;
                let definition2;
                let example2;
                let synonyms2;
                let antonyms2;

                //console.log(result["1"])

                if (result["1"] != undefined) {
                  partOfSpeech2 = result["1"].partOfSpeech;
                  definition2 = result["1"].definitions["0"].definition;
                  example2 = result["1"].definitions["0"].example;
                  synonyms2 = result["1"].synonyms;
                  antonyms2 = result["1"].antonyms;
                }

                //console.log(example)
                //console.log(synonyms)
                //console.log(antonyms)

                console.log(" ");
                console.log(partOfSpeech);
                console.log(" ");
                console.log(definition);

                const embed = new EmbedBuilder()
                  .setTitle(word)
                  .setColor(0xffffff)
                  .setImage(
                    "https://danilionn.github.io/danis-bot-website/assets/images/danibot-dictionary-v2.png",
                  )
                  .addFields({ name: partOfSpeech, value: definition });

                if (example != undefined) {
                  embed.addFields({ name: "Example:", value: example });
                }

                if (synonyms.length != 0) {
                  let s = "";

                  let length = synonyms.length;

                  console.log(`${length} synonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      s = s + synonyms[i] + ", ";
                    }
                    if (i === length - 1) {
                      s = s + synonyms[i];
                    }

                    // if (length === 1) {
                    //     s = (s + synonyms[i])
                    // };

                    //console.log('hi')
                    //console.log(synonyms[i])
                  }
                  // console.log(s)

                  embed.addFields({ name: "Synonyms:", value: s });
                }

                if (antonyms.length != 0) {
                  let a = "";

                  let length = antonyms.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + antonyms[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + antonyms[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  // console.log(a)

                  embed.addFields({ name: "Antonyms:", value: a });
                }

                if (partOfSpeech2 != undefined && definition2 != undefined) {
                  embed.addFields({ name: partOfSpeech2, value: definition2 });
                }

                if (example2 != undefined) {
                  embed.addFields({ name: "Example2:", value: example2 });
                }

                if (synonyms2 && synonyms2.length != 0) {
                  let a = "";

                  let length = synonyms2.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + synonyms2[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + synonyms2[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  embed.addFields({ name: "Synonyms2:", value: a });
                }

                if (antonyms2 && antonyms2.length != 0) {
                  let a = "";

                  let length = antonyms2.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + antonyms2[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + antonyms2[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  embed.addFields({ name: "Antonyms2:", value: a });
                }

                embed.setFooter({ text: `Source: ${sources["0"]}` });

                //Finally! Now DaniBot can return the definition to the server that used the command
                await interaction.editReply({ embeds: [embed] });
                console.log(" ");
                console.log(`sent defininition for "${word}"!`);
              } else {
                //Uh oh, we couldn't get a definition for the word query! Let the command user know.
                await interaction.editReply(`Couldn't define "${word}"!`);
                console.log(" ");
                console.log(`Error: couldn't define "${word}"!`);
              }
            });
          },
        )
        .on("error", async (err) => {
          //Oh my, seems like an error happened whilst trying to run the command.
          //Log it to the Error Log and let the user know.
          console.log(" ");

          let s = new Date().toLocaleString();

          const read = fs.readFileSync(
            `${dirname}/ErrorLog.txt`,
            `utf-8`,
            (errr) => {
              if (errr) {
                console.log(err);
              }
            },
          );

          const data = `${read}\n${s} Command Error: ${err}`;

          console.log("Error: " + err.message);

          fs.writeFileSync(`${dirname}/ErrorLog.txt`, data, (errrr) => {
            if (errrr) {
              console.log(errrr);
            }
          });

          await interaction.editReply(
            "An error occurred whilst trying to execute this command!",
          );
        });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Ohio")
        .setColor(0xffffff)
        .setImage(
          "https://danilionn.github.io/danis-bot-website/assets/images/danibot-dictionary-v2.png",
        )
        .addFields(
          //{name: "noun", value: "Literally hell on earth. Volcanos litter the landscape. Earthquakes happen daily. The McDonalds ice cream machine is twice as broken. Conservatives. Visit with caution."},
          {
            name: "noun",
            value: `An odd way to spell "Conservative hellscape".`,
          },
          {
            name: "Example:",
            value: "Where are you going? Heaven, or Ǫ̵̧̢̛̺̻̖̜̹͎͎̟͔͒̽̓̊͑̀́̃̓̂͂̕͜ͅ ̷̱͍̰̘̘̠͐̌̈̃͊̒̊͆̆͆̒͐̏̂̈́ H̵̢̛͙̟̻̰̦̜̳͉̣̑̊̓̇͗͒̎̿̎͝ ̵̛͉̭̳̼͍̖̦̓̈̏̄̍̎̇̈̾͂̕͠͝͝ I̵̩̮͆̆̈́̓ ̶̧̞̬͉̮́̾̓̃͝ O̷̢͎̘͋̏̊͘",
          },
          { name: "Synonyms:", value: "hell" },
          { name: "Antonyms:", value: "heaven" },
        )
        .setFooter({ text: "Source: no need. you know this is true." });

      await interaction.editReply({ embeds: [embed] });
      console.log(" ");
      console.log(`sent defininition for "${word}"!`);
    }
  },
};
