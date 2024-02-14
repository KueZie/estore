import React, { useEffect } from 'react'
import { FormContainer } from '../components/FormContainer'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useLoginMutation } from '../slices/usersApiSlice'
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { log } from 'console'
import { setCredentials } from '../slices/authSlice'

export const LoginScreen = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate() 

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [login, { isLoading }] = useLoginMutation()

  const { search } = useLocation()
  const searchParams = new URLSearchParams(search) // Get the query string
  const redirectTo = searchParams.get('redirect') || '/' // If there is a redirect query string, use it, otherwise use '/'

  const userInfo = useSelector((state: RootState) => state.auth.userInfo)

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (userInfo) {
      redirect('/')
    }
  }, [userInfo, navigate, redirect])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Dispatch login action
    try {
      const result = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...result }));
      navigate('/')
    } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
      // TODO: Notify user of error
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
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

        <Button type='submit' variant='primary' className='mt-2'>
          Sign In
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Don't have an account? <Link to={redirectTo ? `/register?redirect=${redirectTo}` : '/register'}>Sign up here.</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
