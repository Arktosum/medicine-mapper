import { ToastContainer } from "react-toastify";
import { AddIllness, AddMedicine } from "./components/AddEntity";
import "react-toastify/dist/ReactToastify.css";
import Linker from "./components/Linker";
import Search from "./components/Search";

export default function App() {
  return (
    <div className="min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />
      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-4">
        <section className="grid md:grid-cols-2 gap-4">
          <AddMedicine />
          <AddIllness />
        </section>
        <Linker />
        <Search />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-xs text-slate-500">
      Built with React + TypeScript, Redux Toolkit (RTK Query), Tailwind,
      Express. ✨
    </footer>
  );
}
