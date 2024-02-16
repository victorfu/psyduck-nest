import { Link } from 'react-router-dom';

function PageOne() {
  return (
    <div>
      <h1>Page One</h1>
      <Link to="/page-two">Go to Page Two</Link>
    </div>
  );
}

export default PageOne;
