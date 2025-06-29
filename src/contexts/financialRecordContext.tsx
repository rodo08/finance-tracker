import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  userId?: string; // opcional en frontend, pero se enviará
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `${API_BASE_URL}/financial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    if (!user) return;
    // Añadimos userId para que el backend lo reciba
    const recordWithUserId = { ...record, userId: user.id };

    const response = await fetch(`${API_BASE_URL}/financial-records`, {
      method: "POST",
      body: JSON.stringify(recordWithUserId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    if (!user) return;
    const recordWithUserId = { ...newRecord, userId: user.id };

    const response = await fetch(`${API_BASE_URL}/financial-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(recordWithUserId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => (record._id === id ? updatedRecord : record))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/financial-records/${id}`, {
      method: "DELETE",
    });

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
