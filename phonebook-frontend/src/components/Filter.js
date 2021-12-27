const Filter = (props) => {
  return (
    <div>
        filter shown with<input
        value={props.value}
        onChange={props.handleChange} />
    </div>
  )
}

export default Filter