import { checks } from "./answers.mjs";

// The three drives in Files. Each one opens for A, and only A, after she answers its questions.
// Edit the notes freely; photos go in public/devices/<id>/ (any .jpg, .png or .webp) and show up on their own.
export type Question = { id: keyof typeof checks; ask: string; hint: string };
/** What Diae calls her; one is picked at random when a drive opens. */
export const petNames = ["hobiii", "lmbizla diali", "hyati", "tassano", "l kbida diali", "honey", "sweetie pie"];

export type Device = { id: string; label: string; path: string; icon: "drive" | "disc" | "floppy"; prompt: string; questions: Question[]; note: { name: string; title: string; body: string[] } };

export const devices: Device[] = [
  {
    id: "archive", label: "A&D GAME ARCHIVE", path: "dev://hda", icon: "drive",
    prompt: "This drive only opens for player two.",
    questions: [
      { id: "met", ask: "In which month did we meet on Discord?", hint: "Spring was just starting." },
      { id: "birthday", ask: "When is my birthday?", hint: "Early summer, double digits." },
    ],
    note: {
      name: "from-diae.txt", title: "Hey hobiii,",
      body: [
        "You found the first drive. Of course you did, lmbizla diali.",
        "Everything on this arcade started because I wanted one more reason to sit next to you and lose at something. This drive is where I keep the things that are just ours.",
        "— Diae",
      ],
    },
  },
  {
    id: "cdrom", label: "LG CD-ROM", path: "dev://hdc", icon: "disc",
    prompt: "Insert disc… or answer two questions.",
    questions: [
      { id: "food", ask: "What is my favourite food?", hint: "Look in the mirror." },
      { id: "kids", ask: "How many kids am I planning to have with you?", hint: "More than one, fewer than four." },
    ],
    note: {
      name: "track-01.txt", title: "Side A, track one, hyati",
      body: [
        "If this disc had a soundtrack, it would be you laughing at my driving in Kart.",
        "Thank you for being my favourite player two, and my favourite everything else, l kbida diali.",
        "— your daddy",
      ],
    },
  },
  {
    id: "floppy", label: "Floppy A", path: "dev://fd0", icon: "floppy",
    prompt: "Floppy A. A for you, obviously.",
    questions: [
      { id: "cats", ask: "What were my cats’ names?", hint: "Two Greek names. One is enough." },
      { id: "word", ask: "What is the one word I keep repeating?", hint: "You hear it every single day." },
    ],
    note: {
      name: "saved-game.txt", title: "Saved game found, tassano",
      body: [
        "Progress: 100%. Player two unlocked every drive.",
        "Okoook a sahbi… you really do know me, sweetie pie. Now come play something with me.",
        "— Diae, always",
      ],
    },
  },
];
