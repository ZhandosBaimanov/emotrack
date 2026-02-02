export interface MoodEntry {
	id: number | string
	intensity: number
	note?: string
	created_at: string
	emotion_type?: string
	isNew?: boolean
}
