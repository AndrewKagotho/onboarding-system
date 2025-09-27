import { TextInput } from '../components/form/text.input'
import { NumberInput } from '../components/form/number.input'
import { DateInput } from '../components/form/date.input'
import { DropdownInput } from '../components/form/dropdown.input'
import { CheckboxInput } from '../components/form/checkbox.input'
import { FileInput } from '../components/form/file.input'

export const RenderFormField = (type: string, data?: []) => {
  if (type === 'text') return <TextInput />
  else if (type === 'number') return <NumberInput />
  else if (type === 'date') return <DateInput />
  else if (type === 'dropdown') {
    if (data) return <DropdownInput data={data} />
  } else if (type === 'checkbox') {
    if (data) return <CheckboxInput data={data} />
  } else if (type === 'file') return <FileInput />
}
