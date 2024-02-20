import React, { useEffect, useMemo } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { toast } from 'react-toastify'

const PrivateRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)

  useMemo(() => {
    if (!userInfo)
      toast.error('You need to be logged in to access this page')
  }, [])

  return userInfo ? <Outlet /> : <Navigate to='/login' replace />
}

export default PrivateRoute