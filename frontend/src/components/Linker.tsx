import { useState, useMemo } from "react";
import Card from "./Card";
import { toast } from "react-toastify";
import {
  useGetMedicinesQuery,
  useGetIllnessesQuery,
  useLinkMutation,
} from "../api/api";
import { Medicine, Illness } from "../types";

export default function Linker() {
  const { data: meds = [] } = useGetMedicinesQuery();
  const { data: ills = [] } = useGetIllnessesQuery();
  const [link] = useLinkMutation();

  const [medSearch, setMedSearch] = useState("");
  const [illSearch, setIllSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [selectedIll, setSelectedIll] = useState<Illness | null>(null);

  const filteredMeds = useMemo(
    () =>
      medSearch.trim()
        ? meds.filter((m) =>
            m.name.toLowerCase().includes(medSearch.toLowerCase())
          )
        : [],
    [meds, medSearch]
  );

  const filteredIlls = useMemo(
    () =>
      illSearch.trim()
        ? ills.filter((i) =>
            i.name.toLowerCase().includes(illSearch.toLowerCase())
          )
        : [],
    [ills, illSearch]
  );

  const handleLink = async () => {
    if (!selectedMed || !selectedIll) return;
    await link({
      medicineId: selectedMed.id,
      illnessId: selectedIll.id,
    }).unwrap();
    toast.success(`Linked "${selectedMed.name}" with "${selectedIll.name}"`);
    setSelectedMed(null);
    setSelectedIll(null);
    setMedSearch("");
    setIllSearch("");
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Match Medicine ↔ Illness</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Medicine section */}
        <div>
          <label className="block text-sm font-medium mb-1">Medicine</label>
          <input
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
            value={medSearch}
            onChange={(e) => setMedSearch(e.target.value)}
            placeholder="Search medicine..."
          />
          {medSearch.trim() && (
            <ul className="mt-2 max-h-40 overflow-auto border rounded bg-white">
              {filteredMeds.map((m) => (
                <li
                  key={m.id}
                  onClick={() => setSelectedMed(m)}
                  className={`px-3 py-1 cursor-pointer hover:bg-blue-100 ${
                    selectedMed?.id === m.id ? "bg-blue-200 font-semibold" : ""
                  }`}
                >
                  {m.name}
                </li>
              ))}
              {filteredMeds.length === 0 && (
                <li className="px-3 py-1 text-gray-500">No medicines found</li>
              )}
            </ul>
          )}
        </div>

        {/* Illness section */}
        <div>
          <label className="block text-sm font-medium mb-1">Illness</label>
          <input
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
            value={illSearch}
            onChange={(e) => setIllSearch(e.target.value)}
            placeholder="Search illness..."
          />
          {illSearch.trim() && (
            <ul className="mt-2 max-h-40 overflow-auto border rounded bg-white">
              {filteredIlls.map((i) => (
                <li
                  key={i.id}
                  onClick={() => setSelectedIll(i)}
                  className={`px-3 py-1 cursor-pointer hover:bg-blue-100 ${
                    selectedIll?.id === i.id ? "bg-blue-200 font-semibold" : ""
                  }`}
                >
                  {i.name}
                </li>
              ))}
              {filteredIlls.length === 0 && (
                <li className="px-3 py-1 text-gray-500">No illnesses found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <button
        className="mt-4 px-5 py-2 bg-green-600 text-white font-semibold rounded disabled:opacity-50"
        disabled={!selectedMed || !selectedIll}
        onClick={handleLink}
      >
        Link
      </button>
    </Card>
  );
}
