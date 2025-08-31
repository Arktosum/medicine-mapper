
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'

const app = express()
app.use(cors())
app.use(express.json())

const DATA_PATH = path.resolve('./src/data.json')

interface Medicine { id: string; name: string }
interface Illness { id: string; name: string }
interface Link { medicineId: string; illnessId: string }
interface DB { medicines: Medicine[]; illnesses: Illness[]; links: Link[] }

function readDB(): DB {
    if (!fs.existsSync(DATA_PATH)) {
        const initial: DB = { medicines: [], illnesses: [], links: [] }
        fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2))
        return initial
    }
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as DB
}
function writeDB(db: DB) { fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2)) }

// Helpers
const byName = (s: string) => (x: { name: string }) => x.name.toLowerCase() === s.toLowerCase()

// Routes
app.get('/api/medicines', (req, res) => {
    res.json(readDB().medicines)
})

app.post('/api/medicines', (req, res) => {
    const { name } = req.body as { name?: string }
    if (!name || !name.trim()) return res.status(400).json({ error: 'name required' })
    const db = readDB()
    if (db.medicines.find(byName(name))) return res.status(409).json({ error: 'duplicate medicine' })
    const m: Medicine = { id: nanoid(), name: name.trim() }
    db.medicines.push(m)
    writeDB(db)
    res.status(201).json(m)
})

app.get('/api/illnesses', (req, res) => {
    res.json(readDB().illnesses)
})

app.post('/api/illnesses', (req, res) => {
    const { name } = req.body as { name?: string }
    if (!name || !name.trim()) return res.status(400).json({ error: 'name required' })
    const db = readDB()
    if (db.illnesses.find(byName(name))) return res.status(409).json({ error: 'duplicate illness' })
    const i: Illness = { id: nanoid(), name: name.trim() }
    db.illnesses.push(i)
    writeDB(db)
    res.status(201).json(i)
})

app.post('/api/links', (req, res) => {
    const { medicineId, illnessId } = req.body as { medicineId?: string; illnessId?: string }
    if (!medicineId || !illnessId) return res.status(400).json({ error: 'medicineId & illnessId required' })
    const db = readDB()
    const m = db.medicines.find(x => x.id === medicineId)
    const i = db.illnesses.find(x => x.id === illnessId)
    if (!m || !i) return res.status(404).json({ error: 'medicine or illness not found' })
    const exists = db.links.some(l => l.medicineId === medicineId && l.illnessId === illnessId)
    if (!exists) db.links.push({ medicineId, illnessId })
    writeDB(db)
    res.json({ ok: true })
})

app.get('/api/search', (req, res) => {
    const type = String(req.query.type || 'medicine') as 'medicine' | 'illness'
    const q = String(req.query.q || '').toLowerCase()
    const db = readDB()
    if (!q) return res.json({ type, query: '', matches: [], related: [] })

    if (type === 'medicine') {
        const matches = db.medicines.filter(m => m.name.toLowerCase().includes(q))
        const relatedMap = new Map<string, Illness>()
        for (const m of matches) {
            const links = db.links.filter(l => l.medicineId === m.id)
            for (const l of links) {
                const ill = db.illnesses.find(i => i.id === l.illnessId)
                if (ill) relatedMap.set(ill.id, ill)
            }
        }
        return res.json({ type, query: q, matches, related: Array.from(relatedMap.values()) })
    } else {
        const matches = db.illnesses.filter(i => i.name.toLowerCase().includes(q))
        const relatedMap = new Map<string, Medicine>()
        for (const i of matches) {
            const links = db.links.filter(l => l.illnessId === i.id)
            for (const l of links) {
                const med = db.medicines.find(m => m.id === l.medicineId)
                if (med) relatedMap.set(med.id, med)
            }
        }
        return res.json({ type, query: q, matches, related: Array.from(relatedMap.values()) })
    }
})

// Update medicine
app.put('/api/medicines/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body as { name?: string }
    const db = readDB()
    const med = db.medicines.find((m) => m.id === id)
    if (!med) return res.status(404).json({ error: 'Medicine not found' })
    med.name = name?.trim() || med.name
    writeDB(db)
    res.json(med)
})

// Delete medicine + its links
app.delete('/api/medicines/:id', (req, res) => {
    const { id } = req.params
    const db = readDB()
    db.links = db.links.filter((l) => l.medicineId !== id)
    db.medicines = db.medicines.filter((m) => m.id !== id)
    writeDB(db)
    res.status(204).send()
})

// Update illness
app.put('/api/illnesses/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body as { name?: string }
    const db = readDB()
    const ill = db.illnesses.find((i) => i.id === id)
    if (!ill) return res.status(404).json({ error: 'Illness not found' })
    ill.name = name?.trim() || ill.name
    writeDB(db)
    res.json(ill)
})

// Delete illness + its links
app.delete('/api/illnesses/:id', (req, res) => {
    const { id } = req.params
    const db = readDB()
    db.links = db.links.filter((l) => l.illnessId !== id)
    db.illnesses = db.illnesses.filter((i) => i.id !== id)
    writeDB(db)
    res.status(204).send()
})

app.get('/api/links', (req, res) => {
    const db = readDB();
    res.json(db.links);
});


const PORT = 3005
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))

