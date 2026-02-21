import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    arrayUnion,
    arrayRemove,
    increment,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CircleState, CircleMember } from '@/lib/store';

/**
 * Crée un nouveau cercle
 */
export async function createCircle(userId: string, userName: string, circleName: string): Promise<string | null> {
    if (!db) return null;

    try {
        const circlesRef = collection(db, 'circles');
        const circleId = Math.random().toString(36).substring(2, 9).toUpperCase(); // Code court pour invitation

        const newCircle = {
            id: circleId,
            name: circleName,
            members: [
                {
                    uid: userId,
                    name: userName,
                    hasValidatedToday: false,
                    lastActive: new Date().toISOString(),
                    streak: 0
                }
            ],
            guardianUid: userId,
            fireIntensity: 0,
            fireColor: 'grey',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        await setDoc(doc(db, 'circles', circleId), newCircle);

        // Mettre à jour l'utilisateur avec son circleId
        const userDocRef = doc(db, 'user_data', userId);
        await updateDoc(userDocRef, { circleId });

        return circleId;
    } catch (error) {
        console.error('Error creating circle:', error);
        return null;
    }
}

/**
 * Rejoint un cercle existant
 */
export async function joinCircle(userId: string, userName: string, circleId: string): Promise<CircleState | null> {
    if (!db) return null;

    try {
        const circleDocRef = doc(db, 'circles', circleId);
        const docSnap = await getDoc(circleDocRef);

        if (!docSnap.exists()) {
            throw new Error('Cercle non trouvé');
        }

        const circleData = docSnap.data();
        if (circleData.members.length >= 7) {
            throw new Error('Cercle complet');
        }

        const newMember: CircleMember = {
            uid: userId,
            name: userName,
            hasValidatedToday: false,
            lastActive: new Date().toISOString(),
            streak: 0
        };

        await updateDoc(circleDocRef, {
            members: arrayUnion(newMember),
            updatedAt: Timestamp.now()
        });

        // Mettre à jour l'utilisateur
        const userDocRef = doc(db, 'user_data', userId);
        await updateDoc(userDocRef, { circleId });

        return {
            id: circleId,
            name: circleData.name,
            members: [...circleData.members, newMember],
            guardianUid: circleData.guardianUid,
            fireIntensity: circleData.fireIntensity,
            fireColor: circleData.fireColor
        };
    } catch (error) {
        console.error('Error joining circle:', error);
        return null;
    }
}

/**
 * Quitte un cercle
 */
export async function leaveCircle(userId: string, circleId: string): Promise<void> {
    if (!db) return;

    try {
        const circleDocRef = doc(db, 'circles', circleId);
        const docSnap = await getDoc(circleDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const memberToRemove = data.members.find((m: any) => m.uid === userId);

            if (memberToRemove) {
                await updateDoc(circleDocRef, {
                    members: arrayRemove(memberToRemove),
                    updatedAt: Timestamp.now()
                });
            }
        }

        // Mettre à jour l'utilisateur
        const userDocRef = doc(db, 'user_data', userId);
        await updateDoc(userDocRef, { circleId: null });
    } catch (error) {
        console.error('Error leaving circle:', error);
    }
}

/**
 * Valide l'activité aujourd'hui
 */
export async function validateActivity(userId: string, circleId: string): Promise<void> {
    if (!db) return;

    try {
        const circleDocRef = doc(db, 'circles', circleId);
        const docSnap = await getDoc(circleDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const members = data.members.map((m: any) => {
                if (m.uid === userId) {
                    return { ...m, hasValidatedToday: true, lastActive: new Date().toISOString() };
                }
                return m;
            });

            const validatedCount = members.filter((m: any) => m.hasValidatedToday).length;
            const intensity = Math.min(100, Math.round((validatedCount / members.length) * 100));

            await updateDoc(circleDocRef, {
                members,
                fireIntensity: intensity,
                fireColor: intensity > 0 ? 'bright' : 'grey',
                updatedAt: Timestamp.now()
            });
        }
    } catch (error) {
        console.error('Error validating activity:', error);
    }
}

/**
 * Écoute les changements d'un cercle
 */
export function listenToCircle(circleId: string, callback: (circle: CircleState) => void) {
    if (!db) return () => { };

    return onSnapshot(doc(db, 'circles', circleId), (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            callback({
                id: doc.id,
                name: data.name,
                members: data.members,
                guardianUid: data.guardianUid,
                fireIntensity: data.fireIntensity,
                fireColor: data.fireColor
            });
        }
    });
}
