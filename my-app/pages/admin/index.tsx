import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Location', 'https://www.google.com');
  res.statusCode = 302;
  res.end();

  return {
    props: {},
  };
};

// Component is not actually rendered due to redirect
const AdminPage = () => {
  return null;
};

export default AdminPage;
