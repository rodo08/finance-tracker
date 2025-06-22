import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./FinancialRecordForm";
import { FinancialRecordList } from "./FinancialRecordList";
import { useFinancialRecords } from "../../contexts/financialRecordContext";
import { useMemo } from "react";

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });
    return totalAmount;
  }, [records]);
  return (
    <section className="dashboard-container">
      <h1>
        Welcome <span className="pico-color-jade-100"> {user?.firstName}</span>!
      </h1>
      <FinancialRecordForm />
      <aside className="total">
        <h1>
          Total Monthly:{" "}
          <span
            className={
              totalMonthly < 0 ? "pico-color-red-500" : "pico-color-jade-100"
            }
          >
            {" "}
            ${totalMonthly}
          </span>
        </h1>
      </aside>
      <FinancialRecordList />
    </section>
  );
};
