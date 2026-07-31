import { doc, setDoc, onSnapshot, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from './firebase';

const ROSTER_DOC_PATH = ['settings', 'shared_roster'] as const;

// 1. Save roster to Firestore
export async function saveRosterToCloud(names: string[]): Promise<boolean> {
  try {
    const docRef = doc(db, ROSTER_DOC_PATH[0], ROSTER_DOC_PATH[1]);
    await setDoc(docRef, {
      names,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn('Firestore saveRosterToCloud error (falling back to local):', error);
    return false;
  }
}

// 2. Subscribe to real-time roster changes
export function subscribeRosterFromCloud(onUpdate: (names: string[]) => void) {
  try {
    const docRef = doc(db, ROSTER_DOC_PATH[0], ROSTER_DOC_PATH[1]);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data?.names) && data.names.length > 0) {
          onUpdate(data.names);
        }
      }
    }, (error) => {
      console.warn('Firestore roster snapshot error:', error);
    });
  } catch (error) {
    console.warn('Firestore subscribe error:', error);
    return () => {};
  }
}

// 3. Save daily emotion & custom note state to Firestore
export async function saveDailyStateToCloud(
  date: string,
  teacherName: string,
  state: { emotionId?: string; customNote?: string }
): Promise<boolean> {
  try {
    const docRef = doc(db, 'daily_boards', date);
    await setDoc(
      docRef,
      {
        [teacherName]: {
          emotionId: state.emotionId || null,
          customNote: state.customNote || null,
          updatedAt: new Date().toISOString()
        }
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore saveDailyStateToCloud error:', error);
    return false;
  }
}

// 4. Subscribe to daily board changes in real-time
export function subscribeDailyBoardFromCloud(
  date: string,
  onUpdate: (stateMap: Record<string, { emotionId?: string; customNote?: string }>) => void
) {
  try {
    const docRef = doc(db, 'daily_boards', date);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        const stateMap: Record<string, { emotionId?: string; customNote?: string }> = {};
        
        Object.keys(rawData).forEach((key) => {
          const val = rawData[key];
          if (val && typeof val === 'object') {
            stateMap[key] = {
              emotionId: val.emotionId || undefined,
              customNote: val.customNote || undefined
            };
          }
        });

        onUpdate(stateMap);
      }
    }, (error) => {
      console.warn('Firestore daily board snapshot error:', error);
    });
  } catch (error) {
    console.warn('Firestore subscribe daily board error:', error);
    return () => {};
  }
}

// 5. Reset single teacher state on daily board
export async function resetTeacherStateInCloud(date: string, teacherName: string) {
  try {
    const docRef = doc(db, 'daily_boards', date);
    await updateDoc(docRef, {
      [teacherName]: deleteField()
    });
  } catch (error) {
    console.warn('Firestore resetTeacherStateInCloud error:', error);
  }
}

// 6. Reset all teachers on daily board
export async function resetDailyBoardInCloud(date: string) {
  try {
    const docRef = doc(db, 'daily_boards', date);
    await setDoc(docRef, {});
  } catch (error) {
    console.warn('Firestore resetDailyBoardInCloud error:', error);
  }
}

// 7. URL encoding helpers for sharing link with roster embedded
export function getUrlWithRoster(names: string[]): string {
  const url = new URL(window.location.href);
  if (names && names.length > 0) {
    url.searchParams.set('roster', encodeURIComponent(names.join(',')));
  }
  return url.toString();
}

export function parseRosterFromUrl(): string[] | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const rosterParam = urlParams.get('roster');
    if (rosterParam) {
      const decoded = decodeURIComponent(rosterParam);
      const list = decoded
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      if (list.length > 0) {
        return list;
      }
    }
  } catch (e) {
    console.warn('Failed to parse roster from URL:', e);
  }
  return null;
}
