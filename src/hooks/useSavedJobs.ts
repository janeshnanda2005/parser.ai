import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

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

const STORAGE_KEY = 'parser_ai_saved_jobs'

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load saved jobs from localStorage
  useEffect(() => {
    const loadSavedJobs = () => {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY}_${user?.id || 'guest'}`)
        if (stored) {
          setSavedJobs(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedJobs()
  }, [user?.id])

  // Save to localStorage whenever savedJobs changes
  const persistJobs = useCallback((jobs: SavedJob[]) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${user?.id || 'guest'}`, JSON.stringify(jobs))
    } catch (error) {
      console.error('Error saving jobs:', error)
    }
  }, [user?.id])

  const saveJob = useCallback((job: Omit<SavedJob, 'id' | 'savedAt'>) => {
    const newJob: SavedJob = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
    }

    setSavedJobs(prev => {
      // Check if job already exists (by title and company)
      const exists = prev.some(
        j => j.title.toLowerCase() === job.title.toLowerCase() && 
             j.company?.toLowerCase() === job.company?.toLowerCase()
      )
      if (exists) return prev

      const updated = [newJob, ...prev]
      persistJobs(updated)
      return updated
    })

    return newJob
  }, [persistJobs])

  const removeJob = useCallback((jobId: string) => {
    setSavedJobs(prev => {
      const updated = prev.filter(j => j.id !== jobId)
      persistJobs(updated)
      return updated
    })
  }, [persistJobs])

  const isJobSaved = useCallback((title: string, company?: string) => {
    return savedJobs.some(
      j => j.title.toLowerCase() === title.toLowerCase() && 
           j.company?.toLowerCase() === company?.toLowerCase()
    )
  }, [savedJobs])

  const clearAllJobs = useCallback(() => {
    setSavedJobs([])
    persistJobs([])
  }, [persistJobs])

  return {
    savedJobs,
    isLoading,
    saveJob,
    removeJob,
    isJobSaved,
    clearAllJobs,
    jobCount: savedJobs.length,
  }
}

export default useSavedJobs
