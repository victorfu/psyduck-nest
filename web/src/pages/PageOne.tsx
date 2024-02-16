import { Link } from 'react-router-dom';

function PageOne() {
  return (
    <div>
      <Link to="/page-two">Go to Page Two</Link>
    </div>
  );
}

export default PageOne;
