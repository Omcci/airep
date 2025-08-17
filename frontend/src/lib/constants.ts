// Tone configuration constants
export const TONE_OPTIONS = [
    { label: 'Professional', tone: 'professional' },
    { label: 'Casual', tone: 'casual' },
    { label: 'Funny', tone: 'funny' },
    { label: 'Harsh', tone: 'harsh' },
    { label: 'Friendly', tone: 'friendly' },
    { label: 'Formal', tone: 'formal' }
] as const

// Type for tone values
export type ToneValue = typeof TONE_OPTIONS[number]['tone']

// Platform options
export const PLATFORM_OPTIONS = [
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Blog', value: 'blog' },
    { label: 'Email', value: 'email' }
] as const

// Content type options
export const CONTENT_TYPE_OPTIONS = [
    { label: 'Content', value: 'content' },
    { label: 'URL', value: 'url' },
    { label: 'Tool', value: 'tool' }
] as const
