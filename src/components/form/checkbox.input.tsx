export const CheckboxInput: React.FC<{ data: string[] }> = (props) => {
  return (
    <div className='checkbox_container'>
      {props.data.map((value, index) => (
        <div key={index}>
          <input id={value} type='checkbox' />
          <label htmlFor={value}>{value}</label>
        </div>
      ))}
    </div>
  )
}
