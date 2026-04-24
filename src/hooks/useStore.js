import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, addDoc, updateDoc } from 'firebase/firestore';

const DEFAULT_STOCK = {
  filled12kg: 0,
  filled6kg: 0,
  empty12kg: 0,
  empty6kg: 0
};

export function useStore() {
  const [transactions, setTransactions] = useState([]);
  const [stock, setStock] = useState(DEFAULT_STOCK);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);

  // Sync Data Automatically via Firebase Real-time Web Sockets
  useEffect(() => {
    const handleErr = (err) => {
      console.error("FIREBASE SUBSCRIPTION ERROR:", err);
      setErrorObj(err.message);
      setLoading(false);
    };

    // 1. Stock Connection
    const unsubStock = onSnapshot(doc(db, "config", "stock"), (docSnap) => {
      if (docSnap.exists()) {
        setStock(docSnap.data());
      } else {
        // Initialize if first time
        setDoc(doc(db, "config", "stock"), DEFAULT_STOCK).catch(handleErr);
      }
    }, handleErr);

    // 2. Transactions Connection
    const unsubTx = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort newest first
      data.sort((a,b) => new Date(b.date) - new Date(a.date));
      setTransactions(data);
    }, handleErr);

    // 3. Debts Connection
    const unsubDebts = onSnapshot(collection(db, "debts"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a,b) => new Date(b.datePurchased) - new Date(a.datePurchased));
      setDebts(data);
      // Data is fully loaded
      setLoading(false);
    }, handleErr);

    // Cleanup memory when component closes
    return () => {
      unsubStock();
      unsubTx();
      unsubDebts();
    };
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const newTx = { ...transaction, date: new Date().toISOString() };
      await addDoc(collection(db, "transactions"), newTx);

      // Automatically update stock in the cloud
      const nextLocal = { ...stock };
      if (newTx.type === '12kg') {
        nextLocal.filled12kg = Math.max(0, nextLocal.filled12kg - 1);
        if (newTx.hadEmptyBottle) nextLocal.empty12kg += 1;
      } else if (newTx.type === '6kg') {
        nextLocal.filled6kg = Math.max(0, nextLocal.filled6kg - 1);
        if (newTx.hadEmptyBottle) nextLocal.empty6kg += 1;
      }
      
      await setDoc(doc(db, "config", "stock"), nextLocal);
    } catch(err) {
      alert("Failed to save sale: " + err.message);
    }
  };

  const adjustStock = async (itemKey, newCount, reason) => {
    if (stock[itemKey] == newCount) return;

    try {
      const nextLocal = { ...stock, [itemKey]: parseInt(newCount) };
      await setDoc(doc(db, "config", "stock"), nextLocal);
    } catch (err) {
      alert("Failed to adjust stock: " + err.message);
    }
  };

  const addDebt = async (debt) => {
    try {
      const newDebt = { 
        ...debt, 
        datePurchased: new Date().toISOString(),
        returned: false
      };
      await addDoc(collection(db, "debts"), newDebt);
    } catch(err) {
      alert("Failed to add debt: " + err.message);
    }
  };

  const resolveDebt = async (id) => {
    const debt = debts.find(d => d.id === id);
    if (!debt || debt.returned) return;

    try {
      // Securely update the specific debt document
      await updateDoc(doc(db, "debts", id), {
        returned: true,
        dateReturned: new Date().toISOString()
      });

      // Update stock in cloud
      const nextLocal = { ...stock };
      if (debt.bottleSize === '12kg') nextLocal.empty12kg += 1;
      if (debt.bottleSize === '6kg') nextLocal.empty6kg += 1;
      await setDoc(doc(db, "config", "stock"), nextLocal);
    } catch(err) {
       alert("Failed to return debt: " + err.message);
    }
  };

  return {
    transactions,
    addTransaction,
    stock,
    adjustStock,
    debts,
    addDebt,
    resolveDebt,
    loading,
    errorObj
  };
}
