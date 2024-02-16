import { Link } from 'react-router-dom';

function PageTwo() {
  return (
    <div>
      <h1>Page Two</h1>
      <Link to="/page-one">Go to Page One</Link>
    </div>
  );
}

export default PageTwo;
