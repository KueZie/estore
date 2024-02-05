import React from 'react'
import { FormContainer } from '../components/FormContainer'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom'

import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { useDispatch } from 'react-redux'

export const RegisterScreen = () => {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const navigate = useNavigate()  // Use navigate hook to redirect
  const dispatch = useDispatch() // Use dispatch hook to dispatch actions

  const [register, {isLoading}] = useRegisterMutation() // Use register mutation

  // Persist redirect query string
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search) // Get the query string
  const redirectTo = searchParams.get('redirect') || '/' // If there is a redirect query string, use it, otherwise use '/'

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      console.log('Passwords do not match')
      return;
    } 

    // Dispatch register action
    try {
      const result = await register({ name, email, password }).unwrap()
      console.log(`Register Result: ${JSON.stringify(result)}`)
      dispatch(setCredentials({ ...result }));

      // Redirect
      navigate(redirectTo)
    } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
    }
  }


  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type='text' 
            placeholder='Enter name'
            value={name}
            onChange={e => setName(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control 
            type='email' 
            placeholder='Enter email'
            value={email} 
            onChange={e => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type='password' 
            placeholder='Enter password' 
            value={password}
            onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control 
            type='password' 
            placeholder='Confirm password' 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} />
        </Form.Group>
        <Button type='submit' className='btn btn-primary'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account? <Link to='/login'>Sign in here.</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
