import Quote from './Quote';
import '../styles/QuoteBox.scss';

export const QuoteBox = ({ active, getTweetUrl, getNewQuote }) => {
  return (
    <div id="quote-box">
    <Quote text={active.quote} author={active.author} />
    <div className="controls">
      <a className="control"
        id="tweet-quote" 
        href={getTweetUrl()} 
        target="_blank"
        rel="noreferrer"
      >
        <span className="sr-only">Twitter</span>
        <i className="fab fa-twitter icon" aria-hidden="true" />
        <i className="fab fa-twitter fly-away" aria-hidden="true" />
      </a>
      <button className="control" id="new-quote" onClick={getNewQuote}>New Quote</button>
    </div>
  </div>
  )
};

export default QuoteBox;
