import '../styles/Loader.scss';

export const Loader = () => {
  return (
    <div className="loading-container" aria-hidden="true">
      <div className="loader">
        <div className="loader-part" />
        <div className="loader-part" />
        <div className="loader-part" />
      </div>
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default Loader;
