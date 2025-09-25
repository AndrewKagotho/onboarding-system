export const DropdownInput: React.FC<{ data: string[] }> = (props) => {
  return (
    <select>
      <option value='' hidden>
        Select from list...
      </option>
      {props.data.map((type, index) => (
        <option value={type} key={index}>
          {type}
        </option>
      ))}
    </select>
  )
}
