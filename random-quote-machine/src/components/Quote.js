import '../styles/Quote.scss';

export const Quote = ({ text, author }) => {
  return (
    <div className="quote-content">
      <blockquote className="quote-text">
        <i className="fa fa-angle-double-left" aria-hidden="true" />
        <p id="text">
          {text}
        </p>
        <i className="fa fa-angle-double-right" aria-hidden="true" />
      </blockquote>
      <div className="quote-author">
        <span id="author">{author}</span>
      </div>
    </div>
  );  
};

export default Quote;
