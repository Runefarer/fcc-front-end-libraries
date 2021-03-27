import { getRandomElement } from '../shared/helpers';
import '../styles/QuotesAnim.scss';

export const QuotesAnim = props => {
  const classNames = [
    'quotes-anim-part fas fa-quote-right',
    'quotes-anim-part fas fa-quote-left',
  ];
                                 
  return (
    <div aria-hidden="true" className="quotes-anim-container">
      {
        [...new Array(200)].map((val, idx) => {
          return (<i key={idx} className={getRandomElement(classNames)} />);
        })
      }
    </div>
  )
};

export default QuotesAnim;
