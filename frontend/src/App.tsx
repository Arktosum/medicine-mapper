import { ToastContainer } from "react-toastify";
import { Adddisease, AddMedicine } from "./components/AddEntity";
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
          <Adddisease />
        </section>
        <Linker />
        <Search />
      </main>
    </div>
  );
}
