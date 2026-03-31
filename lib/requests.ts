import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export type RequestStatus =
  | "OPEN"
  | "CLAIMED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export async function createRequest(title: string, details: string = "") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = await addDoc(collection(db, "requests"), {
    title,
    details,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    status: "OPEN",
    claimedBy: null,
    claimedAt: null,
    completedAt: null,
  });

  return docRef.id;
}

export async function getOpenRequests() {
  const q = query(
    collection(db, "requests"),
    where("status", "==", "OPEN"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getMyCreatedRequests() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "requests"),
    where("createdBy", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getMyClaimedRequests() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "requests"),
    where("claimedBy", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function claimRequest(requestId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const requestRef = doc(db, "requests", requestId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(requestRef);

    if (!snap.exists()) {
      throw new Error("Request not found");
    }

    const data = snap.data();

    if (data.status !== "OPEN" || data.claimedBy !== null) {
      throw new Error("Request already claimed");
    }

    transaction.update(requestRef, {
      status: "CLAIMED",
      claimedBy: user.uid,
      claimedAt: serverTimestamp(),
    });
  });
}

export async function markRequestInProgress(requestId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const requestRef = doc(db, "requests", requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) throw new Error("Request not found");

  const data = snap.data();

  if (data.claimedBy !== user.uid) {
    throw new Error("Only the claimer can update this request");
  }

  await updateDoc(requestRef, {
    status: "IN_PROGRESS",
  });
}

export async function markRequestDone(requestId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const requestRef = doc(db, "requests", requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) throw new Error("Request not found");

  const data = snap.data();

  if (data.claimedBy !== user.uid) {
    throw new Error("Only the claimer can complete this request");
  }

  await updateDoc(requestRef, {
    status: "DONE",
    completedAt: serverTimestamp(),
  });
}

export async function cancelRequest(requestId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const requestRef = doc(db, "requests", requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) throw new Error("Request not found");

  const data = snap.data();

  if (data.createdBy !== user.uid) {
    throw new Error("Only the creator can cancel this request");
  }

  if (data.status !== "OPEN") {
    throw new Error("Only open requests can be cancelled");
  }

  await updateDoc(requestRef, {
    status: "CANCELLED",
  });
}

export async function getRequestById(requestId: string) {
  const requestRef = doc(db, "requests", requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) {
    throw new Error("Request not found");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}
