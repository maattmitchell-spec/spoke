export type EventType = "ride" | "run" | "hike" | "meetup";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  coordinates?: Coordinates;
  distance?: string;
  elevation?: string;
  difficulty: "easy" | "moderate" | "hard";
  attendees: number;
  maxAttendees: number;
  host: string;
  hostAvatar: string;
  description: string;
  tags: string[];
  isJoined: boolean;
  ridewithgpsUrl?: string;
  alltrailsUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  eventsAttended: number;
  location: string;
  joinedYear: number;
  bio: string;
  badges: string[];
}

export const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Dawn Patrol Gravel Ride",
    type: "ride",
    date: "SAT APR 5",
    time: "6:30 AM",
    location: "Marin Headlands, CA",
    coordinates: { lat: 37.8283, lng: -122.5311 },
    distance: "42 mi",
    elevation: "3,200 ft",
    difficulty: "hard",
    attendees: 8,
    maxAttendees: 12,
    host: "Alex Chen",
    hostAvatar: "AC",
    description:
      "Classic Marin loop — Rodeo Beach to Hawk Hill and back. Expect marine layer, rugged fire roads, and cold air. Cafe stop mid-ride. Bring layers and tubeless setup.",
    tags: ["gravel", "dawn", "coastal"],
    isJoined: false,
    ridewithgpsUrl: "https://ridewithgps.com/routes/46851791",
  },
  {
    id: "2",
    title: "Fire Road Trail Run",
    type: "run",
    date: "SUN APR 6",
    time: "7:00 AM",
    location: "Tilden Park, Berkeley",
    coordinates: { lat: 37.9000, lng: -122.2478 },
    distance: "8 mi",
    elevation: "1,100 ft",
    difficulty: "moderate",
    attendees: 5,
    maxAttendees: 10,
    host: "Maya Patel",
    hostAvatar: "MP",
    description:
      "Rolling fire roads and eucalyptus forests above the fog. Easy conversational pace — all trail runners welcome. Post-run coffee at Jupiter.",
    tags: ["trail", "hills", "fog"],
    isJoined: true,
    alltrailsUrl: "https://www.alltrails.com/trail/us/california/tilden-regional-park-fire-trail",
  },
  {
    id: "3",
    title: "Half Dome Day Hike",
    type: "hike",
    date: "SAT APR 12",
    time: "5:00 AM",
    location: "Yosemite Valley, CA",
    coordinates: { lat: 37.7459, lng: -119.5936 },
    distance: "16 mi",
    elevation: "4,800 ft",
    difficulty: "hard",
    attendees: 4,
    maxAttendees: 6,
    host: "Jordan Wu",
    hostAvatar: "JW",
    description:
      "Permit secured. Full day summit attempt via the JMT connector. Cables will be up. This is a serious day — bring 3L water, gaiters, and snacks to last.",
    tags: ["alpine", "permit", "summit"],
    isJoined: false,
    alltrailsUrl: "https://www.alltrails.com/trail/us/california/half-dome-trail",
  },
  {
    id: "4",
    title: "Sightglass Coffee Meetup",
    type: "meetup",
    date: "WED APR 9",
    time: "8:00 AM",
    location: "Sightglass Coffee, SF",
    coordinates: { lat: 37.7785, lng: -122.4068 },
    distance: undefined,
    elevation: undefined,
    difficulty: "easy",
    attendees: 11,
    maxAttendees: 20,
    host: "Sarah Kim",
    hostAvatar: "SK",
    description:
      "Casual gathering for the remote worker crowd. Bring your laptop or just hang. Talk about upcoming rides, new routes, and life on the road. No agenda — good coffee, good people.",
    tags: ["social", "coffee", "casual"],
    isJoined: true,
  },
  {
    id: "5",
    title: "Coast Range Road Ride",
    type: "ride",
    date: "SAT APR 19",
    time: "7:30 AM",
    location: "Stinson Beach, CA",
    coordinates: { lat: 37.8997, lng: -122.6442 },
    distance: "68 mi",
    elevation: "5,600 ft",
    difficulty: "hard",
    attendees: 6,
    maxAttendees: 8,
    host: "Tom Bradley",
    hostAvatar: "TB",
    description:
      "Epic coastal century-lite — Fairfax to Stinson via Bolinas Ridge, back over Pantoll and White's Hill. Iconic Marin roads. Group holds for regrouping points.",
    tags: ["road", "coastal", "climbing"],
    isJoined: false,
    ridewithgpsUrl: "https://ridewithgps.com/routes/45912044",
  },
  {
    id: "6",
    title: "Mt. Tam Moonlight Hike",
    type: "hike",
    date: "FRI APR 18",
    time: "8:00 PM",
    location: "Mt. Tamalpais, CA",
    coordinates: { lat: 37.9235, lng: -122.5965 },
    distance: "6 mi",
    elevation: "1,200 ft",
    difficulty: "moderate",
    attendees: 9,
    maxAttendees: 15,
    host: "Priya Shah",
    hostAvatar: "PS",
    description:
      "Full moon summit hike. Bring a headlamp anyway — the view from the East Peak at midnight is worth every step. Flask optional, stars mandatory.",
    tags: ["night", "full moon", "summit"],
    isJoined: false,
    alltrailsUrl: "https://www.alltrails.com/trail/us/california/mount-tamalpais-east-peak",
  },
];

export const SAMPLE_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "AC",
    role: "Ride Captain",
    eventsAttended: 47,
    location: "San Francisco, CA",
    joinedYear: 2022,
    bio: "Gravel obsessed. Remote designer. Usually on a bike somewhere between meetings.",
    badges: ["Centurion", "Dawn Patrol", "Route Setter"],
  },
  {
    id: "2",
    name: "Maya Patel",
    avatar: "MP",
    role: "Trail Ambassador",
    eventsAttended: 31,
    location: "Oakland, CA",
    joinedYear: 2023,
    bio: "UX researcher by day. Trail runner all other times. Chasing the fog line.",
    badges: ["Trailblazer", "Community Builder"],
  },
  {
    id: "3",
    name: "Jordan Wu",
    avatar: "JW",
    role: "Member",
    eventsAttended: 18,
    location: "Berkeley, CA",
    joinedYear: 2023,
    bio: "Software engineer. Weekend alpinist. I believe every permit is worth applying for.",
    badges: ["Summit Seeker", "Early Adopter"],
  },
  {
    id: "4",
    name: "Sarah Kim",
    avatar: "SK",
    role: "Community Host",
    eventsAttended: 62,
    location: "San Francisco, CA",
    joinedYear: 2021,
    bio: "Product lead. Connector of people. Making sure the social side of Spoke never takes itself too seriously.",
    badges: ["Connector", "Founding Member", "Host"],
  },
  {
    id: "5",
    name: "Tom Bradley",
    avatar: "TB",
    role: "Member",
    eventsAttended: 24,
    location: "Mill Valley, CA",
    joinedYear: 2022,
    bio: "Architect and obsessive cartographer. Every good climb needs a better story.",
    badges: ["Centurion", "Route Setter"],
  },
  {
    id: "6",
    name: "Priya Shah",
    avatar: "PS",
    role: "Member",
    eventsAttended: 15,
    location: "San Francisco, CA",
    joinedYear: 2024,
    bio: "Full-stack engineer. Night hiker. The mountains are open 24 hours.",
    badges: ["Night Owl", "New Member"],
  },
];
