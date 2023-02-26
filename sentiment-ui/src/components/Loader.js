const Loader = ({children, isLoading, loadingMessage}) => {
    if(!isLoading) return children
    else return (
      <div id="spinner">
      <span>{loadingMessage}</span>
      <div className="spinner-border" role="status">
    </div>
      </div>
      )
}

export default Loader