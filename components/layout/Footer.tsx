export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} FortuneNFT Admin Panel.
      All Rights Reserved.
    </footer>
  );
}