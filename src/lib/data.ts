import { collection, doc, getDoc, getDocs, setDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial Data
const INITIAL_DRIVERS = [
  { id: "ver", name: "Max Verstappen", team: "Red Bull Racing", points: 350, wins: 12, podiums: 15, number: 1, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png" },
  { id: "nor", name: "Lando Norris", team: "McLaren", points: 285, wins: 3, podiums: 10, number: 4, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png" },
  { id: "lec", name: "Charles Leclerc", team: "Ferrari", points: 260, wins: 2, podiums: 8, number: 16, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png" },
  { id: "ham", name: "Lewis Hamilton", team: "Ferrari", points: 210, wins: 1, podiums: 5, number: 44, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png" },
  { id: "pia", name: "Oscar Piastri", team: "McLaren", points: 195, wins: 1, podiums: 4, number: 81, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png" },
];

const INITIAL_CALENDAR = [
  { id: "bhr", round: 1, name: "Bahrain Grand Prix", Date: "2026-03-02T15:00:00Z", status: "completed", circuit: "Bahrain International Circuit" },
  { id: "sau", round: 2, name: "Saudi Arabian Grand Prix", Date: "2026-03-09T17:00:00Z", status: "completed", circuit: "Jeddah Corniche Circuit" },
  { id: "aus", round: 3, name: "Australian Grand Prix", Date: "2026-03-24T04:00:00Z", status: "upcoming", circuit: "Albert Park Circuit" },
  { id: "jpn", round: 4, name: "Japanese Grand Prix", Date: "2026-04-07T05:00:00Z", status: "upcoming", circuit: "Suzuka International Racing Course" },
  { id: "chn", round: 5, name: "Chinese Grand Prix", Date: "2026-04-21T07:00:00Z", status: "upcoming", circuit: "Shanghai International Circuit" },
];

const INITIAL_NEWS = [
  { id: "n1", title: "Hamilton's stunning debut for Ferrari in Bahrain", snippet: "The 7-time world champion shows he still has the pace, battling for the podium in his first race in red.", date: "2026-03-03T10:00:00Z" },
  { id: "n2", title: "New aerodynamic regulations shake up the midfield", snippet: "Teams are struggling to adapt to the 2026 aero rules, leading to unpredictable results.", date: "2026-03-01T14:30:00Z" },
  { id: "n3", title: "Verstappen dominates early, but McLaren closes the gap", snippet: "Red Bull's early advantage seems to be shrinking as McLaren brings a massive upgrade package to Australia.", date: "2026-03-12T09:15:00Z" }
];

export async function fetchPublicData() {
  try {
    let [driversSnap, calSnap, newsSnap] = await Promise.all([
      getDocs(collection(db, 'drivers')),
      getDocs(collection(db, 'calendar')),
      getDocs(collection(db, 'news'))
    ]);

    // If perfectly empty, might mean they aren't seeded. Unfortunately users can't write these.
    // In a real app we'd seed from an admin backend. 
    // Wait, the client CANNOT write `drivers` according to our rules.
    // For this prototype, I'll temporarily fallback to hardcoded initial values 
    // if the snap is empty, just so the UI has something to show.
    const mapDoc = (d: any) => ({ id: d.id, ...d.data() });
    
    return {
      drivers: driversSnap.empty ? INITIAL_DRIVERS : driversSnap.docs.map(mapDoc),
      calendar: calSnap.empty ? INITIAL_CALENDAR : calSnap.docs.map(mapDoc),
      news: newsSnap.empty ? INITIAL_NEWS : newsSnap.docs.map(mapDoc),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'public_data');
    return { drivers: [], calendar: [], news: [] };
  }
}

export async function ensureUserProfile(uid: string, displayName: string | null) {
  const userRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: displayName || 'Racing Fan',
        level: 1,
        points: 0,
        streak: 1,
        nextRewardAt: 500,
        badges: ['Rookie']
      });
      return {
        id: uid,
        name: displayName || 'Racing Fan',
        level: 1,
        points: 0,
        streak: 1,
        nextRewardAt: 500,
        badges: ['Rookie'],
        predictions: {}
      };
    }
    
    // fetch predictions
    const predSnap = await getDocs(collection(userRef, 'predictions'));
    const predictions: Record<string, any> = {};
    predSnap.docs.forEach(d => {
      predictions[d.id] = d.data();
    });

    return { id: uid, ...snap.data(), predictions };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function savePrediction(uid: string, raceId: string, prediction: { p1: string, p2: string, p3: string }) {
  try {
    const userRef = doc(db, 'users', uid);
    const predRef = doc(userRef, 'predictions', raceId);
    
    const predSnap = await getDoc(predRef);
    const isNew = !predSnap.exists();

    await setDoc(predRef, prediction);

    if (isNew) {
      // Award points (in production this should be a transaction via Cloud Function or exact rule validation, 
      // but for this prototype we'll write updated points via client within allowed field bounds)
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as any;
        let p = data.points + 50;
        let l = Math.floor(p / 500) + 1;
        let badges = data.badges;
        if (l > data.level) badges = [...badges, `Level ${l} Strategist`];
        
        await setDoc(userRef, {
          name: data.name,
          level: l,
          points: p,
          streak: data.streak,
          nextRewardAt: l * 500 + 500,
          badges,
        });
      }
    }
    return isNew;

  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/predictions/${raceId}`);
  }
}
