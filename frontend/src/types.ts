export type ID = string
export interface Medicine { id: ID; name: string }
export interface Illness { id: ID; name: string }
export interface Link { medicineId: ID; illnessId: ID }


export type SearchType = 'medicine' | 'illness'


export interface SearchResponse {
type: SearchType
query: string
matches: Array<{ id: ID; name: string }>
related: Array<{ id: ID; name: string }>
}