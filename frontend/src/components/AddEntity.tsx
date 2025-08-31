import { useState } from "react";
import { toast } from "react-toastify";
import { useAddIllnessMutation, useAddMedicineMutation } from "../api/api";
import Card from "./Card";

export function AddMedicine() {
  const [name, setName] = useState("");
  const [addMedicine, { isLoading }] = useAddMedicineMutation();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addMedicine({ name: name.trim() }).unwrap();
      toast.success("Medicine added");
      setName("");
    } catch (e) {
      toast.error("Failed to add medicine");
    }
  };
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Add Medicine</h3>
      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input"
          placeholder="e.g., Abroma Augusta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          disabled={isLoading}
        >
          Add
        </button>
      </form>
    </Card>
  );
}

export function AddIllness() {
  const [name, setName] = useState("");
  const [addIllness, { isLoading }] = useAddIllnessMutation();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addIllness({ name: name.trim() }).unwrap();
      toast.success("Illness added");
      setName("");
    } catch (e) {
      toast.error("Failed to add illness");
    }
  };
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Add Illness</h3>
      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input"
          placeholder="e.g., Migraine"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          disabled={isLoading}
        >
          Add
        </button>
      </form>
    </Card>
  );
}
