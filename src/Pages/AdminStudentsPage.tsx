


import React from 'react'
import { useParams } from 'react-router-dom'

const AdminStudentsPage = () => {

    const {gradeId} = useParams<{gradeId:string}>();

    // fetch students for this grade

  return (
    <>

    </>
  )
}

export default AdminStudentsPage;
