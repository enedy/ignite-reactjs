import { useContext, useEffect } from "react"

import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api";
import { apiClient } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth"
import { Enable } from "../components/Enable";

const { api } = apiClient;

export default function Dashboard() {
  const { user, signOut, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>Sign out</button>

      <Enable permissions={['metrics.list']}>
        <div>Métricas</div>
      </Enable>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.api.get('/me');

  console.log(response.data)

  return {
    props: {}
  }
})