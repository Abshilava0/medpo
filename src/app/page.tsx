"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<"patient" | "staff" | null>(null);
  const [code, setCode] = useState("");
  const [staffCodeStep, setStaffCodeStep] = useState(false);
  const [error, setError] = useState("");
  const [recordVisible, setRecordVisible] = useState(false);

  function openAccess(role: "patient" | "staff") {
    setSelectedRole(role);
    setCode("");
    setStaffCodeStep(false);
    setError("");
    setRecordVisible(false);
  }

  function closeAccess() {
    setSelectedRole(null);
    setRecordVisible(false);
  }

  function searchRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const medpoCodeMatches = code.trim().toUpperCase() === "A00001";
    const personalIdMatches = code.trim() === "14141414";

    if (selectedRole === "staff" && !staffCodeStep && personalIdMatches) {
      setCode("");
      setStaffCodeStep(true);
      setError("");
      return;
    }

    if ((selectedRole === "patient" && medpoCodeMatches) || (selectedRole === "staff" && staffCodeStep && medpoCodeMatches)) {
      setError("");
      setRecordVisible(true);
      return;
    }

    setRecordVisible(false);
    setError(selectedRole === "staff" ? (staffCodeStep ? "მედპო კოდი არასწორია." : "პირადი ნომერი არასწორია.") : "კოდი არასწორია.");
  }

  return (
    <main className={styles.page}>
      <img className={styles.backgroundImage} src="/medpo-background.jpg" alt="" aria-hidden="true" />
      <header className={styles.header}>
        <a className={styles.brand} href="#" aria-label="Medpo მთავარი">
          <img className={styles.logoImage} src="/medpo-logo.jpg" alt="Medpo.ge" />
        </a>
      </header>

      <section className={styles.welcome} aria-label="აირჩიეთ შესვლის ტიპი">
        <button className={`${styles.choice} ${styles.patient}`} onClick={() => openAccess("patient")}>
          <img className={styles.choiceImage} src="/patient.png" alt="" />
          <span>მოქალაქე</span>
        </button>
        <button className={`${styles.choice} ${styles.staff}`} onClick={() => openAccess("staff")}>
          <img className={styles.choiceImage} src="/med.png" alt="" />
          <span>სამედიცინო<br />პერსონალი</span>
        </button>
      </section>

      {selectedRole && (
        <div className={styles.modalBackdrop} onMouseDown={closeAccess}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.closeButton} type="button" onClick={closeAccess} aria-label="დახურვა">×</button>
            <h1 id="access-title">{selectedRole === "patient" ? "მოქალაქის შესვლა" : "სამედიცინო პერსონალის შესვლა"}</h1>
            <p>{selectedRole === "staff" ? (staffCodeStep ? "შეიყვანეთ მედპო კოდი" : "შეიყვანეთ პირადი ნომერი") : "შეიყვანეთ მედპო კოდი"}</p>
            <form onSubmit={searchRecord}>
              <label className={styles.codeLabel} htmlFor="access-code">
                {selectedRole === "staff" ? (staffCodeStep ? "მედპო კოდი" : "პირადი ნომერი") : "კოდი"}
              </label>
              <input
                id="access-code"
                className={styles.codeInput}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="off"
                autoFocus
                placeholder={selectedRole === "staff" ? (staffCodeStep ? "შეიყვანეთ მედპო კოდი" : "შეიყვანეთ პირადი ნომერი") : "მაგ. A37801"}
              />
              <button className={styles.searchButton} type="submit">ძებნა</button>
            </form>
            {error && <p className={styles.error} role="alert">{error}</p>}
            {recordVisible && (
              <div className={styles.record} aria-live="polite">
                <h2>პაციენტის ინფორმაცია</h2>
                <p><strong>ასაკი:</strong> 35 წლის</p>
                <p><strong>სისხლის ჯგუფი:</strong> I (+)</p>
                <p><strong>ალერგიები:</strong> დექსამეტაზონი</p>
                <p><strong>მნიშვნელოვანი წამლები რომელსაც იღებს:</strong> რიტონავირი</p>
                <p><strong>ქრონიკული დაავადება:</strong> აქვს</p>
                {selectedRole === "staff" && <p className={styles.caution}><strong>სიფრთხილე:</strong> პაციენტი დაინფიცირებულია აივ-ვირუსით.</p>}
              </div>
            )}
          </section>
        </div>
      )}

    </main>
  );
}
