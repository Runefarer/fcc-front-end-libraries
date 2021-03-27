import { useState, useEffect } from 'react';
import { fetchQuotes, getRandom, getRandomElement } from './shared/helpers';
import Loader from './components/Loader'
import QuoteBox from './components/QuoteBox';
import QuotesAnim from './components/QuotesAnim';
import './styles/App.scss';


const App = props => {
  const [state, setState] = useState({
    loading: true,
    quotes: null,
    active: null,
    theme: getRandom(1, 10)
  });
  
  const getNewQuote = () => {
    let theme = getRandom(1, 10);
    while(theme === state.theme) {
      theme = getRandom(1, 10);
    }
    
    setState({
      ...state, active: getRandomElement(state.quotes), theme: theme  
    });
  };
  const getTweetUrl = () => (
    `https://twitter.com/intent/tweet?text=` +
    encodeURIComponent(`"${state.active.quote}"${state.active.author}`)
  );
  
  useEffect(() => {
    fetchQuotes(
      (result) => setState((prevState) => ({ 
        ...prevState, 
        quotes: result.quotes, 
        loading: false,
        active: getRandomElement(result.quotes)
      })), 
      5
    );
  }, []);
  
  return (
    <div className={`container theme-${state.theme}`}>
      <div className="content">
        {
          state.loading
          ? (<Loader />)
          : (
            <QuoteBox
              active={state.active}
              getTweetUrl={getTweetUrl}
              getNewQuote={getNewQuote}
            />
          ) 
        }
      </div>
      <QuotesAnim />
    </div>
  )
};

export default App;
