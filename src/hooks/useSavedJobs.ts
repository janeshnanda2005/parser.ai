import { useState, useEffect, useCallback } from 'react'

export interface SavedJob {
  id: string
  title: string
  company?: string
  location?: string
  salary?: string
  description?: string
  applyUrl?: string
  savedAt: string
  query?: string
}

const STORAGE_KEY = 'parser-ai-saved-jobs'

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedJobs = localStorage.getItem(STORAGE_KEY)
    setSavedJobs(storedJobs ? JSON.parse(storedJobs) : [])
    setIsLoading(false)
  }, [])

  const saveJob = useCallback((job: Omit<SavedJob, 'id' | 'savedAt'>) => {
    // Check if job already exists (by title and company)
    const exists = savedJobs.some(
      j => j.title.toLowerCase() === job.title.toLowerCase() && 
           j.company?.toLowerCase() === job.company?.toLowerCase()
    )
    if (exists) return null

    const newJob: SavedJob = { ...job, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
    setSavedJobs(prev => {
      const nextJobs = [newJob, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextJobs))
      return nextJobs
    })
    return newJob
  }, [savedJobs])

  const removeJob = useCallback((jobId: string) => {
    setSavedJobs(prev => {
      const nextJobs = prev.filter(j => j.id !== jobId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextJobs))
      return nextJobs
    })
  }, [])

  const clearAllJobs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedJobs([])
  }, [])

  const isJobSaved = useCallback((title: string, company?: string) => {
    return savedJobs.some(
      j => j.title.toLowerCase() === title.toLowerCase() && 
           j.company?.toLowerCase() === company?.toLowerCase()
    )
  }, [savedJobs])

  return {
    savedJobs,
    isLoading,
    saveJob,
    removeJob,
    clearAllJobs,
    isJobSaved,
    jobCount: savedJobs.length,
  }
}
