// The site's music: old Philippine recordings (public domain or CC BY-SA) plus one
// original waltz played live in the browser. Files live in public/music.

export type Track = {
  id: string;
  /** Name shown on the music button. */
  name: string;
  /** One line for the tooltip and the credits page. */
  about: string;
  performer: string;
  license: string;
  sourceUrl: string | null;
  /** Audio file under /public; missing for the live-generated waltz. */
  src?: string;
};

export const TRACKS: Track[] = [
  {
    id: "luha",
    name: "Luha ng Isang Dalaga",
    about: "Philippine instrumental, Victor recording, 1921",
    performer: "Victor Band, Rosario Bourdon and Facundo Pérez",
    license: "Public domain",
    sourceUrl: "https://archive.org/details/loc-jukebox-40505-luha-ng-isang-dalaga",
    src: "/music/luha-ng-isang-dalaga-1921.mp3",
  },
  {
    id: "ang-maya",
    name: "Ang Maya",
    about: "Song recorded in 1908, one of the earliest Filipino recordings",
    performer: "Maria Evangelista Carpena",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:1908_Recording_of_Ang_Maya_by_Maria_Evangelista_Carpena.ogg",
    src: "/music/ang-maya-1908.mp3",
  },
  {
    id: "sampaguita",
    name: "La Sampaguita",
    about: "Edison cylinder recording, 1910",
    performer: "Philippine Constabulary Band",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:La_Sampaguita_Philippine_Constabulary_Band.ogg",
    src: "/music/la-sampaguita-1910.mp3",
  },
  {
    id: "balse",
    name: "Lumang Balse",
    about: "An original slow waltz, played live in your browser",
    performer: "Composed for this site",
    license: "Public domain (CC0)",
    sourceUrl: null,
  },
  {
    id: "tonga",
    name: "Tonga",
    about: "Philippine instrumental, Victor recording, 1921",
    performer: "Victor Band, Rosario Bourdon and Facundo Pérez",
    license: "Public domain",
    sourceUrl: "https://archive.org/details/loc-jukebox-188903-tonga",
    src: "/music/tonga-1921.mp3",
  },
  {
    id: "sinulog",
    name: "Sinulog a Kamamatuan",
    about: "Maguindanao kulintang piece played at celebrations, recorded 2007",
    performer: "Philip Dominguez Mercurio",
    license: "CC BY-SA 2.5",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sinulog_a_Kamamatuan_Ver._1.ogg",
    src: "/music/sinulog-a-kamamatuan.mp3",
  },
];
