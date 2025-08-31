// src/components/EditPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { toast } from "react-toastify";
import {
  useGetMedicinesQuery,
  useGetIllnessesQuery,
  useDeleteIllnessMutation,
  useDeleteMedicineMutation,
  useUpdateIllnessMutation,
  useUpdateMedicineMutation,
} from "../api/api";

export default function EditPage() {
  const { data: meds = [] } = useGetMedicinesQuery();
  const { data: ills = [] } = useGetIllnessesQuery();

  const [selMedId, setSelMedId] = useState<string | null>(null);
  const [medName, setMedName] = useState("");
  const [selIllId, setSelIllId] = useState<string | null>(null);
  const [illName, setIllName] = useState("");

  const [updMed] = useUpdateMedicineMutation();
  const [delMed] = useDeleteMedicineMutation();
  const [updIll] = useUpdateIllnessMutation();
  const [delIll] = useDeleteIllnessMutation();

  const handleMedSelect = (id: string) => {
    setSelMedId(id || null);
    const m = meds.find((x) => x.id === id);
    setMedName(m?.name ?? "");
  };

  const handleIllSelect = (id: string) => {
    setSelIllId(id || null);
    const i = ills.find((x) => x.id === id);
    setIllName(i?.name ?? "");
  };

  const handleMedUpdate = async () => {
    if (selMedId && medName.trim()) {
      await updMed({ id: selMedId, name: medName.trim() }).unwrap();
      toast.success("Medicine renamed");
      setSelMedId(null);
      setMedName("");
    }
  };

  const handleMedDelete = async () => {
    if (selMedId && window.confirm("Delete this medicine and its links?")) {
      await delMed(selMedId).unwrap();
      toast.success("Medicine deleted");
      setSelMedId(null);
      setMedName("");
    }
  };

  const handleIllUpdate = async () => {
    if (selIllId && illName.trim()) {
      await updIll({ id: selIllId, name: illName.trim() }).unwrap();
      toast.success("Illness renamed");
      setSelIllId(null);
      setIllName("");
    }
  };

  const handleIllDelete = async () => {
    if (selIllId && window.confirm("Delete this illness and its links?")) {
      await delIll(selIllId).unwrap();
      toast.success("Illness deleted");
      setSelIllId(null);
      setIllName("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <nav className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </nav>
      <h2 className="text-2xl font-bold mb-6">Edit / Delete Entries</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Medicines */}
        <Card>
          <h3 className="text-lg font-semibold mb-3">Medicines</h3>
          <select
            className="w-full border px-3 py-2 rounded mb-3"
            value={selMedId ?? ""}
            onChange={(e) => handleMedSelect(e.target.value)}
          >
            <option value="">— Select medicine —</option>
            {meds.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {selMedId && (
            <>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleMedUpdate}
                  className="btn bg-blue-600 hover:bg-blue-700"
                >
                  Rename
                </button>
                <button
                  onClick={handleMedDelete}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </Card>

        {/* Illnesses */}
        <Card>
          <h3 className="text-lg font-semibold mb-3">Illnesses</h3>
          <select
            className="w-full border px-3 py-2 rounded mb-3"
            value={selIllId ?? ""}
            onChange={(e) => handleIllSelect(e.target.value)}
          >
            <option value="">— Select illness —</option>
            {ills.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          {selIllId && (
            <>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-3"
                value={illName}
                onChange={(e) => setIllName(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleIllUpdate}
                  className="btn bg-blue-600 hover:bg-blue-700"
                >
                  Rename
                </button>
                <button
                  onClick={handleIllDelete}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
