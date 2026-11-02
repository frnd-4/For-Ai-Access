export type Corridor = {
  id: string;
  routeFile: string;
  title: string;
  routeLabel: string;
  startLabel: string;
  endLabel: string;
  waypoints: string[];
  showDirectionalCounts: boolean;
};

export const corridors: Corridor[] = [
  {
    id: 'AbdullahpurGazipur',
    routeFile: 'abdullahpur-gazipur',
    title: 'DHAKA–MYMENSINGH HIGHWAY CORRIDOR',
    routeLabel: 'ABDULLAHPUR  →  UTTARA  →  TONGI  →  GAZIPUR',
    startLabel: 'ABDULLAHPUR',
    endLabel: 'GAZIPUR',
    waypoints: ['Abdullahpur, Dhaka, Bangladesh','Uttara, Dhaka, Bangladesh','Tongi, Gazipur, Bangladesh','Gazipur, Bangladesh'],
    showDirectionalCounts: true,
  },
  {
    id: 'JatrabariSanarpar',
    routeFile: 'jatrabari-sanarpar',
    title: 'DHAKA–CHATTOGRAM HIGHWAY CORRIDOR',
    routeLabel: 'JATRABARI  →  KAJLA  →  SANARPAR',
    startLabel: 'JATRABARI / KAJLA',
    endLabel: 'SANARPAR',
    waypoints: ['Jatrabari, Dhaka, Bangladesh','Kajla, Dhaka, Bangladesh','Sanarpar, Narayanganj, Bangladesh'],
    showDirectionalCounts: true,
  },
  {
    id: 'JatrabariEkuria',
    routeFile: 'jatrabari-ekuria',
    title: 'DHAKA–MAWA EXPRESSWAY CORRIDOR',
    routeLabel: 'JATRABARI  →  DHOLAIPAR  →  EKURIA',
    startLabel: 'JATRABARI / DHOLAIPAR',
    endLabel: 'EKURIA',
    waypoints: ['Jatrabari, Dhaka, Bangladesh','Dholairpar, Dhaka, Bangladesh','Ekuria, South Keraniganj, Bangladesh'],
    showDirectionalCounts: true,
  },
  {
    id: 'GabtoliHemayetpur',
    routeFile: 'gabtoli-hemayetpur',
    title: 'DHAKA–SAVAR HIGHWAY CORRIDOR',
    routeLabel: 'GABTOLI  →  AMINBAZAR  →  HEMAYETPUR',
    startLabel: 'GABTOLI / AMINBAZAR',
    endLabel: 'HEMAYETPUR',
    waypoints: ['Gabtoli, Dhaka, Bangladesh','Aminbazar, Savar, Bangladesh','Hemayetpur, Savar, Bangladesh'],
    showDirectionalCounts: true,
  },
  {
    id: 'AirportJamunaBridge',
    routeFile: 'airport-jamuna-bridge',
    title: 'ALTERNATIVE HIGHWAY CORRIDOR',
    routeLabel: 'HAZRAT SHAHJALAL INTERNATIONAL AIRPORT  →  JAMUNA BRIDGE',
    startLabel: 'HAZRAT SHAHJALAL INTERNATIONAL AIRPORT',
    endLabel: 'JAMUNA BRIDGE',
    waypoints: ['Hazrat Shahjalal International Airport, Dhaka, Bangladesh','Jamuna Bridge, Bangladesh'],
    showDirectionalCounts: false,
  },
];
