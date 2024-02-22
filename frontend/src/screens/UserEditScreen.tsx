import React, { useEffect, useState } from 'react'
import { FormContainer } from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../slices/usersApiSlice'

const UserEditScreen = () => {
  const { id } = useParams() as { id: string }
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery(id)

  const [updateUser, { isLoading: loadingUpdate, error: errorUpdate }] = useUpdateUserMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setName(userDetails?.name || '')
    setEmail(userDetails?.email || '')
    setIsAdmin(userDetails?.isAdmin || false)
  }, [userDetails])


  const navigate = useNavigate()


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await updateUser({ _id: id, name, email, isAdmin })
      toast.success('User updated')
      navigate('/admin/userlist')
    } catch (error) {
      toast.error('User update failed')
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(errorUpdate)
  }, [errorUpdate])

  return (
    <>
      <div>UserEditScreen</div>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate ? <Loader /> :
          errorUpdate ? <Message variant='danger'>{errorUpdate.toString()}</Message> : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='isadmin'>
                <Form.Check
                  type='checkbox'
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>
              <button type='submit' className='btn btn-primary'>
                Update
              </button>
            </Form>
          )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen