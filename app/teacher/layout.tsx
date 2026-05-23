import TeacherNav from "./components/TeacherNav";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 56px 160px",
        }}
        className="teacher-page"
      >
        {children}
      </div>
      <TeacherNav />
      <style>{`
        @media (max-width: 880px) {
          .teacher-page { padding: 24px 20px 140px !important; }
          .teacher-split { grid-template-columns: 1fr !important; }
          .teacher-two-col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
