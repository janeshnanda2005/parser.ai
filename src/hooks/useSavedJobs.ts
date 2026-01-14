import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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

interface DbSavedJob {
  id: string
  user_id: string
  title: string
  company: string | null
  location: string | null
  salary: string | null
  description: string | null
  apply_url: string | null
  query: string | null
  saved_at: string
}

// Convert database row to SavedJob interface
function dbToSavedJob(row: DbSavedJob): SavedJob {
  return {
    id: row.id,
    title: row.title,
    company: row.company || undefined,
    location: row.location || undefined,
    salary: row.salary || undefined,
    description: row.description || undefined,
    applyUrl: row.apply_url || undefined,
    savedAt: row.saved_at,
    query: row.query || undefined,
  }
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load saved jobs from Supabase
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user?.id) {
        setSavedJobs([])
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false })

        if (error) {
          console.error('Error loading saved jobs:', error)
        } else {
          setSavedJobs((data || []).map(dbToSavedJob))
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedJobs()
  }, [user?.id])

  const saveJob = useCallback(async (job: Omit<SavedJob, 'id' | 'savedAt'>) => {
    if (!user?.id) {
      console.error('User must be logged in to save jobs')
      return null
    }

    // Check if job already exists (by title and company)
    const exists = savedJobs.some(
      j => j.title.toLowerCase() === job.title.toLowerCase() && 
           j.company?.toLowerCase() === job.company?.toLowerCase()
    )
    if (exists) return null

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          title: job.title,
          company: job.company || null,
          location: job.location || null,
          salary: job.salary || null,
          description: job.description || null,
          apply_url: job.applyUrl || null,
          query: job.query || null,
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving job:', error)
        return null
      }

      const newJob = dbToSavedJob(data)
      setSavedJobs(prev => [newJob, ...prev])
      return newJob
    } catch (error) {
      console.error('Error saving job:', error)
      return null
    }
  }, [user?.id, savedJobs])

  const removeJob = useCallback(async (jobId: string) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error removing job:', error)
        return
      }

      setSavedJobs(prev => prev.filter(j => j.id !== jobId))
    } catch (error) {
      console.error('Error removing job:', error)
    }
  }, [user?.id])

  const clearAllJobs = useCallback(async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing jobs:', error)
        return
      }

      setSavedJobs([])
    } catch (error) {
      console.error('Error clearing jobs:', error)
    }
  }, [user?.id])

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
